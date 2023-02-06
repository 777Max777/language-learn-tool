import { Card, Text } from "@nextui-org/react";
import classes from "./Answer.module.css";

const AnswerOption = ({
  isPressable,
  css,
  onPress,
  optionName,
  optionNumber,
}) => {
  return (
    <Card
      isPressable={isPressable}
      variant={"bordered"}
      borderWeight={"normal"}
      css={css}
      onPress={onPress}
    >
      <Card.Body>
        <div className={classes.ans}>
          <Text className={classes.keyAns}>{optionNumber}</Text>
          <Text>{optionName}</Text>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AnswerOption;
