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

app.post('/api/v1/tours', (req, res) =>
{
 const item = req.body
 fs.readFile(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8', (err, data) =>
 {
  if (err) return res.status(400).json({ error: "something went wrong" })
  const dataObj = JSON.parse(data)
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
})


app.listen(port, () =>
{
 console.log(`server running on port ${port} ...`);
})