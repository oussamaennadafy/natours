const express = require('express');
const app = express()
const port = 8000
const usersRouter = require('./routes/users')
const toursRouter = require('./routes/tours')

// parse the body 
app.use(express.json());

const users = [
  {
    name: "oussama",
    age: 20
  }
]

app.use('/api/v1/users', usersRouter)
app.use('/api/v1/tours', toursRouter)

app.listen(port, () =>
{
  console.log(`server running on port ${port} ...`);
})