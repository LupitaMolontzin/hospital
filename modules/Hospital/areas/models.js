// models/user.js
const mongoose = require('mongoose');
const AreasSchema = new mongoose.Schema({
  name: { type: String, required: true, description: 'Nombre del área' },
  description: { type: String, description: 'Descripción del área' },
  floor: { type: Number, required: true, description: 'Piso donde se encuentra' },
  capacity: { type: Number, description: 'Capacidad de pacientes' },
  speciality: { type: String, description: 'Especialidad médica del área' }
});

module.exports = mongoose.model('Areas', AreasSchema);
