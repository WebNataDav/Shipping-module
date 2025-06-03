import React, { useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Nullable } from '@types';
import useSWRMutation from 'swr/mutation';
import { deleteRequest } from '@services/axios';
import { useNotification } from '@hooks';
import { Endpoints, Errors } from '@constants';
import { ShippedItem } from 'src/stores/shippingStore/types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { ConfirmationModal } from '@components/ui/ConfirmationModal';
import { ShippersOrderLineItem } from 'src/stores/shippingStore/types';
import EditShipperModal from '../EditShipperModal';
import ShipperPrintFormModal from '../EditShipperModal/ShipperPrintFormModal';
import ShipperTable from './Table/ShipperTable';
import { formattedShippedDated, checkIfUnresolvedAdditionalWork } from './helpers';
import clsx from 'clsx';
import styles from './styles.module.scss';

type LineItemsAccordionProps = {
  lineItems: ShippedItem[];
  date: string;
  shippingAddress: string | undefined;
  notes: Nullable<string>;
  shipperNumber: Nullable<string>;
  id: string;
  shippers: ShippersOrderLineItem[];
  customer?: string;
  carrier?: string;
  customerPO?: string;
  shippingLineItems?: ShippedItem[];
  shipDate?: string;
};

const LineItemsAccordion: React.FC<LineItemsAccordionProps> = ({
  lineItems,
  date,
  notes,
  shippingAddress,
  shipperNumber,
  id,
  shippers,
  customer,
  carrier,
  customerPO,
  shippingLineItems,
  shipDate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const [isConfirmationDeleteModalOpen, setIsConfirmationDeleteModalOpen] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const hasUnresolvedAdditionalWork = checkIfUnresolvedAdditionalWork(lineItems);

  const onEdit = () => {
    setIsEditModalOpen((prevState) => !prevState);
  };

  const openPrintForm = () => {
    setOpenPrintModal(true);
  };

  const closePrintForm = () => {
    setOpenPrintModal(false);
  };

  const onConfirmationDeleteModalClose = () => setIsConfirmationDeleteModalOpen(false);
  const onConfirmationDeleteModalOpen = () => setIsConfirmationDeleteModalOpen(true);

  const { showSuccess, showError } = useNotification();

  const { trigger: deleteShipper } = useSWRMutation(Endpoints.Shipping.Shipper, deleteRequest, {
    onSuccess: () => {
      showSuccess('Shipper removed successfully');
      window.location.reload();
    },
    onError: () => {
      showError('Failed to remove shipper');
    },
  });

  const onDelete = async (id: string) => {
    if (!id) {
      return;
    }

    try {
      setIsConfirmationDeleteModalOpen(false);
      await deleteShipper({
        requestBody: {
          shipperId: id,
        },
      });
      window.location.reload();
    } catch (error) {
      showError(Errors.FAILED_TO_REMOVE_SHIPPER);
    }
  };

  return (
    <Accordion
      className={clsx(styles.accordion, { [styles.collapsed]: !isExpanded, [styles.expanded]: isExpanded })}
      expanded={isExpanded}
      onChange={handleToggle}
    >
      <AccordionSummary className={styles.accordionSummary} aria-controls="panel-content" id="panel-header">
        <Box className={styles.wrapper}>
          <ExpandMoreIcon className={clsx(styles.moreIcon, { [styles.rotated]: isExpanded })} />
          <Box className={styles.titlesWrapper}>
            <Typography className={styles.title}>
              {shipperNumber && shipperNumber + ', '} {formattedShippedDated(date)}
            </Typography>
            <Typography className={styles.titleAddress}>{shippingAddress}</Typography>
          </Box>
          <Box className={styles.tableActionsContainer}>
            <Button onClick={onEdit} color="primary" variant="outlined">
              <EditOutlinedIcon fontSize="small" className={styles.editIcon} />
              Edit
            </Button>

            <Tooltip placement="top" title="Print Shipper">
              <IconButton onClick={openPrintForm} aria-label="print" aria-hidden={false}>
                <PrintOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip placement="top" title="Delete Shipper">
              <IconButton onClick={onConfirmationDeleteModalOpen} aria-label="delete">
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <ConfirmationModal
              title={`Permanently Delete?`}
              mainText={`Are you sure you want to delete this shipper? This action cannot be undone!`}
              isOpen={isConfirmationDeleteModalOpen}
              onClose={onConfirmationDeleteModalClose}
              onConfirm={() => onDelete(id)}
            />
          </Box>
        </Box>
        <ShipperPrintFormModal
          open={openPrintModal}
          closePrintForm={closePrintForm}
          shipperNumber={shipperNumber}
          notes={notes}
          customer={customer}
          carrier={carrier}
          customerPO={customerPO}
          shippers={shippingLineItems || []}
          shipDate={shipDate}
        />
      </AccordionSummary>
      {hasUnresolvedAdditionalWork && (
        <Alert severity="error" className={styles.alert}>
          You have additional work. Please resolve it
        </Alert>
      )}
      <AccordionDetails className={styles.accordionDetails}>
        <ShipperTable hasUnresolvedAdditionalWork={hasUnresolvedAdditionalWork} lineItems={lineItems} />
        <Box className={styles.notesWrapper}>
          <Typography className={styles.notesText}>Notes {notes}</Typography>
        </Box>
      </AccordionDetails>
      <EditShipperModal
        id={id}
        open={isEditModalOpen}
        onClose={onEdit}
        lineItems={lineItems}
        shippers={shippers}
        shipperNumber={shipperNumber}
        shippedDate={date}
        notes={notes}
        customer={customer}
        carrier={carrier}
        customerPO={customerPO}
        shippingLineItems={shippingLineItems}
        shipDate={shipDate}
      />
    </Accordion>
  );
};

export default LineItemsAccordion;
