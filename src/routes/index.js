import usersRouter from './users.route';
import songsRouter from './songs.route';
import jamsRouter from './jams.route';
import authJwt from '../middleware/authJwt';

export default (app) => {
  var unless = function (paths, middleware) {
    return function (req, res, next) {
      if (paths.includes(req.path)) {
        return next();
      } else {
        return middleware(req, res, next);
      }
    };
  };

  app.use(
    unless(['/users/auth/signin', '/users/auth/signup'], authJwt)
  );

  app.use('/users', usersRouter);
  app.use('/songs', songsRouter);
  app.use('/jams', jamsRouter);

  // Create a catch-all route for testing the installation.
  app.all('*', (req, res) =>
    res.status(200).send({
      message: 'Hello World!',
    })
  );
};
