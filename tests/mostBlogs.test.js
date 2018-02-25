const listHelper = require('../utils/list_helper')
const Testidata = require('./testidata')

describe.skip('most blogs', () => {

    test('when list has only one blog return object with author of that blog and 1', () => {
        const result = listHelper.mostBlogs(Testidata.listWithOneBlog)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            blogs: 1
        })
    })
    
    test('when list is empty return null', () => {
        const result = listHelper.mostBlogs([])
        expect(result).toBe(null)
    })
    
    test('when list has many blogs return object with most common author and number of his/her blogs', () => {
        const result = listHelper.mostBlogs(Testidata.blogs)
        expect(result).toEqual({
            author: 'Robert C. Martin',
            blogs: 3
        })
    })
})