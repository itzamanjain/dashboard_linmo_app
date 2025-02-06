import { memo } from "react";

import MonthCalendar from "../common/monthCalendar/monthCalendar";
import Notifications from "../notifications/notifications";

const CalendarSidebar = () => {

    return (
        <>
            <div className="px-8">
                <MonthCalendar />
            </div>
            <div className="border-b border-darkMetal w-full mt-[0.375rem]" />
            <Notifications />
        </>
    )

}

export default memo(CalendarSidebar);