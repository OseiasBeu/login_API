const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req,res, next) => {
    //next - chamado somente se o usuário está pronto para o próximo passo (controller)

    const authHeader = req.headers.authorization; // header de autorização que está contido dentro da requisição
    //Erro 401 = erro de autorização
    if(!authHeader){
        //Verifica se o token foi informado, se não tiver um authHeader - token não foi informado
        return res.status(401).send({ERRO:'Token não fornecido!'});
    }
    
    /*FORMATO DO TOKEN:
    Bearer re34rgfrerdregfre */

    const parts = authHeader.split(' '); //Divide o token em duas partes, a intenção é deixar o Bearer de um lado e o MD5 do outro

    if(!parts.length === 2){
        //Confirma se o token tem de fato duas partes
        return res.status(401).send({ ERRO: 'Erro Token!'});
    }

    /*Se o token possuir duas partes, a script vai desestruturar
    - a função split divide o token em duas partes [um array], onde 
    a posição 0 contém o Bearer e a posição 1 fica com o resto do token */
    const [scheme, token] = parts; //Desestruturação
    //-scheme recebe e -token recebe o número de MD5

    if(!/^Bearer$/i.test(scheme)){
        //Verifica se a variável( que antes era a posição 0 do array parts) Scheme contém a palavra Bearer
        //Método Regex
        // i - indica case sencitive
        // /^ -  indica o começo a palavra
        // % - indica o final da verificação
        return res.status(401).send({ERRO:'Token sem formato!'});
    }

    jwt.verify(token, authConfig.secret, (err, decoded)=>{
        //token - o mesmo da requisição
        //authConfig - é o nosso hash MD5
        //Callback - err, decoded
        if(err){
            //Se houver erro, retornar invalidez no token, pois ele não é o mesmo definido na nossa aplicação (config)
            return res.status(401).send({ERRO: 'Token Inválido!'});
        }


        /*Se passou por todas as verificações e não retornou nenhum erro, significa que temos 
        a informação do user.id */
        //Inclusão do user.id nas próximas requisições do controller
        req.userId = decoded.id; //id - parametro passado no authController
        return next();
    });

};


/*Essas verificações são simples e não consomem nada de processamento*/