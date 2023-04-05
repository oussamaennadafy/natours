const Tour = require('./../../models/toursModel')

const createTour = async (req, res) =>
{
 try {
  const createdTour = await Tour.create(req.body)
  res.status(200).json({
   status: "success",
   data: {
    createdTour
   }
  })
 } catch (err) {
  res.status(400).json({
   status: "fail",
   reason: err.message
  })
 }
};
module.exports = createTour