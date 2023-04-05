const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
 name: String
})

module.exports = new mongoose.model('User', UsersSchema)