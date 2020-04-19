import Post from '../models/Post';
import User from '../models/User';
import Email from '../services/email';

export default {
  async store(req, res){
    const { vehicle, brand, price, url, destination_email } = req.body;
    const { id } = req.headers
    
    const isAdmin = await User.findById(id);

    if(isAdmin && isAdmin.admin){
      const destination_user = await User.findOne({
        email: destination_email
      })
    if(!vehicle || !brand || !price || !url || !destination_email){
      return res.status(400).json({
        error: "Todos os dados devem ser preenchidos!"
      })
    }

      if(!destination_user) return res.status(400).json({error: "Usuário não encontrado!"})
      
      const post = await Post.create({
        vehicle,
        price,
        brand,
        url,
        destination: destination_user._id
      })

      Email.sendEmail({
        email: destination_user.email,
        name: destination_user.name,
        post:{
          vehicle,
          brand
        }
      }, "post");
      return res.json({post})
    }else{
      return res.status(401).json({error: "Não autorizado"})
    }
  },

  async index(req, res){
    const { id } = req.headers;
    const user = await User.findById(id);
    if(!user) return res.status(400).json({error: "Usuário não encontrado"});
    const posts = await Post.find({
      destination: id
    });
    return res.json(posts)
  },

  async delete(req, res){
    const { id, post_id } = req.headers;
    
    const isAdmin = await User.findById(id);

    if(isAdmin && isAdmin.admin){
      const post = await Post.findByIdAndRemove(post_id);
      if(!post) return res.status(400).json({error: "Post não encontrado!"});

      return res.json({ok: "Deletado!"});
    }else{
      return res.status(401).json({error: "Sem autorização!"})
    }
  },

  async show(req, res){
    const { id } = req.headers;

    const user = await User.findById(id);

    if(user.admin){
      const posts = await Post.find().populate('destination');
      return res.json(posts);
    }
    return res.json({error: "Sem autorização!"});
  },

  async showOne(req, res){
    const { id } = req.headers;
    const user = await User.findById(id);
    if(user.admin){
      const {postId} = req.params;
      const post = await Post.findById(postId).populate('destination');
      if(post){
        return res.json(post)
      }
      return res.status(404).json({error: "Post não encontrado"});
    }
  },

  async update(req, res){
    const { id } = req.headers;
    const { destination_email, vehicle, price, brand, url } = req.body
    const user = await User.findById(id);
    if(user.admin){
      const {postId} = req.params;
      const destination_user = await User.findOne({
        email: destination_email
      })
      if(!vehicle || !brand || !price || !url || !destination_email){
        return res.status(400).json({
          error: "Todos os dados devem ser preenchidos!"
        })
      }
      if(!destination_user) return res.status(400).json({error: "Usuário não encontrado!"})
      const post = await Post.findByIdAndUpdate(postId,{
        vehicle,
        price,
        brand,
        url,
        destination: destination_user._id
      })
      return res.status(200).json(post)
    }
    return res.json({error: "Sem autorização!"});
  }
}