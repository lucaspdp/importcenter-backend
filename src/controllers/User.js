import User from '../models/User';

export default {

  async store(req, res){
    const {admin, name, email, credits, code} = req.body;
    const { id } = req.headers
    
    const isAdmin = await User.findById(id);

    if(isAdmin && isAdmin.admin){
      const checkUser = await User.findOne({
        email
      });
  
      if(checkUser) return res.status(400).json({error: "Usuário já cadastrado"})
      const checkCode = await User.findOne({
        code
      });
      if(checkCode) return res.status(405).json({error: "Código já cadastrado"})
      
      if(admin === null || !name || !email || !code){
        return res.status(400).json({error: "Os dados devem ser preenchidos corretamente!"})
      }
      const user = await User.create({
        admin,
        name,
        email,
        credits,
        code
      })
  
      return res.json({
        user
      });
    }else{
      return res.status(401).json({error: "Não autorizado"})
    }
  
  },

  async index(req, res){
    const { id } = req.headers
    
    const isAdmin = await User.findById(id);

    if(isAdmin && isAdmin.admin){
      const users = await User.find({});

      return res.json(users);
    }else{
      return res.status(401).json({error: "Não autorizado"})
    }
  },

  async update(req, res){
    const { name, email, code, admin } = req.body;
    const { id } = req.headers;
    const { user_id } = req.params;
    const isAdmin = await User.findById(id);

    if(isAdmin && isAdmin.admin){
      const user = await User.findByIdAndUpdate(user_id, {
        email,
        name,
        code,
        admin
      });
      if(!user){
        return res.status(400).json({error: 'Usuário não encontrado!'});
      }

      return res.json(user);
    }
  },
  async show(req, res){
    const { id } = req.params;
    const user = await User.findById(id);
    if(!user) return res.status(400).json({error: 'Usuário não encontrado!'});

    return res.json(user);
  },

  async delete(req, res){
    const { id } = req.headers
    const { user_id } = req.params;
    
    const isAdmin = await User.findById(id);

    if(isAdmin && isAdmin.admin){
      const response = await User.findByIdAndRemove(user_id);
      if(!response)
        return res.status(400).json({error: 'Usuário não encontrado!'});
      return res.json({ok: true});
    }else{
      return res.status(401).json({error: "Não autorizado"})
    }
  }
}

