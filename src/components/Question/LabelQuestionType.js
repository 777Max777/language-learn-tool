import { Text } from "@nextui-org/react";

const LabelQuestion = ({label}) => {
  return (
    <Text
      size={16}
      css={{
        whiteSpace: "pre-line",
        fontWeight: "500",
      }}
    >
      {label}
    </Text>
  );
};

export default LabelQuestion
