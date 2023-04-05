const mongoose = require('mongoose')

module.exports = () =>
{
 const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD)

 mongoose.connect(DB)
  .then(() => console.log("database connected..."))
  .catch(() => console.log("error occure while connecting to database !!!"))
}