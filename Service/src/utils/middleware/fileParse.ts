export class FileParser {
  static parse(data, config) {
    const format = config.mimetype;
    const separator = config.separator;
    const encoding = config.encoding;

    if (format === 'csv') {
      return this.parseCSV(data, separator, encoding);
    } else if (format === 'txt') {
      return this.parseTXT(data, separator, encoding);
    } else if (format === 'jsonl') {
      return this.parseJSONL(data, encoding);
    } else if (format === 'plain') {
      return this.parseTXT(data, separator, encoding);
    } else if (format === 'octet-stream') {
      return this.parseJSONL(data, encoding);
    }
  }

  static parseCSV(data, separator, encoding) {
    // Implementation for CSV parsing
    const lines = data.split('\n');
    const headers = lines[0].split(separator).map((h) => h.trim());
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') {
        continue;
      }
      const values = line.split(separator).map((v) => v.trim());
      const record = {};
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        const value = values[j];
        record[header] = value;
      }
      records.push(record);
    }
    return {
      headers,
      records,
    };
  }

  static parseTXT(data, separator, encoding) {
    data = data.replaceAll('|^.', '');
    data = data.replaceAll('_.', '');
    data = data.replaceAll('|-.', '');
    // Implementation for TXT parsing
    const lines = data.split('\n');
    const headers = lines[0].split(separator).map((h) => h.trim());
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') {
        continue;
      }
      const values = line.split(separator).map((v) => v.trim());
      for (let j = 0; j < headers.length; j++) {
        const listProperties = values[j].split('|');
        if (listProperties[1].includes('ML')) {
          const value = { site: listProperties[1], id: listProperties[2] };
          records.push(value);
        }
      }
    }
    return {
      headers,
      records,
    };
  }

  static parseJSONL(data, encoding) {
    // Implementation for JSONL parsing
    const lines = data.split('\n');
    const records = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') {
        continue;
      }
      const record = JSON.parse(line);
      records.push(record);
    }
    return {
      records,
    };
  }
}
