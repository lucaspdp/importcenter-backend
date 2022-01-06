import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import Router from './router';

//Pre-start
dotenv.config();
const app = express();

//Variaveis
const port  = process.env.PORT || 3000;

//Inicia conexão com o BD
mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("Conectado ao BD!");
}, (e)=>{
  console.log("Falha ao se conectar ao BD!", e);
});

//Middlewares
app.use(cors());
app.use(express.json());
app.use(Router);

//Inicia o servidor
app.listen(port, ()=>{
  console.log(`Servidor iniciado na porta ${port}`);
})