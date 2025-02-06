import { memo } from "react";

import EventCard from "../common/eventCard/eventCard";

import useReducerDispatch from "@/hooks/useReducerDispatch";
import useSliceSelector from "@/hooks/useSliceSelector";
import { setActiveEventId, setMainActiveContent, setSelectedDate } from "@/reducers/dashboard/dashboardSlice";

import UpcomingEventsProps from "./interfaces/upcomingEventsProps";

const UpcomingEvents = (props: UpcomingEventsProps) => {
    const { eventsByMonth } = props;

    const dispatch = useReducerDispatch();
    const selectedDate = useSliceSelector(state => state.dashboard.selectedDate);
    const activeEventId = useSliceSelector(state => state.dashboard.activeEventId);

    const handleEventClick = (eventId: string, eventStartTime: string) => {
        if (!activeEventId && !selectedDate) {
            dispatch(setActiveEventId(eventId));
            dispatch(setSelectedDate(eventStartTime));
        }
        else {
            dispatch(setActiveEventId(''));
            dispatch(setSelectedDate(''));
        }
    };

    const handleResetFilter = () => {
        dispatch(setActiveEventId(''));
        dispatch(setSelectedDate(''));
    }

    const handleCreateEvent = () => {
        dispatch(setMainActiveContent('Create Event'));
    }

    if (!selectedDate && Object.keys(eventsByMonth).length === 0) {
        return (
            <div className="flex flex-col gap-6 items-center pt-14 h-screen">
                <div className="flex gap-2 flex-col items-center justify-center">
                    <h2 className="font-bold text-custom-22 leading-7 text-white">
                        You haven&apos;t created any events yet.
                    </h2>
                    <p className="text-gray font-normal leading-6 text-base">
                        Get started creating your first event!
                    </p>
                </div>
                <button
                    className="font-bold text-sm leading-custom-22 text-black py-2 px-4 rounded-[10px] bg-green"
                    onClick={handleCreateEvent}
                >
                    Create Event
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            {Object.keys(eventsByMonth).map((month, idx) => (
                <div key={idx} className="flex flex-col">
                    <div className="flex justify-between">
                        <h2 className="font-semibold text-lg leading-6 text-white">
                            {month}
                        </h2>
                        {selectedDate && (
                            <h2
                                className="font-semibold text-sm leading-4 text-green cursor-pointer"
                                onClick={handleResetFilter}
                            >
                                Reset Filter
                            </h2>
                        )}
                    </div>
                    <div className="flex flex-col gap-4 mt-3">
                        {eventsByMonth[month].map((event, eventIdx) => (
                            <EventCard activeId={activeEventId} onEventClick={handleEventClick} key={eventIdx} {...event} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default memo(UpcomingEvents);