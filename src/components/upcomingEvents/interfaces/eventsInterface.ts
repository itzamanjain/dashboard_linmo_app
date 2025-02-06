import { Moment } from "moment";

export default interface EventInerface {
    day: string;
    date: Moment;
    time: string;
    location: string;
    title: string;
    attendees: string;
    id: number;
}