import { Router } from 'express'
import HttpStatus from 'http-status'
import RootRouterV1 from './v1/routes';

const router = Router();

const routes = (app) => {
  app.use(router);

  router.use('/api/v1', RootRouterV1);

  app.use((error, req, res, next) => {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      error,
      message: error.message,
    });
  });

  app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = HttpStatus.NOT_FOUND;
    res.status(error.status).json({
      success: false,
      data: null,
      error,
      message: error.message,
    });
  });
}

export default routes