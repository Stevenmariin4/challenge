'use strict';
// Libraries
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
import * as https from 'https';
import * as fs from 'fs';
import * as fileUpload from 'express-fileupload';
import config from './config';
import { FileRouter } from './routes/file-router';
import { databaseConnection } from './utils/database/connection';
import envalid from './utils/env/index';
/**
 * This class launch the service
 */

class Server {
  public app: express.Application;
  private env: any;
  private corsOptions: Object;
  private fileRouter: FileRouter;
  constructor() {
    this.app = express();

    // Configure Application
    this.config();

    // Instance Routers
    this.fileRouter = new FileRouter();
    // Cors Options
    this.corsOptions = {
      // credentials: true,
      methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
      origin: true,
    };
    // Validate environment
    this.env = envalid;
    // Configure Routes
    this.routes();
  }

  /**
   * Configure my app
   */
  private config(): void {
    dotenv.config();
    this.app.use(bodyParser.json({ limit: '2048mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }));
    this.app.use(cors(this.corsOptions));
    this.app.use(fileUpload());

    this.app.set('port', this.normalizePort(config.port || 3001));
  }

  /**
   *  Configure the routes of my app
   */
  routes(): void {
    this.app.use(`${this.fileRouter.uri}`, this.fileRouter.router);
  }

  private normalizePort(port: any) {
    const convertPort = typeof port === 'string' ? parseInt(port, 10) : port;
    return isNaN(convertPort) ? port : convertPort > 0 ? convertPort : false;
  }

  /**
   * Open the server in http
   */
  public initServer(isSecure: boolean = false) {
    let server: any;

    if (isSecure) {
      server = https
        .createServer(
          {
            pfx: fs.readFileSync(config.routePFX),
            passphrase: config.sslKey,
          },
          this.app
        )
        .listen(this.app.get('port'), () => {
          console.log(
            `App listening on port ${this.app.get('port')}! Go to https://localhost:${this.app.get(
              'port'
            )}/`
          );
        });
    } else {
      server = this.app.listen(this.app.get('port'), () => {
        console.log(`Listening on http://localhost:${this.app.get('port')}`);
        process.on('SIGINT', () => {
          console.log('Bye bye!');
          process.exit();
        });
      });
    }
  }
  /**
   * start proccess connection database and initServer
   */
  public startProcess() {
    databaseConnection
      .connectDatabase()
      .then(() => {
        console.log('connection database successfull');
        this.initServer();
      })
      .catch((error) => {
        console.log('Error connection database');
      });
  }
}

const server = new Server();
server.startProcess();
