const express = require('express');
const bcrypt = require ('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const mailer = require('../../modules/mailer');
const authConfig = require('../../config/auth');
const router = express.Router();

//Rota de registro de usuario
function gerarToken(params = {}){
    //função geradora de token, retorna um token a partir do MD5  
    return jwt.sign(params, authConfig.secret,{
        expiresIn: 86400, //Tempo de expiração de token 86400 segundos é equivalente a 1 dia
    });
}
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
        return res.send({
            user,
            token: gerarToken({id: user.id}), //passando o token no registro de usuário para ele já ficar logado na aplicação 
        }); //retorna o usuário criado em caso de sucesso

       
            
    } catch(err){ 
        return res.status(400).send({ ERRO: 'Falha no registro'});   //retorno de status 400 (erro) e a mensagens Falha no registro
    }
});

//=====================================FIM DA ROTA DE REGISTRO ========================================================================

//Rota de autenticação
router.post('/authenticate', async (req, res) =>{
    const {email,password} = req.body; //sempre recebo email e senha do usuário (ambos bem no corpo da requisição [req.body])
 
    const user = await User.findOne({email}).select('+password'); //Busca do usuário no banco de dados
    //O campo .select('+password' garante que a senha também seja adquirida nessa busca de usuário

    if(!user){
        //Se o usuário não foi encontrado retorna a informação de erro
        return res.status(400).send({ERRO:'Usuário não encontrado'});
    }

    //Verificação da senha a partir do módulo de bcrypt
    if(!await bcrypt.compare(password, user.password)){
        //Se a comparação da senha que ele está fazendo login com a senha que está salva no BD for falsa, retorna erro 
        return res.status(400).send({ERRO:'Senha inválida!'});
    }

    user.password = undefined; //Não permite que a senha seja exibida na listagem

    // const token = jwt.sign({id: user.id}, authConfig.secret,{
    //     expiresIn: 86400, 
    // });
    /* MD5 gerado a partir das palavras:
     BifeBaconOvoHojeAmanhã17082019*/


    res.send({user, 
        token: gerarToken({id: user.id}),
    }); //Se as negações forem falsas, retornar usuário solicitado

});
 

//=====================================FIM DA ROTA DE RECUPERAÇÃO DE EMAIL ========================================================================
router.post('/forgot_password', async (req, res)=>{
    //recebe o email do usuário [qual email ao qual ele quer recuperar a senha]
    const {email } = req.body;
try {
    //Verifica se esse email realmente está cadastrado em nossa base de usuário
    const user = await  User.findOne({email});
    
    if(!user){
         //Se o usuário não foi encontrado retorna a informação de erro
         return res.status(400).send({ERRO:'Usuário não encontrado'});
    }
        //  preciso gerar um token que só funcione para esse usuário
        const token = crypto.randomBytes(20).toString('hex');

        //Data que vai conter o tempo de expiração
        const now = new Date();
        now.setHours(now.getHours() + 1);

        //Altera usuário que acabamos de gerar o token
        await User.findByIdAndUpdate(user.id,{
            '$set': {  //Quais campos você deseja setar
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        //Email a ser enviado para recuperação de senha
        mailer.sendMail({
            to: email, //para qual email devo enviar
            from: 'oseiasbeu@outlook.com', //de quem será enviado
            template: 'auth/forgot_password', //template
            context: {token}, //valor a ser repassado para a variável que está dentro do forgot_passoword
        }, (err) =>{ //callback de erro
            if(err){
                return res.status(400).send({ERRO: 'Não é possível enviar o email de recuperação de senha!'})
            }

             return res.send('OK');
        }); 
         
}catch(err){
    res.status(400).send({ERRO: 'Erro na recuperação de senha, tente novamente!'})
    }
});

//fim













module.exports = app => app.use('/auth', router); //Teremos uma rota /auth/register que irá chamar a função de registro de usuário

/*IMPORTANTE*/
/*Lembre-se de referenciar esse controller de autenticação 
dentro da aplicação... */
//Arquivo index.js principal, que está dentro do diretório src