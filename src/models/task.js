const mongoose = require('../bancodedados');
const bcrypt = require('bcryptjs');

console.log('Chegou no model Task.js');
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

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task; 