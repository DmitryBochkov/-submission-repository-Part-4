const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs.map(blog => blog.toJSON()))
})


blogsRouter.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (blog) {
      res.json(blog.toJSON())
    } else {
      res.status(404).end()
    }
  } catch (error) {
    console.log(error)
  }
})


blogsRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body)
  try {
    const savedBlog = await blog.save()
    res.status(201).json(savedBlog.toJSON())    
  } catch (error) {
    console.log(error)
  }
})


blogsRouter.delete('/:id', async (req, res) => {
  try {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    console.log(error)
  }
})


blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    const updatedBlog = await Blog.findOneAndUpdate(req.params.id, blog, { new: true })
    res.json(updatedBlog.toJSON())
  } catch (error) {
    console.log(error)
  }
})

module.exports = blogsRouter