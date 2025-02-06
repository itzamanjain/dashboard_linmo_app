import { memo } from "react";

import EventCalendars from "@/components/eventCalendars/eventCalendars";
import Attendees from "../attendees/attendees";

import useSliceSelector from "@/hooks/useSliceSelector";

const MyCalendar = () => {
    const activeContent = useSliceSelector(state => state.dashboard.activeContent);

    return (
        <>
            {activeContent === 'calendar' && <EventCalendars />}
            {activeContent === 'attendees' && <Attendees />}
        </>
    )
}

export default memo(MyCalendar);