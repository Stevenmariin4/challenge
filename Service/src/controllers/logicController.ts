import axios from 'axios';
import config from '../config';
import { IDataProducts, IDataResponse, IDataUrl } from '../interface/logic.interface';

export class LogicController {
  /**
   *
   * @param body
   * @returns
   */
  private async getItems(body: IDataUrl) {
    const options = {
      method: 'get',
      url: `${config.baseUrlMeli}items/${body.site}${body.id}`,
    };
    const responseMeli = await axios.request(options);
    return responseMeli.data;
  }

  private async getCategory(idCategory: string) {
    const options = {
      method: 'get',
      url: `${config.baseUrlMeli}categories/${idCategory}`,
    };
    const responseMeli = await axios.request(options);
    return responseMeli.data;
  }

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
  public async processAnalyzeData(data: IDataUrl[]): Promise<IDataResponse> {
    const allData: IDataProducts[] = [];
    const listAllCategories: Record<string, string> = {};
    const listAllCurrency: Record<string, string> = {};
    const notFound: IDataUrl[] = [];

    await Promise.all(
      data.map(async (item) => {
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
          allData.push({
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
            notFound.push(item);
          } else {
            console.error(
              `Error al obtener los datos para ${config.baseUrlMeli}items/${item.site}${item.id}: ${error.message}`
            );
          }
        }
      })
    );
    return {
      products: allData,
      notFound,
      totalProducts: allData.length,
      totalNotFound: notFound.length,
    };
  }
}
