const tourSchema = new mongoose.Schema({
 name: {
  type: String,
  require: [true, "every tour should have a name"],
  unique: true
 },
 rating: {
  type: Number,
  default: 4.5
 },
 price: {
  type: Number,
  required: [true, "every tour should have a price"]
 }
})

module.exports = new mongoose.model('Tour', tourSchema)