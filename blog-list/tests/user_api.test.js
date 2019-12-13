const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

describe('Invalid users are not created', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({
      username: 'johndoe',
      name: 'John Doe',
      password: 'password'
    })
    await user.save()
  })

  test('Users without usernames are not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'John Doe',
      password: 'password',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd.length).toBe(usersAtStart.length)
    expect(response.body.error).toBe('Username is required')
  })

  test('Users without passwords are not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'john',
      name: 'John Doe',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd.length).toBe(usersAtStart.length)
    expect(response.body.error).toBe('Password is required')
  })

  test('Users with usernames that are less than 3 characters are not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'jo',
      name: 'John Doe',
      password: 'password',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
  
    expect(usersAtEnd.length).toBe(usersAtStart.length)
    expect(response.body.error).toBe('Username must be at least 3 characters long')
  })

  test('Users with passwords that are less than 3 characters are not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'john',
      name: 'John Doe',
      password: 'pa',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
  
    expect(usersAtEnd.length).toBe(usersAtStart.length)
    expect(response.body.error).toBe('Password must be at least 3 characters long')
  })

  test('Users whose usernames are not unique are not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'johndoe',
      name: 'John Doe',
      password: 'password'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    
    expect(usersAtEnd.length).toBe(usersAtStart.length)
    expect(response.body.error).toBe('Username must be unique')
  })

})



afterAll(() => {
  mongoose.connection.close()
})