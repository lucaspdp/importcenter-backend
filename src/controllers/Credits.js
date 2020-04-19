import User from "../models/User";
import Post from "../models/Post";
import Credits from '../models/Credits';
import Email from '../services/email';


export default {
  async update(req, res){
    const { credit, value, user_email, t_type } = req.body;
    const { id, post_id, admin_id } = req.headers;

    if(!id && !user_email) return res.status(401).json({ error: "Todos os dados devem ser preenchidos!" });
    
    let user = null;
    if(id)
      user = await User.findById(id);
    else
      user = await User.findOne({ email : user_email })
    
      if(!user) return res.status(401).json({ error: "Usuário não encontrado"});

    if (!credit)
    {
      const post = await Post.findById(post_id);
      if(!post) return res.status(400);

      if(post.destination != id) return res.status(401).json({ error: "Sem permissão para comprar esse produto!"});

      if(post.bought) return res.status(400).json({error: "Produto já comprado!"});

      const price = post.price;
      
      if(user.credits < price) return res.status(401).json({error: "Créditos insuficientes!"});

      user.credits -= price;
      user.statement.push({
        name: post.vehicle,
        price: -post.price,
        date: Date.now()
      })
      await user.save();

      post.bought = true;
      await post.save();

      return res.json({msg: "Comprado com sucesso"})
    }
    //ADMIN - Creditar
    else{
      let user = null;
      if(id)
        user = await User.findById(id);
      else
        user = await User.findOne({ email : user_email })
      if(!user) return res.status(401).json({ error: "Sem autorização", user });
      const isAdmin = await User.findById(admin_id);

      if(isAdmin && isAdmin.admin){
        if(!user){
          return res.status(400).json({error: "Usuário não encontrado!"});
        }
        user.credits += value;
        user.statement.push({
          name: t_type,
          price: value,
          date: Date.now()
        })

        await Credits.create({
          destination: user._id,
          value
        })

        Email.sendEmail({
          email: user.email,
          name: user.name,
          value,
          creditsNow: user.credits
        }, "credits");

        await user.save();
        return res.json(user.credits);
      }else{
        return res.status(401).json({error: "Sem autorização!"});
      }
    
    }

  },

  async index(req, res){
    const { id } = req.headers;
    const response = await User.findById(id);
    res.json(response.credits)
  }
}