import express from 'express';
import RootController from '../controllers';
const UserRouter = express.Router();

UserRouter.get('/user-name', RootController.Users.userName);
UserRouter.get('/user-country', RootController.Users.userCountry);
UserRouter.post('/user-add', RootController.Users.userAdd);

module.exports = UserRouter;
