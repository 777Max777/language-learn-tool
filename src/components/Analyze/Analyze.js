import {
  Card,
  Spacer,
  Text,
  Progress,
} from '@nextui-org/react';
import classes from './Analyze.module.css';

const Analyze = ({totalAnswers, allQuestions}) => {
  console.log('render Analyze')
  const progress = ((totalAnswers / allQuestions) * 100).toFixed(2);
  return (
    <div className={classes.progress}>
      <Card>
        <Card.Body>
          <Text
            p
            b
            size={12}
            css={{
              width: '100%',
              textAlign: 'center',
            }}
          >
            Analyzing your progress
          </Text>
          <Spacer y={1} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Text p b size={12}>
              Total: {totalAnswers} / {allQuestions}
            </Text>
            <Text p b size={12}>
              {progress} %
            </Text>
          </div>
          <Progress
            squared="true"
            size="xs"
            value={progress}
            shadow
            color={
              progress >= 90 ? 'success' : progress > 0 ? 'warning' : 'error'
            }
            status="primary"
          />
        </Card.Body>
      </Card>
    </div>
  )
}

export default Analyze