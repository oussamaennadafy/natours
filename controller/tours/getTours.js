const getTours = (req, res) =>
{
 const tours = []
 res.json({
  status: "success",
  results: tours.length,
  data: {
   tours
  }
 })
}

module.exports = getTours