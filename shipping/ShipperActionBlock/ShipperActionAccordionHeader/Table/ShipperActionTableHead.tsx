import { TableHead, TableRow, TableCell } from '@mui/material';
import styles from '../styles.module.scss';

export const ShipperActionTableHeader = () => {
  return (
    <TableHead>
      <TableRow className={styles.tableHeader}>
        <TableCell>Description</TableCell>
        <TableCell>Tracking</TableCell>
        <TableCell>Shipped</TableCell>
        <TableCell>Available</TableCell>
        <TableCell>Total</TableCell>
      </TableRow>
    </TableHead>
  );
};
