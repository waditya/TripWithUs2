import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import eventCtrl from '../controllers/event.controller'

const router = express.Router()

router.route('/api/events')
  .get(eventCtrl.list)

router.route('/api/events/new/:userId')
  .post(authCtrl.requireSignin, eventCtrl.create)

router.route('/api/events/photo/:eventId')
  .get(eventCtrl.photo)

router.route('/api/events/by/:userId')
  .get(authCtrl.requireSignin, eventCtrl.listByUser)

router.route('/api/events/feed/:userId')
  .get(authCtrl.requireSignin, eventCtrl.listNewsFeed)

router.route('/api/events/like')
  .put(authCtrl.requireSignin, eventCtrl.like)
router.route('/api/events/unlike')
  .put(authCtrl.requireSignin, eventCtrl.unlike)

router.route('/api/events/comment')
  .put(authCtrl.requireSignin, eventCtrl.comment)
router.route('/api/events/uncomment')
  .put(authCtrl.requireSignin, eventCtrl.uncomment)

router.route('/api/events/:postId')
  .delete(authCtrl.requireSignin, eventCtrl.isPoster, eventCtrl.remove)

router.param('userId', userCtrl.userByID)
router.param('eventId', eventCtrl.eventByID)

export default router
