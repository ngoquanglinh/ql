require('dotenv').config();
const express = require("express");
const configViewEngine = require("./configs/viewEngine");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require("express-session");
const connectFlash = require("connect-flash");
const passport = require("passport");
const socketio = require("socket.io");

// routers
const initWebRoutes = require("./routes/web");
const uploadRoutes = require("./routes/uploads");
const userRoutes = require("./routes/user");
const documentaryRoutes = require("./routes/documentary");
//

let app = express();
const server = require('http').createServer(app);
const io = socketio(server);

global.__basedir = __dirname;
//use cookie parser
app.use(cookieParser('secret'));

//config session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 86400000 1 day
    }
}));

// Enable body parser post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Config view engine
configViewEngine(app);

//Enable flash message
app.use(connectFlash());

//Config passport middleware
app.use(passport.initialize());
app.use(passport.session());

// init all web routes
initWebRoutes(app);
uploadRoutes(app);
userRoutes(app);
documentaryRoutes(app)
//

//Tạo socket 
io.on('connection', function (socket) {
    console.log('Welcome to server chat');
    socket.on('join', function (data) {
        console.log(data, "nghe");
        io.sockets.emit('send', data);
    });
});

let port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Building a login system with NodeJS is running on port ${port}!`));
