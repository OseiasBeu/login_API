const express = require('express');

const User = require('../models/User');

const router = express.Router();

//criação da rota de registro de usuario
router.post('/register', async  (req, res) => {
   //async para tratar promisses
    const {email} = req.body; 
    try{
        if(await User.findOne({ email})){
            return res.status(400).send({ERRO: 'Email já existe!'});
        }    

        const user = await User.create(req.body); //cria usuário quando a rota é chamada
        //req.body pega todos os parâmetros que o usuário está enviando e repassa para o User.create
        //await espera que os parâmetros sejam passados para o User.create para que a aplicação continue
        user.password = undefined;
        return res.send({user}); //retorna o usuário criado em caso de sucesso

       
            
    } catch(err){ 
        return res.status(400).send({ ERRO: 'Falha no registro'});   //retorno de status 400 (erro) e a mensagens Falha no registro
    }
});


module.exports = app => app.use('/auth', router); //Teremos uma rota /auth/register que irá chamar a função de registro de usuário

/*IMPORTANTE*/
/*Lembre-se de referenciar esse controller de autenticação 
dentro da aplicação... */
//Arquivo index.js principal, que está dentro do diretório src