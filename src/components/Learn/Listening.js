import { Card, Spacer, Progress } from "@nextui-org/react";
import { FcAudioFile } from "react-icons/fc";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderEducation from "../HeaderEducation/HeaderEducation";
import LetsTryAgain from "../TryAgain/TryAgain";
import AnswerInput from "../Answer/AnswerInput";
import ManageProcess from "../EducationManagement/ManageProcess";
import useWritingActions from "../../hooks/actions/WritingController";
import useLearning from "../../hooks/useLearning";
import Analyze from "../Analyze/Analyze";
import classes from "./Learn.module.css";

const learnedCondition = (item) => item.learnedListening === true;
const learnedSetter = (item) => (item.learnedListening = true);
const getQuestionsByModule = (id) =>
  JSON.parse(localStorage.getItem(id)).data.map((item) => {
    item.writtenCount = 0;
    return item;
  });

const Listening = () => {
  const { id } = useParams();
  const {
    setIsShuffled,
    dispatch,
    updateBatches,
    refreshTermInQuestionList,
    batchSizeChangeHandler,
    curTerm,
    state,
  } = useLearning(id, getQuestionsByModule(id), learnedCondition);

  const {
    handleKeyDown,
    handleRightAnswer,
    handleInputNextButtonPress,
    answerRef,
  } = useWritingActions({
    curTerm,
    dispatch,
    updateBatches,
    refreshTermInQuestionList,
    learnedSetter,
  });

  const [speech, setSpeech] = useState(new SpeechSynthesisUtterance());

  useEffect(() => {
    speech.rate = 0.8;
    speech.lang = "en";
    setSpeech(speech);
    speechAnswer(curTerm);
  }, []);

  useEffect(() => {
    dispatch({ type: "RESET_CORRECT_TERM_FLAG", payload: {} });
    speechAnswer(curTerm);
  }, [state.listLearning]);

  const speechAnswer = (word) => {
    speech.text = word.answer;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
    answerRef.current.focus();
  };

  const isTryAgain = () =>
    curTerm !== undefined && curTerm.lastIncorrectClone !== undefined;

  return (
    <div className={classes.main}>
      <Analyze
        totalAnswers={state.totalAnswer}
        allQuestions={state.listAllQuestion.length}
      />
      <ManageProcess
        batchSize={state.batchSize}
        batchSizeChangeHanler={batchSizeChangeHandler}
        isShuffled={state.isShuffled}
        setIsShuffled={setIsShuffled}
      />
      <Progress
        css={{
          position: "fixed",
          top: 0,
          left: 0,
        }}
        squared="true"
        size="sm"
        value={state.numberLearning}
        shadow
        color="gradient"
        status="primary"
      />
      <Fragment>
        <HeaderEducation id={id} quitEducateLabel={"Quit listening"} />
        <Spacer y={2} />
        <Card>
          <Card.Body>
            {isTryAgain() && <LetsTryAgain />}
            <FcAudioFile size={150} onClick={() => speechAnswer(curTerm)} />
            <Spacer y={2} />
            <AnswerInput
              question={curTerm}
              answerRef={answerRef}
              isShowRightAnswer={state.isShowRightAnswer}
              isNotCorrect={state.isNotCorrect}
              handleKeyDown={handleKeyDown}
              handleRightAnswer={handleRightAnswer}
              handleNextButtonPress={handleInputNextButtonPress}
            />
          </Card.Body>
        </Card>
      </Fragment>
    </div>
  );
};

export default Listening;
