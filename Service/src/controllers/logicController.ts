import axios from 'axios';
import config from '../config';
import { IDataProducts, IDataResponse, IDataUrl } from '../interface/logic.interface';
import { ProcessController } from './process.controller';

export class LogicController {
  private processController: ProcessController;
  constructor() {
    this.processController = new ProcessController();
  }
  /**
   * method return data of item search by id
   * @param body
   * @returns data of itemS
   */
  private async getItems(body: IDataUrl) {
    const options = {
      method: 'get',
      url: `${config.baseUrlMeli}items/${body.site}${body.id}`,
    };
    const responseMeli = await axios.request(options);
    return responseMeli.data;
  }
  /**
   * Method search category by id
   * @param idCategory
   * @returns return data of category
   */
  private async getCategory(idCategory: string) {
    const options = {
      method: 'get',
      url: `${config.baseUrlMeli}categories/${idCategory}`,
    };
    const responseMeli = await axios.request(options);
    return responseMeli.data;
  }
  /**
   * Method return currency by id
   * @param idCurrency
   * @returns data of currency
   */
  private async getCurrency(idCurrency: any) {
    const options = {
      method: 'get',
      url: `${config.baseUrlMeli}currencies/${idCurrency}`,
    };
    const responseMeli = await axios.request(options);
    return responseMeli.data;
  }

  private async getUsers(idUser: number) {
    const options = {
      method: 'get',
      url: `${config.baseUrlMeli}users/${idUser}`,
    };
    const responseMeli = await axios.request(options);
    return responseMeli.data;
  }
  /**
  Processes the data obtained from a list of IDataUrl objects and returns an IDataResponse object containing the processed data and a 
  list of items that were not found.
  @param data An array of IDataUrl objects that contain the site and ID of each item to be analyzed.
  @returns An IDataResponse object containing the processed data and a list of items that were not found.
*/
  public async processAnalyzeData(data: IDataUrl[], idProcess?: string): Promise<IDataResponse> {
    const listAllCategories: Record<string, string> = {};
    const listAllCurrency: Record<string, string> = {};
    const batchSize = 300;

    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    let allProducts = [];
    let allNotFound = [];
    for (const [index, batch] of batches.entries()) {
      console.log('process ', index);
      const batchProducts: IDataProducts[] = [];
      const batchNotFound: IDataUrl[] = [];
      await Promise.all(
        batch.map(async (item) => {
          try {
            // Gets the required data for the current item.
            const { seller_id, currency_id, category_id, start_time, price } = await this.getItems(
              item
            );
            const categoryName = category_id
              ? listAllCategories[category_id] ||
                ((await this.getCategory(category_id))?.name ??
                  (() => {
                    console.log('Error: category not found for', item.site, item.id);
                    return 'Category Not Found';
                  })())
              : '';
            const currencyName = currency_id
              ? listAllCurrency[currency_id] ||
                ((await this.getCurrency(currency_id))?.description ??
                  (() => {
                    console.log('Error: currency not found for', item.site, item.id);
                    return 'Currency not Found';
                  })())
              : '';
            const { nickname } = await this.getUsers(seller_id);
            batchProducts.push({
              site: item.site,
              id: item.id,
              name: categoryName,
              description: currencyName,
              price,
              nickName: nickname,
              start_time,
            });
          } catch (error) {
            if (error?.response?.status === 404) {
              batchNotFound.push(item);
            } else {
              console.error(
                `Error al obtener los datos para ${config.baseUrlMeli}items/${item.site}${item.id}: ${error.message}`
              );
            }
          }
        })
      );
      allProducts = [...allProducts, ...batchProducts];
      allNotFound = [...allNotFound, ...batchNotFound];
      if (idProcess) {
        if (batchProducts.length > 0) {
          this.processController.insertNewItems(idProcess, { itemsSuccessfull: batchProducts });
        }
        if (batchNotFound.length > 0) {
          this.processController.insertNewItems(idProcess, { itemsError: batchNotFound });
        }
      }
    }
    return {
      products: allProducts,
      notFound: allNotFound,
      totalProducts: allProducts.length,
      totalNotFound: allNotFound.length,
    };
  }
}
