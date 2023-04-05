const Tour = require('./../../models/toursModel')

const getOneTour = async (req, res) =>
{
 try {
  const tour = await Tour.findById(req.params.id)
  res.status(200).json({
   status: "success",
   data: {
    tour
   }
  })
 } catch (err) {
  res.status(404).json({
   status: "fail",
   reason: err
  })
 }
}

module.exports = getOneTour