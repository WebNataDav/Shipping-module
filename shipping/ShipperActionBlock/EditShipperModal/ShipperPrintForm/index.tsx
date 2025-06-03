'use client';

import { Nullable } from '@types';
import PrintFormHeader from './PrintFormHeader';
import { PrintFormCredentials } from './PrintFormCredentials';
import { PrintFormSelector } from './PrintFormSelector';
import PrintFormNotes from './PrintFormNotes';
import { PrintFormPersonalData } from './PrintFormPersonalData';
import ShipperTable from './Table/ShipperTable';
import { ShippedItem } from 'src/stores/shippingStore/types';
import styles from './styles.module.scss';

type ShipperPrintFormProps = {
  shipperNumber: Nullable<string>;
  notes: Nullable<string>;
  customer?: string;
  carrier?: string;
  customerPO?: string;
  shippers?: ShippedItem[];
  shipDate?: string;
};

export const ShipperPrintForm = ({
  shipperNumber,
  notes,
  customer,
  carrier,
  customerPO,
  shippers,
  shipDate,
}: ShipperPrintFormProps) => {
  return (
    <div className={styles.shipperPrintFormContainer}>
      <PrintFormHeader shipperNumber={shipperNumber} />
      <PrintFormCredentials customer={customer} carrier={carrier} customerPO={customerPO} shipDate={shipDate} />
      <PrintFormPersonalData />
      <PrintFormSelector />
      <PrintFormNotes notes={notes} />
      <ShipperTable shippers={shippers} notes={notes} />
    </div>
  );
};
