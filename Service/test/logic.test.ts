import axios from 'axios';
import { LogicController } from '../src/controllers/logicController';
import { IDataResponse, IDataUrl } from '../src/interface/logic.interface';

jest.mock('axios');

describe('LogicController', () => {
  let logicController: LogicController;

  beforeEach(() => {
    logicController = new LogicController();
  });

  describe('getItems', () => {
    it('should return the data of the item', async () => {
      const body = {
        site: 'MLA',
        id: 'MLA1234',
      };
      const expectedResponse = {
        id: 'MLA1234',
        title: 'Test Item',
      };
      (axios.request as jest.MockedFunction<typeof axios.request>).mockResolvedValue({
        data: expectedResponse,
      });

      const response = await logicController['getItems'](body);

      expect(response).toEqual(expectedResponse);
    });

    it('should throw an error if the request fails', async () => {
      const body = {
        site: 'MLA',
        id: 'MLA1234',
      };
      const expectedError = new Error('Request failed');
      (axios.request as jest.MockedFunction<typeof axios.request>).mockRejectedValue(expectedError);

      await expect(logicController['getItems'](body)).rejects.toThrow(expectedError);
    });
  });
  describe('getCategory', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return the data of the category', async () => {
      const idCategory = 'MLA418285';
      const expectedResponse = {
        id: 'MLA418285',
        name: 'Masas y Plastilina',
        picture: null,
        permalink: null,
        total_items_in_this_category: 7357,
      };
      (axios.request as jest.MockedFunction<typeof axios.request>).mockResolvedValue({
        data: expectedResponse,
      });
      const response = await logicController['getCategory'](idCategory);

      expect(response).toEqual(expectedResponse);
    });

    it('should throw an error if the request fails category', async () => {
      const idCategory = 'MLA4182y85';
      const expectedError = new Error('Request failed');
      (axios.request as jest.MockedFunction<typeof axios.request>).mockRejectedValue(expectedError);

      await expect(logicController['getCategory'](idCategory)).rejects.toThrow(expectedError);
    });
  });
  describe('getCurrency', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return the data of the currency', async () => {
      const idCurrency = 'ARS';
      const expectedResponse = {
        id: 'ARS',
        symbol: '$',
        description: 'Peso argentino',
        decimal_places: 2,
      };
      (axios.request as jest.MockedFunction<typeof axios.request>).mockResolvedValue({
        data: expectedResponse,
      });
      const response = await logicController['getCurrency'](idCurrency);

      expect(response).toEqual(expectedResponse);
    });

    it('should throw an error if the request fails currency', async () => {
      const idCurrency = 'ARS';
      const expectedError = new Error('Request failed');
      (axios.request as jest.MockedFunction<typeof axios.request>).mockRejectedValue(expectedError);

      await expect(logicController['getCurrency'](idCurrency)).rejects.toThrow(expectedError);
    });
  });

  describe('processAnalyzeData', () => {
    it('should return the correct data when given valid data', async () => {
      const data: IDataUrl[] = [
        {
          site: 'MLA',
          id: '750925229',
        },
        {
          site: 'MLB',
          id: '845041373',
        },
      ];

      const expectedResponse: IDataResponse = {
        products: [
          {
            site: 'MLB',
            id: '750925229',
            name: 'Masas y Plastilina',
            description: 'Peso argentino',
            price: 654.04,
            nickName: 'VIP.SALE',
            start_time: new Date('2018-10-01T22:31:56.000Z'),
          },
          {
            site: 'MLA',
            id: '845041373',
            name: 'Displays y LCD',
            description: 'Peso argentino',
            price: 2900,
            nickName: 'CHSKATE',
            start_time: new Date('2020-03-22T21:27:57.000Z'),
          },
        ],
        notFound: [],
        totalProducts: 2,
        totalNotFound: 0,
      };

      const response = await logicController.processAnalyzeData(data);
      console.log('Response', response);
      expect(response).toEqual(expectedResponse);
    });

    it('should return the correct data when given invalid data', async () => {
      const data: IDataUrl[] = [
        {
          site: 'MLA',
          id: '750925229',
        },
        {
          site: 'MLB',
          id: 'MLB5678',
        },
        {
          site: 'MCO',
          id: 'MCO91011',
        },
      ];

      const expectedResponse: IDataResponse = {
        products: [
          {
            site: 'MLB',
            id: '750925229',
            name: 'Masas y Plastilina',
            description: 'Peso argentino',
            price: 654.04,
            nickName: 'VIP.SALE',
            start_time: new Date('2018-10-01T22:31:56.000Z'),
          },
        ],
        notFound: [
          {
            site: 'MCO',
            id: 'MCO91011',
          },
          {
            site: 'MLB',
            id: 'MLB5678',
          },
        ],
        totalProducts: 1,
        totalNotFound: 2,
      };

      const response = await logicController.processAnalyzeData(data);
      expect(response).toEqual(expectedResponse);
    });
  });
});
