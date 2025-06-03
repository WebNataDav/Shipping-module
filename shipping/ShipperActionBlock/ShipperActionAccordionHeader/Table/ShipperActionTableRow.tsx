import { TableCell, TableRow } from '@mui/material';
import { ShippedItem } from 'src/stores/shippingStore/types';
import styles from '../styles.module.scss';

interface ShipperActionTableRowProps {
  lineItem: ShippedItem;
}

export const ShipperActionTableRow: React.FC<ShipperActionTableRowProps> = ({ lineItem }) => {
  return (
    <TableRow key={lineItem.id} hover className={styles.tableRow}>
      <TableCell>
        {lineItem.category?.name && `${lineItem.category.name} `}
        {lineItem.description ?? ''}
      </TableCell>
      <TableCell>{lineItem.tracking}</TableCell>
      <TableCell>{lineItem.shippedQuantity}</TableCell>
      <TableCell>{lineItem.availableQuantity}</TableCell>
      <TableCell>{lineItem.totalQuantity}</TableCell>
    </TableRow>
  );
};
