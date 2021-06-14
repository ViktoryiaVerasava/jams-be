import { Router } from 'express';
import * as JamsController from '../controllers/jams.controller';
import * as JamUsersController from '../controllers/jamUsers.controller';

const jamsRouter = Router();

jamsRouter.get('/', JamsController.findAll);
jamsRouter.get('/:id', JamsController.findOne);
jamsRouter.post('/', JamsController.create);
jamsRouter.post('/:id/start', JamsController.startJam);
jamsRouter.put('/:id', JamUsersController.addUserToJam);

export default jamsRouter;
