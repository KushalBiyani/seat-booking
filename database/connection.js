const mongoose = require('mongoose');
// Establish Database Connection
mongoose.connect(
  `mongodb+srv://Kushal:Kushal%4014@cluster0.jglzn.mongodb.net/ticket?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Database connected');
  });