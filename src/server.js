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
const departmentRoutes = require("./routes/department");
const tagsRoutes = require("./routes/tags");
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
documentaryRoutes(app);
departmentRoutes(app)
tagsRoutes(app)
//

//Tạo socket 
io.on('connection', function (socket) {
    // socket.on('join', function (data) {
    //     // io.sockets.emit('documentary', data);
    // });
    socket.on('documentary', function (data) {
        io.sockets.emit('documentary', data);
    });
});

let port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Building a login system with NodeJS is running on port ${port}!`));
exports.io = io;