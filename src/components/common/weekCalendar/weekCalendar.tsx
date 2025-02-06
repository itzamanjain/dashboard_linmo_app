import moment from 'moment';
import Image from 'next/image';
import { JSX, memo, useCallback, useEffect, useRef, useState } from 'react';

import Tooltip from '../tooltip/tooltip';
import Modal from '@/components/modals/modal/modal';

import useReducerDispatch from '@/hooks/useReducerDispatch';
import useSliceSelector from '@/hooks/useSliceSelector';
import { removeEvent, setActiveContent, setActiveEventId, setAttendeesIds, setIsEditingEvent, setMainActiveContent } from '@/reducers/dashboard/dashboardSlice';

import Event from '@/app/models/Event';
import TooltipOptions from '../tooltip/interfaces/tooltipOptions';

const tooltipOptions: TooltipOptions[] = [
    {
        option: 'Edit Event',
        action: undefined,
        icon: {
            src: '/static/edit.svg',
            width: 13.4,
            height: 13.4
        }
    },
    {
        option: 'Attendees',
        action: undefined,
        icon: {
            src: '/static/group.svg',
            width: 13.3,
            height: 12
        }

    },
    {
        option: 'Delete',
        action: undefined,
        icon: {
            src: '/static/trash.svg',
            width: 12,
            height: 13.3
        }

    }
];

