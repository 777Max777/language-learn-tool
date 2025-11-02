import ConfigureModule from "../components/ConfigureModule/ConfigureModule";
import { useEffect, useMemo } from "react";
import { useParams } from 'react-router-dom';

const EditCourseScreen = ({ title }) => {
  const { id } = useParams()
  const module = useMemo(() => JSON.parse(localStorage.getItem(id)), [])
  console.log(module.data.map(item => {
        return {
            id: item.i,
            term: item.answer,
            definition: item.question,
            isValid: true
          }
      }))
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <ConfigureModule
      moduleId={id}
      moduleName={module.name}
      moduleTermItems={module.data.map(item => {
        return {
            id: item.i,
            term: item.answer,
            definition: item.question,
            isValid: true
          }
      })}
    />
  );
};

export default EditCourseScreen;
