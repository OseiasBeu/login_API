//Criando conexão com o banco de dados MongoDB
const  mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/noderest'); //,{useMongoClient: true}

mongoose.Promise = global.Promise;

module.exports = mongoose;