module.exports = (req, res, next) =>
{
 const { name, price } = req.body
 if (!name && !price) return res.status(400).json({
  status: "fail",
  reason: "please add a name and price"
 })
 if (!name) return res.status(400).json({
  status: "fail",
  reason: "please add a valid name"
 })
 if (!Number.isFinite(price)) return res.status(400).json({
  status: "fail",
  reason: "please add a valid price"
 })
 next()
}