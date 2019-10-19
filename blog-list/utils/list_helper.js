const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {

  if (blogs.length === 0) {
    return 0
  } else if (blogs.length === 1) {
    return blogs[0]
  } else {
    const maxNumberOfLikes = Math.max(...blogs.map(blog => blog.likes))

    const compactObj = (obj) => {
      if ('_id' in obj) {
        delete obj['_id']
      }
      if ('__v' in obj) {
        delete obj['__v']
      }
      if ('url' in obj) {
        delete obj['url']
      }
      return obj
    }

    const blogWithmaxNumberOfLikes = blogs.map(compactObj).find(blog => blog.likes === maxNumberOfLikes)

    return blogWithmaxNumberOfLikes
  }

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}