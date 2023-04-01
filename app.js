const fs = require('fs')
const express = require('express');
const app = express()
const port = 8000

// controllers
const { getTour, getTours, addTour, updateTour, deleteTour } = require('./controller/tours')

// parse the body 
app.use(express.json());

// custom middleware 
app.use((req, res, next) =>
{
  console.log('hello from middleware');
  next()
});

app.route('/api/v1/tours').get(getTours).post(addTour)

app.route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)

app.listen(port, () =>
{
  console.log(`server running on port ${port} ...`);
})