const express = require('express');
const app = express()
const port = 8000
const usersRoutes = require('./routes/users')
const toursRoutes = require('./routes/tours')

// parse the body 
app.use(express.json());

app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/tours', toursRoutes)

app.listen(port, () =>
{
  console.log(`server running on port ${port} ...`);
})