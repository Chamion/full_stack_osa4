const listHelper = require('../utils/list_helper')
const Testidata = require('./testidata')

describe('favorite blog', () => {

    test('when list has only one blog return that blog', () => {
        const result = listHelper.favoriteBlog(Testidata.listWithOneBlog)
        expect(result).toBe(Testidata.listWithOneBlog[0])
    })
    
    test('when list is empty return null', () => {
        const result = listHelper.favoriteBlog([])
        expect(result).toBe(null)
    })
    
    test('when list has many blogs return one with most likes', () => {
        const result = listHelper.favoriteBlog(Testidata.blogs)
        expect(result).toBe(Testidata.blogs[2])
    })
})