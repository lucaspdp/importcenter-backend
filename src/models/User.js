import {Schema, model} from 'mongoose';

const UserSchema = new Schema({

  name:{
    type: String,
    required: true,
  },
  credits:{
    type: Number,
    required: true,
    default: 0,
  },
  email:{
    type: String,
    required: true,
  },
  code:{
    type: String,
    required: true
  },
  statement:{
    type: Array,
    default: []
  },
  admin:{
    type: Boolean,
    required: true,
    default: false
  }

},{
  timestamps: true,
})

export default model("User", UserSchema);