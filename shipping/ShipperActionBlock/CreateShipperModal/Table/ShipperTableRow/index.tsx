import { TableCell, TableRow } from '@mui/material';
import { Control } from 'react-hook-form';
import { ControlledInput } from '@components/library';
import { FormValues } from 'src/components/ui/shipping/ShipperActionBlock/CreateShipperModal/types';
import { ShippedItem } from 'src/stores/shippingStore/types';
import { validateAvailableQuantityWhenCreateShipper } from 'src/components/ui/shipping/ShipperActionBlock/helpers';
import styles from './styles.module.scss';

interface ShipperTableRowProps {
  lineItem: ShippedItem;
  control: Control<FormValues>;
}

const ShipperTableRow: React.FC<ShipperTableRowProps> = ({ lineItem, control }) => {
  return (
    <TableRow key={lineItem.id} hover className={styles.tableRow}>
      <TableCell>
        {lineItem.category?.name && `${lineItem.category.name} `}
        {lineItem.description ?? ''}
      </TableCell>
      <TableCell>{lineItem.tracking}</TableCell>
      <TableCell>
        <ControlledInput
          control={control}
          defaultValue={0}
          name={`dataShipped.${Number(lineItem.id)}.shippedQuantityPerShipper`}
          className={styles.shippedQuantityInput}
          type="number"
          fullWidth
          rules={{
            validate: (value: number) => validateAvailableQuantityWhenCreateShipper(value, lineItem.availableQuantity),
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
