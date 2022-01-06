import {Schema, model} from 'mongoose';

const CreditsSchema = new Schema({
  destination:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    
  },
  value: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
},{
  timestamps: true,
  toJSON:{
    virtuals: true
  }
});

export default model("Credits", CreditsSchema);