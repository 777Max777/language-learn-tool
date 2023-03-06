import {
  Button,
  Grid,
  Text,
} from '@nextui-org/react';
import { MdKeyboardBackspace } from 'react-icons/md';
import { useNavigate } from "react-router-dom";


const HeaderEducation = ({id, quitEducateLabel}) => {
  const navigate = useNavigate();
  return (
    <Grid.Container>
      <Grid xs={2}>
        <Button
          color={"error"}
          flat
          icon={<MdKeyboardBackspace />}
          auto
          size={"sm"}
          onPress={() => {
            navigate("/course/" + id);
          }}
        >
          {quitEducateLabel}
        </Button>
      </Grid>
      <Grid xs={8}>
        <Text css={{ textAlign: "center", width: "100%" }} h1 size={18}>
          Learn: {JSON.parse(localStorage.getItem(id)).name}
        </Text>
      </Grid>
    </Grid.Container>
  );
};

export default HeaderEducation
