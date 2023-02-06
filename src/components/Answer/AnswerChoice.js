import {Grid} from "@nextui-org/react";
import classes from "./Answer.module.css";
import LabelQuestion from "../Question/LabelQuestionType";
import ContinueButton from "../Button/ContinueButton";
import AnswerOption from "./AnswerOption";

const styleCardCorrect = {
  cursor: "pointer",
  borderColor: "#23b26d",
  backgroundColor: "#f2fbf6",
};

const styleCardIncorrect = {
  cursor: "pointer",
  borderColor: "#ff9c8c",
  backgroundColor: "#fbf2f2",
};

const AnswerChoice = (prop) => {
  const cssOption = (item) =>
    prop.selectAnswer === undefined
      ? { cursor: "pointer" }
      : prop.selectAnswer === item 
        && prop.selectAnswer === prop.question.answer
        ? styleCardCorrect
        : prop.selectAnswer === item 
          && prop.selectAnswer !== prop.question.answer
          ? styleCardIncorrect
          : item === prop.question.answer
            ? styleCardCorrect
            : { cursor: "pointer" };
  return (
    <>
      <div className={classes.nextButton}>
        <LabelQuestion label={"Choose the right definition"} />
        {prop.isNotCorrect && (
          <ContinueButton handler={prop.handleNextButtonPress} />
        )}
      </div>
      <Grid.Container gap={2}>
        {prop.listAnswer.map((item, index) => (
          <Grid xs={6} key={index}>
            <AnswerOption 
              isPressable={prop.selectAnswer === undefined}
              css={cssOption(item)}
              onPress={() => prop.handleCardAnswerPress(item)}
              optionName={item}
              optionNumber={index+1}
            />
          </Grid>
        ))}
      </Grid.Container>
    </>
  );
};

export default AnswerChoice;
