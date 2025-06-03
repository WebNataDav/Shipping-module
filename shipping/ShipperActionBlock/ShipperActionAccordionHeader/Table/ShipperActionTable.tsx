'use client';

import { Table, TableBody, TableContainer } from '@mui/material';
import { ShippedItem } from 'src/stores/shippingStore/types';
import { ShipperActionTableRow } from './ShipperActionTableRow';
import { ShipperActionTableHeader } from './ShipperActionTableHead';

interface ShipperActionTableProps {
  lineItems?: ShippedItem[];
}

const ShipperActionTable: React.FC<ShipperActionTableProps> = ({ lineItems }) => {
  if (!lineItems) {
    return;
  }

  return (
    <TableContainer>
      <Table size="small">
        <ShipperActionTableHeader />
        <TableBody>
          {lineItems.map((lineItem) => (
            <ShipperActionTableRow key={lineItem.id} lineItem={lineItem} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ShipperActionTable;
