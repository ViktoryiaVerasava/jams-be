import { Router } from 'express';
import * as UsersController  from '../controllers/users.controller';

const usersRouter = Router();

usersRouter.get('/', UsersController.findAll);
usersRouter.get('/:id', UsersController.findOne);
usersRouter.post('/auth/signup', UsersController.create);
usersRouter.post('/auth/signin', UsersController.signIn);


export default usersRouter;