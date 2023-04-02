const express = require('express');
const app = express()
const usersRouter = require('./routes/userRoutes')
const toursRouter = require('./routes/tourRoutes')


// app.param('id', (req, res, next, val) =>
// {
//   console.log(val);
//   next()
// })

// parse the body 
app.use(express.json());
app.use(express.static(`${__dirname}/public`))

app.use('/api/v1/users', usersRouter)
app.use('/api/v1/tours', toursRouter)


module.exports = app