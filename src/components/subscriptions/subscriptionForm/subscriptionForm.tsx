import Image from "next/image";
import { memo, useEffect, useRef } from "react";

import Checkbox from "@/components/common/checkbox/checkbox";

import SubscriptionFormProps from "./interfaces/subscriptionFormProps";

const durationOptions = [
    'Every Month',
    'Every Year'
];

const SubscriptionForm = (props: SubscriptionFormProps) => {
    const {
        decrementCredits,
        // decrementMonths,
        handleDescriptionChange,
        handleDuration,
        handleDurationDropdown,
        handleMaxCreditsChange,
        handlePriceChange,
        handleSaveSubscription,
        handleTitleChange,
        handleUnlimitedAttendeesChange,
        incrementCredits,
        // incrementMonths,
        // handleMonthsChange,
        onClose,
        dropdownOnClose,
        description,
        isDurationDropdownOpen,
        isUnlimitedCredits,
        maxCredits,
        // months,
        price,
        selectedCurrency,
        selectedDurationOption,
        title,
        editingIndex
    } = props;

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                if (isDurationDropdownOpen) {
                    handleDurationDropdown();
                    dropdownOnClose();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDurationDropdownOpen, handleDurationDropdown, onClose, dropdownOnClose]);

    return (
        <div className="bg-darkJungle rounded-2xl p-6 flex-col flex gap-4">
            <h2 className="text-white font-semibold text-custom-22 leading-7">
                {editingIndex !== null ? "Edit Membership" : "Create Membership"}
            </h2>
            <div className="flex flex-col gap-2">
                <h4 className="text-white font-medium text-sm leading-custom-22">Title</h4>
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="E.g. Pack 4 Classes"
                    className="font-normal text-sm leading-custom-22 bg-woodsmoke text-white rounded-xl
                            border border-darkMetal py-3 px-4 placeholder:text-darkgray focus:outline-none"
                />
            </div>
            <div className="flex flex-col gap-2">
                <h4 className="text-white font-medium text-sm leading-custom-22">Description</h4>
                <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Describe your product"
                    className="font-normal text-sm leading-custom-22 bg-woodsmoke text-white rounded-xl
                            border border-darkMetal py-3 px-4 placeholder:text-darkgray focus:outline-none"
                />
            </div>
            <div className="flex flex-col gap-2">
                <h4 className="text-white font-medium text-sm leading-custom-22">Membership price</h4>
                <div
                    className="relative flex items-center"
                >
                    <div className="absolute top-3 left-4 z-10">
                        <h4 className="text-white font-normal text-sm leading-custom-22">
                            {selectedCurrency?.code}
                        </h4>
                    </div>
                    <input
                        type="text"
                        name="price"
                        value={price}
                        onChange={handlePriceChange}
                        placeholder="Set subscription price"
                        className={`font-normal text-sm leading-custom-22 text-white rounded-xl
                                            placeholder:text-darkgray border border-darkMetal py-3 px-4 pl-10 focus:outline-none w-full bg-woodsmoke`}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h4 className="text-white font-medium text-sm leading-custom-22">Credits</h4>
                <div className="flex gap-6 items-center">
                    <div className="relative flex flex-grow">
                        <input
                            type="text"
                            placeholder="Classes"
                            name="credits"
                            value={maxCredits}
                            className="font-normal text-sm leading-custom-22 bg-woodsmoke text-green rounded-xl
                                                    border border-darkMetal py-3 px-4 pl-12 focus:outline-none w-full cursor-default"
                            onChange={handleMaxCreditsChange}
                            readOnly
                        />
                        <div
                            className={`flex justify-center items-center min-w-[24px] min-h-[24px]
                                                    bg-darkMetal rounded-full absolute left-3 top-3
                                                    ${isUnlimitedCredits ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={isUnlimitedCredits ? undefined : decrementCredits}
                        >
                            <Image
                                src="/static/minus.svg"
                                alt="decrement"
                                width={9}
                                height={0}
                            />
                        </div>
                        <div
                            className={`flex justify-center items-center min-w-[24px] min-h-[24px]
                                                    bg-white rounded-full cursor-pointer absolute top-3 left-[4.5rem]
                                                    ${isUnlimitedCredits ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={isUnlimitedCredits ? undefined : incrementCredits}
                        >
                            <Image
                                src="/static/d-plus.svg"
                                alt="increment"
                                width={9}
                                height={9}
                            />
                        </div>
                        <div className="text-center absolute top-[0.9rem] left-[7rem]">
                            <h3 className="font-normal text-sm leading-custom-22 text-gray">
                                Bookings
                            </h3>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center py-3">
                        <h3
                            className="text-white font-normal text-sm leading-custom-22"
                        >
                            Unlimited
                        </h3>
                        <Checkbox checked={isUnlimitedCredits} onChange={handleUnlimitedAttendeesChange} isSub={true} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h4 className="text-white font-medium text-sm leading-custom-22">Recurring</h4>
                <div
                    ref={dropdownRef}
                    className="bg-woodsmoke border border-darkMetal py-3 px-4 rounded-xl flex justify-between cursor-pointer relative"
                    onClick={handleDurationDropdown}
                >
                    {/* <input
                        type="text"
                        name="months"
                        value={months}
                        onChange={handleMonthsChange}
                        className="font-normal text-sm leading-custom-22 bg-woodsmoke text-green rounded-xl
                                                    border border-darkMetal py-3 px-4 pl-12 focus:outline-none w-full cursor-pointer"
                        onClick={handleDurationDropdown}
                        readOnly
                    /> */}
                    {/* <div
                        className="flex justify-center items-center min-w-[24px] min-h-[24px]
                                                    bg-darkMetal rounded-full cursor-pointer absolute left-3 top-3"
                        onClick={decrementMonths}
                    >
                        <Image
                            src="/static/minus.svg"
                            alt="decrement"
                            width={9}
                            height={0}
                        />
                    </div>
                    <div
                        className="flex justify-center items-center min-w-[24px] min-h-[24px]
                                                    bg-white rounded-full cursor-pointer absolute top-3 left-[4.5rem]"
                        onClick={incrementMonths}
                    >
                        <Image
                            src="/static/d-plus.svg"
                            alt="increment"
                            width={9}
                            height={9}
                        />
                    </div> */}
                    {/* <div className="text-center absolute top-[0.9rem] left-[7rem]">
                        <h3 className={`font-normal text-sm leading-custom-22 ${durationOptions.includes(selectedDurationOption) ? 'text-white' : 'text-gray'}`}>
                            {!selectedDurationOption || selectedDurationOption === ''
                                ? 'Month(s)'
                                : months > 1
                                    ? `${selectedDurationOption}s`
                                    : `${selectedDurationOption}`}
                        </h3>
                    </div> */}
                    <h3 className="text-white text-sm leading-custom-22 font-normal">
                        Renews {selectedDurationOption.toLowerCase()}
                    </h3>
                    <Image
                        src='/static/selector-vertical.svg'
                        alt={selectedDurationOption}
                        width={16}
                        height={16}
                    />
                    {isDurationDropdownOpen && (
                        <div className="absolute left-1 top-12 text-left shadow-[0px_4px_20px_0px_#1413181A] z-10 w-40">
                            <div className="flex flex-col">
                                {durationOptions.map((option, index) => {
                                    const isSelected = selectedDurationOption === option;
                                    const isLastItem = index === durationOptions.length - 1
                                    return (
                                        <div
                                            key={index}
                                            className={`py-2 cursor-pointer border-b-darkMetal border-b flex gap-1 items-center
                                                        ${isSelected ? 'bg-graphite px-4' : 'bg-darkMetal px-8'}
                                                        ${index === 0 ? 'rounded-t-2xl' : ''}
                                                        ${isLastItem ? 'rounded-b-2xl' : ''}`}
                                            onClick={() => handleDuration(option)}
                                        >
                                            {isSelected && (
                                                <Image
                                                    src="/static/check.svg"
                                                    alt="checked"
                                                    width={12}
                                                    height={12}
                                                />
                                            )}
                                            <h4 className="font-medium text-sm leading-custom-22 text-white">
                                                {option}
                                            </h4>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-4 justify-end">
                <button
                    className="bg-darkMetal px-4 py-2 text-white font-bold text-sm leading-custom-22 rounded-[0.625rem]"
                    onClick={onClose}

                >
                    Cancel
                </button>
                <button
                    className="bg-green px-4 py-2 text-black font-bold text-sm leading-custom-22 rounded-[0.625rem]"
                    onClick={handleSaveSubscription}

                >
                    {editingIndex !== null ? "Update" : "Save"}
                </button>
            </div>
        </div>
    )
}

export default memo(SubscriptionForm);