const mongoose = require('../bancodedados');
const bcrypt = require('bcryptjs');

console.log('Chegou no Task.js');
const TaskSchema = new mongoose.Schema({
 title:{
     type: String,
     require: true,
 },
 project:{
   type: mongoose.Schema.Types.ObjectId,
   ref:'project',
   require: true,
 },
 assingnedTo:{
   type: mongoose.Schema.Types.ObjectId, // forma como o mongo guarda o ID no banco de dados
   ref: 'User',
   require: true,
  },
  completed:{
    type: Boolean,
    require: true,
    default: false,
  },
 createAt:{
     type: Date,
     default: Date.now,
 },
});

//pre - função do mongoose para que uma ação seja executada antes de ser salva
TaskSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10); // número 10 é o número de vezes que o hash será passado para a encriptação - torna o hash mais forte
    this.password = hash;   //se refere ao objeto que está sendo salvo ( TaskSchema)

    next();
})

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task; 