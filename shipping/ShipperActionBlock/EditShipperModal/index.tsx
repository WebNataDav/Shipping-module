'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogContent, IconButton, Tooltip, Typography, CircularProgress } from '@mui/material';
import ModalTitle from '@components/library/ModalTitle';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import useSWRMutation from 'swr/mutation';
import { putRequest, deleteRequest } from '@services/axios';
import { useNotification } from '@hooks';
import { Endpoints, Errors, Messages } from '@constants';
import { ControlledInput } from '@components/library';
import { Nullable } from '@types';
import { getDefaultShippedData, mapShippedData } from '@utils';
import { FormValues } from './types';
import { ShippedItem } from 'src/stores/shippingStore/types';
import { ShippersOrderLineItem } from 'src/stores/shippingStore/types';
import { formattedShippedDated } from 'src/components/ui/shipping/ShipperActionBlock/LineItemsAccordion/helpers';
import { CancelModal } from './CancelModal';
import { ConfirmationModal } from '@components/ui/ConfirmationModal';
import ShipperTable from './Table/ShipperTable';
import EditedShippersAccordion from './EditedShippersAccordion';
import ShipperPrintFormModal from './ShipperPrintFormModal';
import { validateShipperInput } from 'src/components/ui/shipping/ShipperActionBlock/helpers';
import { getEditedLineItemsWithSignOffCheck } from 'src/components/ui/shipping/ShipperActionBlock/helpers';
import styles from './styles.module.scss';

type EditShipperPropsType = {
  open: boolean;
  onClose: () => void;
  shippedDate: string;
  lineItems?: ShippedItem[];
  shipperNumber: Nullable<string>;
  notes: Nullable<string>;
  id: string;
  shippers: ShippersOrderLineItem[];
  customer?: string;
  carrier?: string;
  customerPO?: string;
  shippingLineItems?: ShippedItem[];
  shipDate?: string;
};

const EditShipperModal: React.FC<EditShipperPropsType> = ({
  open,
  onClose,
  shippedDate,
  lineItems,
  shipperNumber,
  notes,
  id,
  shippers,
  customer,
  carrier,
  customerPO,
  shippingLineItems,
  shipDate,
}) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isConfirmationDeleteModalOpen, setIsConfirmationDeleteModalOpen] = useState(false);
  const originalValuesRef = useRef(lineItems);
  const [openPrintModal, setOpenPrintModal] = useState(false);

  const onConfirmationModalClose = () => setIsConfirmationModalOpen(false);
  const onConfirmationModalOpen = () => setIsConfirmationModalOpen(true);

  const onConfirmationDeleteModalClose = () => setIsConfirmationDeleteModalOpen(false);
  const onConfirmationDeleteModalOpen = () => setIsConfirmationDeleteModalOpen(true);

  const { control, handleSubmit, reset, watch, trigger } = useForm<FormValues>({
    defaultValues: {
      dataShipped: getDefaultShippedData(lineItems),
      notes: notes ?? '',
    },
  });

  useEffect(() => {
    if (open && lineItems) {
      reset({
        dataShipped: mapShippedData(lineItems),
        notes: notes ?? '',
      });
      originalValuesRef.current = lineItems;
    }
  }, [open, lineItems, notes, reset]);

  const { trigger: editShipper, isMutating: isEditing } = useSWRMutation(Endpoints.Shipping.Shipper, putRequest, {
    onSuccess: () => {
      showSuccess(Messages.Shipping.ShipperUpdated);
      window.location.reload();
    },
    onError: () => {
      showError(Errors.FAILED_TO_UPDATE_SHIPPER);
    },
  });

  const { trigger: deleteShipper, isMutating: isDeleting } = useSWRMutation(Endpoints.Shipping.Shipper, deleteRequest, {
    onSuccess: () => {
      showSuccess('Shipper removed successfully');
      onClose();
      window.location.reload();
    },
    onError: () => {
      showError('Failed to remove shipper');
    },
  });

  const isMutating = isEditing || isDeleting;

  const { showSuccess, showError } = useNotification();

  const onSubmit = async (formData: FormValues) => {
    if (!lineItems || !shippers) {
      return;
    }

    const formValues = watch();
    if (!formValues) {
      return;
    }

    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    if (!validateShipperInput(formData)) {
      showError(Errors.FAILED_VALIDATE_SHIPPER_INPUT);
      return;
    }

    const { requiresSignOffForSubmittedItems } = getEditedLineItemsWithSignOffCheck(
      lineItems,
      originalValuesRef,
      formValues,
    );

    if (requiresSignOffForSubmittedItems) {
      showError(Errors.FAILED_TO_SAVE_SHIPPER);
      return;
    }

    const data = lineItems
      .filter((item) => {
        const originalItem = originalValuesRef.current?.find((original) => original.id === item.id);
        return (
          originalItem &&
          formValues.dataShipped[Number(item.id)].shippedQuantityPerShipper !== originalItem.shippedQuantityPerShipper
        );
      })
      .map((item) => ({
        lineItemId: item.id,
        shippedQuantity: formValues.dataShipped[Number(item.id)].shippedQuantityPerShipper,
      }));

    try {
      await editShipper({
        requestBody: {
          shipperId: id,
          lineItemsData: data,
          notes: formValues.notes,
        },
      });
    } catch (error) {
      showError(Errors.FAILED_TO_UPDATE_SHIPPER);
    }
  };

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
      onClose();
      window.location.reload();
    } catch (error) {
      showError(Errors.FAILED_TO_REMOVE_SHIPPER);
    }
  };

  const onConfirmClose = () => {
    onConfirmationModalClose();
    onClose();
  };

  const openPrintForm = () => {
    setOpenPrintModal(true);
  };

  const closePrintForm = () => {
    setOpenPrintModal(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} className={styles.modalContainer}>
      <ModalTitle className={styles.modalTitle} title="Edit Shipper" onClose={onClose}></ModalTitle>
      <DialogContent className={styles.content}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className={styles.contentWraper}>
            <Box className={styles.headerContent}>
              <Typography className={styles.title}>
                {shipperNumber && shipperNumber + ', '} {formattedShippedDated(shippedDate)}
              </Typography>
              <Box className={styles.tableActionsContainer}>
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
            <Box className={styles.innerWrapper}>
              {lineItems && <ShipperTable control={control} lineItems={lineItems} />}
              <Box className={styles.notesWrapper}>
                <ControlledInput
                  control={control}
                  name="notes"
                  className={styles.notesInput}
                  label="Notes (optional)"
                  InputProps={{ multiline: true, rows: 4 }}
                />
              </Box>
            </Box>
            {shippers && shippers.length > 0 && <EditedShippersAccordion shippers={shippers} />}
          </Box>
          <Box className={styles.footer}>
            <Box className={styles.buttonsWrapper}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={onConfirmationModalOpen}
                className={styles.actionsButton}
              >
                cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" className={styles.actionsButton}>
                save
              </Button>
              <CancelModal
                mainText={Messages.Shipping.ShipperCancelModal}
                isOpen={isConfirmationModalOpen}
                onCloseModal={onConfirmationModalClose}
                onConfirm={onConfirmClose}
              />
            </Box>
          </Box>
        </form>
        {isMutating && (
          <Box className={styles.loadingWrapper}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditShipperModal;
