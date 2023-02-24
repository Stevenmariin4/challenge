import { Response, NextFunction } from 'express';
import { IFormat } from '../interface/format.interface';
import processSchema from '../models/process.model';
import { BaseService } from '../core/base-service';
import { FileParser } from '../utils/middleware/fileParse';
import { ConfigFileHandler } from './configFileHandler';
import { LogicController } from './logicController';
import { IProcess } from '../interface/process.interface';
import { ProcessController } from './process.controller';

export class FileController {
  private allowedFormats: IFormat[];
  private configHandler: ConfigFileHandler;
  private fileParser: FileParser;
  private logicController: LogicController;
  private processController: ProcessController;
  constructor() {
    this.configHandler = new ConfigFileHandler();
    this.fileParser = new FileParser();
    this.logicController = new LogicController();
    this.allowedFormats = this.configHandler.getNamesFormats();
    this.processController = new ProcessController();
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
      const mimetype = file.mimetype.split('/').pop();
      const format = this.allowedFormats.find((f) => f.mimetype === mimetype);
      if (!format) {
        return res.status(400).json({
          error: `Invalid file format. Allowed formats are: ${this.allowedFormats.map(
            (f) => f.nameformat
          )}`,
        });
      }

      const fileConfig = {
        mimetype,
        separator: format.separator,
        encoding: format.encoding,
      };

      const records = FileParser.parse(file.data.toString(), fileConfig).records;
      req.body = { status: 'init', totalItems: records.length };
      const process = await this.createProcess(req, res, nextFunction);

      if (req.query.processsync === 'true') {
        this.logicController.processAnalyzeData(records, process._id);
        res.status(201).json({ message: 'The operation has started', code: 201, id: process._id });
        this.logicController.processAnalyzeData(records).then((data) => {
          req.params.id = process._id;
          req.body = { status: 'end' };
          this.processController.update(req, res, nextFunction);
        });
        return null;
      }

      const responseLogic = await this.logicController.processAnalyzeData(records);
      const itemsError = responseLogic.notFound.map((item) => ({
        message: 'Items not Found',
        item: `${item.site}${item.id}`,
      }));
      const newProcess: Partial<IProcess> = {
        status: 'end',
        itemsSuccessfull: responseLogic.products,
        itemsAnalyzed: responseLogic.totalProducts,
        itemsError,
      };
      req.params.id = process._id;
      req.body = newProcess;
      await this.processController.update(req, res, nextFunction);
      const { data } = await this.processController.getById(req, res, nextFunction);
      return res.status(200).json({ message: 'Operation successful', data });
    } catch (error) {
      console.error('Error handling file upload:', error);
      return res.status(500).json({ error: 'Error handling file upload' });
    }
  }

  /**
   * Method create new process
   * @param req request
   * @param res response
   * @param next nextFunction
   * @returns data insert in database
   */
  private async createProcess(req, res, next) {
    const { data } = await this.processController.create(req, res, next);
    return data;
  }
}
