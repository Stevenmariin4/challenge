export interface IDataUrl {
  site: string;
  id: string;
}

export interface IDataProducts {
  site: string;
  id: string;
  price: number;
  start_time: Date | string;
  sellerName: string;
  currencyName: string;
  categoryName: string;
}
export interface IDataResponse {
  products: IDataProducts[];
  notFound: any[];
}

export interface IDataCategory {
  category_id: string;
  name: string;
}

export interface IDataCurrency {
  currency_id: string;
  description: string;
}
