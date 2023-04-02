module.exports = (req, res) =>
{
 res.status(505).json({
  status: "error",
  data: "not available"
 })
}