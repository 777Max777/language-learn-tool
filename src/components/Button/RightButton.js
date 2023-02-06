import { Button } from "@nextui-org/react";

const RightAnswerButton = ({handler}) => {
  return (
    <Button onPress={handler} size={"sm"} color={"secondary"}>
      Choose your right answer
    </Button>
  );
};

export default RightAnswerButton