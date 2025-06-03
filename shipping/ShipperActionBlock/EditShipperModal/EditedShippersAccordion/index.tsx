import React, { useState, useMemo } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ShippersOrderLineItem } from 'src/stores/shippingStore/types';
import ShipperTable from 'src/components/ui/shipping/ShipperActionBlock/LineItemsAccordion/Table/ShipperTable';
import { checkIfUnresolvedAdditionalWork } from 'src/components/ui/shipping/ShipperActionBlock/LineItemsAccordion/helpers';
import clsx from 'clsx';
import styles from './styles.module.scss';

type EditedShippersAccordionProps = {
  shippers: ShippersOrderLineItem[];
  showAvailableQuantity?: boolean;
};

const EditedShippersAccordion: React.FC<EditedShippersAccordionProps> = ({ shippers }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasUnresolvedAdditionalWork = useMemo(() => {
    return checkIfUnresolvedAdditionalWork(shippers);
  }, [shippers]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const lineItems = useMemo(() => {
    return shippers.flatMap((shipper) => shipper.shippingLineItems);
  }, [shippers]);

  return (
    <Accordion
      className={clsx(styles.accordion, { [styles.collapsed]: !isExpanded, [styles.expanded]: isExpanded })}
      expanded={isExpanded}
      onChange={handleToggle}
    >
      <AccordionSummary aria-controls="panel-content" id="panel-header">
        <Box className={styles.wrapper}>
          <Typography className={styles.title}>Existing Shippers {shippers.length}</Typography>
          <ExpandMoreIcon className={clsx(styles.moreIcon, { [styles.rotated]: isExpanded })} />
        </Box>
      </AccordionSummary>
      <AccordionDetails className={styles.accordionDetails}>
        <ShipperTable
          hasUnresolvedAdditionalWork={hasUnresolvedAdditionalWork}
          lineItems={lineItems}
          showAvailableQuantity={false}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default EditedShippersAccordion;
