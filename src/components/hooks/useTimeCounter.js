import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTimeNow, setTimeNow } from "../../features/timeSlice";

const useTimeCounter = () => {
  const dispatch = useDispatch();
  const timeNow = useSelector(selectTimeNow);
  useEffect(() => {
    const timeInterval = setInterval(() => {
      dispatch(setTimeNow(Date.now()));
    }, 1000);
    return () => {
      clearInterval(timeInterval);
    };
  }, [dispatch]);
  return () => timeNow;
};

export default useTimeCounter;
