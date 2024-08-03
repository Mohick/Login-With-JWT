const mongoose = require('mongoose');
const env = require('../Object ENV/Object ENV');



const connectMongoDB = async () => {


    try {
        await mongoose.connect(env.EXPRESS_URL_MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectMongoDB;