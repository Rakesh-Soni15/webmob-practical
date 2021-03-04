const User = require('../model/user-model.js');
const path = require('path');

//creat user
exports.register = (req, res) => {
	res.render('register')
};



exports.registeruser = (req, res) => {


	if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
		res.redirect('/register');
	}
	let userData = User.findOne({ email: req.body.email }, (err, data) => {
		console.log("data", data);
		if (data) {
			res.redirect('/register');
		}

		let user = new User({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		});
		user.save((err, data) => {
			if (err) {
				res.redirect('/register');
			}
			if (data) {
				req.session.user = data;
				res.redirect('/products')
			}
		});

	});
}

exports.login = (req, res) => {
	res.render('login')
}

exports.logout = (req, res) => {
	if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/login');
    } else {
        res.redirect('/login');
    }
}

exports.checkLogin = (req, res) => {

	if (!req.body || !req.body.email || !req.body.password) {
		res.redirect('/login');
	}
	User.findOne({ email: req.body.email }, (err, data) => {
		console.log("data", data);
		if (!data || err) {
			res.redirect('/login');
		}
		if (data.password == req.body.password) {
			req.session.user = data;
			res.redirect('/products')
		}

	});
}