'use client';

import { Table, TableBody, TableContainer } from '@mui/material';
import { Control } from 'react-hook-form';
import { FormValues } from 'src/components/ui/shipping/ShipperActionBlock/EditShipperModal/types';
import { ShippedItem } from 'src/stores/shippingStore/types';
import ShipperTableRow from '../ShipperTableRow';
import ShipperTableHeader from '../ShipperTableHeader';

interface ShipperTableProps {
  lineItems?: ShippedItem[];
  control: Control<FormValues>;
  hasUnresolvedAdditionalWork?: boolean;
}

const ShipperTable: React.FC<ShipperTableProps> = ({ lineItems, control, hasUnresolvedAdditionalWork }) => {
  if (!lineItems) {
    return;
  }

  return (
    <TableContainer>
      <Table size="small">
        <ShipperTableHeader />
        <TableBody>
          {lineItems.map((lineItem) => (
            <ShipperTableRow
              key={lineItem.id}
              lineItem={lineItem}
              control={control}
              hasUnresolvedAdditionalWork={hasUnresolvedAdditionalWork}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ShipperTable;
