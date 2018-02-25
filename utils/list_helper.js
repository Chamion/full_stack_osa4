const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    var summa = 0;
    blogs.forEach( blog => {
        summa += blog.likes
    })
    return summa;
}

const favoriteBlog = (blogs) => {
    var suosikki = null;
    blogs.forEach( blog => {
        if(suosikki === null) {
            suosikki = blog
            return
        }
        if(blog.likes > suosikki.likes) {
            suosikki = blog
        }
    })
    return suosikki;
}

const suurinArvo = (taulu) => {
    var suurin = null
    Object.keys(taulu).forEach( key => {
        if(suurin === null) {
            suurin = key
            return
        }
        if(taulu[key] > taulu[suurin]) {
            suurin = key
        }
    })
    return suurin
}

const mostBlogs = (blogs) => {
    const taulu = {}
    blogs.forEach( blog => {
        if(blog.author in taulu) {
            taulu[blog.author] += 1
        } else {
            taulu[blog.author] = 1
        }
    })
    var suurin = suurinArvo(taulu)
    if(suurin === null) {
        return null
    } else {
        return {
            author: suurin,
            blogs: taulu[suurin]
        }
    }
}

const mostLikes = (blogs) => {
    const taulu = {}
    blogs.forEach( blog => {
        if(blog.author in taulu) {
            taulu[blog.author] += blog.likes
        } else {
            taulu[blog.author] = blog.likes
        }
    })
    var suurin = suurinArvo(taulu)
    if(suurin === null) {
        return null
    } else {
        return {
            author: suurin,
            likes: taulu[suurin]
        }
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
