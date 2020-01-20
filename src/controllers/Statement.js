import User from "../models/User";

export default {
  async index(req, res){
    const { id } = req.headers;

    const user = await User.findById(id);
    if(!user) return res.status(400).json({error: "Usuário não encontrado."});

    const statements = user.statement.sort(function(a,b) {
      return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });

    return res.json(statements);
  }
}