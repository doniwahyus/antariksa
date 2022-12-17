const { Transaction, Passenger, Order, Flight,transactionMapping, User } = require('../db/models')
const seq = require('sequelize')
const db  = require('../db/models/index')
const { QueryTypes } = require('sequelize')
const order = require('../db/models/order')
// const passenger = require('./passenger')
// const passenger = require('./passenger')
// const transaction = require('../db/models/transaction')
// const order = require('./order')
module.exports = {
    getData: async(req, res, next) => {
        try {
            // let transaction = await db.sequelize.query(`SELECT "Passengers".name_passenger, "Passengers".identity_number, "Passengers".identity_exp_date , 
            // "Passengers".nationality, "Passengers".identity_type, "Orders".orderer , "Orders".phone_number, "Orders".email  
            // FROM "Passengers" JOIN "Transactions" ON "Passengers".id = "Transactions".PassengerId JOIN "Orders" ON "Orders".id = "Transactions".OrderId 
            // ORDER BY "Passengers".id ASC `, {
            //     type: QueryTypes.SELECT
            // })
            // if (transaction.length > 0) {
            //     res.status(200).json({
            //         message: 'Data is Loaded',
            //         data: transaction[0]
            //     })
            // } else {
            //     res.status(200).json({
            //         message: 'Data Unknown',
            //         data: []
            //     })
            // }
            Transaction.findOne({where: {id: req.params.id}, 
                include: [
            {
                model: Passenger,
                as: 'passenger',
                attributes: {exclude: ["identity_exp_date","createdAt","updatedAt"]}
            },
            {
                model: Order,
                as: 'order',
                attributes: {exclude: ["createdAt","updatedAt"]} 
            }],
                attributes: {exclude: ["createdAt","updatedAt"]}
            })
            .then(transaction => {
                if(transaction.length < 1) {
                    error
                }
                res.json({message: `Transactions data ${req.params.id} has been found`, success: true, data: {transaction}})
            })
            .catch(err => {
                console.log(err)
                res.json({message: "Transaction is Not Found", success: false, data: {}})  
            })

        } catch (err) {
            next(err)
        }
    },
    getTicket: async( req, res, next) => {
        // const { origin_aiport, destination_aiport, airlines, depature_date, depature_time, price } = req.body
        // console.log(req.params)
        // Flight.findAll()
        // .then((tiket) => {
        //     res.json(tiket)
        // })
        Flight.findOne({ where: {id: +req.params.id}})
        .then((ticket) =>{
            console.log(ticket)
            return res.json({
                data: {
                    ticket
                    // total: ticket.price * ticket.total_passenger
                }
            })
        })

    },
    create: async (req, res, next) => {
        try {
            // const { PassengerId, OrderId } = req.body;

            // //Read
            // // const existTransaction = await Transaction.findOne({ where: {id: id }});
            // // if (existTransaction){
            // //     return res.status(400).json({
            // //         status: false,
            // //         message: 'data already create'
            // //     });
            // // }
            // //Create
            // const transaction = await Transaction.create({
            //     PassengerId,
            //     OrderId
        
            // });


            // return res.status(201).json({
            //     status: false,
            //     message: 'Succes',
            //     data: {
            //         transaction
            //     }
            // });
            // const { name_passenger, identity_number, identity_exp_date, nationality, identity_type, 
            //     name, email, password, gender, phone} =  req.body
            const  DataPassengers  = req.body
            
            
            const UserId = req.user.id
            const FlightId = +req.params.id
            console.log(UserId)
            if(!UserId){
                return res.json({
                    status: false,
                    message: "You are not logged in"
                })
            }
            // const passengers = [
            //     {  name_passenger, 
            //         identity_number, 
            //         identity_exp_date, 
            //         nationality, 
            //         identity_type }
            //     // add more passenger objects here as needed
            //   ];
            
            if (DataPassengers.length == 0){
                res.json({message: "Passenger is not found", success: false, data: {}})
            }

            const transaction = await Transaction.create({
                FlightId,
                UserId
            })
            .then((transaction) => {
                DataPassengers.forEach(element => {
                    let PassengerId = element.PassengerId
                    if(!PassengerId){
                        const passenger = Passenger.create({
                            name_passenger: element.name_passenger, 
                            identity_number: element.identity_number, 
                            identity_exp_date: element.identity_exp_date, 
                            nationality: element.nationality, 
                            identity_type: element.identity_type
                        })
                        .then((Passenger) =>{
                            PassengerId = Passenger.id
                            const transactioniMapping = transactionMapping.create({
                                UserId,
                                TransactionId: transaction.id,
                                PassengerId: Passenger.id
                            })
                        })
                    }    
                });
            })
            return res.status(201).json({
                status: true,
                message: 'Succes Create Booking'
            });

        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        try{
            const { id, PassengerId, OrderId } = req.body;

            const existTransaction = await Transaction.findOne({ where: {id: id }});
            if (!existTransaction){
                return res.status(400).json({
                    status: false,
                    message: 'data is not found'
                });
            }
            const transaction = await Transaction.update({
                PassengerId,
                OrderId
        
            },
            {
                where:{
                    id
                }
            });


            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: transaction
            });
        }catch(err){
            next(err);
        }
    },

    //Delete
    delete: async (req, res, next) => {
        try{
            const { id } = req.body;

            await Transaction.destroy({
                where: {
                    id
                }
            });


            return res.status(201).json({
                message: 'Succes Delete Data'
            });
        }catch(err){
            next(err);
        }
    }
}


// let pemesan_id = req.pemesan.pemesan_id

// if (!pemesan_id){
//     const pemesan = Pemesan.Create({
//         name...
//     })

//     pemesan_id = pmesan.id
// }

// if (panjang penumpang == 0){
//     balikan error
// }

// const transaksi = Transaksi.create({
//     nomor_penerbangan: req.nomor_penerbangan,
//     pemesan_id: pemesan.id
// })

// req.penumpang.forEach(el => {
//     let penumpang_id = el.penumpang_id

//     if (!penumpang_id){
//         const penumpang = penumpang.Create({
//             name...
//         })

//         penumpang_id = pmesan.id
//     }

//     const transactioniMapping = TransactioniMapping.create({
//         user_id: req.user.id
//         transaction_id: transaksi.id,
//         penumpang_id: penumpang_id
//     })
// })
