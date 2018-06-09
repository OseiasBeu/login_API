const mongoose = require('../bancodedados');
const bcrypt = require('bcryptjs');

console.log('Chegou no Project.js');
const ProjectSchema = new mongoose.Schema({
 title:{
     type: String,
     require: true,
 },
 description:{
   type: String,
   require: true,
 },
 user:{
   type: mongoose.Schema.Types.ObjectId, // forma como o mongo guarda o ID no banco de dados
   ref: 'User',
   require: true,
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
 createAt:{
     type: Date,
     default: Date.now,
 },
});

//pre - função do mongoose para que uma ação seja executada antes de ser salva
ProjectSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10); // número 10 é o número de vezes que o hash será passado para a encriptação - torna o hash mais forte
    this.password = hash;   //se refere ao objeto que está sendo salvo ( ProjectSchema)

    next();
})

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project; 