import { useRef, useReducer, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

const learnedCondition = (item) => item.learned === true
const getUnWatched = (questions) => {
  const unWatched = questions.filter(item => !item.isWatched)
  if (unWatched.length == 0) {
    return questions.filter((item) => !learnedCondition(item))
  }
  return unWatched.filter((item) => !learnedCondition(item))
}

function initStates(allQuestions) {
  const unlearned = allQuestions.filter((item) => !learnedCondition(item));
  const random = Math.floor(Math.random() * unlearned.length);
  //установим первый элемент из рабочей пачки как просмотренный
  allQuestions.map((item) => {
    if (item.i === unlearned[random].i) item.isWatched = true;
    return item;
  })

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
    isShowRightAnswer: false
  }
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

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const updateLocalStorage = (id) => {
  const temp = JSON.parse(localStorage.getItem(id));
  temp.data = listAllQuestion;
  localStorage.setItem(id, JSON.stringify(temp));
}

const updateListLocalStorage = () => {
  listAllQuestion.forEach((element) => {
    if (element.learned) {
      delete element.count; // перенести в learned
    }
  });
  updateLocalStorage(id)
  setTotalAnswer(
    JSON.parse(localStorage.getItem(id)).data.filter(
      (item) => item.learned === true
    ).length
  );
};

const reducer = (state, action) => {

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
      }
    }
    //добавляем РАНДОМНО новый термин из неусвоенных ранее
    case 'ADD_TERM_TO_BATCH': {
      const random = Math.floor(Math.random() * action.terms.length);
      return {
        ...state,
        listLearning: [action.terms[random]],
        listAllQuestion: state.listAllQuestion.map(
          (item) => {
            if (item.i === unlearned[random].i) item.isWatched = true;
            return item;
          })
      }
    }
    case 'REMOVE_ANSWERED_TERM': {
      return {
        ...state,
        listLearning: state.listLearning.slice(1)
      }
    }
  }
  return state
}

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
    initStates)
  const batchSizeRef = useRef();

  const updateBatches = useCallback(() => {
    //Чтобы запомнить, нужно "отработать"(слух, письмо) термины рабочей пачки
    //несколько раз и без ошибок
    if (state.cloneListLearning.length == batchSizeRef.current.value
      && state.listLearning.length - 1 == 0) {
      dispatch({ type: 'RESET_BUFFER_BATCH' })
    }
    //если рабочая пачку пустая, то нужно добавить новое слово,
    //которое не было просмотрено и соответственно не было выучено ранее
    else if (state.listLearning.length - 1 == 0) {
      const unWatched = getUnWatched(state.listAllQuestion)
      dispatch({ type: 'ADD_TERM_TO_BATCH', terms: unWatched })
    }
    //убираем из рабочей пачки термин на который был получен ответ, 
    //т.к. даже если этот термин не был усвоен, то он попадёт на следующей итерации в
    //рабочую пачку
    else {
      dispatch({ type: 'REMOVE_ANSWERED_TERM' })
    }
  }, [state.cloneListLearning, state.listLearning, state.listAllQuestion])
}