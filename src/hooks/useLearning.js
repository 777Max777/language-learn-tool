import { useRef, useReducer, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

//----------------------------------------------------------------
const learnedCondition = (item) => item.learned === true;
const isWatched = (bufferBatch, term) =>
  bufferBatch.find((bufItem) => bufItem.i === term.i) != undefined;
//-----------------------------------------------------------------
const getUnWatched = (questions) => {
  const unWatched = questions.filter((item) => !item.isWatched);
  if (unWatched.length == 0) {
    return questions.filter((item) => !learnedCondition(item));
  }
  return unWatched.filter((item) => !learnedCondition(item));
};
//найти РАНДОМНО новый термин из неусвоенных ранее
const getRandomUnWatchedTerm = (questions) => {
  const unWatched = getUnWatched(questions);
  const random = Math.floor(Math.random() * unWatched.length);
  return unWatched[random];
};
//------------------------------------------------------------------
const getRandomUnlearnedTerm = (questions, bufferBatch) => {
  const unlearned = questions.filter(
    (item) => !learnedCondition(item) && !isWatched(bufferBatch, item)
  ); //чтобы исключить возможность попадания термина из уже изучаемых

  const random = Math.floor(Math.random() * unlearned.length);
  return unlearned[random];
};

const ADD_TERM_TO_BUFFER = term => state => state.cloneListLearning.push(term)

//----------------------------------------------------------------------

function initStates(allQuestions) {
  const unlearned = allQuestions.filter((item) => !learnedCondition(item));
  const random = Math.floor(Math.random() * unlearned.length);
  //установим первый элемент из рабочей пачки как просмотренный
  allQuestions.map((item) => {
    if (item.i === unlearned[random].i) item.isWatched = true;
    return item;
  });

  return {
    listAllQuestion: allQuestions,
    totalAnswer: allQuestions.filter(learnedCondition).length,
    listLearning: [unlearned[random]],
    cloneListLearning: [],
    isNotCorrect: false,
    numberLearning: 0,
    selectAnswer: undefined,
    listAnswer: generateAnswer(allQuestions, unlearned[random]),
    isShuffled: true,
    isShowRightAnswer: false,
  };
}

const generateAnswer = (listAllQuestion, answer) => {
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

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

const updateLocalStorage = (id) => {
  const temp = JSON.parse(localStorage.getItem(id));
  temp.data = listAllQuestion;
  localStorage.setItem(id, JSON.stringify(temp));
};

const updateListLocalStorage = () => {
  listAllQuestion.forEach((element) => {
    if (element.learned) {
      delete element.count; // перенести в learned
    }
  });
  updateLocalStorage(id);
  setTotalAnswer(
    JSON.parse(localStorage.getItem(id)).data.filter(
      (item) => item.learned === true
    ).length
  );
};

const reducer = (state, action) => {
  const sideStateActions = action.payload.sideStateActions;
  if (sideStateActions && sideStateActions.length > 0) {
    sideStateActions.forEach(fn => fn(state))
  }
  const data = action.payload.data;
  switch (action.type) {
    //устанавливаем новую рабочую пачку для изучения после предыдущей итерации обучения
    //буферная пачка хранит неусвоенные ранее термины
    case 'RESET_BUFFER_BATCH': {
      state.isShuffled && shuffleArray(state.cloneListLearning)
      return {
        ...state,
        listLearning: state.cloneListLearning,
        cloneListLearning: [],
        totalAnswer: state.listAllQuestion.filter(learnedCondition).length
      };
    }
    case "SET_WORKING_BATCH": {
      return {
        ...state,
        listLearning: data.terms,
      };
    }
    case "SET_TERM_WATCHED": {
      return {
        ...state,
        listAllQuestion: state.listAllQuestion.map((item) => {
          if (item.i === data.term.i) item.isWatched = true;
          return item;
        }),
      };
    }
    case "REMOVE_ANSWERED_TERM": {
      return {
        ...state,
        listLearning: state.listLearning.slice(1),
      };
    }
    case "REFRESH_TERM": {
      return {
        ...state,
        listAllQuestion: state.listAllQuestion.map(data.mapper),
      };
    }
    case "UPDATE_CARD_ANSWERS": {
      return {
        ...state,
        selectAnswer: undefined,
        isNotCorrect: false,
        listAnswer: data.answers ? data.answers : state.listAnswer,
      };
    }
    case "RESET_CORRECT_TERM_FLAG": {
      return {
        ...state,
        selectAnswer: undefined,
        isNotCorrect: false,
      };
    }
    case "SET_INCORRECT_TERM_FLAG": {
      return {
        ...state,
        selectAnswer: data.answer ? data.answer : state.selectAnswer,
        isNotCorrect: true,
      };
    }
    case "SET_CORRECT_TERM_FLAG": {
      return {
        ...state,
        selectAnswer: data.answer,
      };
    }
  }
  return state;
};

const useLearning = () => {
  const { id } = useParams();
  const [state, dispatch] = useReducer(
    reducer,
    JSON.parse(localStorage.getItem(id)).data.map((item) => {
      item.isWatched = false;
      item.count = 0;
      item.writtenCount = 0;
      item.isTested = false;
      return item;
    }),
    initStates
  );
  const batchSizeRef = useRef();
  const curTerm = state.listLearning[0];

  const updateBatches = useCallback(() => {
    //Чтобы запомнить, нужно "отработать"(слух, письмо) термины рабочей пачки
    //несколько раз и без ошибок
    if (
      batchSizeRef.current.value == state.cloneListLearning.length + 1 &&
      state.listLearning.length - 1 == 0
    ) {
      dispatch({
        type: "RESET_BUFFER_BATCH",
        payload: { sideStateActions: [() => ADD_TERM_TO_BUFFER(curTerm)] },
      });
      updateLocalStorage(id);
    }
    //если рабочая пачка пустая, то нужно добавить новое слово,
    //которое НЕ БЫЛО просмотрено и соответственно НЕ БЫЛО выучено ранее
    else if (state.listLearning.length - 1 == 0) {
      //const newTerm = getRandomUnWatchedTerm(state.listAllQuestion);
      //dispatch({ type: "SET_TERM_WATCHED", term: newTerm });
      const newTerm = getRandomUnlearnedTerm(
        state.listAllQuestion,
        state.cloneListLearning
      );
      dispatch({
        type: "SET_WORKING_BATCH",
        payload: { 
          data: { terms: [newTerm] },
          sideStateActions: [() => ADD_TERM_TO_BUFFER(curTerm)]
        },
      });
    }
    //убираем из рабочей пачки термин на который был получен ответ,
    //т.к. даже если этот термин не был усвоен, то он попадёт на следующей итерации в
    //рабочую пачку
    else {
      dispatch({
        type: "REMOVE_ANSWERED_TERM",
        payload: { sideStateActions: [() => ADD_TERM_TO_BUFFER(curTerm)] }
      });
    }
  }, [state.cloneListLearning, state.listLearning, state.listAllQuestion]);

  const refreshTermInQuestionList = (term) => {
    const refreshPredicate = (item) => {
      if (item.i === term.i) {
        return term;
      }
      return item;
    };
    dispatch({
      type: "REFRESH_TERM",
      payload: { data: { mapper: refreshPredicate } },
    });
  };

  //------------------ACTIONS CONTROLLER-----------------------------------------
  useEffect(() => {
    if (curTerm.isTested) {
      dispatch({ type: "RESET_CORRECT_TERM_FLAG" });
    } else {
      dispatch({
        type: "UPDATE_CARD_ANSWERS",
        payload: {
          data: {
            answers: generateAnswer(state.listAllQuestion, curTerm.answer),
          },
        },
      });
    }
  }, [state.listLearning]);

  const handleCardAnswerPress = (key) => {
    if (key === curTerm.answer) {
      curTerm.count++;
      curTerm.lastIncorrect = undefined;
      curTerm.lastIncorrectClone = undefined;
      dispatch({
        type: "SET_CORRECT_TERM_FLAG",
        payload: { data: { answer: key } },
      });
      setTimeout(() => {
        updateBatches();
        if (curTemp.count == 2) {
          curTemp.isTested = true;
        }
      }, 500);
    } else {
      curTerm.lastIncorrect = true;
      dispatch({
        type: "SET_INCORRECT_TERM_FLAG",
        payload: { data: { answer: key } },
      });
    }


  };
};
