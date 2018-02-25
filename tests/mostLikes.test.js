const listHelper = require('../utils/list_helper')
const Testidata = require('./testidata')

describe('most likes', () => {

    test('when list has only one blog return object with author of that blog and its likes', () => {
        const result = listHelper.mostLikes(Testidata.listWithOneBlog)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })
    
    test('when list is empty return null', () => {
        const result = listHelper.mostLikes([])
        expect(result).toBe(null)
    })
    
    test('when list has many blogs return object with most common author and sum of his/her likes', () => {
        const result = listHelper.mostLikes(Testidata.blogs)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 17
        })
    })
})