import { Text } from "@nextui-org/react";

const ReviewLabel = ({ typedAnswer, rightAnswer }) => {
  return (
    <Text
      size={16}
      css={{
        whiteSpace: "pre-line",
        fontWeight: "500",
      }}
      color={"primary"}
    >
      Correct is: "
      {rightAnswer.split("").map((item, index) => {
        if (
          index <= typedAnswer.length - 1 &&
          typedAnswer.charAt(index).toLowerCase() != item
        ) {
          return (
            <u key={index}>
              <font color="red">{item}</font>
            </u>
          );
        } else {
          return item;
        }
      })}
      "
    </Text>
  );
};

export default ReviewLabel
