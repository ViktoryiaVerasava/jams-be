import express from 'express';
import route from './src/routes';
import db from './src/models';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;
var corsOptions = {
  credentials:true,
  origin: [
    'http://localhost:3000',
    'https://whispering-eyrie-19616.herokuapp.com',
  ],
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const alterDatabaseOnSync = true;
const eraseDatabaseOnSync = false; // if enabled, drops all tables and data on sync
db.sequelize
  .sync({ force: eraseDatabaseOnSync, alter: alterDatabaseOnSync })
  .then(async () => {
    if (eraseDatabaseOnSync) {
      // erase tables data
    }
    route(app);
    app.listen(port, () => console.log(`App listening on port ${port}`));
  });
