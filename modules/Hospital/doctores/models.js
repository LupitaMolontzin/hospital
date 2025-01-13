// models/user.js
const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  nombre: { type: String,  required: true, description: 'Nombre del doctor' },
  cedula: { type: String, required: true, unique: true, description: 'Cédula profesional' },
  especialidad: { type: String, required: true, description: 'Especialidad médica' },
  turno: { type: String, enum: ['Matutino', 'Vespertino', 'Nocturno'], required: true,description: 'Turno de trabajo' }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
