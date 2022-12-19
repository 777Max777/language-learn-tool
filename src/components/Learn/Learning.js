import {
  Button,
  Card,
  Grid,
  Spacer,
  Text,
  Progress,
} from '@nextui-org/react';
import { Fragment, useEffect, useState } from 'react';
import Testing from "./Testing/Testing"
import { useParams, useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';
import classes from './Learn.module.css';
import ReactGA from 'react-ga4';

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
    if (cloneListLearning.length > 0) {
      const countLearn = cloneListLearning.filter((item) => {
        return item.count === 2;
      }).length;
      const totalL = cloneListLearning.length;

      setNumberLearning((countLearn * 100) / totalL);
    }
  }, [selectAnswer]);

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
      if (element.count === 2) {
        element.learned = true;
      }
      delete element.count;
    });
    const temp = JSON.parse(localStorage.getItem(id));
    temp.data = listAllQuestion;
    localStorage.setItem(id, JSON.stringify(temp));
    setTotalAnswer(
      JSON.parse(localStorage.getItem(id)).data.filter(
        (item) => item.learned === true
      ).length
    );
  };

  const handleCardAnswerPress = (key) => {
    setSelectAnswer(key);

    if (
      key ===
      listLearning[indexSelectQuestion].answer
    ) {
      listLearning[indexSelectQuestion].count =
        listLearning[indexSelectQuestion].count + 1;
      listLearning[indexSelectQuestion].lastIncorrect = undefined;

      setTimeout(() => {
        listLearning[indexSelectQuestion].lastIncorrectClone =
          listLearning[indexSelectQuestion].lastIncorrect;
        if (indexSelectQuestion !== listLearning.length - 1) {
          setIndexSelectQuestion(indexSelectQuestion + 1);
        } else {
          repeatListLearning();
        }
      }, 500);
    } else {
      listLearning[indexSelectQuestion].lastIncorrect = true;
      setIsNotCorrect(true);
    }
  };

  const handleNextButtonPress = () => {
    listLearning[indexSelectQuestion].lastIncorrectClone =
      listLearning[indexSelectQuestion].lastIncorrect;
    if (indexSelectQuestion !== listLearning.length - 1) {
      setIndexSelectQuestion(indexSelectQuestion + 1);
    } else {
      repeatListLearning();
    }
  };

  const repeatListLearning = () => {
    const t = listLearning.filter((item) => {
      return item.count <= 1;
    });
    if (t.length === 0) {
      updateListLocalStorage();
    } else {
      setListLearning(t);
      setIndexSelectQuestion(0);
    }
  };

  const logicLearn = (word) => {
    
  }

  const Writing = () => {
    return(<></>)
  }

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
            <Testing props={answers}/>
            {false && <Writing />}
          </Card.Body>
        </Card>
      </Fragment>
    </div>
  );
}