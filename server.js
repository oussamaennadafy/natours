const dotenv = require('dotenv')
const app = require('./app')
const connectDb = require('./config/db')
dotenv.config()
const port = process.env.PORT || 1000
connectDb()


app.listen(port, () =>
{
 console.log(`server running on port ${port} ...`);
})