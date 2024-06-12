function allInputsMustExist(inputCriteria) {
  const { muscle, difficulty, type } = inputCriteria;

  if (
    !muscle ||
    muscle === "default" ||
    !difficulty ||
    difficulty === "default" ||
    !type ||
    type === "default"
  ) {
    return false;
  }

  return true;
}

export default allInputsMustExist;
