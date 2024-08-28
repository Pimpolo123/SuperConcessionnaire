const db = require("../models");
const Bid = db.bid;
const User = db.user;
const Car = db.car;
const Model = db.model;
const Make = db.make;
const schedule = require('node-schedule');
const mailingController = require("./mailing.controller");

const Op = db.Sequelize.Op;

exports.getAllBids = (req, res) => {
    Bid.findAll().then(bids => {
        res.status(200).send(bids);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    })
};

exports.getBid = (req, res) => {
    Bid.findOne({
        where: {
            carId: req.query.carId
        }
    }).then(bid => {
        res.status(200).send(bid);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    })
}

exports.addBid = (req, res) => {
    Bid.create({
        carId: req.body.carId,
        userId: req.body.userId,
        startingPrice: req.body.startingPrice,
        currentPrice: req.body.currentPrice,
        bidEndDate: req.body.bidEndDate,
        bidStartDate: req.body.bidStartDate,
        minimumBid: req.body.minimumBid,
    }).then(bid => {
        res.status(200).send({bid: bid, message: "Enchère ajoutée"});
    }).catch(err => {
        res.status(500).send({ message: err.message });
    })
    console.log(req.body);
};

exports.updateBid = (req, res) => {
    Bid.findOne({
        where: {
            id: req.body.id
        }
    }).then(bid => {
        if(!bid){
            return res.status(404).send({message: "Enchère non trouvée"});
        }
        let mailingList = [];
        User.findOne({
            where: {
                id: req.body.userId,
                emailBidWon: true
            }
        }).then(user => {
            mailingList.push(user.email);
            console.log(mailingList);
            
            Car.findOne({
                where: {
                    id: bid.carId
                },
                include : [Make, Model]
            }).then(car => {
                const bidEndDate = new Date(bid.bidEndDate);
                let message = `L'enchère pour la voiture ${car.make.name} ${car.model.name} est terminée, rendez-vous sur le site pour voir les résultats`;
                
                const job = schedule.scheduleJob(`${bidEndDate.getMinutes()} ${bidEndDate.getHours()} ${bidEndDate.getDate()} ${bidEndDate.getMonth()+1} *`, function(){
                    console.log("Enchère terminée");
                    
                    mailingController.sendEmail({
                        body: {
                            email: {
                                addresses: mailingList,
                                mail: {
                                    subject: "Enchère terminée",
                                    message: message,
                                }
                            },
                        }
                    });
                });
                });
		});
        bid.currentPrice = req.body.currentPrice;
        bid.userId = req.body.userId;
        bid.save();
        res.status(200).send({message: "Enchère modifiée"});
    }).catch(err => {
        res.status(500).send({message: err.message});
    });
}

exports.deleteBid = (req, res) => {
    Bid.destroy({
        where: {
            id: req.body.id
        }
    }).then(() => {
        res.status(200).send({message: "Enchère supprimée"});
    }).catch(err => {
        res.status(500).send({message: err.message});
    });
}


