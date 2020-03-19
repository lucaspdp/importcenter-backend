import {Schema, model} from 'mongoose';

const CreditsSchema = new Schema({
  destination:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  value: {
    type: String,
    required: true
  }
},{
  timestamps: true
});

export default model("Credits", CreditsSchema);