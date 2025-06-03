import { PrintOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import styles from './styles.module.scss';

type PrintFormFooterProps = {
  onPrint: () => void;
  onClose: () => void;
};

const PrintFormFooter = ({ onPrint, onClose }: PrintFormFooterProps) => {
  return (
    <div className={styles.printFormFooterContainer}>
      <Button className={styles.printButton} onClick={onPrint} color="primary" variant="outlined">
        <PrintOutlined />
        Print
      </Button>
      <Button className={styles.closeButton} onClick={onClose} color="secondary" variant="outlined">
        Close
      </Button>
    </div>
  );
};

export default PrintFormFooter;
