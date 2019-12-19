const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })

  res.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (req, res) => {
  try {
    const body = req.body

    if (body.username === undefined) {
      return res.status(400).json({ error: 'Username is required' })
    }
    if (body.password === undefined) {
      return res.status(400).json({ error: 'Password is required' })
    }
    if (body.username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long' })
    }
    if (body.password.length < 3) {
      return res.status(400).json({ error: 'Password must be at least 3 characters long' })
    }

    const usersInDb = await User.find({ username: body.username })
    const userInDb = usersInDb.find(u => u.username === body.username)

    if (userInDb !== undefined && userInDb.username === body.username) {
      return res.status(400).json({ error: 'Username must be unique' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(body.password, salt)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const savedUser = await user.save()

    res.json(savedUser)

  } catch(exception) {
    console.log(exception)
  }
})

module.exports = usersRouter