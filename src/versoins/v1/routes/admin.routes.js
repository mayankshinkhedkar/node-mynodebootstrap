import express from 'express';
import RootController from '../controllers';
const AdminRouter = express.Router();

AdminRouter.get('/admin-name', RootController.Admin.adminName);
AdminRouter.get('/admin-country', RootController.Admin.adminCountry);
AdminRouter.post('/admin-add', RootController.Admin.adminAdd);

module.exports = AdminRouter;
