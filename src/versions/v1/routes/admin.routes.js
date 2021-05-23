import express from 'express';
import RootController from '../controllers';
const AdminRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

/**
 * @swagger
 * 
 * /admin-name:
 *   get:
 *     tags:
 *     - Admin
 *     summary: Return Admin Name
 *     description: Returns a single Admin Name
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: successful operation
 *       404:
 *         description: Not found route
 */
AdminRouter.get('/admin-name', RootController.Admin.adminName);

AdminRouter.get('/admin-country', RootController.Admin.adminCountry);

AdminRouter.post('/admin-add', RootController.Admin.adminAdd);

module.exports = AdminRouter;
