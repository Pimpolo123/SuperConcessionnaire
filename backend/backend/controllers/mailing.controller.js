const db = require("../models");
const fs = require('fs');
const path = require('path');
const NewsletterInfos = db.newsletterinfos;
const schedule = require('node-schedule');
const User = db.user;
const Car = db.car;
const Make = db.make;
const Model = db.model;
const CarPicture = db.carpicture;

const Op = db.Sequelize.Op;


exports.sendEmail = (req, res) => {
    email = req.body.email;
    let emailList = req.body.email.addresses.join(",");
    // console.log(req.body);
	
    var nodemailer = require('nodemailer');
	const fs = require('fs');
	const path = require('path');
    var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
			user: 'superconcessionnaire@gmail.com',
			pass: 'lase ozkz ywcn cnvu'
		}
	});
	
	if(!req.body.isNews){
		var mailOptions = {
			from: 'superconcessionnaire@gmail.com',
			bcc: emailList,
			subject: email.mail.subject,
			text: email.mail.message
		};
	} else {
		var mailOptions = {
			from: 'superconcessionnaire@gmail.com',
			bcc: emailList,
			subject: email.mail.subject,
			html: email.mail.message,
			attachments: email.mail.attachments
		};
	}
		
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

exports.setNewsletterInfos = (req, res) => {
	console.log(req.body);
	let mailingList = [];
	let newCarsList = [];
	let content = "";
	let attachments = [];
	const dayMapping = {
		'SUN': 0,
		'MON': 1,
		'TUE': 2,
		'WED': 3,
		'THU': 4,
		'FRI': 5,
		'SAT': 6
	};
	const newsletterInfos = req.body.newsletterInfos;
	let formattedTime;
	if(newsletterInfos.time == null){
		formattedTime = null;
	} else {
		formattedTime = newsletterInfos.time.hours + ":" + newsletterInfos.time.minutes + ":" + newsletterInfos.time.seconds;
		console.log(formattedTime);
		
	}
	if(newsletterInfos.dayOfMonth){
		newsletterInfos.dayOfWeek = null;
	}
	if(newsletterInfos.dayOfWeek){
		newsletterInfos.dayOfMonth = null;
	}
	

	NewsletterInfos.findOrCreate({
		where: { id: 1 },
		defaults: {
			isOn: newsletterInfos.isOn,
			time: formattedTime,
			frequency: newsletterInfos.frequency,
			dayOfMonth: newsletterInfos.dayOfMonth,
			dayOfWeek: newsletterInfos.dayOfWeek
		}
	})
	.then(([newsletter, created]) => {
		if (!created) {
			newsletter.update({
				isOn: newsletterInfos.isOn,
				time: formattedTime,
				frequency: newsletterInfos.frequency,
				dayOfMonth: newsletterInfos.dayOfMonth,
				dayOfWeek: newsletterInfos.dayOfWeek
			});
		}
		User.findAll().then(users => {
			users = users.filter(user => user.emailoptin === true);
			users.forEach(user => {
				mailingList.push(user.email);
			});
		});

		Car.findAll({
			where: {
				new: true
			},
			include: [Make, Model, {model: CarPicture, limit: 1}]
		}).then(cars => {
			cars.forEach(car => {
				newCarsList.push(car);
			});
			// console.log('NEW CARS',newCarsList);
			
			let content = `
			<html>
				<head>
					<style>
						body {
							font-family: Arial, sans-serif;
							color: #333;
							line-height: 1.6;
						}
						table {
							width: 100%;
							border-collapse: collapse;
							margin-bottom: 20px;
						}
						th, td {
							padding: 8px 12px;
							border: 1px solid #ddd;
							text-align: left;
						}
						th {
							background-color: #f4f4f4;
						}
						.car-item {
							margin-bottom: 10px;
						}
						.car-header {
							font-weight: bold;
							color: #2c3e50;
							margin-bottom: 5px;
						}
						.car-details {
							margin-left: 10px;
						}
						img {
							max-width: 100px;
							height: auto;
						}
					</style>
				</head>
				<body>
					<h1>Liste des nouvelles voitures</h1>
					<table>
						<thead>
							<tr>
								<th>Image</th>
								<th>Marque</th>
								<th>Modèle</th>
								<th>Kilométrage</th>
								<th>Prix (€)</th>
								<th>Puissance (ch)</th>
								<th>Cylindrée (cc)</th>
							</tr>
						</thead>
						<tbody>`;

			cars.forEach(car => {
				const carImageBase64 = car.carpictures && car.carpictures.length > 0 ? car.carpictures[0].base64url : '';
				const carImageTag = carImageBase64 ? `<img src="cid:car${car.id}@nodemailer.com" alt="Image" />` : '';

				content += `
					<tr>
						<td>${carImageTag}</td>
						<td>${car.make.name}</td>
						<td>${car.model.name}</td>
						<td>${car.kilometers.toLocaleString()} km</td>
						<td>${car.price.toLocaleString()} €</td>
						<td>${car.power} ch</td>
						<td>${car.displacement} cc</td>
					</tr>`;

				if (carImageBase64) {
					const tempImagePath = path.join("../pictures", `temp-image-${car.id}.png`);
					fs.writeFileSync(tempImagePath, carImageBase64.replace(/^data:image\/\w+;base64,/, ""), {encoding: 'base64'});
					attachments.push({
						filename: `car-image-${car.id}.png`,
						path: tempImagePath,
						cid: `car${car.id}@nodemailer.com`
					});
				}
			});

			content += `
						</tbody>
					</table>
					<p>Merci de votre intérêt pour notre concessionnaire. N'hésitez pas à nous contacter pour plus d'informations.</p>
				</body>
			</html>`;
			schedule.gracefulShutdown();
			if(newsletterInfos.isOn){
				if(newsletterInfos.frequency == "D"){
					const job = schedule.scheduleJob(`${newsletterInfos.time.minutes} ${newsletterInfos.time.hours} * * *`, function(){
						exports.sendEmail({
							body: {
								email: {
									addresses: mailingList,
									mail: {
                                        subject: "Nouveautés du concessionnaire",
                                        message: content,
                                        attachments: attachments
                                    }
								},
								isNews: true
							}
						});
						Car.update({ 
							new: false 
						},{ 
							where: { new: true } 
						})
						.then(() => {
							console.log("Cars updated successfully.");
						})
						.catch(err => {
							console.log(err);	
						});
					});
				}
				if(newsletterInfos.frequency == "W"){
					const job = schedule.scheduleJob(`${newsletterInfos.time.minutes} ${newsletterInfos.time.hours} * * ${dayMapping[newsletterInfos.dayOfWeek]}`, function(){
						exports.sendEmail({
							body: {
								email: {
									addresses: mailingList,
									mail: {
                                        subject: "Nouveautés du concessionnaire",
                                        message: content,
                                        attachments: attachments
                                    }
								},
								isNews: true
							}
						});
						Car.update({ 
							new: false 
						},{ 
							where: { new: true } 
						})
						.then(() => {
							console.log("Cars updated successfully.");
						})
						.catch(err => {
							console.log(err);	
						});
					});
				}
				if(newsletterInfos.frequency == "M"){
					const job = schedule.scheduleJob(`${newsletterInfos.time.minutes} ${newsletterInfos.time.hours} ${newsletterInfos.dayOfMonth} * *`, function(){
						exports.sendEmail({
							body: {
								email: {
									addresses: mailingList,
									mail: {
                                        subject: "Nouveautés du concessionnaire",
                                        message: content,
                                        attachments: attachments
                                    }
								},
								isNews: true
							}
						});
						Car.update({ 
							new: false 
						},{ 
							where: { new: true } 
						})
						.then(() => {
							console.log("Cars updated successfully.");
						})
						.catch(err => {
							console.log(err);	
						});
					});
				}
			}
			res.status(200).send("Newsletter info updated successfully.");
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).send("An error occurred while updating newsletter info.");
	});
}

exports.getNewsletterInfos = (req, res) => {
	NewsletterInfos.findOne({
		where: { id: 1 }
	})
	.then(newsletterInfos => {
		res.status(200).send(newsletterInfos);
	})
	.catch(err => {
		console.log(err);
		res.status(500).send("An error occurred while retrieving newsletter info.");
	});
}


