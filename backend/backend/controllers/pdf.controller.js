const db = require("../models");
const PDFDocument = require('pdfkit');
const path = require('path');
const PDFinfos = db.pdfinfos;
const User = db.user;
const Car = db.car;
const Make = db.make;
const Model = db.model;

const Op = db.Sequelize.Op;

exports.addPdfInfos = (req, res) => {
    PDFinfos.create({
        fileName: req.body.fileName,
        dealershipName: req.body.dealershipName,
        promiseDate: req.body.promiseDate,
        promiseLocation: req.body.promiseLocation,
        deposit: req.body.deposit,
        bankAccount: req.body.bankAccount,
    })
    .then(pdfinfos => {
        pdfinfos.setUser(req.body.userId);
        pdfinfos.setCar(req.body.carId);
        res.status(200).send({ message: "Informations envoyées", infos: pdfinfos });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.generatePDF = (req, res) => {
    console.log(req.body.id);
    PDFinfos.findOne({
        where: {
            id: req.body.id
        },
        include: [User, Car]
    }).then(pdfinfos => {
        Car.findOne({
            where: {
                id: pdfinfos.dataValues.car.dataValues.id
            },
            include: [Make, Model]
        }).then(resCar => {
            const car = {
                make: resCar.dataValues.make.dataValues.name,
                model: resCar.dataValues.model.dataValues.name,
                year: resCar.dataValues.year,
                firstReg: resCar.dataValues.firstReg,
                price: resCar.dataValues.price
            }
            const user = pdfinfos.dataValues.user.dataValues;
            pdfinfos.dataValues.promiseDate = pdfinfos.dataValues.promiseDate.toLocaleDateString();
            const infos = pdfinfos.dataValues;
            const imagePath = path.join(__dirname, '../../../pictures/signature.png');
            const doc = new PDFDocument({ margin: 50 });
        
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename=test.pdf');
        
            doc.pipe(res);
        
            doc.fontSize(15).text(`${infos.dealershipName}`, { align: 'left' });
            doc.moveDown(1);
        
            doc.fontSize(20);
        
            // Titre du document
            doc.text('PROMESSE DE VENTE POUR', { align: 'center' });
            doc.text('UN VEHICULE D’OCCASION', { align: 'center' });
            doc.moveDown(1);
        
            doc.fontSize(12);
        
            // Parties
            doc.text('Entre :', { underline: true });
            doc.moveDown(0.5);
            doc.text(`Entreprise : ${infos.dealershipName}`);
            doc.moveDown(1);
        
            doc.text('Et :', { underline: true });
            doc.moveDown(0.5);
            doc.text('M / Mme / Mlle*');
            doc.text('NOM et prénoms ou DENOMINATION pour une entreprise :');
            doc.text(`${user.name} ${user.surname}`);	
            doc.moveDown(1);
        
            // Accord
            doc.text('Il a été convenu ce qui suit :', { underline: true });
            doc.moveDown(0.5);
            doc.text(`L’entreprise : ${infos.dealershipName}, propriétaire du véhicule énoncé ci-dessous :`);
            doc.moveDown(0.5);
            doc.text(`Marque : ${car.make}`);
            doc.text(`Modèle : ${car.model}`);
            doc.text(`Année : ${car.year}`);
        
            doc.moveDown(0.5);
        
            // Date de première mise en circulation
            doc.text(`Date de première mise en circulation : ${car.firstReg}`, { continued: true });
            doc.text('(J       M       A)', { align: 'right' });
            doc.moveDown(2);
        
            // Promesse de vente
            doc.text('Promet de vendre ce véhicule à :');
            doc.moveDown(0.5);
            doc.text(`M / Mme / Mlle* : ${user.name} ${user.surname} qui accepte ce véhicule, et qui`);
            doc.text(`verse à titre d’arrhes ou d’acompte** à son propriétaire la somme de ${infos.deposit} euros`);
            doc.text(`sur le compte ${infos.bankAccount}.`);
            doc.text(`La somme totale étant de ${car.price} euros.`);
            doc.moveDown(1.5);
        
            // Compromis
            doc.text(`Compromis établi à : ${infos.promiseLocation} le :  ${infos.promiseDate}`);
            doc.moveDown(1);
        
            // Signatures
            doc.text('Le vendeur ***', { align: 'left', continued: true });
            doc.text('L’acheteur ***', { align: 'right' });
            doc.image(imagePath, {
                fit: [100, 100],
                align: 'left',
            });
        
            doc.moveDown(8);
            doc.fontSize(10);
            doc.text('* : rayer la mention inutile', { align: 'left' });
            doc.text('**  : Acompte : seule une décision de justice peut annuler la vente, Arrhes : si l’acheteur se désiste, ses', { align: 'left' });
            doc.text('arrhes sont perdues, si le vendeur se désiste, il doit rembourser un montant égal ou double des arrhes.', { align: 'left' });
            doc.text('*** : Signature précédée de la mention  « lu et approuvé ».', { align: 'left' });
            
            return doc.end();
        }).catch(err => {
            return res.status(500).send({ message: err.message });
        });
    }).catch(err => {
        return res.status(500).send({ message: err.message });
    });
};




