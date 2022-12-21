import {
  Button,
  Card,
  Input,
  Grid,
  Spacer,
  Text,
  Progress,
} from '@nextui-org/react';
import { Fragment, useCallback, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';
import classes from './Learn.module.css';
import ReactGA from 'react-ga4';

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

const Learning = () => {
  // init react-router-dom
  const { id } = useParams();
  const navigate = useNavigate();

  // init state
  const [listAllQuestion, setListAllQuestion] = useState(
    JSON.parse(localStorage.getItem(id)).data.map(item => {
      item.isWatched = false
      item.count = 0
      item.writtenCount = 0
      item.isTested = false
      return item
    })
  );
  const [listLearning, setListLearning] = useState([]); // рабочая пачка
  const [cloneListLearning, setCloneListLearning] = useState([]); // буферная пачка
  const [isNotCorrect, setIsNotCorrect] = useState(false);
  const [numberLearning, setNumberLearning] = useState(0);
  const [totalAnswer, setTotalAnswer] = useState(0);
  const [selectAnswer, setSelectAnswer] = useState(undefined);
  const [indexSelectQuestion, setIndexSelectQuestion] = useState(0);
  const [listAnswer, setListAnswer] = useState([]);

  const [isShowRightAnswer, setShowIsRightAnswer] = useState(false);
  const [isAlmostCorrectWord, seIsAlmostCorrectWord] = useState(false);
  const answerRef = useRef()

  useEffect(() => {
    const unlearned = listAllQuestion.filter(item => item.learned === false)
    if (unlearned.length === 0) {
      navigate('/course/' + id);
    }
    const random = Math.floor(Math.random() * unlearned.length);
    setTotalAnswer(
      listAllQuestion.filter((item) => item.learned === true).length
    );
    setListLearning([unlearned[random]]);
    setListAllQuestion(prev => prev.map(item => {
      if (item.i === unlearned[random].i)
        item.isWatched = true
      return item
    }))
    setIndexSelectQuestion(0);
    ReactGA.event({
      category: 'Learning',
      action:
        'Learning question in set ' + JSON.parse(localStorage.getItem(id))?.name,
    });
  }, []);

  useEffect(() => {
    const unlearned = listAllQuestion.filter(item => item.learned === false)
    if (unlearned.length === 0) {
      updateListLocalStorage();
      navigate('/course/' + id);
    }
  }, [listAllQuestion])

  // load question and answer to card on indexSelectQuestion change
  useEffect(() => {
    setSelectAnswer(undefined);
    setIsNotCorrect(false);
    if (listLearning.length > 0) {
      setListAnswer(generateAnswer(listLearning[indexSelectQuestion].answer));
    }
  }, [indexSelectQuestion, listLearning]);

  useEffect(() => {
    const learned = listAllQuestion.filter(item => item.learned === true)
    const totalL = learned.length;

    setNumberLearning((listAllQuestion.length * totalL) / 100);
  }, [selectAnswer, listAllQuestion]);

  const clearField = () => {
    answerRef.current.value = ''
    answerRef.current.focus()
  }

  // function and handler
  const generateAnswer = (answer) => {
    const listAns = listAllQuestion.map((item) =>
      item.answer.trim()
    );
    const a = listAns
      .filter((item, index) => {
        return listAns.indexOf(item) === index;
      })
      .sort(() => Math.random() - 0.5);

    const b = [answer, ...a];
    const result = b.filter((item, index) => {
      return b.indexOf(item) === index;
    });

    const shuffled = result.slice(0, 4).sort(() => Math.random() - 0.5);
    return shuffled;
  };

  const updateListLocalStorage = () => {
    listAllQuestion.forEach((element) => {
      if (element.learned) {
        delete element.count;
      }
    })
    const temp = JSON.parse(localStorage.getItem(id));
    temp.data = listAllQuestion;
    localStorage.setItem(id, JSON.stringify(temp));
    setTotalAnswer(
      JSON.parse(localStorage.getItem(id)).data.filter(
        (item) => item.learned === true
      ).length
    );
  }

  const handleCardAnswerPress = (key) => {
    setSelectAnswer(key);

    if (
      key ===
      listLearning[indexSelectQuestion].answer
    ) {
      listLearning[indexSelectQuestion].count =
        listLearning[indexSelectQuestion].count + 1;
      listLearning[indexSelectQuestion].lastIncorrect = undefined;

      listLearning[indexSelectQuestion].lastIncorrectClone =
        listLearning[indexSelectQuestion].lastIncorrect;

      /*if (indexSelectQuestion !== listLearning.length - 1) {
        setIndexSelectQuestion(indexSelectQuestion + 1);
      } else {
        repeatListLearning();
      }*/


      if (listLearning[indexSelectQuestion].count < 2) {
        setCloneListLearning(prev => {
          prev.push(listLearning[indexSelectQuestion])
          return prev
        })
      } else {
        setListAllQuestion(prev => prev.map(item => {
          if (item.i === listLearning[indexSelectQuestion].i) {
            //item.learned = true
            console.log(item)
            return listLearning[indexSelectQuestion]
          }
          return item
        }))
        setCloneListLearning(prev => {
          prev.push(listLearning[indexSelectQuestion])
          return prev
        })
      }
      setTimeout(() => {
        updateBatches()
        if (listLearning[indexSelectQuestion].count == 2) {
          listLearning[indexSelectQuestion].isTested = true
        }
      }, 500)
    } else {
      listLearning[indexSelectQuestion].lastIncorrect = true;
      setIsNotCorrect(true);
    }
  }

  const updateBatches = useCallback(() => {
    if (cloneListLearning.length == 10 && listLearning.length - 1 == 0) {
      setListLearning(cloneListLearning)
      setCloneListLearning([])
      updateListLocalStorage();
    } else if (listLearning.length - 1 == 0) {
      let unlearned = listAllQuestion.filter(item => item.learned === false && !item.isWatched)
      if (unlearned.length == 0) {
        unlearned = listAllQuestion.filter(item => item.learned === false)
      }
      const random = Math.floor(Math.random() * unlearned.length);
      setListLearning([unlearned[random]]);
      setListAllQuestion(prev => prev.map(item => {
        if (item.i === unlearned[random].i)
          item.isWatched = true
        return item
      }))
    } else {
      setListLearning(prev => prev.slice(1))
    }
  }, [cloneListLearning, listLearning, listAllQuestion])

  const handleNextButtonPress = () => {
    listLearning[indexSelectQuestion].lastIncorrectClone =
      listLearning[indexSelectQuestion].lastIncorrect;
    setCloneListLearning(prev => {
      prev.push(listLearning[indexSelectQuestion])
      return prev
    })
    updateBatches();
  };

  const handleKeyDown = useCallback((event) => {
    if (answerRef.current.value
      && answerRef.current.value.length > 0
      && event.key === 'Enter') {
      isNotCorrect && handleInputNextButtonPress()
      setSelectAnswer(answerRef.current.value);

      if (
        answerRef.current.value.toLowerCase() ===
        listLearning[indexSelectQuestion].answer.toLowerCase()
      ) {
        listLearning[indexSelectQuestion].writtenCount =
          listLearning[indexSelectQuestion].writtenCount + 1;
        listLearning[indexSelectQuestion].lastIncorrect = undefined;

        setShowIsRightAnswer(true)

        listLearning[indexSelectQuestion].lastIncorrectClone =
          listLearning[indexSelectQuestion].lastIncorrect;

        if (listLearning[indexSelectQuestion].writtenCount < 2) {
          setCloneListLearning(prev => {
            console.log(`prev`)
            console.log(prev)
            prev.push(listLearning[indexSelectQuestion])
            return prev
          })
        } else {
          console.log('Выучил слово')
          setListAllQuestion(prev => prev.map(item => {
            if (item.i === listLearning[indexSelectQuestion].i) {
              item.learned = true
              console.log(item)
            }
            return item
          }))
        }
        setTimeout(() => {
          updateInputBatches()
          setShowIsRightAnswer(false)
          clearField()
        }, 1000);
      } else {
        listLearning[indexSelectQuestion].lastIncorrect = true;

        setIsNotCorrect(true);
        seIsAlmostCorrectWord(true)
      }
    }
  }, [listLearning, isNotCorrect, indexSelectQuestion])

  const handleRightAnswer = useCallback(() => {
    listLearning[indexSelectQuestion].writtenCount =
      listLearning[indexSelectQuestion].writtenCount + 1;
    listLearning[indexSelectQuestion].lastIncorrect = undefined;

    listLearning[indexSelectQuestion].lastIncorrectClone =
      listLearning[indexSelectQuestion].lastIncorrect;
    if (listLearning[indexSelectQuestion].writtenCount < 2) {
      setCloneListLearning(prev => {
        console.log(`prev`)
        console.log(prev)
        prev.push(listLearning[indexSelectQuestion])
        return prev
      })
    } else {
      console.log('Выучил слово')
      setListAllQuestion(prev => prev.map(item => {
        if (item.i === listLearning[indexSelectQuestion].i) {
          item.learned = true
          console.log(item)
        }
        return item
      }))
    }

    setTimeout(() => {
      updateInputBatches()
      setIsNotCorrect(false);
      seIsAlmostCorrectWord(false)
      clearField()
    }, 1000);
  }, [listLearning, indexSelectQuestion])

  const handleInputNextButtonPress = () => {
    listLearning[indexSelectQuestion].lastIncorrectClone =
      listLearning[indexSelectQuestion].lastIncorrect;
    listLearning[indexSelectQuestion].writtenCount = 0;
    setCloneListLearning(prev => {
      prev.push(listLearning[indexSelectQuestion])
      return prev
    })
    updateInputBatches();
    clearField()
  };

  const updateInputBatches = useCallback(() => {
    if (cloneListLearning.length == 10 && listLearning.length - 1 == 0) {
      setListLearning(cloneListLearning)
      setCloneListLearning([])
      updateListLocalStorage();
    } else if (listLearning.length - 1 == 0) {
      let unlearned = listAllQuestion.filter(item => item.learned === false)
      /*if (unlearned.length == 0) {
        unlearned = listAllQuestion.filter(item => item.learned === false)
      }*/
      const random = Math.floor(Math.random() * unlearned.length);
      setListLearning([unlearned[random]]);
      setListAllQuestion(prev => prev.map(item => {
        if (item.i === unlearned[random].i)
          item.isWatched = true
        return item
      }))
    } else {
      console.log(listLearning)
      setListLearning(prev => prev.slice(1))
    }
  }, [cloneListLearning, listLearning, listAllQuestion])

  const progress = ((totalAnswer / listAllQuestion.length) * 100).toFixed(2);

  return (
    <div className={classes.main}>
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
                Total: {totalAnswer}/{listAllQuestion.length}
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
      <Progress
        css={{
          position: 'fixed',
          top: 0,
          left: 0,
        }}
        squared="true"
        size="sm"
        value={numberLearning}
        shadow
        color="gradient"
        status="primary"
      />
      <Fragment>
        <Grid.Container>
          <Grid xs={2}>
            <Button
              color={'error'}
              flat
              icon={<MdKeyboardBackspace />}
              auto
              size={'sm'}
              onPress={() => {
                navigate('/course/' + id);
              }}
            >
              Quit learn
            </Button>
          </Grid>
          <Grid xs={8}>
            <Text css={{ textAlign: 'center', width: '100%' }} h1 size={18}>
              Learn: {JSON.parse(localStorage.getItem(id)).name}
            </Text>
          </Grid>
        </Grid.Container>
        <Spacer y={2} />
        <Card>
          <Card.Body>
            <div className={classes.headerQuestionNumber}>
              {listLearning[indexSelectQuestion] !== undefined &&
                listLearning[indexSelectQuestion].lastIncorrectClone !==
                undefined && (
                  <Text
                    size={20}
                    css={{
                      backgroundColor: 'rgb(255, 219, 205)',
                      fontSize: 12,
                      padding: '2px 10px',
                      fontWeight: 700,
                      borderRadius: 50,
                    }}
                  >
                    Let's try again
                  </Text>
                )}
            </div>
            <Text
              size={20}
              css={{
                whiteSpace: 'pre-line',
                padding: 20,
              }}
            >
              {listLearning[indexSelectQuestion] &&
                listLearning[indexSelectQuestion].question}
            </Text>
            <Spacer y={2} />
            {listLearning[indexSelectQuestion] &&
              //listLearning[indexSelectQuestion].count < 2 &&
              !listLearning[indexSelectQuestion].isTested &&
              (<><div className={classes.nextButton}>
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
                    onPress={handleNextButtonPress}
                    size={'sm'}
                    color={'warning'}
                  >
                    Continue
                  </Button>
                )}
              </div>
                <Grid.Container gap={2}>
                  {listAnswer.map((item, index) => (
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
                        onPress={() => handleCardAnswerPress(item)}
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
              )}
            {listLearning[indexSelectQuestion] &&
              //listLearning[indexSelectQuestion].count == 2 &&
              listLearning[indexSelectQuestion].isTested &&
              (<>
                <div className={classes.nextButton}>
                  <Text
                    size={16}
                    css={{
                      whiteSpace: 'pre-line',
                      fontWeight: '500',
                    }}
                  >
                    Type definition
                  </Text>
                  {isNotCorrect && (
                    <>
                      <Text
                        size={16}
                        css={{
                          whiteSpace: 'pre-line',
                          fontWeight: '500',
                        }}
                        color={'primary'}
                      >
                        Correct is: "{
                          listLearning[indexSelectQuestion].answer
                            .split('')
                            .map((item, index) => {
                              if (index <= answerRef.current.value.length - 1
                                && answerRef.current.value.charAt(index).toLowerCase() != item) {
                                return <u><font color='red'>{item}</font></u>
                              } else {
                                return item
                              }
                            })}"
                      </Text>
                      {isAlmostCorrectWord && (
                        <Button
                          onPress={handleRightAnswer}
                          size={'sm'}
                          color={'secondary'}
                        >
                          Choose your right answer
                        </Button>
                      )}
                      <Button
                        onPress={handleInputNextButtonPress}
                        size={'sm'}
                        color={'warning'}
                      >
                        Continue
                      </Button>
                    </>
                  )}
                  {isShowRightAnswer && (
                    <Text
                      size={16}
                      css={{
                        whiteSpace: 'pre-line',
                        fontWeight: '500',
                      }}
                      color={'green'}
                    >
                      it's right
                    </Text>
                  )}
                </div>
                <Input
                  css={{ width: '100%' }}
                  onKeyDown={handleKeyDown}
                  ref={answerRef}
                />
              </>
              )}
          </Card.Body>
        </Card>
      </Fragment>
    </div >
  );
}

export default Learning