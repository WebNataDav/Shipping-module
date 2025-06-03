import { PermissionType } from '@prisma/client';
import { CustomSelectFieldOptions } from '@components/library/CustomSelectField/types';
import { OrderClientStatuses } from '@constants';
import { Filters } from './types';

export const DefaultShippingTableFilters: Filters = {
  customer: '',
  orderStatus: '',
};

export const shippingOrderStatusOptions: CustomSelectFieldOptions[] = [
  { id: OrderClientStatuses.ReadyToShipping, name: OrderClientStatuses.ReadyToShipping },
  { id: OrderClientStatuses.PartiallyShipped, name: OrderClientStatuses.PartiallyShipped },
  { id: OrderClientStatuses.Shipped, name: OrderClientStatuses.Shipped },
  { id: OrderClientStatuses.Done, name: OrderClientStatuses.Done },
];

const { EDIT_SHIPPING } = PermissionType;
export const pagePermissions = [EDIT_SHIPPING];
