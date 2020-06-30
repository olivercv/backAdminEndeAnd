// Requires

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');


// Inicializar variables

var app = express();

//cors

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Body Parser

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json());

// Importar rutas


var userRoutes = require('./routes/userRoute');
var loginRoutes = require('./routes/loginRoute');
var publicationRoutes = require('./routes/publicationRoute');
var notificationRoutes = require('./routes/notificationRoute');
var categoryRoutes = require('./routes/categoryRoute');
var convocatoriesRoutes = require('./routes/convocatory');
var docRoutes = require('./routes/doc');
var searchRoutes = require('./routes/searchRoute');
var uploadRoutes = require('./routes/uploadRoute');
var imageRoutes = require('./routes/imageRoute');
var uploadFileRoutes = require('./routes/uploadFileRoute');
var fileRoutes = require('./routes/fileRoute');



//conexion a la base de datos
mongoose.set('useCreateIndex', true);
mongoose.connection.openUri('mongodb://localhost:27017/ende', { useNewUrlParser: true,  useUnifiedTopology: true }, (err, res) => {
    if(err) throw err;
    console.log('Base de datos mongo: \x1b[32m%s\x1b[0m','online');
});



// Rutas
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/publication', publicationRoutes);
app.use('/notification', notificationRoutes);
app.use('/category', categoryRoutes);
app.use('/convocatory',convocatoriesRoutes);
app.use('/doc', docRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/image', imageRoutes);
app.use('/uploadfile', uploadFileRoutes);
app.use('/file', fileRoutes);


// Configuracion para subir el backend y el front en un solo puerto

app.use('/', express.static('client', {redirect: false}));
app.get('*', function(req, res, next) {
    res.sendFile(path.resolve('client/index.html'));
});


// escuchar peticiones

app.listen(3000, () => {
    console.log('express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m','online');
});
