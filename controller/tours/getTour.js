const getTour = (req, res) =>
{
 const tours = []
 const { id } = req.params
 const tour = tours.find(tour => tour.id == id)
 if (!tour)
  res.status(404).json({
   status: "fail",
   reason: "item not found"
  })
 res.status(200).json({
  status: "success",
  data: {
   tour
  }
 })
}

module.exports = getTour