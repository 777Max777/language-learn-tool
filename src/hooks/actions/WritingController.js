import { useRef } from 'react'

const useWritingActions = (curTerm, dispatch, updateBatches, refreshTermInQuestionList) => {
  const answerRef = useRef();
  
  const handleKeyDown = event => {
    if (
      answerRef.current.value &&
      answerRef.current.value.length > 0 &&
      event.key === "Enter"
    ) {
      if (
        answerRef.current.value.toLowerCase() ===
        curTerm.answer.toLowerCase()
      ) {
        correctWordProcess()
      } else {
        curTerm.lastIncorrect = true;
        curTerm.lastIncorrectClone = true
        dispatch({ type: "SET_INCORRECT_TERM_FLAG", payload: {} });
      }
    }
  }

  const correctWordProcess = () => {
    curTerm.writtenCount++;
    curTerm.lastIncorrect = undefined;
    curTerm.lastIncorrectClone = undefined;
    if (curTerm.writtenCount == 2) {
      curTerm.learned = true;
      delete curTerm.count
      delete curTerm.writtenCount
      refreshTermInQuestionList(curTerm)
    }
    dispatch({
      type: "SET_CORRECT_TERM_FLAG",
      payload: { data: { isShowRightAnswer: true } },
    });
    setTimeout(() => {
      updateBatches();
      clearField();
    }, 1000);
  }

  const handleRightAnswer = () => {
    correctWordProcess()
  }

  const handleInputNextButtonPress = () => {
    curTerm.writtenCount = 0
    updateBatches();
    clearField();
  }

  const clearField = () => {
    answerRef.current.value = "";
    answerRef.current.focus();
  };

  return {
    handleKeyDown, 
    handleRightAnswer, 
    handleInputNextButtonPress, 
    answerRef
  }
}

export default useWritingActions