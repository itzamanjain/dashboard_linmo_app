import { Dispatch, SetStateAction } from "react";

import CategoriesProps from "@/components/common/categories/interfaces/categoriesProps";
import DatePickerProps from "@/components/common/datePicker/interfaces/datePickerProps";
import DescriptionFieldsProps from "@/components/common/descriptionFields/interfaces/descriptionFieldsProps";
import SearchLocationProps from "@/components/common/searchLocation/interfaces/searchLocationProps";
import EventImageUploadProps from "@/components/eventImageUpload/interfaces/eventImageUploadProps";

export default interface EventContentProps extends
    CategoriesProps,
    DescriptionFieldsProps,
    DatePickerProps,
    SearchLocationProps,
    EventImageUploadProps {
    title: string;
    setTitle: Dispatch<SetStateAction<string>>;
    description: string;
    setDescription: Dispatch<SetStateAction<string>>;
    isUnlimitedAttendees: boolean;
    setIsUnlimitedAttendees: Dispatch<SetStateAction<boolean>>;
    maxAttendees: number;
    setMaxAttendees: Dispatch<SetStateAction<number>>;
    isFree: boolean;
    setIsFree: Dispatch<SetStateAction<boolean>>;
    setIsOnline: Dispatch<SetStateAction<boolean>>;
    isOnline: boolean;
    meetLink: string;
    setMeetLink: Dispatch<SetStateAction<string>>;
    price: number;
    setPrice: Dispatch<SetStateAction<number>>;
    priceCurrency: string | undefined;
    setPriceCurrency: Dispatch<SetStateAction<string | undefined>>;
    allowMembership: boolean;
    setAllowMembership: Dispatch<SetStateAction<boolean>>;
    onCreateEventClick: () => void;
}