const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const login = async (username, password) => {
    const res = await api
        .post('/api/login')
        .send({
            username,
            password
        })
    return res.body.token
}

const wipeAllBlogs = async () => {
    await Blog.remove({})
}

const wipeAllUsers = async () => {
    await User.remove({})
}

const getAllBlogs = async () => {
    const res = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const blogs = res.body.map(r => {
        return {
            title: r.title,
            author: r.author,
            url: r.url,
            likes: r.likes
        }
    })
    return blogs
}

const saveBlog = async (blog, token) => {
    const res = await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer '+token)
        .send({
            blog
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)
    return res
}

const attemptToSaveMalformedBlog = async (blog, token) => {
    const res = await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer '+token)
        .send({
            blog
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)
    return res
}

const removeBlogById = async (id, token) => {
    await api
        .delete('/api/blogs/'+id)
        .set('Authorization', 'Bearer '+token)
        .expect(200)
}

const attemptToRemoveNonExistingBlogById = async (id, token) => {
    await api
        .delete('/api/blogs/'+id)
        .set('Authorization', 'Bearer '+token)
        .expect(404)
}

const attemptToRemoveBlogByMalformedId = async (id, token) => {
    await api
        .delete('/api/blogs/'+id)
        .set('Authorization', 'Bearer '+token)
        .expect(400)
}

const attemptToRemoveBlogByIdWithInvalidToken = async (id, token) => {
    await api
        .delete('/api/blogs/'+id)
        .set('Authorization', 'Bearer '+token)
        .expect(401)
}

const updateBlogById = async (id, blog, token) => {
    const res = await api
        .put('/api/blogs/'+id)
        .set('Authorization', 'Bearer '+token)
        .send({
            blog
        })
        .expect(200)
}

const attemptToUpdateNonExistingBlogById = async (id, blog, token) => {
    await api
        .put('/api/blogs/'+id)
        .set('Authorization', 'Bearer '+token)
        .send({
            blog
        })
        .expect(404)
}

const attemptToUpdateBlogByMalformedId = async (id, blog, token) => {
    await api
        .put('/api/blogs/'+id)
        .set('Authorization', 'Bearer '+token)
        .send({
            blog
        })
        .expect(400)
}

const getAllUsers = async () => {
    const res = await User.find({})
    const users = res.map(u => {
        return {
            username: u.username,
            name: u.name
        }
    })
    return users
}

const saveUser = async (user) => {
    const res = await api
        .post('/api/users')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    return res
}

const attemptToSaveNonUniqueUser = async (user) => {
    const res = await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(res.body.error).toBe('Username is unavailable.')
}

const listUsers = async () => {
    const res = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    return res.body
}

const attemptToSaveUserWithoutPassword = async (user) => {
    const res = await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(res.body.error).toBe('Missing or malformed argument password')
}

const close = () => {
    server.close()
}

module.exports = {
    login,
    wipeAllBlogs,
    wipeAllUsers,
    getAllBlogs,
    saveBlog,
    attemptToSaveMalformedBlog,
    removeBlogById,
    attemptToRemoveNonExistingBlogById,
    attemptToRemoveBlogByMalformedId,
    attemptToRemoveBlogByIdWithInvalidToken,
    updateBlogById,
    attemptToUpdateNonExistingBlogById,
    attemptToUpdateBlogByMalformedId,
    getAllUsers,
    saveUser,
    attemptToSaveNonUniqueUser,
    listUsers,
    attemptToSaveUserWithoutPassword,
    close
}