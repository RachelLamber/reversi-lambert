/************************************** */
/* set up the static file server */
let static = require('node-static');
/*set up hhtp server */
let http = require('http');

/*assume that we are running on heroku */
let port = process.env.PORT;
let directory = __dirname + '/public';

/* if we aren't on heroku then we need to adjust port or directory */
if ((typeof port == 'undefined') || (port === null)){
    port = 8080;
    directory = './public';
}

/*set up static file web server */
let file = new static.Server(directory);

let app = http.createServer(
    function(request, response){
        request.addListener('end', function(){
            file.serve(request,response);
        }
    ).resume();
    }
).listen(port);

console.log('The server is running');

/************************************** */
/* set up the web socket server */

const { Server } = require("socket.io");
const io = new Server(app);

io.on('connection', (socket)=> {
    /* Output a log message on the server and send it to the clients */
    function serverLog(...messages){
        io.emit('log', ['**** Message from the server:\n']);
        messages.forEach((item) => {
            io.emit('log', ['****\t'+item]);
            console.log(item);
        });

    }

    serverLog('a page connected to the server: '+socket.id);

    socket.on('disconnect', () => {
        serverLog('a page disconnected from the server: ' + socket.id);
    });
});