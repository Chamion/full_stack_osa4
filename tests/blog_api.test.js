const User = require('../models/user')
const helper = require('./test_helper')

describe('blogs api', () => {
    
    var token
    
    beforeEach( async () => {
        await helper.wipeAllBlogs()
        await helper.wipeAllUsers()
        const user = {
            username: 'test',
            name: 'Tester',
            minor: false,
            password: 'testpass'
        }
        await helper.saveUser(user)
        token = await helper.login('test', 'testpass')
    })
    
    describe('list all', () => {
        
        test('blogs are returned as json', async () => {
            await helper.getAllBlogs()
        })
        
        test('GET gets all blogs', async () => {
            const newBlogs = [
                {
                    title: 'Test1',
                    author: 'a1',
                    url: 'www.imaginary.websiteone.com',
                    likes: 1
                },
                {
                    title: 'Test2',
                    author: 'a2',
                    url: 'www.imaginary.websitetwo.com',
                    likes: 2
                },
                {
                    title: 'Test3',
                    author: 'a3',
                    url: 'www.imaginary.websitethree.com',
                    likes: 3
                }
            ]
            
            
            // Jostain syystä tämä ei toimi.
            // Samalla se myös rikkoo kaikki muut testit.
            // Vittu mitä JavaScriptiä.
            /*newBlogs.forEach( async blog => {
                await helper.saveBlog(blog, token)
            })*/
            await helper.saveBlog(newBlogs[0], token)
            await helper.saveBlog(newBlogs[1], token)
            await helper.saveBlog(newBlogs[2], token)
            const blogs = await helper.getAllBlogs()
            newBlogs.forEach( blog => {
                expect(blogs).toContainEqual(blog)
            })
        })
    })
    
    describe('insert', () => {
        test('POST adds a new blog', async () => {
            const newBlog = {
                title: 'Test',
                author: 'Jemi Salo',
                url: 'www.imaginary.website.com',
                likes: 0
            }
            var blogs = await helper.getAllBlogs()
            const prevLength = blogs.length
            await helper.saveBlog(newBlog, token)
            blogs = await helper.getAllBlogs()
            expect(blogs.length).toBe(prevLength + 1)
        })
        
        test('if POST body is missing likes, default to 0', async () => {
            const newBlog = {
                title: 'Likes default test',
                author: 'Jemi Salo',
                url: 'www.imaginary.website.com'
            }
            await helper.saveBlog(newBlog, token)
            const blogs = await helper.getAllBlogs()
            expect(blogs).toContainEqual({
                title: 'Likes default test',
                author: 'Jemi Salo',
                url: 'www.imaginary.website.com',
                likes: 0
            })
        })
        
        test('if POST body is missing title or url respond with 400', async () => {
            var newBlog = {
                author: 'Jemi Salo',
                url: 'www.missing.website.com',
                likes: 0
            }
            var res = await helper.attemptToSaveMalformedBlog(newBlog, token)
            expect(res.body.error).toBe('Missing required argument blog.title')
            newBlog = {
                title: 'Title missing test',
                author: 'Jemi Salo',
                likes: 0
            }
            res = await helper.attemptToSaveMalformedBlog(newBlog, token)
            expect(res.body.error).toBe('Missing required argument blog.url')
        })
    })
    
    describe('delete', () => {
        test('DELETE request to /id removes record with that id', async () => {
            const newBlog = {
                title: 'Delete Me',
                author: 'Jemi Salo',
                url: 'www.missing.website.com',
                likes: 0
            }
            const res = await helper.saveBlog(newBlog, token)
            const id = JSON.parse(res.text)._id
            await helper.removeBlogById(id, token)
            const blogs = await helper.getAllBlogs()
            expect(blogs).not.toContainEqual(newBlog)
        })
        
        test('if DELETE request is to /id that doesn\'t exist, respond with 404', async () => {
            const newBlog = {
                title: 'Delete Me',
                author: 'Jemi Salo',
                url: 'www.missing.website.com',
                likes: 0
            }
            const res = await helper.saveBlog(newBlog, token)
            const id = '5a9040e6262ac611c4582bde'
            await helper.attemptToRemoveNonExistingBlogById(id, token)
            const blogs = await helper.getAllBlogs()
            expect(blogs).toContainEqual(newBlog)
        })
        
        test('if DELETE request is to malformed /id, respond with 400', async () => {
            const newBlog = {
                title: 'Delete Me',
                author: 'Jemi Salo',
                url: 'www.missing.website.com',
                likes: 0
            }
            const res = await helper.saveBlog(newBlog, token)
            const id = 'aaaaaaarrgghhh34'
            await helper.attemptToRemoveBlogByMalformedId(id, token)
            const blogs = await helper.getAllBlogs()
            expect(blogs).toContainEqual(newBlog)
        })
        
        test('if DELETE request token doesn\'t match, respond with 401', async () => {
            const hacker = {
                username: '1337Haxor1337',
                name: 'Hackerman',
                minor: true,
                password: 'scriptkiddie'
            }
            await helper.saveUser(hacker)
            hackerToken = await helper.login('1337Haxor1337', 'scriptkiddie')
            const newBlog = {
                title: 'Delete Me If You Can',
                author: 'Jemi Salo',
                url: 'www.missing.website.com',
                likes: 0
            }
            const res = await helper.saveBlog(newBlog, token)
            const id = JSON.parse(res.text)._id
            var blogs = await helper.getAllBlogs()
            expect(blogs).toContainEqual(newBlog)
            await helper.attemptToRemoveBlogByIdWithInvalidToken(id, hackerToken)
            var blogs = await helper.getAllBlogs()
            expect(blogs).toContainEqual(newBlog)
        })
    })
    
    describe('update', () => {
        test('PUT request to /id overwrites record with body of request', async () => {
            const oldBlog = {
                title: 'Update Me',
                author: 'Jemi Salo',
                url: 'www.imaginary.website.com',
                likes: 0
            }
            const res = await helper.saveBlog(oldBlog, token)
            const id = JSON.parse(res.text)._id
            const newBlog = {
                title: 'Updated!',
                author: 'Jemi Salo',
                url: 'www.updated.website.com',
                likes: 1
            }
            await helper.updateBlogById(id, newBlog, token)
            const blogs = await helper.getAllBlogs()
            expect(blogs).not.toContainEqual(oldBlog)
            expect(blogs).toContainEqual(newBlog)
        })
        
        test('if PUT request is to /id that doesn\'t exist, respond with 404', async () => {
            const oldBlog = {
                title: 'Update Me',
                author: 'Jemi Salo',
                url: 'www.imaginary.website.com',
                likes: 0
            }
            const res = await helper.saveBlog(oldBlog, token)
            const id = '5a9040e6262ac611c4582bde'
            const newBlog = {
                title: 'Updated!',
                author: 'Jemi Salo',
                url: 'www.updated.website.com',
                likes: 1
            }
            await helper.attemptToUpdateNonExistingBlogById(id, newBlog, token)
            const blogs = await helper.getAllBlogs()
            expect(blogs).toContainEqual(oldBlog)
            expect(blogs).not.toContainEqual(newBlog)
        })
        
        test('if PUT request is to malformed /id, respond with 400', async () => {
            const oldBlog = {
                title: 'Update Me',
                author: 'Jemi Salo',
                url: 'www.imaginary.website.com',
                likes: 0
            }
            const res = await helper.saveBlog(oldBlog, token)
            const id = 'abc34abcaaa2e'
            const newBlog = {
                title: 'Updated!',
                author: 'Jemi Salo',
                url: 'www.updated.website.com',
                likes: 1
            }
            await helper.attemptToUpdateBlogByMalformedId(id, newBlog, token)
            const blogs = await helper.getAllBlogs()
            expect(blogs).toContainEqual(oldBlog)
            expect(blogs).not.toContainEqual(newBlog)
        })
    })
})

