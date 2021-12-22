const useAutoGenerate = () => {
  const baseString = () => Math.random().toString(36).substring(2, 8);
  const baseLength = 7;
  return (length) => {
    let exampleString = "";
    for (let i = 0; i < length / baseLength; i++) {
      exampleString += baseString();
    }
    return exampleString.substring(0, length - 1);
  };
};

export default useAutoGenerate;
