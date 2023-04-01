const deleteTour = (req, res) =>
{
 const { id } = req.params
 const tours = []
 const tour = tours.find(tour => tour.id == id)
 if (!tour)
  return res.status(400).json({
   status: "fail",
   reason: "item not found"
  })
 res.json({
  status: "success",
  data: { tour }
 })
}

module.exports = deleteTour