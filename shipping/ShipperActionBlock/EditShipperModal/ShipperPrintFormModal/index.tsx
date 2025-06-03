'use client';

import React, { useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { PrintFormTitle } from '../ShipperPrintForm/PrintFormTitle';
import { ShipperPrintForm } from '../ShipperPrintForm';
import PrintFormFooter from '../ShipperPrintForm//PrintFormFooter';
import { Nullable } from '@types';
import { ShippedItem } from 'src/stores/shippingStore/types';
import { useReactToPrint } from 'react-to-print';
import styles from './styles.module.scss';

type ShipperPrintFormModalProps = {
  open: boolean;
  closePrintForm: () => void;
  shipperNumber: Nullable<string>;
  notes: Nullable<string>;
  customer?: string;
  carrier?: string;
  customerPO?: string;
  shippers: ShippedItem[];
  shipDate?: string;
};

const ShipperPrintFormModal = ({
  open,
  closePrintForm,
  shipperNumber,
  notes,
  customer,
  carrier,
  customerPO,
  shippers,
  shipDate,
}: ShipperPrintFormModalProps) => {
  const printRef = useRef(null);

  const onPrintForm = () => {
    handlePrint();
  };

  const handleClose = () => {
    closePrintForm();
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <Dialog fullWidth open={open} className={styles.modalContainer}>
      <DialogTitle>
        <PrintFormTitle shipperNumber={shipperNumber} />
      </DialogTitle>
      <DialogContent ref={printRef}>
        <ShipperPrintForm
          shipperNumber={shipperNumber}
          customer={customer}
          carrier={carrier}
          customerPO={customerPO}
          notes={notes}
          shippers={shippers}
          shipDate={shipDate}
        />
      </DialogContent>
      <DialogActions>
        <PrintFormFooter onClose={handleClose} onPrint={onPrintForm} />
      </DialogActions>
    </Dialog>
  );
};

export default ShipperPrintFormModal;
