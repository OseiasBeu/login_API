const mongoose = require('../bancodedados');
const bcrypt = require('bcryptjs');

console.log('Chegou no user.js');
const UserSchema = new mongoose.Schema({
 name:{
     type: String,
     require: true,
 },
 email:{
     type: String,
     unique:true,
     require: true,
     lowercase: true,
 },
 password:{
     type: String,
     require: true,
     select: false, //select false indica que o campo password não vai ser exibido numa listagem de usuários
 },
 passwordResetToken:{
     type: String,
     select: false,
 },
 passwordResetExpires:{
     type: Date,
     select: false,
 },
 createAt:{
     type: Date,
     default: Date.now,
 },
});

//pre - função do mongoose para que uma ação seja executada antes de ser salva
UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10); // número 10 é o número de vezes que o hash será passado para a encriptação - torna o hash mais forte
    this.password = hash;   //se refere ao objeto que está sendo salvo ( UserSchema)

    next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User; 