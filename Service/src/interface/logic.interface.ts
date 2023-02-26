export interface IDataUrl {
  site: string;
  id: string;
}

export interface IDataProducts {
  site: string;
  id: string;
  price: number;
  start_time: Date | string;
  name: string;
  description: string;
  nickName: string;
}
export interface IDataResponse {
  products: IDataProducts[];
  notFound: any[];
  totalProducts: number;
  totalNotFound: number;
}

export interface IDataCategory {
  category_id: string;
  name: string;
}

export interface IDataCurrency {
  currency_id: string;
  description: string;
}
