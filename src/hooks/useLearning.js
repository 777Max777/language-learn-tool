import { useEffect, useReducer } from "react";

function initStates(allQuestions) {
  const unlearned = allQuestions.filter((item) => item.learned === false);
  const random = Math.floor(Math.random() * unlearned.length);
  //установим первый элемент из рабочей пачки как просмотренный
  allQuestions.map((item) => {
    if (item.i === unlearned[random].i) item.isWatched = true;
    return item;
  })

  return {
    listAllQuestion: allQuestions,
    totalAnswer: allQuestions.filter((item) => item.learned === true).length,
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

const reducer = (state, action) => {
  return state
}

const useLearning = () => {
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

}