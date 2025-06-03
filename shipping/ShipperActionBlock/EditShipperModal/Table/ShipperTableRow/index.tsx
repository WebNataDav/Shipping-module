import { TableCell, TableRow } from '@mui/material';
import { Control } from 'react-hook-form';
import { ControlledInput } from '@components/library';
import { FormValues } from 'src/components/ui/shipping/ShipperActionBlock/EditShipperModal/types';
import clsx from 'clsx';
import { ShippedItem } from 'src/stores/shippingStore/types';
import { validateAvailableQuantityWhenEditShipper } from 'src/components/ui/shipping/ShipperActionBlock/helpers';
import styles from './styles.module.scss';

interface ShipperTableRowProps {
  lineItem: ShippedItem;
  hasUnresolvedAdditionalWork?: boolean;
  control: Control<FormValues>;
}

const ShipperTableRow: React.FC<ShipperTableRowProps> = ({ lineItem, hasUnresolvedAdditionalWork, control }) => {
  return (
    <TableRow
      key={lineItem.id}
      hover
      className={clsx(styles.tableRow, { [styles.disabledRow]: hasUnresolvedAdditionalWork })}
    >
      <TableCell>
        {lineItem.category?.name && `${lineItem.category.name} `}
        {lineItem.description ?? ''}
      </TableCell>
      <TableCell>{lineItem.tracking}</TableCell>
      <TableCell>
        <ControlledInput
          control={control}
          defaultValue={lineItem.shippedQuantityPerShipper ?? 0}
          name={`dataShipped.${Number(lineItem.id)}.shippedQuantityPerShipper`}
          className={styles.shippedQuantityInput}
          type="number"
          fullWidth
          rules={{
            validate: (value: number) =>
              validateAvailableQuantityWhenEditShipper(
                value,
                lineItem.totalQuantity,
                lineItem.shippedQuantity,
                lineItem.shippedQuantityPerShipper,
                lineItem.availableQuantity,
              ),
          }}
        />
      </TableCell>
      <TableCell>{lineItem.shippedQuantity}</TableCell>
      <TableCell>{lineItem.availableQuantity}</TableCell>
      <TableCell>{lineItem.totalQuantity}</TableCell>
    </TableRow>
  );
};

export default ShipperTableRow;
