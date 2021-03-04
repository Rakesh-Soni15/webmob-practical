const Product = require('../model/product-model.js');

// const multer = require('multer');
const path = require('path');


//creat product
exports.create = async (req, res) => {
	let product = new Product({
		SKU: req.body.SKU,
		Name: req.body.Name,
		Price: req.body.Price,
		Category: req.body.Category,
		qty: req.body.qty,
		//image: req.file.path
	});

	if (req.file) {
		product.image = req.file.path
	}
	try {
		let newProduct = await product.save();
		newProduct.image = req.file ? `http://localhost:7000/upload/images/${req.file.filename}` : ""

		res.redirect("/products")

	} catch (err) {
		console.log(err)
		res.status(400).send({
			message: "Something went wrong",
			data: {}
		});
	}
};

// get all data
exports.findall = async (req, res) => {
	if (req.session.user && req.cookies.user_sid) {
		try {
			const products = await Product.find();

			res.render('products', { products });
			// res.json({
			// 		message: "success",
			// 		data: {products}
			// 	});
		} catch (err) {
			console.log(err)
			res.status(400).send({
				message: "Something went wrong",
				data: {}
			});
		}
	} else {
		res.redirect('/login');
	}
}


//form for update product
exports.editProductform = async (req, res) => {
	if (req.session.user && req.cookies.user_sid) {
		try {
			let productData = Product.findById(req.params.productId, (err, data) => {
				//res.status(200).send({"productData": data});
				console.log(data);
				res.render('product_update', { product: data });
			});
		} catch (err) {
			return res.status(500).send({
				message: "error retrieving product with id" + req.params.productId
			});

		}
	} else {
		res.redirect('/login');
	}
}

//form for add product
exports.addProductform = async (req, res) => {
	if (req.session.user && req.cookies.user_sid) {
		res.render('product_add', {});
	} else {
		res.redirect('/login');
	}

}

//update data

exports.update = async (req, res) => {
	try {
		let updateProduct = {
			SKU: req.body.SKU,
			Name: req.body.Name,
			Price: req.body.Price,
			Category: req.body.Category,
			qty: req.body.qty,
			//image:req.path.file
		};

		if (req.file) {
			updateProduct.image = req.file.path
		}
		let productData = await Product.findByIdAndUpdate(
			{ _id: req.params.productId },
			{ $set: updateProduct },
			{ new: true, lean: true },
			(err, productData) => {
				if (productData) {
					productData.image = req.file ? `http://localhost:7000/upload/images/${req.file.filename}` : ""
					// res.json({
					// 	message: "updated!", 
					// 	data: {"product": productData}
					// });
					res.redirect('/products');
				} else if (err) {
					console.log(err)
					res.status(400).send({
						message: "Something went wrong",
						data: {}
					});
				}

			}
		);

	} catch (err) {
		console.log(err)
		res.status(400).send({
			message: "Something went wrong",
			data: {}
		});
	}

}


