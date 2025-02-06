import moment from 'moment';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';

import useReducerDispatch from '@/hooks/useReducerDispatch';
import useSliceSelector from '@/hooks/useSliceSelector';
import { setSelectedDate } from '@/reducers/dashboard/dashboardSlice';

import Event from '@/app/models/Event';
import EventsByMonth from '@/components/upcomingEvents/interfaces/eventsByMonth';
import MonthCalendarProps from './interfaces/monthCalendarProps';

const MonthCalendar = (props: MonthCalendarProps) => {
    const { selectedStartDate, onStartDateSelect, onEndDateSelect, showEvents = true } = props;

    const [currentMonth, setCurrentMonth] = useState(moment());
    const [localSelectedDate, setLocalSelectedDate] = useState<moment.Moment | null>(null);
    const selectedDate = useSliceSelector((state) => state.dashboard.selectedDate);
    const allEvents = useSliceSelector(state => state.dashboard.allEvents);
    const dispatch = useReducerDispatch();

    const currentTime = moment();

    const groupEventsByMonth = (events: Event[]): EventsByMonth => {
        return events.reduce((acc: EventsByMonth, event: Event) => {
            const month = moment(event.trainingStartDateTime).format("MMMM YYYY");
            if (!acc[month]) {
                acc[month] = [];
            }
            acc[month].push(event);
            return acc;
        }, {} as Record<string, Event[]>);
    };

    const upcomingEvents = allEvents.filter(event => moment(event.trainingStartDateTime).isAfter(currentTime));
    const eventsByMonth = groupEventsByMonth(upcomingEvents);

    const hasEventOnDate = (date: moment.Moment) => {
        if (!showEvents) return false;
        const monthKey = date.format('MMMM YYYY');
        if (eventsByMonth[monthKey]) {
            return eventsByMonth[monthKey].some((event) => moment(event.trainingStartDateTime).isSame(date, 'day'));
        }
        return false;
    };

    useEffect(() => {
        if (selectedDate) {
            setCurrentMonth(moment(selectedDate));
        } else if (!showEvents && localSelectedDate) {
            setCurrentMonth(moment(localSelectedDate));
        } else {
            setCurrentMonth(moment());
        }
    }, [selectedDate, localSelectedDate, showEvents]);

    const handlePreviousMonth = () => {
        setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setCurrentMonth(currentMonth.clone().add(1, 'month'));
    };

    const handleDateClick = (date: moment.Moment) => {
        if (showEvents) {
            if (selectedDate && moment(selectedDate).isSame(date, 'day')) {
                dispatch(setSelectedDate(''));
            } else {
                dispatch(setSelectedDate(date.toISOString()));
            }
        } else {
            if (localSelectedDate && localSelectedDate.isSame(date, 'day')) {
                setLocalSelectedDate(null);
            } else {
                setLocalSelectedDate(date);
            }
        }

        if (onStartDateSelect && !selectedStartDate) {
            onStartDateSelect(date);
        }
        if (onEndDateSelect && selectedStartDate) {
            onEndDateSelect(date);
        }
    };

    const renderCalendar = () => {
        const startOfMonth = currentMonth.clone().startOf('month');
        const endOfMonth = currentMonth.clone().endOf('month');
        const startOfWeek = startOfMonth.clone().startOf('week');
        const endOfWeek = endOfMonth.clone().endOf('week');

        const calendar = [];
        const day = startOfWeek.clone();

        while (day.isBefore(endOfWeek, 'day')) {
            calendar.push(
                <div className="grid grid-cols-7 gap-[0.656rem]" key={day.format('YYYY-MM-DD')}>
                    {[...Array(7)].map(() => {
                        const currentDay = day.clone();
                        day.add(1, 'day');

                        const isCurrentMonth = currentDay.month() === currentMonth.month();
                        const isSelectedDate = (showEvents ? selectedDate && currentDay.isSame(moment(selectedDate), 'day')
                            : localSelectedDate && currentDay.isSame(localSelectedDate, 'day'));
                        const isToday = currentDay.isSame(moment(), 'day');
                        const hasEvent = showEvents && hasEventOnDate(currentDay);

                        let backgroundClass = '';
                        let textClass = '';
                        if (isSelectedDate) {
                            backgroundClass = 'bg-swampGreen';
                            textClass = 'text-green';
                        } else if (isToday) {
                            backgroundClass = 'bg-green';
                            textClass = 'text-cinder';
                        } else if (showEvents && hasEvent) {
                            backgroundClass = 'bg-olive';
                            textClass = 'text-green';
                        }

                        return (
                            <div
                                key={currentDay.format('YYYY-MM-DD')}
                                className={`flex items-center justify-center mb-[0.625rem] py-[0.625rem] px-1 rounded-full w-10 h-10 cursor-pointer 
                                    ${isCurrentMonth ? 'text-white' : 'text-gray'}
                                    ${currentDay.month() !== currentMonth.month() ? 'text-charcoal opacity-50' : ''}
                                    ${backgroundClass}`}
                                onClick={() => handleDateClick(currentDay)}
                            >
                                <h2 className={`font-semibold text-sm leading-5 text-center 
                                    ${textClass}`}
                                >
                                    {currentDay.date()}
                                </h2>
                            </div>
                        );
                    })}
                </div>
            );
        }
        return calendar;
    };

    return (
        <div className={`flex flex-col gap-2 ${!showEvents ? 'bg-rangoonGreen rounded-xl p-4 pb-0' : ''}`}>
            <div
                className={`flex justify-between items-center mb-2
                ${!showEvents ? 'border-b border-darkMetal pb-2' : ''}`}
            >
                <button
                    className="px-4 py-2"
                    onClick={handlePreviousMonth}
                >
                    <Image
                        src="/static/left.svg"
                        width={6}
                        height={12}
                        alt="Previous"
                    />
                </button>
                <h3 className="text-white font-semibold text-base leading-6 text-center">
                    {currentMonth.format('MMMM, YYYY')}
                </h3>

                <button
                    className="px-4 py-2"
                    onClick={handleNextMonth}
                >
                    <Image
                        src="/static/right.svg"
                        width={6}
                        height={12}
                        alt="Next"
                    />
                </button>
            </div>
            <div className="grid grid-cols-7 text-center font-medium text-sm leading-custom-22 text-darkgray gap-[0.656rem]">
                <h2>Sun</h2>
                <h2>Mon</h2>
                <h2>Tue</h2>
                <h2>Wed</h2>
                <h2>Thu</h2>
                <h2>Fri</h2>
                <h2>Sat</h2>
            </div>

            <div>{renderCalendar()}</div>
        </div>
    );
};

export default memo(MonthCalendar);
