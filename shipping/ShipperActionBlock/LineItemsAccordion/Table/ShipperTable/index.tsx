'use client';

import { Table, TableBody, TableContainer } from '@mui/material';
import { ShippedItem } from 'src/stores/shippingStore/types';
import ShipperTableRow from '../ShipperTableRow';
import ShipperTableHeader from '../ShipperTableHeader';

interface ShipperTableProps {
  lineItems?: ShippedItem[];
  hasUnresolvedAdditionalWork: boolean;
  showAvailableQuantity?: boolean;
}

const ShipperTable: React.FC<ShipperTableProps> = ({
  lineItems,
  hasUnresolvedAdditionalWork,
  showAvailableQuantity = true,
}) => {
  return (
    <TableContainer>
      <Table size="small">
        <ShipperTableHeader showAvailableQuantity={showAvailableQuantity} />
        <TableBody>
          {lineItems &&
            lineItems.map((lineItem) => (
              <ShipperTableRow
                key={lineItem.id}
                lineItem={lineItem}
                hasUnresolvedAdditionalWork={hasUnresolvedAdditionalWork}
                showAvailableQuantity={showAvailableQuantity}
              />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ShipperTable;
