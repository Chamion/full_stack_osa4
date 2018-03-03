const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    var res = await Blog.find({}).populate('user', {_id: 1, username: 1, name: 1, minor: 1})
    res = res.map(blog => {
        return {
            likes: blog.likes,
            _id: blog._id,
            title: blog.title,
            author: blog.author,
            url: blog.url,
            user: blog.user
        }
    })
    response.json(res)
})

blogsRouter.post('/', async (request, response) => {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = new Blog(request.body.blog)
    if(blog.title === undefined) {
        response.status(400).json({error: 'Missing required argument blog.title'})
        return
    } else if (blog.url === undefined) {
    response.status(400).json({error: 'Missing required argument blog.url'})
        return
    }
    var user = await User.find({'_id': decodedToken.id})
    if(user.length < 1) {
        response.status(404).json({error: 'Could not find user with given id.'})
        return
    }
    user = new User(user[0])
    blog.user = user._id
    const blogResponse = await blog.save()
    user.blogs = user.blogs.concat(blogResponse._id)
    await user.save()
    response.status(201).json(blogResponse)
})

blogsRouter.delete('/:id', async (request, response) => {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    try {
        var oldBlog = await Blog.find({'_id': request.params.id})
    } catch(err) {
        if(err.name === 'CastError') {
            response.status(400).json({error: 'Malformed id.'})
            return
        } else {
            console.log(err.message)
            response.status(500).json({error: 'Unexpected failure'})
            return
        }
    }
    
    if(oldBlog.length < 1) {
        response.status(404).json({error: 'Could not find blog with given id.'})
        return
    }
    oldBlog = oldBlog[0]
    if(oldBlog.user.toString() !== decodedToken.id) {
        response.status(401).json({error: 'Invalid userId'})
        return
    }
    var user = await User.find({'_id': decodedToken.id})
    user = user[0]
    const index = user.blogs.indexOf(request.params.id)
    if(index > -1) {
        user.blogs.splice(index, 1)
    }
    await user.save()
    var res;
    try {
        res = await Blog.findByIdAndRemove(request.params.id)
    } catch(err) {
        if(err.name === 'CastError') {
            response.status(400).json({error: 'Malformed id.'})
            return
        } else {
            console.log(err.name)
            response.status(500).json({error: 'Unexpected failure'})
            return
        }
    }
    response.json(res)
})

blogsRouter.put('/:id', async (request, response) => {
    //const token = request.token
    //const decodedToken = jwt.verify(token, process.env.SECRET)

    /*if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }*/
    if(typeof request.body.blog !== 'object') {
        response.status(400).json({error: 'Missing required argument blog'})
        return
    }/* else if('user' in request.body.blog) {
        console.log('User attempted to change blog.user')
        response.status(400).json({error: 'Found unexpected argument blog.user'})
        return
    }*/
    const blog = new Blog(request.body.blog)
    if(blog.title === undefined) {
        response.status(400).json({error: 'Missing required argument blog.title'})
        return
    } else if (blog.url === undefined) {
    response.status(400).json({error: 'Missing required argument blog.url'})
        return
    }
    blog._id = request.params.id
    var oldBlog
    try {
        oldBlog = await Blog.find({'_id': request.params.id})
    } catch(err) {
        if(err.name === 'CastError') {
            response.status(400).json({error: 'Malformed id.'})
            return
        } else {
            console.log(err.name)
            response.status(500).json({error: 'Unexpected failure.'})
            return
        }
    }
    if(oldBlog.length < 1) {
        response.status(404).json({error: 'Could not find blog with given id.'})
        return
    }
    oldBlog = oldBlog[0]
    /*if(oldBlog.user.toString() !== decodedToken.id) {
        response.status(403).json({error: 'Invalid userId'})
        return
    }*/
    blog.user = oldBlog.user
    const query = {
        '_id': request.params.id
    }
    var blogResponse
    try {
        blogResponse = await Blog.update(query, blog)
    } catch(err) {
        if(err.name === 'CastError') {
            response.status(400).json({error: 'Malformed id.'})
            return
        } else {
            console.log(err.name)
            response.status(500).json({error: 'Unexpected failure.'})
            return
        }
    }
    response.json(blogResponse)
})

module.exports = blogsRouter