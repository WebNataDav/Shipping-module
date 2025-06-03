import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import clsx from 'clsx';
import styles from './styles.module.scss';

const MaterialReceivedByPad = () => {
  const signatureCanvasRef = useRef<SignatureCanvas>(null);

  return (
    <div className={styles.signatureCanvasArea}>
      <SignatureCanvas
        ref={signatureCanvasRef}
        penColor="black"
        canvasProps={{ className: clsx('signature-canvas', styles.canvas) }}
      />
    </div>
  );
};

export default MaterialReceivedByPad;
