import { IItems } from '../interface/process.interface';
import { BaseService } from '../core/base-service';
import processSchema from '../models/process.model';
import { databaseConnection } from '../utils/database/connection';

export class ProcessController extends BaseService {
  constructor() {
    super();
    this.table = 'process';
    this.model = processSchema;
    this.validateParams = [];
    this.database = 'challenge';
  }

  public async insertNewItems(id: string, items) {
    return new Promise<any>(async (resolve, reject) => {
      const databaseTenant = await databaseConnection.switchDatabase(
        this.database,
        new Map([[this.table, this.model]])
      );
      const tenant = await databaseConnection.getDatabaseModel(databaseTenant, this.table);
      const responseUpdate = tenant.findByIdAndUpdate(id, { $push: items });
      resolve({
        code: 200,
        message: 'Operation successfull',
        data: responseUpdate,
      });
    });
  }
}
