import {Schema, model} from 'mongoose';

const PostSchema = new Schema({

  vehicle:{
    type: String,
    required: true,
  },
  brand:{
    type: String,
    required: true,
  },
  price:{
    type: Number,
    required: true,
    default: 0
  },
  url:{
    type: String,
    required: true,
  },
  destination:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  bought: {
    type: Boolean,
    default: false
  }
  
},{
  timestamps: true,
})

export default model("Post", PostSchema);