const cors = require('cors');
const env = require('../Object ENV/Object ENV');

const configCORS = (app) => {
    const corsOptions = {
        origin: env.EXPRESS_URL_FE, // Replace with your allowed origin
        methods: ['GET', 'POST', 'PUT', 'patch', 'DELETE', 'OPTIONS'], // Methods you want to allow
        allowedHeaders: ['Content-Type', 'Authorization'], // Headers you want to allow
        credentials: true // Allow cookies to be sent
    };

    // Use the CORS middleware with the defined options
    app.use(cors(corsOptions));
}

module.exports = configCORS