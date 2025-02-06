import moment from "moment";
import { memo } from "react";

import TimePickerProps from "./interfaces/timePickerProps";

const TimePicker = (props: TimePickerProps) => {
    const { selectedTime, onTimeSelect } = props;

    const currentTime = moment().minutes(Math.round(moment().minutes() / 30) * 30).seconds(0);

    const timeSlots: moment.Moment[] = [];
    for (let i = 0; i < 24 * 2; i++) {
        const time = moment().startOf('day').add(i * 30, 'minutes');
        timeSlots.push(time);
    }

    return (
        <div className="overflow-y-scroll max-h-[21.75rem] w-[10.313rem] bg-rangoonGreen rounded-xl pt-4 px-1">
            {timeSlots.map((time, index) => {
                const isSelected = selectedTime && selectedTime.isSame(time, 'minute');
                const isCurrentTime = currentTime.isSame(time, 'minute');

                return (
                    <div
                        key={index}
                        onClick={() => onTimeSelect(time)}
                        className={`cursor-pointer py-2 px-4 rounded-lg transition-colors duration-200
                            ${isCurrentTime ? 'bg-green' : isSelected ? 'bg-olive' : 'bg-transparent text-gray-300'}
                        `}
                    >
                        <p className={`${isCurrentTime ? 'text-black' : 'text-white'} font-normal text-sm leading-custom-22 opacity-90`}>
                            {time.format('HH:mm')}
                        </p>
                    </div>
                );
            })}
        </div>
    )
}

export default memo(TimePicker);