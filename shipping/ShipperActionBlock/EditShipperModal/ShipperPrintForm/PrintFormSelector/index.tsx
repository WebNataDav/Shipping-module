import styles from './styles.module.scss';
import React, { useMemo, useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { IconButton, Autocomplete } from '@mui/material';
import { getUserOptions } from './helpers';
import { SelectorComboboxProps } from './types';
import { useUsersByGroups } from 'src/hooks/postDataHooks';
import { fetchOnceConfig, yard } from './constants';

export const PrintFormSelector = () => {
  const { users, isLoadingUsers: isLoading } = useUsersByGroups(yard, fetchOnceConfig);
  const options = useMemo(() => getUserOptions(users), [users]);

  return (
    <div className={styles.printFormSelectorContainer}>
      <SelectorCombobox
        title={'Counted By'}
        disabled={isLoading || !options}
        options={!isLoading && options ? options : ['']}
      />
      <SelectorCombobox
        title={'Loaded By'}
        disabled={isLoading || !options}
        options={!isLoading && options ? options : ['']}
      />
      <SelectorCombobox
        title={'Verified By'}
        disabled={isLoading || !options}
        options={!isLoading && options ? options : ['']}
      />
    </div>
  );
};

export const SelectorCombobox = ({ title, options, disabled }: SelectorComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleIconClick = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <div className={styles.selectorComboboxContainer}>
      <span>{title}:</span>
      <div>
        <Autocomplete
          open={open}
          onOpen={() => {}}
          onClose={() => setOpen(false)}
          inputValue={inputValue}
          onInputChange={(_event, newInputValue) => {
            setInputValue(newInputValue);
            if (newInputValue.length > 0) {
              setOpen(true);
            } else {
              setOpen(false);
            }
          }}
          options={options ? options : ['']}
          freeSolo
          disabled={disabled}
          classes={{ listbox: styles.dropdownListbox, option: styles.dropdownOption, paper: styles.dropdownPaper }}
          renderInput={(params) => (
            <div ref={params.InputProps.ref}>
              <input type="text" {...params.inputProps} />
              <IconButton
                onClick={handleIconClick}
                tabIndex={-1}
                title="open combobox"
                aria-label="open combobox"
                disableRipple
                className={styles.noPrint}
                disabled={disabled || !options}
              >
                <ArrowDropDownIcon fontSize={'large'} />
              </IconButton>
            </div>
          )}
        />
      </div>
    </div>
  );
};
