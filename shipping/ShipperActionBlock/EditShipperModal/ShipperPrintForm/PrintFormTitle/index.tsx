import styles from './styles.module.scss';
import { Nullable } from '@types';
import { Spinner } from '@components/library/Spinner';

type PrintFormTitleProps = {
  shipperNumber?: Nullable<string>;
};

export const PrintFormTitle = ({ shipperNumber }: PrintFormTitleProps) => {
  return (
    <div className={styles.printFormTitleContainer}>
      <div>
        {!shipperNumber ? (
          <>
            <Spinner />
          </>
        ) : (
          <>#{shipperNumber} Shipper</>
        )}
      </div>
    </div>
  );
};
