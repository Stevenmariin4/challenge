import { Response, NextFunction } from 'express';
import { IFormat } from 'src/interface/format.interface';
import { BaseService } from '../core/base-service';
import itemSchema from '../models/process.model';
import { FileParser } from '../utils/middleware/fileParse';
import { ConfigFileHandler } from './configFileHandler';
import { LogicController } from './logicController';

export class FileController extends BaseService {
  private allowedFormats: IFormat[];
  private configHandler: ConfigFileHandler;
  private fileParser: FileParser;
  private logicController: LogicController;
  constructor() {
    super();
    this.configHandler = new ConfigFileHandler();
    this.fileParser = new FileParser();
    this.logicController = new LogicController();
    this.allowedFormats = this.configHandler.getNamesFormats();

    this.table = 'items';
    this.model = itemSchema;
    this.validateParams = [];
    this.database = 'challenge';
  }

  /**
  Handles file upload request.
  Validates the format of the file and reads it using the configured settings.
  Sends back parsed file content.
  @param req Request object of Express
  @param res Response object of Express
  @param nextFuction Next function of Express middleware chain
  @returns JSON object with parsed file content or error message
  */
  async handleFileUpload(req: any, res: Response, nextFunction: NextFunction) {
    try {
      const file = req.files.file;
      const mimetype = req.files.file.mimetype.split('/').pop();
      const format = this.allowedFormats.find((format) => format.mimetype === mimetype);
      if (!format) {
        return res.status(400).json({
          error: `Invalid file format. Allowed formats are: ${this.allowedFormats.map(
            (format) => format.nameformat
          )}`,
        });
      }

      const fileConfig = {
        mimetype,
        separator: format.separator,
        encoding: format.encoding,
      };

      const { records } = FileParser.parse(file.data.toString(), fileConfig);
      const responseLogic = await this.logicController.processAnalyzeData(records);
      req.body = responseLogic.products;
      const response = await this.create(req, res, nextFunction);
      res.send(response);
    } catch (error) {
      console.error('Error handling file upload: ', error);
      res.status(500).json({
        error: 'Error handling file upload.',
      });
    }
  }
}