describe('users api', () => {
    describe('when there is initially one user in db', async () => {
        beforeAll(async () => {
            await User.remove({})
            const user = new User({ username: 'root', password: 'sekret' })
            await user.save()
        })

        test('POST succeeds with a fresh username', async () => {
            const usersBeforeOperation = await helper.getAllUsers()

            const newUser = {
                username: 'jemisalo',
                name: 'Jemi Salo',
                password: 'salainen',
                minor: false
            }

            await helper.saveUser(newUser)

            const usersAfterOperation = await helper.getAllUsers()
            expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
            const usernames = usersAfterOperation.map(u=>u.username)
            expect(usernames).toContain(newUser.username)
        })
        
        test('POST fails with a used up username', async () => {
            const usersBeforeOperation = await helper.getAllUsers()

            const newUser = {
                username: 'root',
                name: 'Jemi Salo',
                password: 'salainen',
                minor: false
            }

            await helper.attemptToSaveNonUniqueUser(newUser)

            const usersAfterOperation = await helper.getAllUsers()
            expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
        })
        
        test('POST fails without password', async () => {
            const usersBeforeOperation = await helper.getAllUsers()

            const newUser = {
                username: 'uusikayttaja',
                name: 'Jemi Salo',
                minor: false
            }

            await helper.attemptToSaveUserWithoutPassword(newUser)

            const usersAfterOperation = await helper.getAllUsers()
            expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
        })
    })
    
    describe('when there are multiple users in db', async () => {
        
        var usersBefore
        
        beforeAll(async () => {
            await User.remove({})
            usersBefore = [
                {
                    username: 'doot16',
                    name: 'Doot Doot 16',
                    password: 'dootpass',
                    minor: true,
                    blogs: []
                },
                {
                    username: 'doot17',
                    name: 'Doot Doot 17',
                    password: 'dootpass',
                    minor: true,
                    blogs: []
                },
                {
                    username: 'doot18',
                    name: 'Doot Doot 18',
                    password: 'dootpass',
                    minor: false,
                    blogs: []
                }
            ]
            var user = new User(usersBefore[0])
            var res = await user.save()
            usersBefore[0]._id = res._id.toString()
            user = new User(usersBefore[1])
            res = await user.save()
            usersBefore[1]._id = res._id.toString()
            user = new User(usersBefore[2])
            res = await user.save()
            usersBefore[2]._id = res._id.toString()
            delete usersBefore[0].password
            delete usersBefore[1].password
            delete usersBefore[2].password
        })
        
        test('GET request will list all users', async () => {
            const users = await helper.listUsers()
            expect(users.length).toBe(3)
            usersBefore.forEach( user => {
                expect(users).toContainEqual(user)
            })
        })
    })
})

afterAll(() => {
    helper.close()
})
