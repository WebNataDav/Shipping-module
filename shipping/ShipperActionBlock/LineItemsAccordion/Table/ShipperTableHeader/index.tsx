import { TableHead, TableRow, TableCell } from '@mui/material';
import { headerTitles } from 'src/components/ui/shipping/ShipperActionBlock/constants';
import styles from './styles.module.scss';

interface ShipperTableHeaderProps {
  showAvailableQuantity?: boolean;
}

const ShipperTableHeader: React.FC<ShipperTableHeaderProps> = ({ showAvailableQuantity }) => {
  const filteredTitles = showAvailableQuantity ? headerTitles : headerTitles.filter((title) => title !== 'Available');

  return (
    <TableHead>
      <TableRow className={styles.tableHeader}>
        {filteredTitles.map((title, index) => (
          <TableCell key={index}>{title}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default ShipperTableHeader;
