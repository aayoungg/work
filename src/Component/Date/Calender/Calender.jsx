/* eslint-disable */
import React, { useState, useEffect } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import "../Calender/Calender.css";
import { ko } from "date-fns/locale";

const Calendar = ({ workcheckData }) => {
  const [events, setEvents] = useState([]);
  const newEvents = [];

  let date = new Date();
  let nowstartDate = new Date(date.getFullYear(), date.getMonth(), 2);

  useEffect(() => {
    if (workcheckData && workcheckData.length !== 0) {
      const currentDate = new Date();
      console.log(currentDate);
      for (
        let date = nowstartDate;
        date <= currentDate;
        date.setDate(date.getDate() + 1)
      ) {
        const dateString = date.toISOString().split("T")[0];
        const someData =
          workcheckData.code !== 200
            ? []
            : workcheckData.data.find((data) =>
                data.startDate.includes(dateString)
              );
        console.log("someData", someData);
        if (date.getDay() === 0 || date.getDay() === 1) {
          continue;
        }

        if (someData === undefined) {
          const commuteEvent = {
            title: "정보 없음",
            date: dateString,
          };
          newEvents.push(commuteEvent);
        } else {
          if (someData.endDate == null) {
            const leaveEvent = {
              title: "정보 없음",
              date: dateString,
              color: "red",
            };
            newEvents.push(leaveEvent);
          }
        }
      }
    }

    setEvents(newEvents);
  }, [workcheckData]);

  return (
    <div>
      <FullCalendar
        key={events.length}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today",
          center: "title",
          end: "prev,next",
        }}
        events={events}
        locale={ko}
      />
    </div>
  );
};

export default Calendar;
