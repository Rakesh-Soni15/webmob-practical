const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
	SKU :{ type : String , unique : true },
	Name:String,
	Price:Number,
	Category: String,
	qty: Number,
	image: String
});

module.exports = mongoose.model('products', ProductSchema);