import { Router, Request, Response, NextFunction } from "express";
import { FileController } from "../controllers/fileController";

export class FileRouter {
  public router: Router;
  public uri: string;
  private FileController: FileController;
  constructor() {
    this.router = Router();
    this.uri = "/files";
    this.FileController = new FileController();
    this.config();
  }

  /**
   *  Configure the routes of my RoleRoute
   */
  private config(): void {
    this.create();
  }

  /**
   *  Create Route
   */
  public create() {
    this.router.post(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          this.FileController.handleFileUpload(req, res, next);
        } catch (error) {
          console.error("has ocurred error in create data", error);
        }
      }
    );
  }
}
