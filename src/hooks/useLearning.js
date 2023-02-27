import { useEffect, useReducer } from "react";

function getAllQuestions() {
  const allQuestions = JSON.parse(localStorage.getItem(id)).data.map((item) => {
    item.isWatched = false;
    item.count = 0;
    item.writtenCount = 0;
    item.isTested = false;
    return item;
  })
  return {
    listAllQuestion: allQuestions,
    totalAnswer: allQuestions.filter((item) => item.learned === true).length
  }
}
const initStates = {
  base: getAllQuestions(),
  listLearning: [],
  cloneListLearning: [],
  isNotCorrect: false,
  numberLearning: 0,
  selectAnswer: undefined,
  listAnswer: [],
  isShuffled: true,
  isShowRightAnswer: false
}

const reducer = (state, action) => {
  return state
}

const useLearning = () => {
  const [state, dispatch] = useReducer(reducer, initStates)
}