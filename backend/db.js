const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const connectToMongo = () => {
    mongoose.connect(uri) // if error it will throw async error
    .then(() => { // if all is ok we will be here
        console.log("Connected to mongo");
    })
    .catch(err => { // we will not be here...
        console.error('App starting error:', err.stack);
        process.exit(1);
    });
}
module.exports = connectToMongo;
