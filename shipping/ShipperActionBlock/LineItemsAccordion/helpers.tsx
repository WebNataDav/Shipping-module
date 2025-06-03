import { $Enums, AdditionalWork } from '@prisma/client';
import { format } from 'date-fns';
import { DateFormat } from '@constants';
import { ShippedItem, ShippersOrderLineItem } from 'src/stores/shippingStore/types';

export const formattedShippedDated = (dateStr: string) => {
  const date = new Date(dateStr);
  const formattedDate = format(date, DateFormat.ShipperActionFullDate);
  return formattedDate;
};

export const checkIfUnresolvedAdditionalWork = (shippingLineItems: ShippedItem[] | ShippersOrderLineItem[]) => {
  if (!shippingLineItems || !shippingLineItems.length) return false;

  return shippingLineItems.some(
    (item) =>
      // @ts-expect-error: incompatible types
      item?.additionalWorks?.some(
        (work: AdditionalWork) =>
          work.status === $Enums.AdditionalWorkRecordStatus.Created ||
          work.status === $Enums.AdditionalWorkRecordStatus.InProgress,
      ),
  );
};
