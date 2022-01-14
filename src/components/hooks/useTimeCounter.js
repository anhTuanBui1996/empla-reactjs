import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTimeNow } from "../../features/timeSlice";

const useTimeCounter = () => {
  const dispatch = useDispatch();
  /* eslint-disable */
  useEffect(() => {
    const timeInterval = setInterval(() => {
      dispatch(setTimeNow(Date.now()));
    }, 1000);
    return () => {
      clearInterval(timeInterval);
    };
  }, []);
};

export default useTimeCounter;
