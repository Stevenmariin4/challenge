export class ConfigFileHandler {
  formatConfig: any;
  constructor() {
    this.formatConfig = {
      csv: {
        separator: ',',
        encoding: 'utf8',
      },
      txt: {
        separator: '\t',
        encoding: 'utf8',
      },
      jsonl: {
        separator: '',
        encoding: 'utf8',
      },
    };
  }

  handleConfigUpdate(req, res) {
    const format = req.params.format;
    if (!this.formatConfig[format]) {
      return res.status(400).json({
        error: `Invalid file format. Allowed formats are: ${Object.keys(this.formatConfig).join(
          ', '
        )}`,
        allowedFormats: Object.keys(this.formatConfig),
      });
    }

    const separator = req.body.separator || this.formatConfig[format].separator;
    const encoding = req.body.encoding || this.formatConfig[format].encoding;

    this.formatConfig[format] = {
      separator,
      encoding,
    };

    res.status(200).json({
      separator,
      encoding,
    });
  }

  getSeparator(format) {
    return this.formatConfig[format].separator;
  }

  getEncoding(format) {
    return this.formatConfig[format].encoding;
  }
}
