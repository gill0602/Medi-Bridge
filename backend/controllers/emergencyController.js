const express = require('express')
const router = express.Router()
const twilio = require('twilio')
const authMiddleware = require('../middlewares/auth') // Assuming token-based user auth
const User = require('../models/User') // Assuming you store doctor numbers

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

router.post('/emergency', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId)

    if (!user || !user.doctorPhone) {
      return res.status(404).json({ success: false, message: 'Doctor phone number not found' })
    }

    const message = `🚨 Emergency Alert: Patient ${user.name} needs assistance.`

    // Send SMS
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: user.doctorPhone
    })

    // Optional: Trigger voice call
    // await client.calls.create({
    //   url: 'http://demo.twilio.com/docs/voice.xml',
    //   to: user.doctorPhone,
    //   from: process.env.TWILIO_PHONE_NUMBER
    // })

    return res.status(200).json({ success: true, message: 'Emergency alert sent' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: 'Failed to send alert' })
  }
})

module.exports = router
