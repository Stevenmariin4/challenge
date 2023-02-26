export interface IProcess {
  status: string;
  totalItems: number;
  itemsAnalyzed: number;
  itemsSuccessfull: IItems[];
  itemsError: any[];
  startTime: Date | string;
  endTime: Date | string;
}

export interface IItems {}
