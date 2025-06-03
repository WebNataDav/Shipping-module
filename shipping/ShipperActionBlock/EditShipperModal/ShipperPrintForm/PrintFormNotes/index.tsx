import { Nullable } from '@types';
import styles from './styles.module.scss';

type PrintFormNotesProps = {
  notes?: Nullable<string>;
};

const PrintFormNotes = ({ notes }: PrintFormNotesProps) => {
  return (
    <div className={styles.printFormNotesContainer}>
      <div>Notes:</div>
      <div>
        <p>{notes}</p>
      </div>
    </div>
  );
};

export default PrintFormNotes;
