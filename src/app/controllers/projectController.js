const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Project = require('../../models/projects');
const Task = require('../../models/task');
const router = express.Router();


router.use(authMiddleware);

router.get('/',(req,res)=>{
    res.send({ok: true, user: req.userId});
});

router.get('/:projectId', async (req, res)=>{
    res.send({user: req.userId});
});

router.post('/', async (req, res)=>{
    res.send({user: req.userId});
});

router.put('/:projectId', async (req, res)=>{
    res.send({user: req.userId});
});

router.delete('/:projectId', async (req, res)=>{
    res.send({user: req.userId});
});

/*Middleware vai interceptar a requisição entre o controller e a parte da rota
ou seja,
no moment em que a requisição chega no servidor, antes de entrar no controller, existe o middleware
ele verifica se o res e o req são válidos para receber a resposta do controller */

module.exports = app => app.use('/projects', router);