import { Router, Request, Response, NextFunction } from 'express';
import { ProcessController } from '../controllers/process.controller';

export class ProcessRouter {
  public router: Router;
  public uri: string;
  private processController: ProcessController;
  constructor() {
    this.router = Router();
    this.uri = '/proccess';
    this.processController = new ProcessController();
    this.config();
  }

  /**
   *  Configure the routes of my RoleRoute
   */
  private config(): void {
    this.getById();
  }

  /**
   *  get By Id  Route
   */
  public getById() {
    this.router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response = await this.processController.getById(req, res, next);
        res.status(response?.code || 200).send(response);
      } catch (error) {
        console.error('has ocurred error in create data', error);
      }
    });
  }
}
