import { memo } from "react";

import CalendarContent from "@/components/calendarContent/calendarContent";
import CalendarSidebar from "../calendarSidebar/calendarSidebar";
import SidebarLayout from "../sidebarLayout/sidebarLayout";

const EventCalendars = () => {

    return (
        <SidebarLayout
            sidebarContent={<CalendarSidebar />}
        >
            <CalendarContent />
        </SidebarLayout>
    )
}

export default memo(EventCalendars);