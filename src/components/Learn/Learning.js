import {
  Card,
  Spacer,
  Progress,
} from "@nextui-org/react";
import { Fragment, useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderEducation from "../HeaderEducation/HeaderEducation";
import LetsTryAgain from "../TryAgain/TryAgain";
import classes from "./Learn.module.css";
import ContentQuestion from '../Question/ContentQuestion'
import AnswerChoice from '../Answer/AnswerChoice'
import AnswerInput from '../Answer/AnswerInput'
import Analyze from "../Analyze/Analyze";
import ManageProcess from "../EducationManagement/ManageProcess";
import ReactGA from "react-ga4";

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const Learning = () => {
  // init react-router-dom
  const { id } = useParams();
  const navigate = useNavigate();

  // init state
  const [listAllQuestion, setListAllQuestion] = useState(
    JSON.parse(localStorage.getItem(id)).data.map((item) => {
      item.isWatched = false;
      item.count = 0;
      item.writtenCount = 0;
      item.isTested = false;
      return item;
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
  const [isShuffled, setIsShuffled] = useState(true);
  const [isShowRightAnswer, setShowIsRightAnswer] = useState(false);
  //const [isAlmostCorrectWord, seIsAlmostCorrectWord] = useState(false);
  const answerRef = useRef();
  const batchSizeRef = useRef();

  useEffect(() => {
    const unlearned = listAllQuestion.filter((item) => item.learned === false);
    if (unlearned.length === 0) {
      navigate("/course/" + id);
    }
    const random = Math.floor(Math.random() * unlearned.length);
    setTotalAnswer(
      listAllQuestion.filter((item) => item.learned === true).length
    );
    setListLearning([unlearned[random]]);
    setListAllQuestion((prev) =>
      prev.map((item) => {
        if (item.i === unlearned[random].i) item.isWatched = true;
        return item;
      })
    );
    setIndexSelectQuestion(0);
    batchSizeRef.current.value = 7
    ReactGA.event({
      category: "Learning",
      action:
        "Learning question in set " +
        JSON.parse(localStorage.getItem(id))?.name,
    });
  }, []);

  useEffect(() => {
    const unlearned = listAllQuestion.filter((item) => item.learned === false);
    if (unlearned.length === 0) {
      updateListLocalStorage();
      navigate("/course/" + id);
    }
  }, [listAllQuestion]);

  // load question and answer to card on indexSelectQuestion change
  useEffect(() => {
    setSelectAnswer(undefined);
    setIsNotCorrect(false);
    if (listLearning.length > 0) {
      setListAnswer(generateAnswer(listLearning[indexSelectQuestion].answer));
    }
  }, [indexSelectQuestion, listLearning]);

  useEffect(() => {
    const learned = listAllQuestion.filter((item) => item.learned === true);
    const totalL = learned.length;

    setNumberLearning((listAllQuestion.length * totalL) / 100);
  }, [selectAnswer, listAllQuestion]);

  const clearField = () => {
    answerRef.current.value = "";
    answerRef.current.focus();
  };

  // function and handler
  const generateAnswer = (answer) => {
    const listAns = listAllQuestion.map((item) => item.answer.trim());
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

    if (key === listLearning[indexSelectQuestion].answer) {
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
        setCloneListLearning((prev) => {
          prev.push(listLearning[indexSelectQuestion]);
          return prev;
        });
      } else {
        setListAllQuestion((prev) =>
          prev.map((item) => {
            if (item.i === listLearning[indexSelectQuestion].i) {
              //item.learned = true
              console.log(item);
              return listLearning[indexSelectQuestion];
            }
            return item;
          })
        );
        setCloneListLearning((prev) => {
          prev.push(listLearning[indexSelectQuestion]);
          return prev;
        });
      }
      setTimeout(() => {
        updateBatches();
        if (listLearning[indexSelectQuestion].count == 2) {
          listLearning[indexSelectQuestion].isTested = true;
        }
      }, 500);
    } else {
      listLearning[indexSelectQuestion].lastIncorrect = true;
      setIsNotCorrect(true);
    }
  };

  const updateBatches = useCallback(() => {
    if (cloneListLearning.length == batchSizeRef.current.value && listLearning.length - 1 == 0) {
      isShuffled && shuffleArray(cloneListLearning)
      setListLearning(cloneListLearning);
      setCloneListLearning([]);
      updateListLocalStorage();
    } else if (listLearning.length - 1 == 0) {
      let unlearned = listAllQuestion.filter(
        (item) => item.learned === false && !item.isWatched
      );
      if (unlearned.length == 0) {
        unlearned = listAllQuestion.filter((item) => item.learned === false);
      }
      const random = Math.floor(Math.random() * unlearned.length);
      setListLearning([unlearned[random]]);
      setListAllQuestion((prev) =>
        prev.map((item) => {
          if (item.i === unlearned[random].i) item.isWatched = true;
          return item;
        })
      );
    } else {
      setListLearning((prev) => prev.slice(1));
    }
  }, [cloneListLearning, listLearning, listAllQuestion]);

  const handleNextButtonPress = () => {
    listLearning[indexSelectQuestion].lastIncorrectClone =
      listLearning[indexSelectQuestion].lastIncorrect;
    setCloneListLearning((prev) => {
      prev.push(listLearning[indexSelectQuestion]);
      return prev;
    });
    updateBatches();
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (
        answerRef.current.value &&
        answerRef.current.value.length > 0 &&
        event.key === "Enter"
      ) {
        isNotCorrect && handleInputNextButtonPress();
        setSelectAnswer(answerRef.current.value);

        if (
          answerRef.current.value.toLowerCase() ===
          listLearning[indexSelectQuestion].answer.toLowerCase()
        ) {
          listLearning[indexSelectQuestion].writtenCount =
            listLearning[indexSelectQuestion].writtenCount + 1;
          listLearning[indexSelectQuestion].lastIncorrect = undefined;

          setShowIsRightAnswer(true);

          listLearning[indexSelectQuestion].lastIncorrectClone =
            listLearning[indexSelectQuestion].lastIncorrect;

          if (listLearning[indexSelectQuestion].writtenCount < 2) {
            setCloneListLearning((prev) => {
              console.log(`prev`);
              console.log(prev);
              prev.push(listLearning[indexSelectQuestion]);
              return prev;
            });
          } else {
            console.log("Выучил слово");
            setListAllQuestion((prev) =>
              prev.map((item) => {
                if (item.i === listLearning[indexSelectQuestion].i) {
                  item.learned = true;
                  console.log(item);
                }
                return item;
              })
            );
          }
          setTimeout(() => {
            updateInputBatches();
            setShowIsRightAnswer(false);
            clearField();
          }, 1000);
        } else {
          listLearning[indexSelectQuestion].lastIncorrect = true;

          setIsNotCorrect(true);
          //seIsAlmostCorrectWord(true);
        }
      }
    },
    [listLearning, isNotCorrect, indexSelectQuestion]
  );

  const handleRightAnswer = useCallback(() => {
    listLearning[indexSelectQuestion].writtenCount =
      listLearning[indexSelectQuestion].writtenCount + 1;
    listLearning[indexSelectQuestion].lastIncorrect = undefined;

    listLearning[indexSelectQuestion].lastIncorrectClone =
      listLearning[indexSelectQuestion].lastIncorrect;
    if (listLearning[indexSelectQuestion].writtenCount < 2) {
      setCloneListLearning((prev) => {
        console.log(`prev`);
        console.log(prev);
        prev.push(listLearning[indexSelectQuestion]);
        return prev;
      });
    } else {
      console.log("Выучил слово");
      setListAllQuestion((prev) =>
        prev.map((item) => {
          if (item.i === listLearning[indexSelectQuestion].i) {
            item.learned = true;
            console.log(item);
          }
          return item;
        })
      );
    }

    setTimeout(() => {
      updateInputBatches();
      setIsNotCorrect(false);
      //seIsAlmostCorrectWord(false);
      clearField();
    }, 1000);
  }, [listLearning, indexSelectQuestion]);

  const handleInputNextButtonPress = () => {
    listLearning[indexSelectQuestion].lastIncorrectClone =
      listLearning[indexSelectQuestion].lastIncorrect;
    listLearning[indexSelectQuestion].writtenCount = 0;
    setCloneListLearning((prev) => {
      prev.push(listLearning[indexSelectQuestion]);
      return prev;
    });
    updateInputBatches();
    clearField();
  };

  const updateInputBatches = useCallback(() => {
    if (cloneListLearning.length == batchSizeRef.current.value && listLearning.length - 1 == 0) {
      isShuffled && shuffleArray(cloneListLearning)
      setListLearning(cloneListLearning);
      setCloneListLearning([]);
      updateListLocalStorage();
    } else if (listLearning.length - 1 == 0) {
      let unlearned = listAllQuestion.filter((item) => item.learned === false);
      /*if (unlearned.length == 0) {
        unlearned = listAllQuestion.filter(item => item.learned === false)
      }*/
      const random = Math.floor(Math.random() * unlearned.length);
      setListLearning([unlearned[random]]);
      setListAllQuestion((prev) =>
        prev.map((item) => {
          if (item.i === unlearned[random].i) item.isWatched = true;
          return item;
        })
      );
    } else {
      console.log(listLearning);
      setListLearning((prev) => prev.slice(1));
    }
  }, [cloneListLearning, listLearning, listAllQuestion]);

  const isTryAgain = () =>
    listLearning[indexSelectQuestion] !== undefined &&
    listLearning[indexSelectQuestion].lastIncorrectClone !== undefined;

  const readQuestion = () =>
    listLearning[indexSelectQuestion] &&
    listLearning[indexSelectQuestion].question;

  return (
    <div className={classes.main}>
      <Analyze
        totalAnswers={totalAnswer}
        allQuestions={listAllQuestion.length}
      />
      <ManageProcess 
        batchSizeRef={batchSizeRef} 
        isShuffled={isShuffled} 
        setIsShuffled={setIsShuffled}
      />
      <Progress
        css={{
          position: "fixed",
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
        <HeaderEducation navigate={navigate} id={id} quitEducateLabel={'Quit learn'} />
        <Spacer y={2} />
        <Card>
          <Card.Body>
            {isTryAgain() && <LetsTryAgain />}
            <ContentQuestion readQuestion={readQuestion}/>

            <Spacer y={2} />
            {listLearning[indexSelectQuestion] &&
              !listLearning[indexSelectQuestion].isTested && (
                <AnswerChoice 
                  listAnswer={listAnswer}
                  selectAnswer={selectAnswer}
                  isNotCorrect={isNotCorrect}
                  question={listLearning[indexSelectQuestion]}
                  handleNextButtonPress={handleNextButtonPress}
                  handleCardAnswerPress={handleCardAnswerPress}
                />
              )}
            {listLearning[indexSelectQuestion] &&
              listLearning[indexSelectQuestion].isTested && (
                <AnswerInput 
                  question={listLearning[indexSelectQuestion]}
                  answerRef={answerRef}
                  isShowRightAnswer={isShowRightAnswer}
                  isNotCorrect={isNotCorrect}
                  handleKeyDown={handleKeyDown}
                  handleRightAnswer={handleRightAnswer}
                  handleNextButtonPress={handleInputNextButtonPress}
                />
              )}
          </Card.Body>
        </Card>
      </Fragment>
    </div>
  );
};

export default Learning;
