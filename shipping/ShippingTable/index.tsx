'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import Table from '@components/library/Table';
import { GridRowParams, MuiEvent } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { initialPaginationModel, userInputDebounceDelay, ModulePermissions, Module } from '@constants';
import { useFilteredPaginatedShippingOrders, useHasPermission, useOrderWithShippingData } from '@hooks';
import { Nullable } from '@types';
import { OrderPrintFormModal } from '@components/ui/orders/OrderPrintFormModal';
import { OrderInfoModal } from '@components/library/OrderInfoModal';
import ShipperActionBlock from '../ShipperActionBlock';
import { OrdersTableColumns } from '../../orders/OrdersPage/types';
import ShippingTableFilters from './ShippingTableFilters';
import { DefaultShippingTableFilters } from './constants';
import { getColumns, getRows } from './helpers';
import { Filters, ShippingRow } from './types';
import styles from './styles.module.scss';
import { PermissionType } from '@prisma/client';

const ShippingTable = () => {
  const [paginationModel, setPaginationModel] = useState(initialPaginationModel);
  const [orderPagination, setOrderPagination] = useState(initialPaginationModel);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, userInputDebounceDelay);
  const [filters, setFilters] = useState<Filters>(DefaultShippingTableFilters);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Nullable<OrdersTableColumns>>(null);
  const [selectedShippingOrder, setSelectedShippingOrder] = useState<Nullable<ShippingRow>>(null);
  const [isShippingOrderOpen, setIsShippingOrderOpen] = useState(false);
  const { EDIT_SHIPPING } = PermissionType;
  const hasPermission = useHasPermission(ModulePermissions[Module.Shipping]);

  const { shippingOrders, isLoadingShippingOrders, mutateShippingOrders, paginationOptions } =
    useFilteredPaginatedShippingOrders({
      //TODO: complete filters in WHYRUST-1174
      ...paginationModel,
      ...filters,
      search: debouncedSearch,
    });

  useEffect(() => {
    if (paginationOptions) {
      setOrderPagination({ ...paginationOptions, ...paginationModel });
      mutateShippingOrders();
    }
  }, [mutateShippingOrders, paginationModel, paginationOptions]);

  const handleRowClick = (params: GridRowParams<ShippingRow>, event: MuiEvent<React.MouseEvent>) => {
    const targetElement = event.target as HTMLElement;
    const isActionButton = targetElement.closest('.MuiIconButton-root') || targetElement.closest('[role="button"]');

    if (isActionButton) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    setSelectedShippingOrder(params.row);
    setIsShippingOrderOpen(true);
  };

  const { orderWithShippingData, refetch, isLoadingorderWithShippingData } = useOrderWithShippingData(
    selectedShippingOrder?.id,
  );

  useEffect(() => {
    if (selectedShippingOrder?.id) {
      refetch();
    }
  }, [selectedShippingOrder?.id, refetch]);

  const openPrintForm = async (row: OrdersTableColumns) => {
    setSelectedOrder(row);
    setOpen(true);
  };

  const closePrintForm = () => {
    setOpen(false);
  };

  const columns = getColumns({ openPrintForm });
  const rows = useMemo(() => getRows(shippingOrders), [shippingOrders]);

  const onFilterChange = (value: Date | string | null, filterName: string) =>
    setFilters((prevState) => ({ ...prevState, [filterName]: value }));

  return (
    <Box>
      <ShippingTableFilters
        selectedFilters={filters}
        onFilterChange={onFilterChange}
        search={search}
        setSearch={setSearch}
      />
      <Box className={styles.tableSection}>
        <Table
          className={styles.table}
          rows={rows}
          columns={columns}
          loading={isLoadingShippingOrders}
          setPaginationModel={setPaginationModel}
          paginationInfo={orderPagination}
          autoHeight={true}
          onRowClick={handleRowClick}
        />
        <Box className={styles.shipperActionWrapper}>
          {isShippingOrderOpen && isLoadingorderWithShippingData && (
            <Box className={styles.spinnerWrapper}>
              <CircularProgress />
            </Box>
          )}
          {isShippingOrderOpen && !isLoadingorderWithShippingData && (
            <ShipperActionBlock
              open={isShippingOrderOpen}
              orderNumber={selectedShippingOrder?.orderNumber}
              lineItems={orderWithShippingData?.lineItems || []}
              whileYouWait={selectedShippingOrder?.whileYouWait}
              shippers={orderWithShippingData?.shippers || []}
              selectedShipperId={selectedShippingOrder?.id}
              customer={orderWithShippingData?.customer?.name}
              carrier={orderWithShippingData?.carrier?.name}
              customerPO={orderWithShippingData?.customerPO}
            />
          )}
        </Box>
        <OrderPrintFormModal
          open={open}
          key={`printFormModal${selectedOrder?.id}`}
          closePrintForm={closePrintForm}
          orderData={selectedOrder ? selectedOrder : null}
          disabled={!hasPermission[EDIT_SHIPPING]}
        />
        <OrderInfoModal />
      </Box>
    </Box>
  );
};

export default ShippingTable;
