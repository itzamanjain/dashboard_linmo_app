import Event from "@/app/models/Event";

export default interface EventsByMonth {
    [key: string]: Event[];
}