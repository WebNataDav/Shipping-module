'use client';

import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ShippedItem } from 'src/stores/shippingStore/types';
import { ShippersOrderLineItem } from 'src/stores/shippingStore/types';
import ShipperActionAccordionHeader from './ShipperActionAccordionHeader';
import LineItemsAccordion from './LineItemsAccordion';
import CreateShipperModal from './CreateShipperModal';
import clsx from 'clsx';
import styles from './styles.module.scss';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import { PermissionType } from '@prisma/client';
import { useHasPermission } from '@hooks';
import { ModulePermissions, Module } from '@constants';

type ShipperActionBlockPropsType = {
  open: boolean;
  orderNumber: string | undefined;
  lineItems: ShippedItem[] | undefined;
  shippers: ShippersOrderLineItem[];
  selectedShipperId?: string;
  whileYouWait: boolean | undefined;
  customer?: string;
  carrier?: string;
  customerPO?: string;
};

const ShipperActionBlock: React.FC<ShipperActionBlockPropsType> = ({
  open,
  orderNumber,
  lineItems,
  shippers,
  selectedShipperId,
  whileYouWait,
  customer,
  carrier,
  customerPO,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const toggleShipperModalOpen = () => {
    setIsEditModalOpen((prevState) => !prevState);
  };
  const { EDIT_SHIPPING } = PermissionType;
  const hasPermission = useHasPermission(ModulePermissions[Module.Shipping]);

  return (
    <Box className={clsx(styles.sidebar, { [styles.openSidebar]: open, [styles.closedSidebar]: !open })}>
      <Box className={styles.sidebarHeader}>
        <Box className={styles.titlesWrapper}>
          <Typography variant="h6" className={styles.receiveOrderTitle}>
            Order:
          </Typography>
          <span className={styles.receiveOrderSpan}>
            {orderNumber} {whileYouWait && <StarOutlinedIcon className={styles.whileYouWait} />}
          </span>
        </Box>
        <Button
          className={styles.createShipperButton}
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          size="small"
          onClick={toggleShipperModalOpen}
          disabled={!hasPermission[EDIT_SHIPPING]}
        >
          Create shipper
        </Button>
      </Box>
      <Box className={styles.content}>
        <ShipperActionAccordionHeader lineItems={lineItems} />
        {shippers &&
          shippers.map((shipper: ShippersOrderLineItem, index) => {
            return (
              <LineItemsAccordion
                key={index}
                lineItems={shipper.shippingLineItems}
                date={shipper.createdAt}
                shippingAddress={shipper.shipperPrint && shipper.shipperPrint?.shippingAddress}
                notes={shipper.notes}
                shipperNumber={shipper.shipperNumber}
                id={shipper.id}
                shippers={shippers}
                customer={customer}
                carrier={carrier}
                customerPO={customerPO}
                shipDate={shipper.createdAt}
                shippingLineItems={shipper.shippingLineItems}
              />
            );
          })}
      </Box>
      <CreateShipperModal
        open={isEditModalOpen}
        onClose={toggleShipperModalOpen}
        lineItems={lineItems}
        shippers={shippers}
        selectedShipperId={selectedShipperId}
      />
    </Box>
  );
};

export default ShipperActionBlock;
