import { memo, useState } from "react";

import Header from "../common/header/header";
import Tab from "../common/tab/tab";
import TabContent from "../common/tab/tabContent";

import useReducerDispatch from "@/hooks/useReducerDispatch";
import useSliceSelector from "@/hooks/useSliceSelector";
import { setActiveTab, setMainActiveContent } from "@/reducers/dashboard/dashboardSlice";

const CalendarContent = () => {
    const dispatch = useReducerDispatch();
    const activeTab = useSliceSelector((state) => state.dashboard.activeTab);
    const upcomingContainerHeight = useSliceSelector(state => state.dashboard.upcomingEventsContainerClass);
    const pastContainerHeight = useSliceSelector(state => state.dashboard.pastEventsContainerClass);
    const [eventCounts, setEventCounts] = useState({
        upcoming: 0,
        week: 0
    });

    const tabs = [
        { id: 'Upcoming', label: 'Upcoming', notifications: eventCounts.upcoming },
        { id: 'Week', label: 'This Week', notifications: eventCounts.week },
        { id: 'Past', label: 'Past', notifications: 0 },
    ];

    const containerHeightClass = activeTab === 'Past' ? pastContainerHeight : upcomingContainerHeight;

    const handleCreateEventClick = () => {
        dispatch(setMainActiveContent('Create Event'));
    };

    return (
        <div className="flex-1 transition-all duration-300 ease-in-out h-max">
            <div className={`flex flex-col gap-[1.563rem] pt-12 p-4 lg:px-8 lg:pt-10 pb-2 
                lg:pb-4 ${containerHeightClass}`}>
                <Header
                    title="My Calendar"
                    onCreateEventClick={handleCreateEventClick}
                />
                <div className="flex gap-2 flex-row">
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            label={tab.label}
                            notifications={tab.notifications}
                            isActive={activeTab === tab.id}
                            setActive={() => dispatch(setActiveTab(tab.id))}
                        />
                    ))}
                </div>
                <TabContent activeTab={activeTab} setEventCounts={setEventCounts} />
            </div>
        </div>
    )
}

export default memo(CalendarContent);