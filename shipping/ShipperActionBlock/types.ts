export interface DataShippedItem {
  id?: string;
  shippedQuantityPerShipper: number | string;
}

export interface FormData {
  dataShipped: DataShippedItem[];
}
