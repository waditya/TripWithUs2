import Post from '../models/post.model'
import Event from '../models/event.model'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'

const create = (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      })
    }
    let event = new Event(fields)
    event.postedBy= req.profile
    if(files.photo){
      event.photo.data = fs.readFileSync(files.photo.path)
      event.photo.contentType = files.photo.type
    }
    event.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(result)
    })
  })
}

const list = (req, res) => {
  Event.find((err, events) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(events)
  }).select('eventID eventName eventDescription location')
}

const eventByID = (req, res, next, id) => {
  Event.findById(id).populate('postedBy', '_id name').exec((err, event) => {
    if (err || !event)
      return res.status('400').json({
        error: "Event not found"
      })
    req.event = event
    next()
  })
}

const listByUser = (req, res) => {
  Event.find({postedBy: req.profile._id})
  .populate('comments', 'text created')
  .populate('comments.postedBy', '_id name')
  .populate('postedBy', '_id name')
  .sort('-created')
  .exec((err, events) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(events)
  })
}

const listNewsFeed = (req, res) => {
  let following = req.profile.following
  following.push(req.profile._id)
  Event.find({postedBy: { $in : req.profile.following } })
  .populate('comments', 'text created')
  .populate('comments.postedBy', '_id name')
  .populate('postedBy', '_id name')
  .sort('-created')
  .exec((err, events) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(events)
  })
}

const remove = (req, res) => {
  let event = req.event
    event.remove((err, deletedEvent) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(deletedEvent)
    })
}

const photo = (req, res, next) => {
    res.set("Content-Type", req.event.photo.contentType)
    return res.send(req.event.photo.data)
}

const like = (req, res) => {
  Event.findByIdAndUpdate(req.body.eventId, {$push: {likes: req.body.userId}}, {new: true})
  .exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(result)
  })
}

const unlike = (req, res) => {
  Event.findByIdAndUpdate(req.body.eventId, {$pull: {likes: req.body.userId}}, {new: true})
  .exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(result)
  })
}


const comment = (req, res) => {
  let comment = req.body.comment
  comment.postedBy = req.body.userId
  Event.findByIdAndUpdate(req.body.eventId, {$push: {comments: comment}}, {new: true})
  .populate('comments.postedBy', '_id name')
  .populate('postedBy', '_id name')
  .exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(result)
  })
}

const uncomment = (req, res) => {
  let comment = req.body.comment
  Event.findByIdAndUpdate(req.body.postId, {$pull: {comments: {_id: comment._id}}}, {new: true})
  .populate('comments.postedBy', '_id name')
  .populate('postedBy', '_id name')
  .exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(result)
  })
}

const isPoster = (req, res, next) => {
  let isPoster = req.event && req.auth && req.event.postedBy._id == req.auth._id
  if(!isPoster){
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

export default {
  listByUser,
  listNewsFeed,
  eventByID,
  create,
  list,
  remove,
  photo,
  like,
  unlike,
  comment,
  uncomment,
  isPoster
}
