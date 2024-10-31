import React, { useState } from "react";
import { Tasks } from "../types";

import {
  addMonths,
  format,
  getDay,
  parse,
  startOfWeek,
  subMonths,
} from "date-fns";
import { enIN } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./DateCalendar.css";
import EventCard from "./EventCard";
import Toolbar from "./Toolbar";

const locales = {
  "en-IN": enIN,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface DateCalendarProps {
  data: Tasks[];
}

const DateCalendar = ({ data }: DateCalendarProps) => {
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date()
  );
  const events = data.map((item) => ({
    start: new Date(item.dueDate),
    end: new Date(item.dueDate),
    title: item.name,
    project: item.project,
    assignee: item.assignee,
    status: item.status,
    id: item.$id,
  }));

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else {
      setValue(new Date());
    }
  };

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture) ?? "",
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            id={event.id}
            title={event.title}
            assignee={event.assignee}
            project={event.project}
            status={event.status}
          />
        ),
        toolbar: () => (
            <Toolbar date={value} onNavigate={handleNavigate} />
        )
      }}
    />
  );
};

export default DateCalendar;
