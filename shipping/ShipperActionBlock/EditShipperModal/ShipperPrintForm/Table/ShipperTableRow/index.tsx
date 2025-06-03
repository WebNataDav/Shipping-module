import { TableCell, TableRow } from '@mui/material';
import { Nullable } from '@types';
import { ShippedItem } from 'src/stores/shippingStore/types';
import styles from './styles.module.scss';

interface ShipperTableRowProps {
  shipper: ShippedItem;
  notes: Nullable<string>;
  rowSpan?: number;
}

const ShipperTableRow: React.FC<ShipperTableRowProps> = ({ shipper, notes, rowSpan }) => {
  return (
    <TableRow key={shipper.id} className={styles.tableRow}>
      <TableCell>{shipper.tracking}</TableCell>
      <TableCell className={styles.shipperCell}>{shipper?.category?.name}</TableCell>
      <TableCell>
        {shipper.shippedQuantity}/{shipper.totalQuantity}
      </TableCell>
      <TableCell>{shipper.status}</TableCell>
      {rowSpan !== 0 && <TableCell rowSpan={rowSpan}>{notes}</TableCell>}
    </TableRow>
  );
};

export default ShipperTableRow;
