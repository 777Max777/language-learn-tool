import {
  Button,
  Card,
  Grid,
  Text
} from '@nextui-org/react';

const styleCardCorrect = {
  cursor: 'pointer',
  borderColor: '#23b26d',
  backgroundColor: '#f2fbf6',
};

const styleCardIncorrect = {
  cursor: 'pointer',
  borderColor: '#ff9c8c',
  backgroundColor: '#fbf2f2',
};

const Testing = ({isNotCorrect, answers, learnLogic}) => {
  const [selectAnswer, setSelectAnswer] = useState(undefined);

  const onPressAnswerHandler = (word) => {
    setSelectAnswer(word)
    
  }

  return (
    <>
      <div className={classes.nextButton}>
        <Text
          size={16}
          css={{
            whiteSpace: 'pre-line',
            fontWeight: '500',
          }}
        >
          Choose the right definition
        </Text>
        {isNotCorrect && (
          <Button
            onPress={learnLogic}
            size={'sm'}
            color={'warning'}
          >
            Continue
          </Button>
        )}
      </div>
      <Grid.Container gap={2}>
        {answers.map((item, index) => (
            <Grid xs={6} key={index}>
              <Card
                isPressable={selectAnswer === undefined}
                variant={'bordered'}
                borderWeight={'normal'}
                css={
                  selectAnswer === undefined
                    ? { cursor: 'pointer' }
                    : selectAnswer === item &&
                      selectAnswer ===
                      listLearning[
                        indexSelectQuestion
                      ].answer
                      ? styleCardCorrect
                      : selectAnswer === item &&
                        selectAnswer !==
                        listLearning[
                          indexSelectQuestion
                        ].answer
                        ? styleCardIncorrect
                        : item ===
                          listLearning[
                            indexSelectQuestion
                          ].answer
                          ? styleCardCorrect
                          : { cursor: 'pointer' }
                }
                onPress={() => onPressAnswerHandler(item)}
              >
                <Card.Body>
                  <div className={classes.ans}>
                    <Text className={classes.keyAns}>{index + 1}</Text>
                    <Text>{item}</Text>
                  </div>
                </Card.Body>
              </Card>
            </Grid>
          ))}
      </Grid.Container>
    </>
  )
}

export default Testing