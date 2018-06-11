const mongoose = require('../bancodedados');
const bcrypt = require('bcryptjs');

console.log('Chegou no model Project.js');
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
 }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project; 