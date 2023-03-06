import { shuffleArray } from '../actions/TestController'

//чтобы редьюсер отрабатывал корректно необходимо чтобы 
//в action было передано обязательно payload
export default function reducer(state, action) {
  const sideStateActions = action.payload.sideStateActions
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
        totalAnswer: state.listAllQuestion.filter(data.predicate).length
      };
    }
    case "SET_WORKING_BATCH": {
      return {
        ...state,
        listLearning: data.terms,
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
        totalAnswer: state.listAllQuestion.filter(data.predicate).length
      };
    }
    case "UPDATE_CARD_ANSWERS": {
      return {
        ...state,
        selectAnswer: undefined,
        isNotCorrect: false,
        listAnswer: data && data.answers ? data.answers : state.listAnswer,
      };
    }
    case "RESET_CORRECT_TERM_FLAG": {
      return {
        ...state,
        selectAnswer: undefined,
        isNotCorrect: false,
        isShowRightAnswer: false
      };
    }
    case "SET_INCORRECT_TERM_FLAG": {
      return {
        ...state,
        selectAnswer: data && data.answer ? data.answer : state.selectAnswer,
        isNotCorrect: true
      };
    }
    case "SET_CORRECT_TERM_FLAG": {
      return {
        ...state,
        selectAnswer: data && data.answer ? data.answer : state.selectAnswer,
        isShowRightAnswer: data && data.isShowRightAnswer ? data.isShowRightAnswer : state.isShowRightAnswer
      };
    }
    case 'CHANGE_SHUFFLED': {
      return {
        ...state,
        isShuffled: !state.isShuffled
      }
    }
    case 'SET_BATCH_NUMBER_PROGRESS': {
      return {
        ...state,
        numberLearning: data && data.progress
      }
    }
    case 'CHANGE_BATCHE_SIZE': {
      return {
        ...state,
        batchSize: data && data.batchSize ? data.batchSize : state.batchSize,
        listLearning: data && data.workingBatch ? data.workingBatch : state.listLearning,
        cloneListLearning: data && data.bufferBatch ? data.bufferBatch : state.cloneListLearning
      }
    }
  }
  return state;
};
