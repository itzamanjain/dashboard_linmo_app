import Event from "@/app/models/Event";

export default interface UpcomingEventsProps {
    eventsByMonth: {
        [key: string]: Event[];
    };
}