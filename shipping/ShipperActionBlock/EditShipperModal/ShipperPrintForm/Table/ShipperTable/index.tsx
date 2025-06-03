'use client';

import { Table, TableBody, TableContainer } from '@mui/material';
import { Nullable } from '@types';
import { ShippedItem } from 'src/stores/shippingStore/types';
import ShipperTableRow from '../ShipperTableRow';
import ShipperTableHeader from '../ShipperTableHeader';
import styles from './styles.module.scss';

interface ShipperTableProps {
  shippers?: ShippedItem[];
  notes: Nullable<string>;
}

const ShipperTable: React.FC<ShipperTableProps> = ({ shippers, notes }) => {
  return (
    <TableContainer className={styles.shipperTableWrapper}>
      <Table className={styles.shipperTable} size="small">
        <ShipperTableHeader />
        <TableBody>
          {shippers &&
            shippers?.map((shipper, index) => (
              <ShipperTableRow
                key={shipper.id}
                shipper={shipper}
                notes={index === 0 ? notes : null}
                rowSpan={index === 0 ? shippers.length : 0}
              />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ShipperTable;
