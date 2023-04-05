const Tour = require('./../../models/toursModel')

const deleteTour = async (req, res) =>
{
 try {
  await Tour.findByIdAndDelete(req.params.id)
  res.status(204).end();
 } catch (err) {
  res.status(400).json({
   status: "fail",
   reason: {
    err
   }
  })
 }
}

module.exports = deleteTour