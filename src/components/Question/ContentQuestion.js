import { Text } from "@nextui-org/react";

const ContentQuestion = ({readQuestion}) => {
  return (
    <Text
      size={20}
      css={{
        whiteSpace: "pre-line",
        padding: 20,
      }}
    >
      {readQuestion()}
    </Text>
  );
};

export default ContentQuestion
