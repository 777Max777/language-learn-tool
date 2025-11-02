import ConfigureModule from '../components/ConfigureModule/ConfigureModule';
import { useEffect } from 'react';
import { nanoid } from 'nanoid'
import {v4 as uuid} from 'uuid'

const CreateScreen = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <ConfigureModule 
      moduleId={nanoid(15)}
      moduleName={''}
      moduleTermItems={[{ id: uuid(), term: '', definition: '', isValid: true }]}
    />
  )
};

export default CreateScreen;
