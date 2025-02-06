import { Moment } from "moment";
import { Dispatch, SetStateAction } from "react";

export default interface DatePickerProps {
    selectedStartDate: Moment | null;
    setSelectedStartDate: Dispatch<SetStateAction<Moment | null>>;
    selectedEndDate: Moment | null;
    setSelectedEndDate: Dispatch<SetStateAction<Moment | null>>;
    selectedStartTime: Moment | null;
    setSelectedStartTime: Dispatch<SetStateAction<Moment | null>>;
    selectedEndTime: Moment | null;
    setSelectedEndTime: Dispatch<SetStateAction<Moment | null>>;
    selectedDropdownOption: string | undefined;
    setSelectedDropdownOption: Dispatch<SetStateAction<string | undefined>>;
    setSelectedDropdownFrequency: Dispatch<SetStateAction<number | undefined>>;
}