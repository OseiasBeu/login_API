//Criando conexão com o banco de dados MongoDB
const  mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/noderest'); //,{useMongoClient: true}

console.log('Chegou na conexão com o Banco de dados');

mongoose.Promise = global.Promise;

module.exports = mongoose;