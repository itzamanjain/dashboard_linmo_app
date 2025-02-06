import moment from "moment";
import { memo, useEffect } from "react";

import UpcomingEvents from "@/components/upcomingEvents/upcomingEvents";
import WeeklyCalendar from "../weekCalendar/weekCalendar";

import useReducerDispatch from "@/hooks/useReducerDispatch";
import useSliceSelector from "@/hooks/useSliceSelector";
import { setPastEventsContainerClass, setUpcomingEventsContainerClass } from "@/reducers/dashboard/dashboardSlice";

import Event from "@/app/models/Event";
import EventsByMonth from "@/components/upcomingEvents/interfaces/eventsByMonth";
import TabContentProps from "./interfaces/tabContentProps";

const TabContent = (props: TabContentProps) => {
    const { activeTab, setEventCounts } = props;

    const allEvents = useSliceSelector(state => state.dashboard.allEvents);
    const selectedDate = useSliceSelector(state => state.dashboard.selectedDate);
    const dispatch = useReducerDispatch();
    const isLoading = useSliceSelector(state => state.dashboard.isLoading);

    const currentTime = moment();

    const filteredEvents = selectedDate
        ? allEvents.filter(event => moment(event.trainingStartDateTime).isSame(selectedDate, 'day'))
        : allEvents;

    const groupEventsByMonth = (events: Event[]): EventsByMonth => {
        const grouped = events.reduce((acc: EventsByMonth, event: Event) => {
            const month = moment(event.trainingStartDateTime).format("MMMM");
            if (!acc[month]) {
                acc[month] = [];
            }
            acc[month].push(event);
            acc[month].sort((a, b) => moment(a.trainingStartDateTime).isBefore(b.trainingStartDateTime) ? -1 : 1);
            return acc;
        }, {} as Record<string, Event[]>);

        const sortedMonths = Object.keys(grouped).sort((a, b) =>
            moment(a, "MMMM").month() - moment(b, "MMMM").month()
        );

        return sortedMonths.reduce((acc: EventsByMonth, month) => {
            acc[month] = grouped[month];
            return acc;
        }, {} as EventsByMonth);
    };

    const upcomingEvents = filteredEvents.filter(event => moment(event.trainingStartDateTime).isAfter(currentTime));
    const pastEvents = filteredEvents.filter(event => moment(event.trainingStartDateTime).isBefore(currentTime));
    const startOfWeek = currentTime.clone().startOf('week');
    const endOfWeek = currentTime.clone().endOf('week');

    const upcomingEventsAll = allEvents.filter(event => moment(event.trainingStartDateTime).isAfter(currentTime));
    const weeklyEventsAll = upcomingEventsAll.filter(event =>
        moment(event.trainingStartDateTime).isBetween(startOfWeek, endOfWeek, null, '[]')
    );

    const sortedPastEvents = pastEvents.sort((a, b) => moment(a.trainingStartDateTime).isAfter(b.trainingStartDateTime) ? -1 : 1);

    const groupedUpcomingEvents = groupEventsByMonth(upcomingEvents);
    const groupedPastEvents = groupEventsByMonth(sortedPastEvents);

    const upcomingEventCount = upcomingEvents.length;
    const upcomingContainerHeightClass = upcomingEventCount > 2 ? "h-full" : "h-screen";

    const pastEventCount = pastEvents.length;
    const pastContainerHeightClass = pastEventCount > 2 ? "h-full" : "h-screen";

    useEffect(() => {
        dispatch(setUpcomingEventsContainerClass(upcomingContainerHeightClass));
        dispatch(setPastEventsContainerClass(pastContainerHeightClass));
    }, [upcomingContainerHeightClass, pastContainerHeightClass, dispatch]);

    useEffect(() => {
        setEventCounts({
            upcoming: upcomingEventsAll.length,
            week: weeklyEventsAll.length
        });
    }, [upcomingEventsAll.length, weeklyEventsAll.length, setEventCounts]);

    const noEventsMessage = (
        <div className="flex justify-center pt-14 h-screen">
            <h2 className="font-bold text-custom-22 leading-7 text-white">
                No Events on this day.
            </h2>
        </div>
    );

    const noPastEventsMessage = (
        <div className="flex justify-center pt-14 h-screen">
            <h2 className="font-bold text-custom-22 leading-7 text-white">
                No Past Events.
            </h2>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex justify-center pt-14 h-screen">
                <div className="font-bold text-custom-22 leading-7 text-white">Loading...</div>
            </div>
        );
    }

    switch (activeTab) {
        case 'Upcoming':
            return upcomingEvents.length === 0 && selectedDate ? noEventsMessage : <UpcomingEvents eventsByMonth={groupedUpcomingEvents} />
        case 'Week':
            return <WeeklyCalendar upcomingEvents={upcomingEvents} />;
        case 'Past':
            if (upcomingEventCount > 0 && pastEventCount === 0) {
                return noPastEventsMessage;
            }
            return !pastEvents.length ? noEventsMessage : <UpcomingEvents eventsByMonth={groupedPastEvents} />;
        default:
            return null;
    }
}

export default memo(TabContent);