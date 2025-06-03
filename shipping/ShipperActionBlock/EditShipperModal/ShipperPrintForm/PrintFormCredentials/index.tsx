import { useState, useMemo } from 'react';
import { rowNames } from './constants';
import { formatDate, formatValueDate } from './helpers';
import { CredentialsRowProps } from './types';
import styles from './styles.module.scss';

type PrintFormCredentialsProps = {
  customer?: string;
  carrier?: string;
  customerPO?: string;
  shipDate?: string;
};

export const PrintFormCredentials = ({ customer, carrier, customerPO, shipDate }: PrintFormCredentialsProps) => {
  const formattedDate = formatDate(new Date());
  const formattedShipDate = formatValueDate(shipDate);

  const rowData = useMemo(
    () => ({
      customer,
      carrier,
      customerPO,
      date: formattedDate,
      shippedDate: shipDate,
    }),
    [customer, carrier, customerPO, formattedDate, shipDate],
  );

  const firstThreeRows = useMemo(
    () =>
      Object.entries(rowData)
        .slice(0, 3)
        .map(([key, value]) => <CredentialsRow key={key} name={rowNames[key as keyof typeof rowNames]} data={value} />),
    [rowData],
  );

  const remainingRows = useMemo(
    () =>
      Object.entries(rowData)
        .slice(3)
        .map(([key, value]) => (
          <CredentialsRow
            key={key}
            name={rowNames[key as keyof typeof rowNames]}
            data={value}
            shipDate={formattedShipDate}
          />
        )),
    [rowData, formattedShipDate],
  );

  return (
    <div className={styles.credentialsContainer}>
      <table>
        <tbody>{firstThreeRows}</tbody>
      </table>
      <table>
        <tbody>{remainingRows}</tbody>
      </table>
    </div>
  );
};

export const CredentialsRow = ({ name, data, shipDate }: CredentialsRowProps) => {
  const [shipDateValue, setShipDateValue] = useState(shipDate);

  const handleShipDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShipDateValue(event.target.value);
  };
  return (
    <tr className={styles.rowContainer}>
      <th>{name}:</th>
      {name === 'Ship Date' && (
        <td>
          <input
            type="date"
            value={shipDateValue}
            onChange={handleShipDate}
            placeholder={shipDate}
            className={styles.inputField}
            style={{ outline: 'none' }}
          />
        </td>
      )}
      {name !== 'Ship Date' && <td>{data}</td>}
    </tr>
  );
};
