const express = require('express')
const { accessChat, fetchChat, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controls/chatController')
const { verify } = require('../middleware/userAuth')
const router = express.Router()

router.route('/').post(verify, accessChat)
router.route('/').get(verify, fetchChat)

router.route('/group').post(verify, createGroupChat)
router.route('/rename').put(verify, renameGroup)
router.route('/groupremove').put(verify, removeFromGroup)
router.route('/groupadd').put(verify, addToGroup)

module.exports = router