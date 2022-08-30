import Post from '../models/Post';
import User from '../models/User';
import Email from '../services/email';

const itemsPerPage = 10;

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
    const { id, page: _page, is_web } = req.headers;
    const user = await User.findById(id);
    const page = _page - 1;
    let posts = []
    
    if(!user) return res.status(400).json({error: "Usuário não encontrado"});

    if(is_web)
      posts = await Post.find({
        destination: id
      }).sort({updatedAt: 'desc'}).limit(itemsPerPage).skip(page * itemsPerPage);
    
    else
      posts = await Post.find({
        destination: id
      }).sort({updatedAt: 'desc'})
    return res.json(posts)
  },

  async count(req, res){
    const { id, page: _page } = req.headers;

    const count = await Post.find({destination: id}).count();

    let maxPages = parseInt(count / itemsPerPage)
    if(parseInt(count / itemsPerPage) != (count / itemsPerPage)) maxPages++;
    return res.json({count, itemsPerPage, maxPages});
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
    const { id, rows, is_web, page} = req.headers
    const {email, code, placa} = req.query;

    const user = await User.findById(id);

    if(user.admin){

      let users_id = []
      let filtered = undefined
      let posts = [];
      let count = 0;

      if(email || code){
        const users = await User.find({
          ...email && {email: {$regex: '.*' + email + '.*'}},
          ...code && {code: {$regex: '.*' + code + '.*'}}
        }).select('_id')
  
        filtered = true
  
        users_id = Object.values(users).map(val=> val._id)
      }

      posts = await Post.find({
        ...filtered && {destination:{
          $in: users_id
        }},
        ...placa && {brand: {$regex: '.*' + placa + '.*'}}
      }).sort({
        createdAt: 'desc'
      }).limit(rows).skip(rows * page).populate({path: 'destination', select: 'email code name credits'})
  
      count = await Post.find({
        ...filtered && {destination:{
          $in: users_id
        }},
        ...placa && {brand: {$regex: '.*' + placa + '.*'}}
      }).populate({path: 'destination', select: 'email code name credits'}).count()
  
      return res.json({posts, count});
    }
    return res.status(500).json({error: "Sem autorização!"});
  },

  async showAll(req, res){
    const { id } = req.headers
    const user = await User.findById(id);

    if(user.admin){
      let posts = [];

      posts = await Post.find().sort({
        createdAt: 'desc'
      }).populate({path: 'destination', select: 'email code name credits'})
  
      return res.json(posts);
    }
    return res.status(500).json({error: "Sem autorização!"});
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
      Email.sendEmail({
        email: destination_user.email,
        name: destination_user.name,
        post:{
          vehicle,
          brand
        }
      }, "updatePost");
      return res.status(200).json(post)
    }
    return res.json({error: "Sem autorização!"});
  }
}