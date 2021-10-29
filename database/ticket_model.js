const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    ticketsAvailable: Number,
    ticketsBooked: Number,
    ticketList: Array,
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;