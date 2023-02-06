import { Button } from "@nextui-org/react";

const ContinueButton = ({ handler }) => {
  return (
    <Button onPress={handler} size={"sm"} color={"warning"}>
      Continue
    </Button>
  );
};

export default ContinueButton
