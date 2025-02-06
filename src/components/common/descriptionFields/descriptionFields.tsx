import Image from "next/image";
import { memo } from "react";

import DescriptionField from "./interfaces/descriptionField";
import DescriptionFieldsProps from "./interfaces/descriptionFieldsProps";

const DescriptionFields = (props: DescriptionFieldsProps) => {
    const { selectedButtons, setSelectedButtons, descriptionFields, setDescriptionFields } = props;

    const handleAddField = (type: string, buttonType: string) => {
        setDescriptionFields((prevFields: DescriptionField[]) => {
            const existingField = prevFields.find(field => field.type === type);

            if (existingField) {
                setSelectedButtons((prevButtons: string[]) =>
                    prevButtons.filter(btn => btn !== buttonType)
                );
                return prevFields.filter(field => field.id !== existingField.id);
            } else {
                setSelectedButtons((prevButtons: string[]) =>
                    [...prevButtons, buttonType]
                );
                return [...prevFields, { id: Date.now(), type, value: "" }];
            }
        });
    };

    const handleFieldValueChange = (id: number, newValue: string) => {
        setDescriptionFields(prevFields =>
            prevFields.map(field =>
                field.id === id ? { ...field, value: newValue } : field
            )
        );
    };

    const handleAddIncluded = () => {
        handleAddField("What's Included", "included");
    };

    const handleAddAdditional = () => {
        handleAddField("Additional Information", "additional");
    };

    return (
        <>
            <div className="flex gap-4">
                <div
                    className={`flex gap-2 px-4 py-3 rounded-full cursor-pointer ${selectedButtons.includes("included") ? 'bg-white' : 'bg-darkJungle'}`}
                    onClick={handleAddIncluded}
                >
                    <Image
                        src={`${selectedButtons.includes("included") ? '/static/d-plus.svg' : '/static/plus.svg'}`}
                        alt="Add"
                        width={9.3}
                        height={9.3}
                    />
                    <h3
                        className={`font-bold text-sm leading-custom-22 ${selectedButtons.includes("included") ? 'text-black' : 'text-white'}`}
                    >
                        Add What&apos;s Included
                    </h3>
                </div>
                <div
                    className={`flex gap-2 px-4 py-3 rounded-full cursor-pointer ${selectedButtons.includes("additional") ? 'bg-white' : 'bg-darkJungle'}`}
                    onClick={handleAddAdditional}
                >
                    <Image
                        src={`${selectedButtons.includes("additional") ? '/static/d-plus.svg' : '/static/plus.svg'}`}
                        alt="Add"
                        width={9.3}
                        height={9.3}
                    />
                    <h3
                        className={`font-bold text-sm leading-custom-22 ${selectedButtons.includes("additional") ? 'text-black' : 'text-white'}`}
                    >
                        Add Additional Information
                    </h3>
                </div>
            </div>
            {descriptionFields.map((field) => (
                <div key={field.id} className="flex flex-col gap-4">
                    <h3 className="text-white font-semibold text-lg leading-6">{field.type}</h3>
                    <textarea
                        className="bg-black font-normal text-sm leading-custom-22 text-white opacity-90
                                focus:outline-none py-3 px-4 border border-darkMetal rounded-xl placeholder:text-darkgray"
                        placeholder={`Enter ${field.type.toLowerCase()}`}
                        name={field.type.toLowerCase()}
                        rows={6}
                        value={field.value}
                        onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                    />
                </div>
            ))}
        </>
    );
};

export default memo(DescriptionFields);