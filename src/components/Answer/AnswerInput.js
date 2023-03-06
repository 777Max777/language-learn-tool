import { Text, Input } from "@nextui-org/react";
import classes from "./Answer.module.css";
import LabelQuestion from "../Question/LabelQuestionType";
import ContinueButton from "../Button/ContinueButton";
import RightAnswerButton from "../Button/RightButton";
import ReviewLabel from "./ReviewLabel";

const AnswerInput = (prop) => {
  return (
    <>
      <div className={classes.nextButton}>
        <LabelQuestion label={"Type definition"} />
        {prop.isNotCorrect && 
          prop.answerRef.current && (
          <>
            <ReviewLabel
              typedAnswer={prop.answerRef.current.value}
              rightAnswer={prop.question.answer}
            />
            <RightAnswerButton handler={prop.handleRightAnswer} />
            <ContinueButton handler={prop.handleNextButtonPress} />
          </>
        )}
        {prop.isShowRightAnswer && (
          <Text
            size={16}
            css={{
              whiteSpace: "pre-line",
              fontWeight: "500",
            }}
            color={"green"}
          >
            it's right
          </Text>
        )}
      </div>
      <Input
        css={{ width: "100%" }}
        onKeyDown={prop.handleKeyDown}
        ref={prop.answerRef}
      />
    </>
  );
};

export default AnswerInput;
