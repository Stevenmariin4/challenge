import { Router, Request, Response, NextFunction } from 'express';
import { ConfigFileHandler } from '../controllers/configFileHandler';

export class FormatRouter {
  public router: Router;
  public uri: string;
  private formatController: ConfigFileHandler;
  constructor() {
    this.router = Router();
    this.uri = '/format';
    this.formatController = new ConfigFileHandler();
    this.config();
  }

  /**
   *  Configure the routes of my RoleRoute
   */
  private config(): void {
    this.showAll();
  }

  /**
   *  show all Route
   */
  public showAll() {
    this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response = await this.formatController.showAll(req, res, next);
        res.send(response);
      } catch (error) {
        console.error('has ocurred error in create data', error);
      }
    });
  }
}
