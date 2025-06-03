import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography } from '@mui/material';
import { ShippedItem } from 'src/stores/shippingStore/types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShipperActionTable from './Table/ShipperActionTable';
import clsx from 'clsx';
import styles from './styles.module.scss';

type ShipperActionAccordionHeaderProps = {
  lineItems: ShippedItem[] | undefined;
};

const ShipperActionAccordionHeader: React.FC<ShipperActionAccordionHeaderProps> = ({ lineItems }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Accordion className={styles.accordion} expanded={isExpanded} onChange={handleToggle}>
      <AccordionSummary aria-controls="panel-content" id="panel-header">
        <Box className={styles.wrapper}>
          <ExpandMoreIcon className={clsx(styles.moreIcon, { [styles.rotated]: isExpanded })} />
          <Typography className={styles.title}>Line Items:</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <ShipperActionTable lineItems={lineItems} />
      </AccordionDetails>
    </Accordion>
  );
};

export default ShipperActionAccordionHeader;
