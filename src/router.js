import express from 'express';

import User from './controllers/User';
import Authentication from './controllers/Authentication';
import Post from './controllers/Post';
import Credits from './controllers/Credits';
import Statement from './controllers/Statement';

const router = express.Router();

///ADMIN
router.post('/register', User.store);
router.get('/users', User.index);
router.get('/posts', Post.show);
//POST
router.post('/post/new', Post.store);
router.delete('/post/delete', Post.delete);

///USER
router.post('/login', Authentication.store);
router.get('/post/show', Post.index);
router.get('/credits', Credits.index);
router.put('/credits', Credits.update);
router.get('/statement', Statement.index);

///TEST
router.get('/', (req, res)=>{
  res.send(`Servidor ONLINE!`);
});

export default router;