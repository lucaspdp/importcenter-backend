import Credits from '../models/Credits';
import User from '../models/User';

export default {
  async index(req, res){
    const { id, rows, is_web, page} = req.headers
    const {email, code} = req.query;

    const user = await User.findById(id);
    if(!user){
      res.status(400).json({error: "Usuário não encontrado"});
      return;
    }
    if(!user.admin){
      return res.status(500).json({error: "Você não tem permissão para executar esse comando!"});
    }

    let users_id = []
    let filtered = undefined
    let creditsHistory = [];
    let count = 0;

    if(email || code){
      const users = await User.find({
        ...email && {email: {$regex: '.*' + email + '.*'}},
        ...code && {code: {$regex: '.*' + code + '.*'}}
      }).select('_id')

      filtered = true

      users_id = Object.values(users).map(val=> val._id)
    }

    creditsHistory = await Credits.find({
      ...filtered && {destination:{
        $in: users_id
      }}
    }).sort({
      createdAt: 'desc'
    }).limit(rows).skip(rows * page).populate({path: 'destination', select: 'email code name credits'})

    count = await Credits.find({
      ...filtered && {destination:{
        $in: users_id
      }}
    }).populate({path: 'destination', select: 'email code name credits'}).count()

    return res.json({credits: creditsHistory, count})
    
  },

  async indexAll(req, res){
    const { id } = req.headers

    const user = await User.findById(id);
    if(!user){
      res.status(400).json({error: "Usuário não encontrado"});
      return;
    }
    if(!user.admin){
      return res.status(500).json({error: "Você não tem permissão para executar esse comando!"});
    }

    const creditsHistory = await Credits.find().populate({path: 'destination', select: 'email code name credits'})

    return res.json(creditsHistory)
  },

  async delete(req, res){
    const {id} = req.headers;
    const {date} = req.params;
    const {credit} = req.body;


    const user = await User.findById(id);
    if(!user){
      res.status(400).json({error: "Usuário não encontrado"});
      return;
    }
    if(!user.admin){
      return res.status(500).json({error: "Você não tem permissão para executar esse comando!"});
    }

    const credits = await Credits.findOne({
      date
    });

    if(!credits){
      return res.status(400).json({error: "Operação não encontrada!"})
    }

    const user_statement = await User.findById(credits.destination)

    if(!user_statement){
      return res.status(400).json({error: "Usuário não encontrado!"});
    }

    const statement = user_statement.statement.filter(st=>{
      return st.date == date;
    });

    if(statement.length === 0){
      return res.status(400).json({error: "Operação não encontrada, tente novamente!"})
    }

    user_statement.statement = user_statement.statement.filter(st=>{
      return st.date != date;
    });

    if(credit){
      user_statement.credits -= parseFloat(credits.value).toFixed(2);
    }

    await user_statement.save();
    await credits.remove();

    return res.json({ok: true})
  }
};