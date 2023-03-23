import { Card, Spacer, Progress } from "@nextui-org/react";
import { Fragment, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeaderEducation from "../HeaderEducation/HeaderEducation";
import LetsTryAgain from "../TryAgain/TryAgain";
import classes from "./Learn.module.css";
import ContentQuestion from "../Question/ContentQuestion";
import AnswerChoice from "../Answer/AnswerChoice";
import AnswerInput from "../Answer/AnswerInput";
import Analyze from "../Analyze/Analyze";
import ManageProcess from "../EducationManagement/ManageProcess";
import useTestActions, {
  generateAnswer,
} from "../../hooks/actions/TestController";
import useWritingActions from "../../hooks/actions/WritingController";
import useLearning from "../../hooks/useLearning";

const learnedCondition = (item) => item.learned === true;
const learnedSetter = (item) => (item.learned = true);
const getQuestionsByModule = (id) =>
  JSON.parse(localStorage.getItem(id)).data.map((item) => {
    item.count = 0;
    item.writtenCount = 0;
    item.isTested = false;
    return item;
  });

const Learning = () => {
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

  const { handleCardAnswerPress, handleNextButtonPress } = useTestActions(
    curTerm,
    dispatch,
    updateBatches
  );
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

  //чтобы совместить обучение теста с письмом
  useEffect(() => {
    if (curTerm.isTested) {
      dispatch({ type: "RESET_CORRECT_TERM_FLAG", payload: {} });
    } else {
      dispatch({
        type: "UPDATE_CARD_ANSWERS",
        payload: {
          data: {
            answers: generateAnswer(state.listAllQuestion, curTerm.answer),
          },
        },
      });
    }
  }, [state.listLearning]);

  const isTryAgain = () =>
    curTerm !== undefined && curTerm.lastIncorrectClone !== undefined;

  const readQuestion = () => curTerm && curTerm.question;

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
        <HeaderEducation id={id} quitEducateLabel={"Quit learn"} />
        <Spacer y={2} />
        <Card>
          <Card.Body>
            {isTryAgain() && <LetsTryAgain />}
            <ContentQuestion readQuestion={readQuestion} />

            <Spacer y={2} />
            {curTerm && !curTerm.isTested && (
              <AnswerChoice
                listAnswer={state.listAnswer}
                selectAnswer={state.selectAnswer}
                isNotCorrect={state.isNotCorrect}
                question={curTerm}
                handleNextButtonPress={handleNextButtonPress}
                handleCardAnswerPress={handleCardAnswerPress}
              />
            )}
            {curTerm && curTerm.isTested && (
              <AnswerInput
                question={curTerm}
                answerRef={answerRef}
                isShowRightAnswer={state.isShowRightAnswer}
                isNotCorrect={state.isNotCorrect}
                handleKeyDown={handleKeyDown}
                handleRightAnswer={handleRightAnswer}
                handleNextButtonPress={handleInputNextButtonPress}
              />
            )}
          </Card.Body>
        </Card>
      </Fragment>
    </div>
  );
};

export default Learning;
