import { Text } from "@nextui-org/react";
import classes from "./TryAgain.module.css";

const LetsTryAgain = () => {
  return (
    <div className={classes.headerQuestionNumber}>
      <Text
        size={20}
        css={{
          backgroundColor: "rgb(255, 219, 205)",
          fontSize: 12,
          padding: "2px 10px",
          fontWeight: 700,
          borderRadius: 50,
        }}
      >
        Let's try again
      </Text>
    </div>
  );
};

export default LetsTryAgain;
