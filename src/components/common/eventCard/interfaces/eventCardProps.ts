import Event from "@/app/models/Event";

export default interface EventCardProps extends Event {
    onEventClick?: (eventId: string, eventStartTime: string) => void;
    activeId: string;
    fromAttendees?: boolean;
}