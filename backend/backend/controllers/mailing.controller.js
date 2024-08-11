const db = require("../models");
const fs = require('fs');
const NewsletterInfos = db.newsletterinfos;
const schedule = require('node-schedule');

const Op = db.Sequelize.Op;


exports.sendEmail = (req, res) => {
    email = req.body.email;
    let emailList = req.body.email.addresses.join(",");
    console.log(req.body);
	
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
			user: 'superconcessionnaire@gmail.com',
			pass: 'lase ozkz ywcn cnvu'
		}
	});
		
	var mailOptions = {
		from: 'superconcessionnaire@gmail.com',
		bcc: emailList,
		subject: email.mail.subject,
		text: email.mail.message
	};
		
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
	
	const newsletterInfos = req.body.newsletterInfos;
	let formattedTime;
	if(newsletterInfos.time == null){
		formattedTime = null;
	} else {
		console.log('test');
		
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
		schedule.gracefulShutdown();
		const job = schedule.scheduleJob(`${newsletterInfos.time.minutes} * * * *`, function(){
			exports.sendEmail({
				body: {
					email: {
						addresses: ["jefjef2222@gmail.com"],
						mail: {
							subject: "test",
							message: "test"
						}
					}
				}
			});
		});
		res.status(200).send("Newsletter info updated successfully.");
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


