'use client';

import { Box } from '@mui/material';
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { TableFilter, TextField } from '@components/library';
import type { Filters } from './types';
import styles from './styles.module.scss';
import { useCustomers } from '@hooks';
import { shippingOrderStatusOptions } from './constants';

interface TableFiltersProps {
  selectedFilters: Filters;
  onFilterChange: (value: Date | string | null, filterName: string) => void;
  search: string;
  setSearch: (value: string) => void;
}

const ShippingTableFilters = ({ search, setSearch, selectedFilters, onFilterChange }: TableFiltersProps) => {
  const { customers, isLoadingCustomers } = useCustomers();

  return (
    <Box className={styles.filtersContainer}>
      <TextField
        value={search}
        label="Search"
        placeholder="Search by customer PO, Order #"
        variant="outlined"
        multiline
        icon={<SearchIcon color="action" />}
        className={styles.searchField}
        onChange={(event) => setSearch(event.target.value)}
      />
      <TableFilter
        value={selectedFilters.customer}
        setValue={(value) => onFilterChange(value, 'customer')}
        label="Customer"
        isOptionsLoading={isLoadingCustomers}
        options={customers}
        className={styles.selectFilterField}
      />
      <TableFilter
        value={selectedFilters.customer}
        setValue={(value) => onFilterChange(value, 'customer')}
        label="Order status"
        options={shippingOrderStatusOptions}
        className={styles.selectFilterField}
      />
    </Box>
  );
};

export default ShippingTableFilters;
