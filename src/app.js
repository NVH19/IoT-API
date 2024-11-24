const express = require('express');
const bodyParser = require('body-parser'); // middleware phân tích dữ liệu dạng json
const userRoute = require('./route/router');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
require('dotenv').config();


let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
const port = process.env.port;

userRoute(app);

// app.get('/test', (req,res) => {
//     res.send('Hello');
// })
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});