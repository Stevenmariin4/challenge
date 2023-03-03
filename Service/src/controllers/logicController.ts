import axios from 'axios';
import { response } from 'express';
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
            let categoryName = '';
            if (!!!category_id) {
              if (listAllCategories[category_id]) {
                const { name } = await this.getCategory(category_id).catch((error) => {
                  console.log('Error get Category', error);
                });
                categoryName = name;
              }
            }
            let currencyName = '';
            if (currency_id) {
              if (listAllCurrency[currency_id]) {
                const { description } = await this.getCurrency(currency_id).catch((error) => {
                  console.log('Error get currency', error);
                });
                currencyName = description;
              }
            }
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
              // console.log(
              //   `Error al obtener los datos para ${config.baseUrlMeli}items/${item.site}${item.id} ${error.message}`
              // );
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
