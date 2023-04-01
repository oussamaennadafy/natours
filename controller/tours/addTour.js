const fs = require('fs')

const addTour = (req, res) =>
{
 const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`, 'utf-8'))

 const { place, duration } = req.body
 // log(req.params)
 if (!place || !duration) return res.status(400).json({
  status: "fail",
  reason: "please include all fields: <place, duration>"
 })
 tours.push({ place, duration })
 res.status(201).json({
  status: "success",
  result: tours.length,
  data: {
   tours
  }
 })
}

module.exports = addTour