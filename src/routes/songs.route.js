import { Router } from 'express';
import * as SongsController  from '../controllers/songs.controller';

const songsRouter = Router();

songsRouter.get('/', SongsController.findAll);

export default songsRouter;