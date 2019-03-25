import mongoose from 'mongoose'
import crypto from 'crypto'

const EventSchema = new mongoose.Schema({
  eventID: {
    type: Number,
    required: 'Please add a number'
  },
   eventName: {
     text: String,
     required:'Event Name is required'
   }
  ,eventDescription: {
    type: String,
    required: 'Event Description is required'
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  likes: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  comments: [{
    text: String,
    created: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User'}
  }],
  postedBy: {type: mongoose.Schema.ObjectId, ref: 'User'},
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type:String,
    required: 'Event Location is mandatory'
  }
})

export default mongoose.model('Event', EventSchema)
