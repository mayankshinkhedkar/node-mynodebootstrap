import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';
import { createStream } from 'rotating-file-stream';
import SwaggerUIDist from 'swagger-ui-dist';
import compression from 'compression';
import RootRouterV1 from './versoins/v1/routes';

const app = express();
const router = express.Router();

const pathToSwaggerUi = SwaggerUIDist.getAbsoluteFSPath();

let logDirectory = path.join(__dirname, 'log');
let logFile = path.join(__dirname, 'log', 'access.log');
let loggerFormat = `
  ------- START -------
  date[web] => :date[web] 
  http-version => :http-version 
  method => :method 
  referrer => :referrer 
  remote-addr => :remote-addr 
  remote-user => :remote-user 
  req[header] => :req[header] 
  res[header] => :res[header]
  response-time[3] => :response-time[3] 
  status => :status 
  total-time[3] => :total-time[3] 
  url => :url 
  user-agent => :user-agent
  ------- END -------
`;

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// ensure log file exists
fs.existsSync(logFile) || fs.open(logFile, 'w', function (err, file) {
  if (err) throw err;
});

const pad = num => (num > 9 ? "" : "0") + num;
const generator = (time, index) => {
  if (!time) return "file.log";

  var month = time.getFullYear() + "-" + pad(time.getMonth() + 1);
  var day = pad(time.getDate());
  var hour = pad(time.getHours());
  var minute = pad(time.getMinutes());

  return `${month}/${month}-${day}--${hour}-${minute}--${index}-file.log`;
};

// create a rotating write stream
let accessLogStream = createStream(generator, {
  size: "10M", // rotate every 10 MegaBytes written
  interval: "30m", // rotate daily
  compress: "gzip", // compress rotated files
  history: 'record-req-res',
  immutable: true,
  intervalBoundary: true,
  path: logDirectory
})

app.use(logger(loggerFormat, { stream: accessLogStream }));
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