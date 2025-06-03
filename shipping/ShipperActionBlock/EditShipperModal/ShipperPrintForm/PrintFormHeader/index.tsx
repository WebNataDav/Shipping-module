import { Nullable } from '@types';
import styles from './styles.module.scss';
import Image from 'next/image';
import { Spinner } from '@components/library/Spinner';
import { staticHeaderData } from './constants';

type PrintFormHeaderProps = {
  shipperNumber?: Nullable<string>;
};

const PrintFormHeader = ({ shipperNumber }: PrintFormHeaderProps) => {
  return (
    <div className={styles.printFormHeaderContainer}>
      <div>
        <LogoSection src={'/printFormImagePlaceholder.png'} />
        <CompanySection />
      </div>
      <RecieverTicket ticketNumber={shipperNumber} />
    </div>
  );
};

type LogoSectionProps = {
  src: string;
};

export const LogoSection = ({ src }: LogoSectionProps) => {
  return (
    <div className={styles.logoSectionContainer}>
      <Image src={src} alt="logo" fill sizes="(max-width: 105px) 100vw" />
    </div>
  );
};

export const CompanySection = () => {
  return (
    <div className={styles.companySectionContainer}>
      <h4>{staticHeaderData.company.title}</h4>
      <div>
        <em>
          <strong>{staticHeaderData.company.moto}</strong>
        </em>
      </div>
      <div>{staticHeaderData.company.address}</div>
      <div>
        <span>
          <strong>{staticHeaderData.company.plantTitle}</strong> {staticHeaderData.company.plant}
        </span>
      </div>
    </div>
  );
};

type RecieverTicketProps = {
  ticketNumber?: Nullable<string>;
};

export const RecieverTicket = ({ ticketNumber }: RecieverTicketProps) => {
  return (
    <div className={styles.recieverTicketContainer}>
      {ticketNumber !== undefined ? (
        <h5>{`${'#' + ticketNumber}`}</h5>
      ) : (
        <h5>
          <Spinner />
        </h5>
      )}
      <h6>{staticHeaderData.ticket.title}</h6>
      <span>{staticHeaderData.ticket.phone}</span>
      <div>
        <span>
          <em>{staticHeaderData.ticket.commentsPhoneTitle}</em> {staticHeaderData.ticket.commentsPhone}
        </span>
      </div>
    </div>
  );
};

export default PrintFormHeader;
