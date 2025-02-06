import { Moment } from "moment";

import MapProps from "@/components/common/map/interfaces/mapProps";

export default interface EventSidebarProps extends MapProps {
    address: string | undefined;
    city: string | undefined;
    title: string;
    description: string;
    startDate: Moment | null;
    startTime: Moment | null;
    additionalField: string | undefined;
    includedField: string | undefined;
    attendees: number;
    selectedImages: string[];
}