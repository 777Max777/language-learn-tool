import Import from '../components/Import/Import';
import { useEffect } from 'react';

const ImportScreen = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <Import />;
};

export default ImportScreen;
