module.exports = (app)=>{
	const productController = require('../controller/product.controller.js');
	const userController = require('../controller/user.controller.js');

	// for image upload
	const multer = require('multer');
	const path = require('path');

	const storage = multer.diskStorage({
	destination:(req, file,cb)=>{
		cb(null, './upload/images/')
	},
	filename: (req, file, cb)=>{
		return cb  (null, file.fieldname +'-'+ Date.now() + path.extname(file.originalname));
	}
	});

	//filter type of file

	const filefilter = (req, file, cb)=>{
	if(file.mimetype==='image/jpeg'|| file.mimetype==='image/png') {
		cb (null, true);
	} else {
		cb (null, false);
	}
	};

	const upload = multer({
	storage: storage,
	limits: {filesize : 1024 * 1024 * 15},
	filefilter : filefilter
	});


	app.get("/register", userController.register)
	app.post("/register", userController.registeruser)

	app.get("/login", userController.login)
	app.post("/login", userController.checkLogin)

	app.get("/logout", userController.logout)

	app.post('/addProduct', upload.single('image'), productController.create);
	app.get('/products', productController.findall);
	app.get('/product/update/:productId', productController.editProductform);
	app.get('/product/add', productController.addProductform);
	app.post('/updateProduct/:productId', upload.single('image'), productController.update);



}