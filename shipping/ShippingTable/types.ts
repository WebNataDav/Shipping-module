import { ReactNode } from 'react';
import { Nullable, ShippingOrderClientType, WithStringId } from '@types';

export type ShippingTableColumns = {
  id: string;
  PO: string;
  customer: string;
  orderStatus: ReactNode;
  orderNumber: string;
  lostQuantity: number;
  dateCreated: WithStringId<Date>;
  lineItems: ShippingOrderClientType['lineItems'];
  whileYouWait: boolean;
};

export interface Filters {
  customer: string;
  orderStatus: string;
}

export type ShippingRow = {
  open: boolean;
  orderNumber: string | undefined;
  lineItems: ShippingOrderClientType['lineItems'];
  id?: string;
  notes: Nullable<string>;
  whileYouWait: boolean;
};
