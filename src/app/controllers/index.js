//Arquivo criado para a exportação de todos os controllers
const fs = require('fs');
const path = require('path');

console.log('Chegou nas exportações dos controllers');
module.exports = app => {
  fs
    .readdirSync(__dirname) //ler diretório dirname [que estamos operando no index.js]
    .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js"))) //filtra os arquivos que tem o nome que não começam com ponto [geralmetne arquivos de configuração] e também não quero que seja o arquivo index.js
    //Ou seja, estou procurando por todos os arquivos da pasta que não comecam com . e que não sejam index.js
    .forEach(file => require(path.resolve(__dirname, file))(app)); //percorrendo todos os arquivos passando o app para cada um deles
    
};