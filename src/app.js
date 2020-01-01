import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';
import rfs from 'rotating-file-stream';
import SwaggerUIDist from 'swagger-ui-dist';
import compression from 'compression';
import RootRouterV1 from './versoins/v1/routes';

const app = express();
const router = express.Router();

const pathToSwaggerUi = SwaggerUIDist.getAbsoluteFSPath()

let logDirectory = path.join(__dirname, 'log')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
let accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
})

app.use(logger('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Index file get call
app.use(express.static(path.join(__dirname, '../public')));

/**
 * URL for swagger API
 * 
 * https://github.com/scottie1984/swagger-ui-express/blob/6711c8e4200f1921e9080b9d2dff0faa04cf1417/index.js#L94
 * https://github.com/swagger-api/swagger-ui/issues/4624#issuecomment-396439809
 * 
 * Example for -> swaggerDocURL = 'http://rackerlabs.github.io/wadl2swagger/openstack/swagger/dbaas.yaml'
 */
const swaggerDocURL = '/swagger.yaml';

app.use('/swagger.yaml', express.static(path.join(__dirname, '../public/apiDoc/swagger.yaml')));

const indexContent = fs.readFileSync(`${pathToSwaggerUi}/index.html`)
  .toString()
  .replace("https://petstore.swagger.io/v2/swagger.json", swaggerDocURL)

app.get("/api-doc", (req, res) => res.send(indexContent))
app.use(express.static(pathToSwaggerUi));

// https://codeburst.io/never-forget-to-compress-on-nodejs-11a19db74e60
app.use(compression());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "HEAD,OPTIONS,GET,POST,PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access_token");
  next();
});

/**
 * API Routes
 * 
 * Version: 1
 */
router.use("/api/v1", [RootRouterV1.AdminRouter, RootRouterV1.UserRouter]);
app.use(router);

/**
 * Response on Error Code 500
 */
app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    success: false,
    error: error,
    message: error.message
  });
});

/**
 * Response on Error code 404
 */
app.use((req, res, next) => {
  let error = new Error("Not Found");
  error.status = 404;
  res.status(error.status).send({
    success: false,
    error: error,
    message: error.message
  });
});

module.exports = app;