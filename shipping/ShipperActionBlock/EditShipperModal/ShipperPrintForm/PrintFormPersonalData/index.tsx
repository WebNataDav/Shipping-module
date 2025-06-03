import { useState } from 'react';
import MaterialReceivedByPad from './MaterialReceivedByPad';
import styles from './styles.module.scss';

export const PrintFormPersonalData = () => {
  const [address, setAddress] = useState('');

  const handleAddress = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(event.target.value);
    const textarea = event.target;
    textarea.style.height = '27.8px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className={styles.personalInfoContainer}>
      <table>
        <tbody>
          <tr className={styles.rowContainer}>
            <th>Material Received By:</th>
            <td>
              <div>
                <MaterialReceivedByPad />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr className={styles.rowContainer}>
            <th>Address:</th>
            <td>
              <textarea
                value={address}
                onChange={handleAddress}
                className={styles.inputField}
                style={{
                  outline: 'none',
                  resize: 'none',
                  overflow: 'hidden',
                  minHeight: '27.8px',
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
