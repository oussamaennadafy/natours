const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')
dotenv.config({ path: "./config.env" })

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD)

mongoose.connect(DB).then(data =>
{
 console.log(`promise resolved with this value : ${data}`);
})

const port = process.env.PORT || 1000


app.listen(port, () =>
{
 console.log(`server running on port ${port} ...`);
})