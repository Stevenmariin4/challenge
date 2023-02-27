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
    this.formatConfig = [
      { nameformat: 'csv', separator: ',', encoding: 'utf8', mimetype: 'csv' },
      { nameformat: 'txt', encoding: 'utf8', separator: '\n', mimetype: 'plain' },
      { nameformat: 'jsonl', encoding: 'utf8', separator: '\n', mimetype: 'octet-stream' },
    ];
  }
  /**
   * Method search configuration of format file
   * @param req request
   * @param res response
   * @returns separator and encoding
   */
  handleConfigUpdate(req, res) {
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
   * Method search separator of minetype
   * @param format
   * @returns
   */
  getSeparator(mimetype: any) {
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
  getEncoding(mimetype: any) {
    const formatFind = this.formatConfig.find((format) => {
      format.mimetype === mimetype;
    });
    return formatFind.encoding;
  }
  /**
   * Method return format and configurations
   * @returns
   */
  getNamesFormats() {
    return this.formatConfig;
  }
}
