const express = require('express')
const { sendMessage, allMessage } = require('../controls/MessageController')
const { verify } = require('../middleware/userAuth')

const router = express.Router()

router.route('/').post(verify, sendMessage)
router.route('/:chatId').get(verify, allMessage)


module.exports = router