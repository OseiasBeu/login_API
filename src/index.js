const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json()); //Primeira função a ser utilizada, faz com que minha aplicação entenda quando as requisições em json forem enviadas 
app.use(bodyParser.urlencoded({extended:false})); //Faz ele entender quando url são passados como parâmetros para que ele possa decodar

//req  são dados da requisição, parâmetros que for receber - token de autenticação...
//res objeto que utilizamos para enviar algume resposta para o usuário quando acessar essa rota...


require('./controllers/authController')(app);
//o app está sendo repassado porque ele é um objeto que é definido uma vez e precisamos utilizá-lo em todos os outros arquivos
/*OBS.: Se criar outro app teríamos duas aplicações rodando na mesma plataforma do node */

//Não esqueça de recuperar o app na authController com o modulo de exports




app.listen(port);

// app.listen(port, function () {
//     console.log(`Servidor rodando na porta ${port}`);
// }); 
