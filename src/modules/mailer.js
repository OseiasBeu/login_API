const nodemailer = require('nodemailer');
const path = require('path');
const {host, port, user,pass}= require('../config/mail.json');
const hbs = require('nodemailer-express-handlebars');

const transport = nodemailer.createTransport({
  host,
  port,
  auth: {user,pass},
});


// configuração do Handlebars
transport.use('compile', hbs({
  viewEngine: 'handlebars',
  viewPath: path.resolve('./src/resources/mail/'), //onde vão ficar as views de templates de emails 
  extName: '.html', //tipo da extensão do arquivo
})); 

module.exports = transport;