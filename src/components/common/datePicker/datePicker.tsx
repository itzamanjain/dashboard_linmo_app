import moment from "moment";
import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";

import MonthCalendar from "../monthCalendar/monthCalendar";
import TimePicker from "../timePicker/timePicker";

import DatePickerProps from "./interfaces/datePickerProps";

const DatePicker = (props: DatePickerProps) => {
    const { selectedDropdownOption,
        selectedEndDate,
        selectedEndTime,
        selectedStartDate,
        selectedStartTime,
        setSelectedDropdownOption,
        setSelectedEndDate,
        setSelectedEndTime,
        setSelectedStartDate,
        setSelectedStartTime,
        setSelectedDropdownFrequency
    } = props;

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);

    const modalRef = useRef<HTMLDivElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleOpenCalendar = (isEndDate: boolean) => {
        setIsSelectingEndDate(isEndDate);
        setTimeout(() => setIsCalendarOpen(true), 0);
    };

    const handleOpenDropdown = () => {
        setIsDropdownOpen(true);
    }

    const handleClose = () => {
        setIsCalendarOpen(false);
        setIsDropdownOpen(false);
    };

    const handleDateSelect = (date: moment.Moment) => {
        const today = moment().startOf('day');

        if (date.isBefore(today)) {
            alert("You cannot select a date before today.");
            return;
        }

        if (isSelectingEndDate) {
            setSelectedEndDate(date);
        } else {
            setSelectedStartDate(date);
            if (!selectedEndDate) {
                setSelectedEndDate(date);
            }
        }
    };

    const handleTimeSelect = (time: moment.Moment) => {
        if (isSelectingEndDate) {
            if (selectedStartTime && time.isBefore(selectedStartTime.clone().add(1, 'hour'))) {
                alert("End time must be at least one hour after the start time.");
                return;
            }
            setSelectedEndTime(time);
            handleClose();
        } else {
            const endTime = moment(time).add(1, 'hour');
            setSelectedStartTime(time);
            setSelectedEndTime(endTime);
        }
    };

    const handleDropdownSelect = (option: string, frequency: number) => {
        setSelectedDropdownOption(option);
        setSelectedDropdownFrequency(frequency);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current && !modalRef.current.contains(event.target as Node) ||
                dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
            ) {
                handleClose();
            }
        };

        if (isCalendarOpen || isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isCalendarOpen, isDropdownOpen]);

    useEffect(() => {
        if (isSelectingEndDate && (selectedEndDate && selectedEndTime)) {
            handleClose();
        } else if (selectedStartDate && selectedStartTime) {
            handleClose();
        }
    }, [selectedStartDate, selectedEndDate, selectedStartTime, selectedEndTime, isSelectingEndDate])

    return (
        <div className="flex flex-col gap-4 relative">
            <h3 className="font-semibold text-lg leading-6 text-white">Date & time</h3>
            <div className="flex gap-4 items-center cursor-pointer relative" onClick={() => handleOpenCalendar(false)}>
                <div className="flex gap-4 w-full max-w-[4rem]">
                    <Image
                        src="/static/white-dot.svg"
                        alt="start date"
                        width={12}
                        height={12}
                    />
                    <h3 className="text-white font-semibold text-base leading-6">Start</h3>
                </div>
                <div className={`flex rounded-xl py-3 px-4 w-full justify-between border
                    ${isCalendarOpen && !isSelectingEndDate ? 'border-green' : 'border-darkMetal'}`}
                >
                    <p className="text-white opacity-90 font-normal text-sm leading-custom-22">
                        {selectedStartDate || selectedStartTime
                            ? `${selectedStartDate ? selectedStartDate.format('ddd, DD MMM') : 'Select start date'} at 
                                    ${selectedStartTime ? selectedStartTime.format('HH:mm') : 'Select start time'}`
                            : "Select start date & time"}
                    </p>
                    <Image
                        src="/static/calendar.svg"
                        alt="calendar"
                        width={14}
                        height={14}
                    />
                </div>
                <div className="absolute left-[0.331rem] top-[2rem] h-[3.125rem] border-l border-darkMetal border-dashed" />
            </div>
            <div className="flex gap-4 items-center cursor-pointer relative" onClick={() => handleOpenCalendar(true)}>
                <div className="flex gap-4 w-full max-w-[4rem]">
                    <Image
                        src="/static/black-dot.svg"
                        alt="start date"
                        width={12}
                        height={12}
                    />
                    <h3 className="text-white font-semibold text-base leading-6">End</h3>
                </div>
                <div className={`flex rounded-xl py-3 px-4 w-full justify-between border
                    ${isCalendarOpen && isSelectingEndDate ? 'border-green' : 'border-darkMetal'}`}>
                    <p className="text-white opacity-90 font-normal text-sm leading-custom-22">
                        {selectedEndDate || selectedEndTime
                            ? `${selectedEndDate ? selectedEndDate.format('ddd, DD MMM') : 'Select end date'} at 
                                    ${selectedEndTime ? selectedEndTime.format('HH:mm') : 'Select end time'}`
                            : "Select end date & time"}
                    </p>
                    <Image
                        src="/static/calendar.svg"
                        alt="calendar"
                        width={14}
                        height={14}
                    />
                </div>
            </div>
            {isCalendarOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div ref={modalRef} className="flex bg-darkJungle p-6 rounded-lg gap-6">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-white font-semibold text-base leading-6">Select Date</h2>
                            <MonthCalendar
                                selectedStartDate={selectedStartDate}
                                onStartDateSelect={handleDateSelect}
                                onEndDateSelect={handleDateSelect}
                                showEvents={false}
                            />
                        </div>
                        <div className="border border-darkMetal max-h-[24.063rem]"></div>
                        <div className="flex flex-col gap-3">
                            <h2 className="text-white font-semibold text-base leading-6">Select Time</h2>
                            <TimePicker
                                selectedTime={isSelectingEndDate ? selectedEndTime : selectedStartTime}
                                onTimeSelect={handleTimeSelect}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div
                className="bg-darkJungle rounded-[0.625rem] py-2 px-4 w-full sm:w-2/4 flex justify-between cursor-pointer"
                onClick={handleOpenDropdown}
            >
                <h3 className="text-green text-sm font-bold leading-custom-22">{selectedDropdownOption}</h3>
                <Image
                    src="/static/double-arrows.svg"
                    alt="Every week"
                    width={16}
                    height={16}
                />
            </div>
            {isDropdownOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div ref={dropdownRef} className="flex bg-darkJungle py-4 rounded-lg gap-2 flex-col w-[160px]">
                        <div
                            className="px-6 border-b border-darkMetal pb-2 cursor-pointer"
                            onClick={() => handleDropdownSelect("Every day", 1)}
                        >
                            <h3 className="text-white text-sm font-bold leading-custom-22">Every day</h3>
                        </div>
                        <div
                            className="px-6 border-b border-darkMetal pb-2 cursor-pointer"
                            onClick={() => handleDropdownSelect("Every week", 7)}
                        >
                            <h3 className="text-white text-sm font-bold leading-custom-22">Every week</h3>
                        </div>
                        <div
                            className="px-6 border-b border-darkMetal pb-2 cursor-pointer"
                            onClick={() => handleDropdownSelect("Every month", 28)}
                        >
                            <h3 className="text-white text-sm font-bold leading-custom-22">Every month</h3>
                        </div>
                        <div
                            className="px-6 border-b border-darkMetal pb-2 cursor-pointer"
                            onClick={() => handleDropdownSelect("No repeat", 0)}
                        >
                            <h3 className="text-white text-sm font-bold leading-custom-22">No repeat</h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default memo(DatePicker);