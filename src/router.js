import express from 'express';

import User from './controllers/User';
import Authentication from './controllers/Authentication';
import Post from './controllers/Post';
import Credits from './controllers/Credits';
import Statement from './controllers/Statement';
import AdminCredits from './controllers/AdminCredits';

const router = express.Router();

///ADMIN
router.post('/register', User.store);
router.get('/users', User.index);
router.get('/user/:id', User.show);
router.get('/editpost/:postId', Post.showOne);
router.delete('/user/:user_id', User.delete);
router.put('/user/:user_id', User.update);
router.put('/post/:postId', Post.update);
router.get('/posts', Post.show);
router.get('/creditshistory', AdminCredits.index);
router.delete('/creditshistory/:date', AdminCredits.delete);
//POST
router.post('/post/new', Post.store);
router.delete('/post/delete', Post.delete);

///USER
router.post('/login', Authentication.store);
router.get('/post/show', Post.index);
router.get('/post/count', Post.count);
router.get('/credits', Credits.index);
router.put('/credits', Credits.update);
router.get('/statement', Statement.index);

///TEST
router.get('/', (req, res)=>{
  res.send(`Servidor ONLINE!`);
});

export default router;