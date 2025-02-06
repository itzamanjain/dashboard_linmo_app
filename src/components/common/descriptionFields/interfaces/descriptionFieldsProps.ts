import { Dispatch, SetStateAction } from "react";

import DescriptionField from "./descriptionField";

export default interface DescriptionFieldsProps {
    selectedButtons: string[];
    setSelectedButtons: Dispatch<SetStateAction<string[]>>;
    descriptionFields: DescriptionField[];
    setDescriptionFields: Dispatch<SetStateAction<DescriptionField[]>>;
}