const cookieParser = require('cookie-parser');
const express = require('express');
const dotenv = require('dotenv');

const isAuthenticated = require('./middleware/auth');

//Configure dotenv files above using any other library and files
dotenv.config({ path: './config/config.env' });
require('./config/conn');
//Creating an app from express
const app = express();
const route = require('./routes/userRoute');

//Using express.json to get request of json data
app.use(cookieParser());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/favicon.ico', express.static(__dirname + '/public/images/favicon.ico'));

//Using routes
app.use('/api', route);

//listening to the server
app.listen(process.env.PORT, () => {
  console.log(`Server is listening at ${process.env.PORT}`);
})

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/html/index.html');
})

