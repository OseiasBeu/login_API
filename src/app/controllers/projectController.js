const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Project = require('../../models/projects');
const Task = require('../../models/task');
const router = express.Router();

console.log('Chegou no CRUD');

router.use(authMiddleware);

router.get('/', async (req,res)=>{
   try{
       const projects = await Project.find().populate(['user','tasks']);
       return res.send({projects});

   }catch (err){
       console.log(err);
       return res.status(400).send({ERRO:"Erro no carregamento dos projetos"});
   }
});

router.get('/:projectId', async (req, res)=>{
   try{
       const project = await Project.findById(req.params.projectId).populate(['user','tasks']);
       return res.send({ project });
   }catch(err){
    console.log(err);
       return res.status(400).send({ ERRO: "Erro no carregamento do projeto"});
   }
});

router.post('/', async (req, res)=>{
    try{
        const { title, description, tasks } = req.body;        
        const project =  await Project.create({ title, description, user: req.userId });

        await Promise.all(tasks.map(async task =>{
            const projectTask = new Task({ ...task, project: project._id });

            await projectTask.save();

            project.tasks.push(projectTask);
        }));
        await project.save();
        return res.send({project});
    }catch(err){
        console.log(err);
        return res.status(400).send({ERRO: "Erro na criação de um novo projeto!"});
    }
});

router.put('/:projectId', async (req, res)=>{
    try{
        const { title, description, tasks } = req.body;        
        const project =  await Project.findByIdAndUpdate(req.params.projectId, { 
            title,
            description
            },{new:true});

            project.tasks =[];
            await Task.remove({project: project._Id});

        await Promise.all(tasks.map(async task =>{
            const projectTask = new Task({ ...task, project: project._id });

            await projectTask.save();

            project.tasks.push(projectTask);
        }));
        await project.save();
        return res.send({project});
    }catch(err){
        console.log(err);
        return res.status(400).send({ERRO: "Erro na atualização do projeto!"});
    }
});

router.delete('/:projectId', async (req, res)=>{
    try{
        await Project.findByIdAndRemove(req.params.projectId);
        return res.send();
    }catch(err){
        console.log(err);
        return res.status(400).send({ERRO: "Erro na exclusão do projeto"});
    }
});

/*Middleware vai interceptar a requisição entre o controller e a parte da rota
ou seja,
no moment em que a requisição chega no servidor, antes de entrar no controller, existe o middleware
ele verifica se o res e o req são válidos para receber a resposta do controller */

module.exports = app => app.use('/projects', router);