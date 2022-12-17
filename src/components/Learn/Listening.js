import {
  Button,
  Input,
  Card,
  Grid,
  Modal,
  Spacer,
  Text,
  Progress,
} from '@nextui-org/react';
import { FcAudioFile } from 'react-icons/fc';
import { Fragment, useEffect, useCallback, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';
import classes from './Learn.module.css';
import ReactGA from 'react-ga4';

const dummyAnswer = ['A', 'B', 'C', 'D'];

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

const getSevenFromList = (list) => {
  const length = list.length < 7 ? list.length : 7;
  const result = [];
  for (let i = 0; i < length; i++) {
    const random = Math.floor(Math.random() * list.length);
    list[random].count = 0;
    result.push(list[random]);
    list.splice(random, 1);
  }
  return result;
};

const Listening = () => {
  // init react-router-dom
  const { id } = useParams();
  const navigate = useNavigate();

  // init state
  const [listAllQuestion, setListAllQuestion] = useState(
    JSON.parse(localStorage.getItem(id)).data
  );
  const [listLearning, setListLearning] = useState([]);
  const [cloneListLearning, setCloneListLearning] = useState([]);
  const [indexSelectQuestion, setIndexSelectQuestion] = useState(0);
  const [listAnswer, setListAnswer] = useState([]);
  const [selectAnswer, setSelectAnswer] = useState(undefined);
  const [isNotCorrect, setIsNotCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [numberLearning, setNumberLearning] = useState(0);
  const [totalAnswer, setTotalAnswer] = useState(0);
  const [isShowRightAnswer, setShowIsRightAnswer] = useState(false);
  const [isAlmostCorrectWord, seIsAlmostCorrectWord] = useState(false);
  //const [typedAnswer, setTypedAnswer] = useState(0);
  const answerRef = useRef()
  const [speech, setSpeech] = useState(new SpeechSynthesisUtterance())

  // get 7 question random from list in first time
  useEffect(() => {
    const listSeven = getSevenFromList(
      listAllQuestion.filter((item) => {
        return item.learnedListening === false;
      })
    );
    if (listSeven.length === 0) {
      navigate('/course/' + id);
    }
    speech.rate = 0.8
    speech.lang = 'en'
    setSpeech(speech)
    clearField()
    setTotalAnswer(
      listAllQuestion.filter((item) => item.learnedListening === true).length
    );
    setListLearning(listSeven);
    setCloneListLearning(listSeven);
    setIndexSelectQuestion(0);
    speechAnswer(listSeven[indexSelectQuestion])
    ReactGA.event({
      category: 'Learn',
      action:
        'Learn question in set ' + JSON.parse(localStorage.getItem(id))?.name,
    });
  }, []);

  // load question and answer to card on indexSelectQuestion change
  useEffect(() => {
    setSelectAnswer(undefined);
    setIsNotCorrect(false);
    if (listLearning.length > 0) {
      setListAnswer(generateAnswer(listLearning[indexSelectQuestion].answer));
    }
  }, [indexSelectQuestion, listLearning]);

  useEffect(() => {
    if (cloneListLearning.length > 0) {
      const countLearn = cloneListLearning.filter((item) => {
        return item.count === 2;
      }).length;
      const totalL = cloneListLearning.length;

      setNumberLearning((countLearn * 100) / totalL);
    }
  }, [selectAnswer, cloneListLearning]);

  // function and handler
  const generateAnswer = (answer) => {
    if (answer.trim().length === 1) {
      const ran = [...dummyAnswer].sort(() => Math.random() - 0.5);
      const l = [answer, ...ran];

      const result = l.filter((item, index) => {
        return l.indexOf(item) === index;
      });

      // shuffle
      const shuffled = result.slice(0, 4).sort(() => Math.random() - 0.5);
      return shuffled;
    } else {
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
    }
  };

  const updateListLocalStorage = () => {
    listAllQuestion.forEach((element) => {
      if (element.count === 2) {
        element.learnedListening = true;
      }
      delete element.count;
    });
    const temp = JSON.parse(localStorage.getItem(id));
    temp.data = listAllQuestion;
    localStorage.setItem(id, JSON.stringify(temp));
    setShowResult(true);
    setTotalAnswer(
      JSON.parse(localStorage.getItem(id)).data.filter(
        (item) => item.learnedListening === true
      ).length
    );
  };

  const speechAnswer = (word) => {
    speech.text = word.answer
    window.speechSynthesis.speak(speech);
    answerRef.current.focus()
  }

  const clearField = () => {
    //setTypedAnswer('')
    answerRef.current.value = ''
    answerRef.current.focus()
  }

  const handleKeyDown = useCallback((event) => {
    if (answerRef.current.value
      && answerRef.current.value.length > 0
      && event.key === 'Enter') {
      isNotCorrect && handleNextButtonPress()
      setSelectAnswer(answerRef.current.value);

      if (
        answerRef.current.value.toLowerCase() ===
        listLearning[indexSelectQuestion].answer.toLowerCase()
      ) {
        listLearning[indexSelectQuestion].count =
          listLearning[indexSelectQuestion].count + 1;
        listLearning[indexSelectQuestion].lastIncorrect = undefined;

        setShowIsRightAnswer(true)

        setTimeout(() => {
          listLearning[indexSelectQuestion].lastIncorrectClone =
            listLearning[indexSelectQuestion].lastIncorrect;
          if (indexSelectQuestion !== listLearning.length - 1) {
            setIndexSelectQuestion(indexSelectQuestion + 1);
            speechAnswer(listLearning[indexSelectQuestion + 1])
            clearField()
          } else {
            repeatListLearning();
          }
          setShowIsRightAnswer(false)
        }, 1000);
      } else {
        listLearning[indexSelectQuestion].lastIncorrect = true;
        setIsNotCorrect(true);
        seIsAlmostCorrectWord(true)
      }
    }
  }, [listLearning, isNotCorrect, indexSelectQuestion])

  const handleRightAnswer = useCallback(() => {
    listLearning[indexSelectQuestion].count =
      listLearning[indexSelectQuestion].count + 1;
    listLearning[indexSelectQuestion].lastIncorrect = undefined;

    setTimeout(() => {
      listLearning[indexSelectQuestion].lastIncorrectClone =
        listLearning[indexSelectQuestion].lastIncorrect;
      if (indexSelectQuestion !== listLearning.length - 1) {
        setIndexSelectQuestion(indexSelectQuestion + 1);
        speechAnswer(listLearning[indexSelectQuestion + 1])
        clearField()
      } else {
        repeatListLearning();
      }
      setIsNotCorrect(false);
      seIsAlmostCorrectWord(false)
    }, 1000);
  }, [listLearning, indexSelectQuestion])

  const handleNextButtonPress = useCallback(() => {
    listLearning[indexSelectQuestion].lastIncorrectClone =
      listLearning[indexSelectQuestion].lastIncorrect;
    if (indexSelectQuestion !== listLearning.length - 1) {
      setIndexSelectQuestion(indexSelectQuestion + 1);
      speechAnswer(listLearning[indexSelectQuestion + 1])
      clearField()
    } else {
      repeatListLearning();
    }
  }, [listLearning, indexSelectQuestion])

  const repeatListLearning = useCallback(() => {
    clearField()
    const t = listLearning.filter((item) => {
      return item.count <= 1;
    });
    if (t.length === 0) {
      updateListLocalStorage();
    } else {
      setListLearning(t);
      setIndexSelectQuestion(0);
      speechAnswer(t[0])
    }
  }, [listLearning])

  const handleCloseModal = useCallback(() => {
    setShowResult(false);
    const listSeven = getSevenFromList(
      listAllQuestion.filter((item) => {
        return item.learnedListening === false;
      })
    );
    if (listSeven.length === 0) {
      navigate('/course/' + id);
    }
    setListLearning(listSeven);
    setCloneListLearning(listSeven);
    setIndexSelectQuestion(0);
    speechAnswer(listSeven[0])
    clearField()
  }, [listLearning, listAllQuestion, cloneListLearning, cloneListLearning, indexSelectQuestion, showResult])

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
        <Modal
          onClose={handleCloseModal}
          closeButton
          open={showResult}
          scroll
          width="900px"
        >
          <Modal.Header>
            <Text id="modal-title" size={18}>
              Result your learning
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Grid.Container gap={2}>
              {cloneListLearning.length > 0 &&
                cloneListLearning.map((item, index) => (
                  <Grid key={index} xs={12}>
                    <Card variant={'bordered'} borderWeight={'normal'}>
                      <Card.Body>
                        <Text size={14} css={{ whiteSpace: 'pre-wrap' }}>
                          {item.question}
                        </Text>
                        <Spacer />
                        <Text size={14}>
                          <strong>Answer: {item.answer}</strong>
                        </Text>
                      </Card.Body>
                    </Card>
                  </Grid>
                ))}
            </Grid.Container>
          </Modal.Body>
        </Modal>
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
              <Text size={20}>
                <strong>Word № {indexSelectQuestion + 1}:</strong>{' '}
              </Text>
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
            {/* <Text
                size={20}
                css={{
                  whiteSpace: 'pre-line',
                  padding: 20,
                }}
                icon = {<FcAudioFile size={30}/>}
              >
                {listLearning[indexSelectQuestion] &&
                  listLearning[indexSelectQuestion].question}
              </Text>
               */}
            <FcAudioFile size={150} onClick={() => speechAnswer(listLearning[indexSelectQuestion])} />
            <Spacer y={2} />
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
                    onPress={handleNextButtonPress}
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
          </Card.Body>
        </Card>
      </Fragment>
    </div>
  );
};

export default Listening;
