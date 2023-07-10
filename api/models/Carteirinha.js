const mongoose = require('mongoose');
const {Schema,model} = mongoose; 

const CarteirinhaSchema = new Schema({
    cardstatus:{type: String},
    owner:{type:Schema.Types.ObjectId, ref:'User'},
}, {
    timestamps: true,
});
  
const CarteirinhaModel = model('Carteirinha', CarteirinhaSchema);
  
module.exports = CarteirinhaModel;