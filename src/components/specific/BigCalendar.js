import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import PropTypes from "prop-types";
import Card from "../common/Card";

const localizer = momentLocalizer(moment);
function BigCalendar({ title, events, dateSelected }) {
  const handleNavigate = () => {};

  return (
    <Card
      noBodyPadding
      cardHeader={{
        title: title,
      }}
      elementList={[
        <Calendar
          date={dateSelected}
          onNavigate={handleNavigate}
          defaultView={"week"}
          views={["month", "week", "day"]}
          getNow={() => new Date()}
          localizer={localizer}
          events={events}
          eventPropGetter={(event) =>
            event.resource?.style && {
              style: event.resource?.style,
            }
          }
          startAccessor="start"
          endAccessor="end"
          style={{
            height: "742.5px",
            width: "100%",
            borderBottom: "1px solid #ddd",
            borderLeft: "1px solid #ddd",
            borderRight: "1px solid #ddd",
            borderBottomLeftRadius: "0.5rem",
            borderBottomRightRadius: "0.5rem",
            overflow: "hidden",
          }}
        />,
      ]}
    />
  );
}

BigCalendar.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
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
