import { Request, Response, NextFunction } from 'express';
import { FileParser } from '../utils/middleware/fileParse';
import { ConfigFileHandler } from './configFileHandler';
export class FileController {
  private allowedFormats: string[];
  private configHandler: ConfigFileHandler;
  private fileParser: FileParser;
  constructor() {
    this.allowedFormats = ['csv', 'txt', 'jsonl'];
    this.configHandler = new ConfigFileHandler();
    this.fileParser = new FileParser();
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
  handleFileUpload(req: any, res: Response, nextFunction: NextFunction) {
    try {
      const file = req.files.file;
      const format = req.files.file.mimetype.split('/').pop();
      if (!this.allowedFormats.includes(format)) {
        return res.status(400).json({
          error: `Invalid file format. Allowed formats are: ${this.allowedFormats.join(', ')}`,
          allowedFormats: this.allowedFormats,
        });
      }

      const fileConfig = {
        format,
        separator: this.configHandler.getSeparator(format),
        encoding: this.configHandler.getEncoding(format),
      };

      const fileContent = FileParser.parse(file.data.toString(), fileConfig);
      res.status(200).json({
        data: fileContent,
      });
    } catch (error) {
      console.error('Error handling file upload: ', error);
      res.status(500).json({
        error: 'Error handling file upload.',
      });
    }
  }
}
