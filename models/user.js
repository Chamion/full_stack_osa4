const mongoose = require('mongoose')

const User = mongoose.model('User', {
    username: { type: String, unique: true },
    name: String,
    minor: {type: Boolean, default: false},
    passwordHash: String,
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

module.exports = User
