const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const connect = require('./db.js');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var jwt = require('jsonwebtoken');

const connection = mysql.createPool(connect);

class authController {
	async logup(req, res) {
		try {
			const userName = req.body.userName;
			const password = req.body.password;
			const candidate = connection.query("SELECT * FROM `users` WHERE login = '"+ userName +"' ", function(err, row) {
				if(row.length > 0) {
					res.render('log/logall.ejs', {error: "Такой пользователь уже существует"})
				}
				else {
					const user = connection.query("INSERT INTO `users` (login, password) VALUES ('"+ userName +"', '"+ password +"') ");
					res.redirect("http://localhost:3000/")
				}
			});
		}
		
		catch(e) {
			res.status(400).json({message: "reg error"})
		}
	}
	async login(req, res) {
		try {
			const userName = req.body.login;
			const password = req.body.password_log;
			
			const user = connection.query("SELECT * FROM `users` WHERE login = '"+ userName +"' ", function(err, row) {
				if(row.length > 0) {
					// found user
					if(row[0].login == userName) {
						// login correct
						var pass = row[0].password;
					    if(pass == password) {
					    	// password correct
					    	var token = jwt.sign(userName, 'shhhhh');
							res.cookie(row[0].id, token)
							res.redirect("http://localhost:3000/")
						}
						else {
							// Password is not correct
							res.render('log/unlogged.ejs', {error: "Не верный пароль"})
						}
					}
					else {
						// login is not correct
						console.log('login is not correct')
					}
				}
				else {
					// user was not registered
					res.render('log/logall.ejs', {error: "Зарегистрируйся"})
				}
			});
		}

		catch(e) {
			// error
			res.status(400).json({message: "reg error"})
		}
	}

	async logout(req, res) {
		try {
			var cookies = req.headers.cookie.split(";");

            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                var eqPos = cookie.indexOf("=");
                var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                res.clearCookie(name);
            }
            res.redirect("http://localhost:3000/")
		}

		catch(e) {
			// error
			res.status(400).json({message: "reg error"})
		}
	}

	async users(req, res) {
		try {
			// get users
			var cooki = req.headers.cookie.split(";");
			for (var i = 0; i < cooki.length; i++) {
			    var cookie = cooki[i];
			    var eqPos = cookie.indexOf("=") + 1;
			    var leng = cookie.length - eqPos
			    var name = eqPos > -1 ? cookie.substr(eqPos, leng) : cookie;
			}
		  var decoded = jwt.decode(name)
		  var result = connection.query("SELECT * FROM `users` WHERE login NOT IN ('"+ decoded +"')", function(err, row) {
		  	if(err) return console.log(err)
		  	res.render('users.ejs', {row: row, name: decoded})
		  });
		}

		catch(e) {
			// error
			res.status(400).json({message: "reg error"})
		}
	}
}

module.exports = new authController();