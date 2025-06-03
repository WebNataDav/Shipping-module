import { Tooltip, IconButton, Box } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { useOrderInfoStore } from '@stores';
import styles from './styles.module.scss';
// TODO: complete in WHYRUST-1104
interface OrderTableActionColumnProps {
  // onEdit: () => void;
  // onDelete: () => void;
  // openTagModal: () => void;
  openPrintForm: () => void;
  id: string;
}

export const ShippingTableActionColumn = ({ openPrintForm, id }: OrderTableActionColumnProps) => {
  const { openModal, setSelectedOrderId } = useOrderInfoStore();

  const handleOpenModal = () => {
    setSelectedOrderId(id);
    openModal(id);
  };

  return (
    <Box className={styles.shippingTableActionContainer}>
      <Tooltip placement="top" title="View Order Info">
        <IconButton aria-label="edit" onClick={handleOpenModal}>
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip placement="top" title="View Order Receiver">
        <IconButton onClick={openPrintForm} aria-label="edit">
          <ReceiptLongOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
