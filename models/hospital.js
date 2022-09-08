const { Schema, model, default: mongoose } = require('mongoose');

const HospitalSchema = Schema({
  nombre: {
    type: String,
    required: true
  },
  img: {
    type: String
  },
  usuario: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }
  
}, { collection: 'hospitales' });


HospitalSchema.method('toJSON', function() {
  const { __v, _id, ...data } = this.toObject();
  data.id = _id;
  return data;
});

HospitalSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

HospitalSchema.set('toObject', { virtuals: true })

module.exports = model('Hospital', HospitalSchema);