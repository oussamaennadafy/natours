const Tour = require('./../../models/toursModel')

const getAllTours = async (req, res) =>
{
 try {
  const tours = await Tour.find()
  res.status(200).json({
   status: "success",
   results: tours.length,
   data: {
    tours
   }
  })
 } catch (err) {
  res.status(400).json({
   status: "fail",
   reason: err
  })
 }
};

module.exports = getAllTours