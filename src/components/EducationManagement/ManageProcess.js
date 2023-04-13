import { Card, Spacer, Text, Input, Checkbox } from "@nextui-org/react";
import classes from "./EducationManagement.module.css";

const styles = {
  content: {
    display: "flex",
    justifyContent: "space-between",
  },
  header: {
    width: "100%",
    textAlign: "center",
  },
};

const ManageBatches = ({
  batchSize,
  isShuffled,
  setIsShuffled,
  batchSizeChangeHanler
}) => {
  const onChangeHandler = (event) => {
    batchSizeChangeHanler(event.target.value)
  }
  const onClickInputHandler = (event) => {
    event.target.select()
  }
  return (
    <div className={classes.progress}>
      <Card>
        <Card.Body>
          <Text p b size={12} css={styles.header}>
            Manage your education process
          </Text>
          <Spacer y={1} />
          <div style={styles.content}>
            <Text p b size={12}>
              Type batch size
            </Text>
            <Input value={batchSize} onChange={onChangeHandler} onClick={onClickInputHandler}/>
          </div>
          <Spacer y={1} />
          <div style={styles.content}>
            <Checkbox
              color={"success"}
              isSelected={isShuffled}
              onChange={setIsShuffled}
            >
              <Text p b size={12}>
                Is shuffled batch?
              </Text>
            </Checkbox>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export const ManageDetailProcess = ({
  batchSize,
  isShuffled,
  setIsShuffled,
  batchSizeChangeHanler
}) => {
  const onChangeHandler = (event) => {
    batchSizeChangeHanler(event.target.value)
  }
  const onClickInputHandler = (event) => {
    event.target.select()
  }
  return (
    <div className={classes.progress}>
      <Card>
        <Card.Body>
          <Text p b size={12} css={styles.header}>
            Manage your education process
          </Text>
          <Spacer y={1} />
          <div style={styles.content}>
            <Text p b size={12}>
              Type batch size
            </Text>
            <Input value={batchSize} onChange={onChangeHandler} onClick={onClickInputHandler}/>
          </div>
          <Spacer y={1} />
          <div style={styles.content}>
            <Checkbox
              color={"success"}
              isSelected={isShuffled}
              onChange={setIsShuffled}
            >
              <Text p b size={12}>
                Is shuffled batch?
              </Text>
            </Checkbox>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManageBatches;
