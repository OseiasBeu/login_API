const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Project = require('../../models/projects');
const Task = require('../../models/task');
const router = express.Router();


router.use(authMiddleware);

router.get('/', async (req,res)=>{
   try{
       const projects = await Project.find().populate('user');
       return res.send({projects});

   }catch (err){
       return res.status(400).send({ERRO:"Erro no carregamento dos projetos"});
   }
});

router.get('/:projectId', async (req, res)=>{
   try{
       const project = await Project.findById(req.params.projectId).populate('user');
       return res.send({ project });
   }catch(err){
       return res.status(400).send({ ERRO: "Erro no carregamento do projeto"});
   }
});

router.post('/', async (req, res)=>{
    try{
    const project = await Project.create({...req.body, user: req.userId});
    return res.send({project});
    }catch(err){
        return res.status(400).send({ERRO: "Erro na criação de um novo projeto!"});
    }
});

router.put('/:projectId', async (req, res)=>{
    res.send({user: req.userId});
});

router.delete('/:projectId', async (req, res)=>{
    try{
        await Project.findByIdAndRemove(req.params.projectId);
        return res.send();

    }catch(err){
        return res.status(400).send({ERRO: "Erro na exclusão do projeto"});
    }
    

});

/*Middleware vai interceptar a requisição entre o controller e a parte da rota
ou seja,
no moment em que a requisição chega no servidor, antes de entrar no controller, existe o middleware
ele verifica se o res e o req são válidos para receber a resposta do controller */

module.exports = app => app.use('/projects', router);