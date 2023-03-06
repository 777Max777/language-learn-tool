
export const generateAnswer = (listAllQuestion, answer) => {
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

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

const useTestActions = (curTerm, dispatch, updateBatches) => {

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
        if (curTerm.count == 2) {
          curTerm.isTested = true;
        }
      }, 500);
    } else {
      curTerm.lastIncorrect = true;
      curTerm.lastIncorrectClone = true;
      dispatch({
        type: "SET_INCORRECT_TERM_FLAG",
        payload: { data: { answer: key } },
      });
    }
  }

  const handleNextButtonPress = () => {
    updateBatches()
  }
  return { handleCardAnswerPress, handleNextButtonPress} 
}

export default useTestActions