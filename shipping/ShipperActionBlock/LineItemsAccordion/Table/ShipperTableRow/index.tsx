import { TableCell, TableRow } from '@mui/material';
import clsx from 'clsx';
import { ShippedItem } from 'src/stores/shippingStore/types';
import styles from './styles.module.scss';

interface ShipperTableRowProps {
  lineItem: ShippedItem;
  hasUnresolvedAdditionalWork: boolean;
  showAvailableQuantity?: boolean;
}

const ShipperTableRow: React.FC<ShipperTableRowProps> = ({
  lineItem,
  hasUnresolvedAdditionalWork,
  showAvailableQuantity,
}) => {
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
      <TableCell className={styles.shipperCell}>{lineItem.shippedQuantityPerShipper}</TableCell>
      <TableCell>{lineItem.shippedQuantity}</TableCell>
      {showAvailableQuantity && <TableCell>{lineItem.availableQuantity}</TableCell>}
      <TableCell>{lineItem.totalQuantity}</TableCell>
    </TableRow>
  );
};

export default ShipperTableRow;
