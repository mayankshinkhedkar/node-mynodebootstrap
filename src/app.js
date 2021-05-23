import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';
import { createStream } from 'rotating-file-stream';
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import compression from 'compression';
import methodOverride from 'method-override'
import helmet from 'helmet'
import Config from './config';
import swaggers from './config/swagger';
import localLogger from './localLoggerSetup';
import routes from './versions';
import db from './versions/models'

const PORT = Config.port || 8080
const HOST = Config.host || "localhost"

export default class app {
  constructor(normalizePort, startServer) {
    this.normalizePort = normalizePort
    this.startServer = startServer
    this.app = express()

    this.middleware()
    this.connectDb()
    this.routes()
    this.start()
  }

    /**
     * Loads all the middleware
     */
     middleware() {
      const { app } = this

      /**
       * It parses incoming requests with JSON payloads and is based on body-parser.
       */
      app.use(express.json());

      /**
       * URL Encoded
       * https://www.geeksforgeeks.org/express-js-express-urlencoded-function/
       */
       app.use(express.urlencoded({ extended: false }));

      /**
       * Decreases the downloadable amount of data that’s served to users
       * Ref: https://alligator.io/nodejs/compression/
       */
      app.use(compression());
  
      /**
       * Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
       * Ref: https://www.npmjs.com/package/method-override
       */
      app.use(methodOverride());
  
      /**
       * Helmet helps you secure your Express apps by setting various HTTP headers.
       * Ref: https://www.twilio.com/blog/securing-your-express-app-html
       */
      app.use(helmet())

      /**
       * Parse Cookie header and populate req.cookies with an object keyed by the cookie names
       * http://expressjs.com/en/resources/middleware/cookie-parser.html
       */
      app.use(cookieParser());

      /**
       * Public folder access
       */
      app.use(express.static(path.join(__dirname, '../public')));

      /**
       * Logger
       */
      // logger dir path
      let logDirectory = path.join(__dirname, 'log');

      // logger file path
      let logFile = path.join(__dirname, 'log', 'access.log');

      // logger format
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

      // logger file name generator
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

      /**
       * Swagger for API version wise documentation
       */
      const swaggersData = swaggers(PORT, HOST)

      if (Object.keys(swaggersData).length) {
        for (const property in swaggersData) {
          const swaggerSpec = swaggerJSDoc(swaggersData[property]);
          app.use(property, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        }
      }
    }

    /**
     * Database connection
     */
    connectDb() {
      const { sequelize } = db

      sequelize
        .authenticate()
        .then(async () => {
          localLogger.info('Connection has been established successfully.');
          await sequelize
            .sync()
            .then(() => {
              localLogger.info('Database sync successfully');
            })
            .catch((error) => {
              localLogger.error('Database syncing error %s', error);
            });
        })
        .catch(err => {
          localLogger.error('Unable to connect to the database:', err);
        });
    }

    /**
     * Routes initialization
     */
    routes() {
      const { app } = this

      routes(app)
    }

  /**
   * Start
   */
  start() {
    const { app, normalizePort, startServer } = this
    let port = normalizePort(PORT || '3000');
    let hostname = normalizePort(HOST || 'localhost');
    app.set('port', port);
    app.set('hostname', hostname);

    startServer(app, port, hostname);
  }
}