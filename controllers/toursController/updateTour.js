const Tour = require('./../../models/toursModel')

const updateTour = async (req, res) =>
{
 try {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
   new: true,
   runValidators: false,
  })
  res.status(200).json({
   status: "success",
   data: {
    updatedTour
   }
  })
 } catch (err) {
  res.status(404).json({
   status: "fail",
   reason: err
  })
 }
};

module.exports = updateTour