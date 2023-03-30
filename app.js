const fs = require('fs')
const express = require('express');
const app = express()
const port = 8000

// read json files
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'))

// parse the body 
app.use(express.json());

// routes
app.get('/api/v1/tours', (req, res) =>
{
 res.json({
  status: "success",
  results: tours.length,
  data: {
   tours
  }
 })
})

app.get('/api/v1/tours/:id', (req, res) =>
{
 const { id } = req.params
 const tour = tours.filter(tour => tour.id === id)
 res.json({
  status: "success",
  results: tours.length,
  data: {
   tour
  }
 })
})

app.post('/api/v1/tours', (req, res) =>
{
 const item = req.body
 // if (err) return res.status(400).json({ error: "something went wrong" })
 const dataObj = JSON.parse(tours)
 dataObj.push(item)
 const newTour = JSON.stringify(dataObj)
 fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, newTour, () =>
 {
  res.status(201).json({
   status: "success",
   data: {
    tour: newTour
   }
  })
 })
})


app.listen(port, () =>
{
 console.log(`server running on port ${port} ...`);
})