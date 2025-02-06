import { Moment } from "moment";

export default interface TimePickerProps {
    selectedTime: Moment | null;
    onTimeSelect: (time: Moment) => void;
}