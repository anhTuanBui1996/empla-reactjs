import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import PropTypes from "prop-types";
import Card from "../common/Card";
import { useSelector } from "react-redux";
import { selectTimeNow } from "../../features/timeSlice";

const localizer = momentLocalizer(moment);
function BigCalendar({ title, events }) {
  const now = useSelector(selectTimeNow);
  return (
    <Card
      noBodyPadding
      cardHeader={{
        title: title,
        extension: true,
      }}
      elementList={[
        <Calendar
          defaultView={"week"}
          getNow={() => new Date(now)}
          localizer={localizer}
          events={events}
          eventPropGetter={(event) =>
            event.resource?.style && {
              style: event.resource?.style,
            }
          }
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />,
      ]}
    />
  );
}

BigCalendar.propTypes = {
  title: PropTypes.any.isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      start: PropTypes.instanceOf(Date).isRequired,
      end: PropTypes.instanceOf(Date).isRequired,
      allDay: PropTypes.bool,
      resource: PropTypes.any,
    })
  ).isRequired,
};

export default BigCalendar;
