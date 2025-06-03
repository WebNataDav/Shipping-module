import { TableHead, TableRow, TableCell } from '@mui/material';
import { headerTitles } from 'src/components/ui/shipping/ShipperActionBlock/EditShipperModal/ShipperPrintForm/Table/constants';
import styles from './styles.module.scss';

const ShipperTableHeader = () => {
  return (
    <TableHead>
      <TableRow className={styles.tableHeader}>
        {headerTitles.map((title, index) => (
          <TableCell key={index}>{title}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default ShipperTableHeader;
