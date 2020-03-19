import Credits from '../models/Credits';
import User from '../models/User';

export default {
  async index(req, res){
    const {id} = req.headers;

    const user = await User.findById(id);
    if(!user){
      res.status(400).json({error: "Usuário não encontrado"});
      return;
    }
    if(!user.admin){
      res.status(500).json({error: "Você não tem permissão para executar esse comando!"});
    }

    const response = await Credits.find({}).populate('destination');
    
    return res.json(response);
  },
};