const express = require("express");
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));

//Cors for local file access
const cors = require("cors");
app.use(cors());

//Environment Variable
require('dotenv').config()
const port = 6000;
const database = require('./database/connection');
const Ticket = require('./database/ticket_model');

//Body parser
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
app.use("/getData", (req, res) => {
    Ticket.find({}, function (err, Data) {
        if (err) {
            res.status(404).json(err);
        }
        else {
            res.status(200).json(
                Data
            );
        }

    });
});
//Route for reset data
app.use("/reset", (req, res) => {

    let ticket = new Ticket();
    ticket.ticketsAvailable = 80;
    ticket.ticketsBooked = 0
    ticket.ticketList = [[0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0]];

    Ticket.count(function (err, count) {
        if (!err && count === 0) {
            ticket.save();
        }
        else {
            Ticket.deleteMany({}, () => ticket.save())
        }
    });
});

//Route for Book Tickets
app.post("/bookticket/:noOfTickets", async (req, res) => {
    const { noOfTickets } = req.params;
    var ticket = await Ticket.find({}).exec();
    const Tickets = Number(noOfTickets)
    var _id = ticket[0]._id;
    var available = ticket[0].ticketsAvailable
    let seatList = [];
    let row = 0;
    if (available >= Tickets) {
        var layout = ticket[0].ticketList;
        var rowTicketsAvailable = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (let i = 0; i < layout.length; i++) {
            let temp = 0;
            for (var j = 0; j < layout[i].length; j++) {
                layout[i][j] === 0 && temp++
            }
            rowTicketsAvailable[i] = temp;
        }
        if (rowTicketsAvailable.includes(Tickets)) {
            row = rowTicketsAvailable.indexOf(Tickets);
            console.log(row)
            for (let i = 0; i < layout[row].length; i++) {
                if (layout[row][i] === 0) {
                    layout[row][i] = 1;
                    seatList.push((row) * 7 + (i + 1))
                }
            }
        } else if (rowTicketsAvailable.find(e => e > Tickets)) {

            row = rowTicketsAvailable.indexOf(rowTicketsAvailable.find(e => e > Tickets)) + 1;
            var count = Tickets
            for (let i = 0; i < layout[row - 1].length; i++) {
                
                if (layout[row - 1][i] === 0 && count>0 ) {
                    layout[row - 1][i] = 1;
                    seatList.push((row - 1) * 7 + (i+1))
                    count--
                }
            }
        } else {
            for (let i = 0; i < layout.length; i++) {
                for (let j = 0; j < layout[i].length; j++) {
                    if (layout[i][j] === 0) {
                        layout[i][j] = 1;
                        seatList.push((i) * 7 + (j + 1))
                    }
                }

            }
        }
        available -= Tickets;
        Ticket.findByIdAndUpdate(_id, { ticketList: layout, ticketsAvailable: available, ticketsBooked: 80 - available }, function (err, docs) {
            if (err) {
                console.log(err);
                return res.status(404).json(err);
            }
            else {
                return res.status(200).json(seatList);
            }

        }
        )
    }
    else {
        return res.status(201).json("Seats Not Available")
    }

    
});

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(port, () => {
    console.log("Server running at port : " + port);
});