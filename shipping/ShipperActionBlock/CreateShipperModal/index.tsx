'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogContent, Typography, CircularProgress } from '@mui/material';
import ModalTitle from '@components/library/ModalTitle';
import useSWRMutation from 'swr/mutation';
import { useSWRConfig } from 'swr';
import { postRequest } from '@services/axios';
import { useNotification } from '@hooks';
import { getDefaultShippedData } from '@utils';
import { Endpoints, Errors, Messages } from '@constants';
import { ControlledInput } from '@components/library';
import { FormValues } from './types';
import { ShippedItem } from 'src/stores/shippingStore/types';
import { ShippersOrderLineItem } from 'src/stores/shippingStore/types';
import { CancelModal } from './CancelModal';
import ShipperTable from './Table/ShipperTable';
import EditedShippersAccordion from './EditedShippersAccordion';
import { validateShipperInput } from 'src/components/ui/shipping/ShipperActionBlock/helpers';
import { getEditedLineItemsWithSignOffCheck } from 'src/components/ui/shipping/ShipperActionBlock/helpers';
import styles from './styles.module.scss';

type CreateShipperPropsType = {
  open: boolean;
  onClose: () => void;
  lineItems?: ShippedItem[];
  shippers: ShippersOrderLineItem[];
  selectedShipperId?: string;
};

const CreateShipperModal: React.FC<CreateShipperPropsType> = ({
  open,
  onClose,
  lineItems,
  shippers,
  selectedShipperId,
}) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const onConfirmationModalClose = () => setIsConfirmationModalOpen(false);
  const onConfirmationModalOpen = () => setIsConfirmationModalOpen(true);

  const originalValuesRef = useRef(lineItems);

  const { control, handleSubmit, reset, watch, trigger } = useForm<FormValues>({
    defaultValues: {
      dataShipped: getDefaultShippedData(lineItems),
      notes: '',
    },
  });

  useEffect(() => {
    if (open && lineItems) {
      reset({
        dataShipped: getDefaultShippedData(lineItems),
        notes: '',
      });
      originalValuesRef.current = lineItems;
    }
  }, [open, lineItems, reset]);

  const { mutate } = useSWRConfig();

  const { trigger: createShipper, isMutating } = useSWRMutation(Endpoints.Shipping.Shipper, postRequest, {
    onSuccess: () => {
      showSuccess(Messages.Shipping.ShipperCreated);
      mutate(Endpoints.Shipping.Order.OrderShippingData);
    },
    onError: () => {
      showError(Errors.FAILED_TO_CREATE_SHIPPER);
    },
  });

  const { showSuccess, showError } = useNotification();

  const onSubmit = async (formData: FormValues) => {
    if (!lineItems) {
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

    const formValues = watch() as FormValues;
    if (!formValues) {
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
      .map((item: ShippedItem) => {
        const shippedQuantity = formValues.dataShipped[item.id as unknown as number]?.shippedQuantityPerShipper;
        return shippedQuantity ? { lineItemId: item.id, shippedQuantity } : null;
      })
      .filter(Boolean);

    try {
      await createShipper({
        requestBody: {
          lineItemsData: data,
          receiveOrderId: selectedShipperId,
          notes: formValues.notes,
        },
      });
      window.location.reload();
    } catch (error) {
      showError(Errors.FAILED_TO_CREATE_SHIPPER);
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} className={styles.modalContainer}>
      <ModalTitle className={styles.modalTitle} title="Create Shipper" onClose={onClose}></ModalTitle>
      <DialogContent className={styles.content}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className={styles.contentWraper}>
            <Typography className={styles.title}>Can be added to that shipper:</Typography>
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
                create
              </Button>
              <CancelModal
                mainText={Messages.Shipping.ShipperCancelModal}
                isOpen={isConfirmationModalOpen}
                onCloseModal={onConfirmationModalClose}
                onConfirm={() => {
                  onConfirmationModalClose();
                  onClose();
                }}
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

export default CreateShipperModal;
