const listHelper = require('../utils/list_helper')
const Testidata = require('./testidata')

describe.skip('total likes', () => {

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(Testidata.listWithOneBlog)
        expect(result).toBe(5)
    })
    
    test('when list has many blogs equals the sum of likes', () => {
        const result = listHelper.totalLikes(Testidata.blogs)
        expect(result).toBe(36)
    })
})