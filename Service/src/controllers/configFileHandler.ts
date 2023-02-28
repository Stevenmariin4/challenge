import formatSchema from '../models/format.model';
import { BaseService } from '../core/base-service';
import { IFormat } from '../interface/format.interface';

export class ConfigFileHandler extends BaseService {
  private formatConfig: IFormat[];
  constructor() {
    super();
    this.table = 'items';
    this.model = formatSchema;
    this.validateParams = [];
    this.database = 'challenge';
    this.formatConfig = [];
  }
  /**
   * Method search configuration of format file
   * @param req request
   * @param res response
   * @returns separator and encoding
   */
  public handleConfigUpdate(req, res) {
    const format = this.formatConfig.find((format) => {
      format.nameformat === req.query.format;
    });
    if (format) {
      return res.status(400).json({
        error: `Invalid file format. Allowed formats are: `,
        allowedFormats: Object.keys(this.formatConfig),
      });
    }

    const separator = req.body.separator || format.separator;
    const encoding = req.body.encoding || format.encoding;

    res.status(200).json({
      separator,
      encoding,
    });
  }
  /**
   * Method validate if exist formats in database
   * @param req
   * @param res
   */
  public async validateDefaultFormats(req, res) {
    return new Promise<any>(async (resolve, reject) => {
      const { data } = await this.showAll(req, res, null);
      if (data.length > 0) {
        this.formatConfig = data.map((format) => {
          return {
            nameformat: format.nameformat,
            separator: format.separator,
            encoding: format.encoding,
            mimetype: format.mimetype,
          };
        });
        resolve(true);
      } else {
        const returnListFormat = await this.createDefaultValues(req, res);
        this.formatConfig = returnListFormat.map((format) => {
          return {
            nameformat: format.nameformat,
            separator: format.separator,
            encoding: format.encoding,
            mimetype: format.mimetype,
          };
        });
        resolve(true);
      }
    });
  }

  /**
   * Method search separator of minetype
   * @param format
   * @returns
   */
  public getSeparator(mimetype: any) {
    const formatFind = this.formatConfig.find((format) => {
      format.mimetype === mimetype;
    });
    return formatFind.separator;
  }
  /**
   * Method search encoding of mimetype
   * @param format
   * @returns
   */
  public getEncoding(mimetype: any) {
    const formatFind = this.formatConfig.find((format) => {
      format.mimetype === mimetype;
    });
    return formatFind.encoding;
  }
  /**
   * Method return format and configurations
   * @returns
   */
  public getNamesFormats() {
    return this.formatConfig;
  }
  /**
   * Methos create for default values in document formats
   * @param req Request
   * @param res Response
   * @returns Return formats inserted
   */
  private async createDefaultValues(req, res) {
    req.body = [
      { nameformat: 'csv', separator: ',', encoding: 'utf8', mimetype: 'csv' },
      { nameformat: 'txt', encoding: 'utf8', separator: '\n', mimetype: 'plain' },
      { nameformat: 'jsonl', encoding: 'utf8', separator: '\n', mimetype: 'octet-stream' },
    ];
    const { data } = await this.create(req, res, null);
    return data;
  }
  /**
   * Method return all config by format
   * @param req
   * @param res
   * @param next
   * @returns
   */
  public async getAllFormat(req, res, next) {
    return this.showAll(req, res, next);
  }
}
