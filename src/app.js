import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import Router from './router';

//Pre-start
dotenv.config();
const app = express();

//Variaveis
const port  = 3000;

//Inicia conexão com o BD
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true
}).then(()=>{
  console.log("Conectado ao BD!");
}, ()=>{
  console.log("Falha ao se conectar ao BD!");
});

//Middlewares
app.use(cors());
app.use(express.json());
app.use(Router);

//Inicia o servidor
app.listen(port, ()=>{
  console.log(`Servidor iniciado na porta ${port}`);
})