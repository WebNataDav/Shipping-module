import { ShippingOrderClientType } from '@types';
import { ShippingTableColumns } from './types';
import { OrdersTableColumns } from 'src/components/ui/orders/OrdersPage/types';
import { GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { DateFormat } from '@constants';
import StatusIconColumn from '@components/library/StatusIconColumn';
import { OrderNumberColumn } from '@components/library';
import { OrderShippingStatusIconMatch } from 'src/constants/icons';
import { ShippingTableActionColumn } from './ShippingTableActionColumn';
import { getCalculatedLostQuantityFromLineItemsArray } from 'src/utils/lineItem';
import { getOrderClientStatus } from 'src/utils/utils';

export const getRows = (orders?: ShippingOrderClientType[]) => {
  if (!orders) {
    return [];
  }

  return orders.map(
    ({
      id,
      customer,
      customerPO,
      receiveOrderStatusInfo,
      lineItems,
      orderNumber,
      createdAt,
      whileYouWait,
    }): ShippingTableColumns => {
      return {
        id: id,
        PO: customerPO ?? '',
        customer: customer?.name ?? '',
        orderStatus: receiveOrderStatusInfo?.status ? getOrderClientStatus(receiveOrderStatusInfo?.status) : '',
        lostQuantity: getCalculatedLostQuantityFromLineItemsArray(lineItems),
        orderNumber: orderNumber,
        dateCreated: createdAt,
        lineItems: lineItems,
        whileYouWait: whileYouWait,
      };
    },
  );
};

export interface PrintColumnActions {
  openPrintForm: (row: OrdersTableColumns) => void;
}

export const getColumns = ({ openPrintForm }: PrintColumnActions): GridColDef[] => [
  {
    field: 'orderStatus',
    width: 66,
    headerName: '',
    sortable: false,
    renderCell: ({ value, row }) => {
      return (
        <StatusIconColumn
          status={value}
          statusIconMatch={OrderShippingStatusIconMatch}
          additionalMarkValue={row.lostQuantity > 0 ? row.lostQuantity : undefined}
          additionalMarkTitle="Lost Quantity"
        />
      );
    },
  },
  { field: 'customer', headerName: 'Customer', flex: 1 },
  { field: 'PO', headerName: 'Customer PO', flex: 1 },
  {
    field: 'orderNumber',
    headerName: 'Order Number',
    flex: 1,
    renderCell: ({ row, value }) => {
      return <OrderNumberColumn orderNumber={value} isWhileYouWait={row.whileYouWait} />;
    },
  },
  {
    field: 'dateCreated',
    headerName: 'Date',
    flex: 1,
    type: 'date',
    valueGetter: (value) => new Date(value),
    valueFormatter: (value) => (value ? format(value, DateFormat.TableDateUSA) : null),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 198,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    // TODO: complete in WHYRUST-1104
    renderCell: ({ row }) => (
      <ShippingTableActionColumn
        id={row.id}
        openPrintForm={() => openPrintForm(row)}
        // TODO: complete in WHYRUST-1104
        // openTagModal={() => openTagModal(row)}
        // onEdit={() => onEdit(id)}
        // onDelete={() => onDelete(id)}
      />
    ),
  },
];
