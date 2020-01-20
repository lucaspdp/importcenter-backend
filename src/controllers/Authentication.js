import User from '../models/User';

export default {
  async store(req, res){
    const { code } = req.body;
    
    const checkUser = await User.findOne({
      code
    });

    if(!checkUser) return res.status(400).json({error: "Usuário não cadastrado"})

    return res.json(checkUser)
  }
}