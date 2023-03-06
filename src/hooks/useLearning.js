import { useRef, useReducer, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateAnswer } from './actions/TestController'
import reducer from './reducers/learn.reducer'
//----------------------------------------------------------------
//чтобы исключить возможность попадания термина из уже изучаемых
const isWatched = (batch, term) =>
  batch.find((bufItem) => bufItem.i === term.i) != undefined;
//------------------------------------------------------------------
const getRandomUnlearnedTerm = (questions, batches, learnedCondition) => {
  let unlearned = questions.filter(
    (item) => !learnedCondition(item) && !isWatched(batches, item)
  );
  if (unlearned.length == 0) {
    unlearned = questions.filter(item => !learnedCondition(item))
  }
  const random = Math.floor(Math.random() * unlearned.length);
  return unlearned[random];
};

const ADD_TERM_TO_BUFFER = term => state => state.cloneListLearning.push(term)
//----------------------------------------------------------------------

function initStates({ learnQuestions: allQuestions, learnedCondition }) {
  const unlearned = allQuestions.filter((item) => !learnedCondition(item));
  const random = Math.floor(Math.random() * unlearned.length);
  return {
    listAllQuestion: allQuestions,
    totalAnswer: allQuestions.filter(learnedCondition).length,
    listLearning: [unlearned[random]],
    cloneListLearning: [],
    isNotCorrect: false,
    numberLearning: 0,
    batchSize: 7,
    selectAnswer: undefined,
    listAnswer: generateAnswer(allQuestions, unlearned[random].answer),
    isShuffled: true,
    isShowRightAnswer: false,
  };
}

const updateLocalStorage = (id, listAllQuestion) => {
  const temp = JSON.parse(localStorage.getItem(id));
  temp.data = listAllQuestion;
  localStorage.setItem(id, JSON.stringify(temp));
};

export default function useLearning(id, learnQuestions, learnedCondition) {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, { learnQuestions, learnedCondition }, initStates)
  const curTerm = state.listLearning[0];

  const updateBatches = useCallback(() => {
    const defaultSideStateActions = learnedCondition(curTerm)
      ? undefined
      : [ADD_TERM_TO_BUFFER(curTerm)]
    //Чтобы запомнить, нужно "отработать"(слух, письмо) термины рабочей пачки
    //несколько раз и без ошибок
    if (
      state.batchSize <= state.cloneListLearning.length + 1
      && state.listLearning.length - 1 == 0
      //&& state.batchSize != 1 
    ) {
      dispatch({
        type: "RESET_BUFFER_BATCH",
        payload: {
          sideStateActions: defaultSideStateActions,
          data: { predicate: learnedCondition }
        },
      });
      updateLocalStorage(id, state.listAllQuestion);
    }
    //если рабочая пачка пустая, то нужно добавить новое слово,
    //которое НЕ БЫЛО просмотрено и соответственно НЕ БЫЛО выучено ранее
    else if (state.listLearning.length - 1 == 0) {
      const newTerm = getRandomUnlearnedTerm(
        state.listAllQuestion,
        [...state.listLearning, ...state.cloneListLearning],
        learnedCondition
      );
      dispatch({
        type: "SET_WORKING_BATCH",
        payload: {
          data: { terms: [newTerm] },
          sideStateActions: defaultSideStateActions
        },
      });
    }
    //убираем из рабочей пачки термин на который был получен ответ,
    //т.к. даже если этот термин не был усвоен, то он попадёт на следующей итерации в
    //рабочую пачку
    else {
      dispatch({
        type: "REMOVE_ANSWERED_TERM",
        payload: { sideStateActions: defaultSideStateActions }
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
      payload: {
        data: {
          mapper: refreshPredicate,
          predicate: learnedCondition
        }
      },
    });
  };

  const setIsShuffled = () => {
    dispatch({ type: 'CHANGE_SHUFFLED', payload: {} })
  }

  //------------------ACTIONS CONTROLLER-----------------------------------------

  useEffect(() => {
    const unlearned = state.listAllQuestion.filter((item) => !learnedCondition(item));
    if (unlearned.length === 0) {
      updateLocalStorage(id, state.listAllQuestion);
      navigate("/course/" + id);
    }
  }, [state.listAllQuestion]);

  const batchSizeChangeHandler = useCallback(changedSize => {
    if (changedSize) {
      const batchSize = state.batchSize
      console.log('Batch size = ' + batchSize + ', changedSize = ' + changedSize)
      const re = /^[0-9\b]+$/;
      if (re.test(changedSize)) {
        const newBatchSize = parseInt(changedSize)
        if (newBatchSize != 0 && newBatchSize < batchSize) {
          let bufferBatch, workingBatch
          if (state.listLearning.length > newBatchSize) {
            workingBatch = state.listLearning.splice(0, newBatchSize)
          }
          if (state.cloneListLearning.length > newBatchSize) {
            bufferBatch = []
          }
          dispatch({
            type: 'CHANGE_BATCHE_SIZE',
            payload: {
              data: {
                batchSize: newBatchSize,
                workingBatch: workingBatch,
                bufferBatch: bufferBatch
              }
            }
          })
        } else if (newBatchSize != 0) {
          dispatch({
            type: 'CHANGE_BATCHE_SIZE',
            payload: {
              data: {
                batchSize: newBatchSize
              }
            }
          })
        }
      }
    }
  }, [state.batchSize, state.listLearning, state.cloneListLearning])

  useEffect(() => {
    const workingBatch = state.listLearning.length
    const bufferBatch = state.cloneListLearning.length

    const fullAmount = state.batchSize
    console.log('workingBatch = ', + workingBatch
      + ', bufferBatch = ', + bufferBatch
      + ', BufferSize = ' + fullAmount)
    let batchProgress
    if (workingBatch - 1 == 0
      && bufferBatch < fullAmount) {
      batchProgress = ((bufferBatch + workingBatch - 1) * 100) / fullAmount
    } else {
      batchProgress = ((fullAmount - workingBatch) * 100) / fullAmount
    }
    dispatch({ type: 'SET_BATCH_NUMBER_PROGRESS', payload: { data: { progress: batchProgress } } })
  }, [state.listLearning, state.cloneListLearning])

  return {
    setIsShuffled,
    dispatch,
    updateBatches,
    refreshTermInQuestionList,
    batchSizeChangeHandler,
    curTerm,
    state
  }
}