const WeeklyCalendar = ({ upcomingEvents }: { upcomingEvents: Event[] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccesModalOpen, setIsSuccesModalOpen] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const dotsRef = useRef<HTMLDivElement>(null);
    const [activeTooltipId, setActiveTooltipId] = useState('');
    const [currentWeek, setCurrentWeek] = useState(moment());
    const startOfWeek = currentWeek.clone().startOf('week');
    const endOfWeek = currentWeek.clone().endOf('week');
    const timeSlots = Array.from({ length: 24 }, (_, i) => moment({ hour: i }).format('HH:mm'));
    const selectedDate = useSliceSelector((state) => state.dashboard.selectedDate);
    const dispatch = useReducerDispatch();
    const activeEventId = useSliceSelector(state => state.dashboard.activeEventId);
    const allEvents = useSliceSelector(state => state.dashboard.allEvents);
    const activeEvent = allEvents.find(event => event.trainingId === activeEventId);
    const attendeesIds = activeEvent ? activeEvent.participants : [];
    const isSmallScreen = window.innerWidth < 640;
    const multiplier = isSmallScreen ? 55 : 110;

    const confirmDelete = async () => {
        try {
            const response = await fetch(`https://prod-ts-liveliness-server.onrender.com/api/event/${activeEventId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            await response.json();
            setIsModalOpen(false);
            setIsSuccesModalOpen(true);
            setActiveTooltipId('');
            dispatch(removeEvent(activeEventId));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleDeleteClick = () => {
        setIsModalOpen(true);
    };

    const handleEditClick = useCallback(() => {
        console.log("Editing event:", activeEventId);
        dispatch(setIsEditingEvent(true));
        dispatch(setMainActiveContent('Create Event'));
    }, [activeEventId, dispatch]);

    const handleDuplicateClick = () => {
        console.log("Duplicating event:", activeEventId);
    };

    const handleAttendeesClick = () => {
        console.log("Attendees:", activeEventId);
        dispatch(setAttendeesIds(attendeesIds));
        dispatch(setActiveContent('attendees'));
    };

    const updatedTooltipOptions = tooltipOptions.map(option => {
        switch (option.option) {
            case 'Edit Event':
                return { ...option, action: handleEditClick };
            case 'Attendees':
                return { ...option, action: handleAttendeesClick };
            case 'Duplicate':
                return { ...option, action: handleDuplicateClick };
            case 'Delete':
                return { ...option, action: handleDeleteClick };
            default:
                return option;
        }
    });

    const handleToggleTooltip = (e: React.MouseEvent, tooltipId: string) => {
        e.stopPropagation();
        setActiveTooltipId(prevId => (prevId === tooltipId ? '' : tooltipId));
        dispatch(setActiveEventId(tooltipId));
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            tooltipRef.current &&
            !tooltipRef.current.contains(event.target as Node) &&
            dotsRef.current &&
            !dotsRef.current.contains(event.target as Node)
        ) {
            setActiveTooltipId('');
        }
    };

    const handlePreviousWeek = () => {
        setCurrentWeek((prev) => prev.clone().subtract(1, 'week'));
    };

    const handleNextWeek = () => {
        setCurrentWeek((prev) => prev.clone().add(1, 'week'));
    };

    const renderTimeSlots = () => {
        return timeSlots.map((time, index) => (
            <div
                key={index}
                className="flex items-center justify-center border-darkMetal h-[55px] sm:h-[110px]"
            >
                <h2 className='text-xs sm:text-sm font-normal text-white leading-custom-18 sm:leading-custom-22'>{time}</h2>
            </div>
        ));
    };

    const getEventTimeSlots = (event: Event) => {
        const startTime = moment(event.trainingStartDateTime);
        const endTime = moment(event.trainingEndDateTime);
        const startHour = startTime.hour();
        const endHour = endTime.hour();

        const startMinutes = startTime.minutes();
        const endMinutes = endTime.minutes();

        const minutesPerHourHeight = multiplier / 60;
        const marginTop = startMinutes * minutesPerHourHeight;

        let duration = 0;
        let nextDayDuration = 0;

        if (endHour > startHour || (endHour === startHour && endMinutes > startMinutes)) {
            duration = (endHour - startHour) * 60 + (endMinutes - startMinutes);
        } else {
            duration = (24 - startHour) * 60 - startMinutes;
            nextDayDuration = endHour * 60 + endMinutes;
        }

        const dayOffset = startTime.day();
        const startDate = moment(event.trainingStartDateTime);
        const endDate = startHour <= endHour ? startDate : startDate.clone().add(1, 'days');

        const formattedTime = `${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`

        return { startHour, dayOffset, endDate, startDate, duration, nextDayDuration, marginTop, formattedTime };
    };

    const renderWeekDays = () => {
        const days = [];
        const day = startOfWeek.clone();

        while (day.isBefore(endOfWeek)) {
            const isSelected = selectedDate && day.isSame(moment(selectedDate), 'day');

            days.push(
                <div
                    key={day.format('YYYY-MM-DD')}
                    className='h-[48px] flex justify-center items-center'
                >
                    <div
                        className={`flex flex-col sm:flex-row justify-center items-center gap-[2px] sm:gap-2 rounded-lg p-[6px] sm:p-3 
                        ${isSelected ? 'bg-olive' : ''}`}
                    >
                        <h2 className='text-xs sm:text-sm font-normal leading-custom-18 sm:leading-custom-22 text-white'>{day.format('ddd')}</h2>
                        <h2 className='font-semibold text-xs sm:text-sm leading-3 sm:leading-5 text-gray'>{day.format('D')}</h2>
                    </div>
                </div>
            );
            day.add(1, 'day');
        }

        return days;
    };

    const truncateTitle = (title: string, maxLength: number) => {
        if (title.length <= maxLength) return title;
        return title.slice(0, maxLength) + '...';
    };

    const mergeEvents = (events: Event[]) => {
        const mergedEvents: Event[] = [];
        const eventsSorted = events.sort((a, b) => moment(a.trainingStartDateTime).diff(moment(b.trainingStartDateTime)));

        for (let i = 0; i < eventsSorted.length; i++) {
            const currentEvent = eventsSorted[i];
            const currentStartTime = moment(currentEvent.trainingStartDateTime);
            const currentEndTime = moment(currentEvent.trainingEndDateTime);

            let merged = false;

            for (let j = 0; j < mergedEvents.length; j++) {
                const lastMergedEvent = mergedEvents[j];
                const lastMergedStartTime = moment(lastMergedEvent.trainingStartDateTime);
                const lastMergedEndTime = moment(lastMergedEvent.trainingEndDateTime);

                const isOverlapping =
                    currentStartTime.isBefore(lastMergedEndTime) &&
                    currentEndTime.isAfter(lastMergedStartTime);

                if (isOverlapping) {
                    lastMergedEvent.trainingEndDateTime = moment.max(lastMergedEndTime, currentEndTime).toISOString();
                    if (!lastMergedEvent.titles?.includes(currentEvent.title)) {
                        lastMergedEvent.titles?.push(currentEvent.title);
                    }

                    currentEvent.participants.forEach(participant => {
                        if (!lastMergedEvent.participants.includes(participant)) {
                            lastMergedEvent.participants.push(participant);
                        }
                    });

                    merged = true;
                    break;
                }
            }

            if (!merged) {
                mergedEvents.push({
                    ...currentEvent,
                    titles: [currentEvent.title],
                    participants: [...currentEvent.participants],
                });
            }
        }
        return mergedEvents;
    };

    const renderCells = () => {
        const cells: JSX.Element[] = [];
        const day = startOfWeek.clone();

        const eventCells = new Map<string, JSX.Element>();
        const renderedEvents = new Set<string>();
        const mergedEvents = mergeEvents(upcomingEvents);

        mergedEvents.forEach(event => {
            const { startHour, duration, nextDayDuration, endDate, startDate, marginTop, formattedTime } = getEventTimeSlots(event);
            const eventKey = `${startDate.format('YYYY-MM-DD')}-${event.trainingId}`;
            const activeTooltip = activeTooltipId === event.trainingId;

            if (!renderedEvents.has(eventKey)) {
                if (nextDayDuration === 0) {
                    const eventHeight = `${duration * (multiplier / 60)}px`;
                    const eventElement = (
                        <div
                            key={eventKey}
                            className="p-1 flex items-center justify-center h-full"
                            style={{
                                height: eventHeight,
                                marginTop: `${marginTop}px`
                            }}
                        >
                            <div className="bg-darkMetal flex flex-col gap-1 w-full h-full p-2 rounded-lg relative">
                                <div
                                    className="top-2 right-1 absolute cursor-pointer py-1 min-w-[18px] min-h-[16px]"
                                    onClick={(e) => event.trainingId && handleToggleTooltip(e, event.trainingId)}
                                    ref={dotsRef}
                                >
                                    <Image
                                        src={"/static/dots.svg"}
                                        alt={"options"}
                                        width={10.6}
                                        height={1.3}
                                    />
                                    {activeTooltip &&
                                        <Tooltip
                                            options={updatedTooltipOptions}
                                            showTooltip={activeTooltip}
                                            tooltipRef={tooltipRef}
                                        />
                                    }
                                </div>
                                <h4 className="text-green font-normal text-custom-10 leading-custom-14">{formattedTime}</h4>
                                <h2 className="font-bold text-xs leading-custom-18 text-white pb-1">
                                    <span style={{ whiteSpace: 'pre-line' }}>
                                        {event.titles && event.titles.map(title => truncateTitle(title, 20)).join('\n')}
                                    </span>
                                </h2>
                                <p className="text-iron font-normal text-custom-10 leading-custom-14">{event.participants.length} Going</p>
                            </div>
                        </div>
                    );

                    const dayKey = `${startDate.format('YYYY-MM-DD')}-${startHour % 24}`;
                    eventCells.set(dayKey, eventElement);
                }
                else {
                    const firstDayHeight = `${duration * (multiplier / 60)}px`;

                    const firstDayElement = (
                        <div
                            key={eventKey}
                            className="p-1 flex items-center justify-center h-full"
                            style={{
                                height: firstDayHeight,
                                marginTop: `${marginTop}px`
                            }}
                        >
                            <div className="bg-darkMetal flex flex-col gap-1 w-full h-full p-2 rounded-lg relative">
                                <div
                                    className="top-6 right-4 absolute sm:static lg:absolute 2xl:static 2xl:ml-4 cursor-pointer py-1 min-w-[18px] min-h-[16px]"
                                    onClick={(e) => event.trainingId && handleToggleTooltip(e, event.trainingId)}
                                    ref={dotsRef}
                                >
                                    <Image
                                        src={"/static/dots.svg"}
                                        alt={"options"}
                                        width={0}
                                        height={0}
                                        className="w-full"
                                    />
                                    {activeTooltip &&
                                        <Tooltip
                                            options={updatedTooltipOptions}
                                            showTooltip={activeTooltip}
                                            tooltipRef={tooltipRef}
                                        />
                                    }
                                </div>
                                <h4 className="text-green font-normal text-custom-10 leading-custom-14">{formattedTime}</h4>
                                <h2 className="font-bold text-xs leading-custom-18 text-white pb-1">{event.title}</h2>
                                <p className="text-iron font-normal text-custom-10 leading-custom-14">{event.participants.length} Going</p>
                            </div>
                        </div>
                    );

                    const dayKey = `${startDate.format('YYYY-MM-DD')}-${startHour}`;
                    eventCells.set(dayKey, firstDayElement);

                    const nextDayHeight = `${nextDayDuration * (multiplier / 60)}px`;

                    const nextDayElement = (
                        <div
                            key={eventKey + '-next'}
                            className="p-1 flex items-center justify-center h-full"
                            style={{
                                height: nextDayHeight,
                            }}
                        >
                            <div className="bg-darkMetal flex flex-col gap-1 w-full h-full p-2 rounded-lg">
                                <h4 className="text-green font-normal text-custom-10 leading-custom-14">{formattedTime}</h4>
                                <h2 className="font-bold text-xs leading-custom-18 text-white pb-1">{event.title}</h2>
                                <p className="text-iron font-normal text-custom-10 leading-custom-14">{event.participants.length} Going</p>
                            </div>
                        </div>
                    );

                    const nextDayKey = `${endDate.format('YYYY-MM-DD')}-0`;
                    eventCells.set(nextDayKey, nextDayElement);
                }
                renderedEvents.add(eventKey);
            }
        });

        while (day.isBefore(endOfWeek)) {
            timeSlots.forEach((_, timeIndex) => {
                const isLastColumn = day.diff(startOfWeek, 'days') === 6;
                const isLastRow = timeIndex === timeSlots.length - 1;

                const cellKey = `${day.format('YYYY-MM-DD')}-${timeIndex}`;
                const eventCell = eventCells.get(cellKey);

                cells.push(
                    <div
                        key={cellKey}
                        className={`h-14 sm:h-[110px] ${!isLastRow ? 'border-b' : ''} ${!isLastColumn ? 'border-r' : ''} border-darkMetal`}
                        style={{
                            gridColumn: day.diff(startOfWeek, 'days') + 1,
                            gridRow: timeIndex + 1,
                        }}
                    >
                        {eventCell || null}
                    </div>
                );
            });
            day.add(1, 'day');
        }

        return cells;
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside as EventListener);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside as EventListener);
        };
    }, []);

    useEffect(() => {
        if (selectedDate) {
            const date = moment(selectedDate);
            setCurrentWeek(date.clone().startOf('week'));
        }
    }, [selectedDate]);

    return (
        <div className="flex flex-col items-center gap-4 w-full pb-8">
            <div className="flex justify-between w-full items-center px-3">
                <div className='flex gap-1 items-center'>
                    <h3 className="text-white font-medium text-xs sm:text-custom-22 leading-5 sm:leading-7">
                        {startOfWeek.format('MMMM')}
                    </h3>
                    <h3 className='text-gray font-medium text-xs sm:text-custom-22 leading-5 sm:leading-7'>
                        {startOfWeek.format('YYYY')}
                    </h3>
                </div>
                <div className='flex gap-2'>
                    <button onClick={handlePreviousWeek} className="p-2 sm:p-3 bg-rangoonGreen flex justify-center items-center rounded-full overflow-hidden">
                        <Image src="/static/stick-arr-left.svg" width={14} height={14} alt="Previous Week" />
                    </button>
                    <button onClick={handleNextWeek} className="p-2 sm:p-3 bg-rangoonGreen flex justify-center items-center rounded-full overflow-hidden">
                        <Image src="/static/stick-arr-right.svg" width={14} height={14} alt="Next Week" />
                    </button>
                </div>
            </div>
            <div className="border border-darkMetal rounded-xl w-full">
                <div className='grid grid-cols-[60px_repeat(7,_1fr)] sm:grid-cols-[80px_repeat(7,_1fr)] grid-rows-[auto_repeat(24,_1fr)]'>
                    <div className='border-r border-darkMetal flex flex-col'>
                        <div className='border-b border-darkMetal'>
                            <div className='flex justify-center items-center px-3 h-[48px]'>
                                <h2 className='font-semibold text-xs sm:text-sm leading-3 sm:leading-5 text-white'>{startOfWeek.format('MMM')}</h2>
                            </div>
                        </div>
                        {renderTimeSlots()}
                    </div>

                    <div className='col-span-7'>
                        <div className='grid grid-cols-7 border-b border-darkMetal'>
                            {renderWeekDays()}
                        </div>
                        <div className='grid grid-cols-7 grid-rows-[repeat(24,_1fr)]'>
                            {renderCells()}
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <Modal
                    onClose={() => {
                        setIsModalOpen(false);
                        setActiveTooltipId('');
                    }}
                    buttonAction={confirmDelete}
                    buttonText="Delete"
                    description="Are you sure you want to delete this event?"
                    iconSrc="/static/trash-white.svg"
                    title="Delete Event"
                    isDeleteModal={true}
                />
            )}
            {isSuccesModalOpen && (
                <Modal
                    onClose={() => setIsSuccesModalOpen(false)}
                    buttonAction={() => setIsSuccesModalOpen(false)}
                    buttonText="Done"
                    description="Event Deleted Succesfully!"
                    iconSrc="/static/checkmark.svg"
                    title="Event Deleted!"
                />
            )}
        </div>
    );
};

export default memo(WeeklyCalendar);