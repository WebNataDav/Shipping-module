import { $Enums } from '@prisma/client';
import { AdditionalWork } from 'src/components/ui/FindOrderModal/types';
import { ShippedItem } from 'src/stores/shippingStore/types';
import { FormValues } from 'src/components/ui/shipping/ShipperActionBlock/EditShipperModal/types';
import { DataShippedItem, FormData } from './types';

export const getEditedLineItemsWithSignOffCheck = (
  lineItems: ShippedItem[],
  originalValuesRef: React.MutableRefObject<ShippedItem[] | undefined>,
  formValues: FormValues,
) => {
  if (!lineItems || !originalValuesRef.current)
    return { lineItemIdsBeingSubmitted: [], requiresSignOffForSubmittedItems: false };

  const lineItemIdsBeingSubmitted = Object.keys(formValues.dataShipped).filter((id) => {
    const shippedQuantity = formValues.dataShipped[Number(id)].shippedQuantityPerShipper;
    return Number(shippedQuantity) > 0;
  });

  const requiresSignOffForSubmittedItems = lineItemIdsBeingSubmitted.some((id) => {
    const item = lineItems.find((lineItem) => lineItem.id === id);
    return (
      item &&
      // @ts-expect-error: incompatible types
      item.additionalWorks?.some(
        (work: AdditionalWork) =>
          work.workType?.requiresSignOff &&
          (work.status === $Enums.AdditionalWorkRecordStatus.Created ||
            work.status === $Enums.AdditionalWorkRecordStatus.InProgress),
      )
    );
  });

  return { requiresSignOffForSubmittedItems };
};

export const validateShipperInput = (data: FormData): boolean => {
  const itemsWithoutId = data.dataShipped.filter(
    (item: DataShippedItem | null): item is DataShippedItem => item !== null && !item.id,
  );

  return !(itemsWithoutId.length > 0 && itemsWithoutId.every((item) => Number(item.shippedQuantityPerShipper) === 0));
};

export const validateAvailableQuantityWhenCreateShipper = (value: string | number, availableQuantity: number) => {
  const numericValue = Number(value);

  if (numericValue > availableQuantity) {
    return `Maximum value should be ${availableQuantity}`;
  }
};

export const validateAvailableQuantityWhenEditShipper = (
  value: string | number,
  totalQuantity: number,
  currentShipped: number,
  currentShipper: number,
  availableQuantity: number,
) => {
  const numericValue = Number(value);

  const maxAllowed = currentShipper + (totalQuantity - currentShipped);

  if (numericValue > maxAllowed) {
    return `You can increase by at most ${availableQuantity}`;
  }
};
