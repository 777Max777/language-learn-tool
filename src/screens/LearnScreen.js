import { useEffect } from "react";
import Learn from "../components/Learn/Learn";
import Learning from "../components/Learn/Learning";
import Listening from "../components/Learn/Listening";

const LearnScreen = ({title}) => {
  useEffect(() => {
    document.title = title;
  }, [title])

  return <Learn/>;
}
export const ListeningScreen = ({title}) => {
  useEffect(() => {
    document.title = title;
  }, [title])

  return <Listening/>;
}

export const LearningScreen = ({title}) => {
  useEffect(() => {
    document.title = title;
  }, [title])

  return <Learning/>;
}

export default LearnScreen;