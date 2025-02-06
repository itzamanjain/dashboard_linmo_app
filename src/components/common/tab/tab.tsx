import { memo } from "react";

import TabProps from "./interfaces/tabProps";

const Tab = (props: TabProps) => {
    const { label, notifications, isActive, setActive } = props;
    const showNotifications = notifications > 0;

    return (
        <div
            className={`flex gap-[0.375rem] items-center justify-normal lg:justify-between 2xl:justify-normal rounded-[0.625rem] cursor-pointer 
                        ${showNotifications ? 'p-[0.375rem]' : 'px-3 py-[0.375rem]'}  
                        ${isActive ? 'bg-green' : 'bg-rangoonGreen'}`}
            onClick={setActive}
        >
            <h4
                className={`font-bold text-sm leading-custom-22 
                    ${isActive ? 'text-black' : 'text-white'}`}
            >
                {label}
            </h4>
            {showNotifications && (
                <div
                    className={`w-[20px] h-[20px] flex justify-center items-center rounded-[0.375rem] 
                        ${isActive ? 'bg-navyGreen' : 'bg-onyx'}`}
                >
                    <p
                        className={`font-bold text-xs leading-custom-18 
                            ${isActive ? 'text-green' : 'text-custard'}`}
                    >
                        {notifications}
                    </p>
                </div>
            )}
        </div>
    )
}

export default memo(Tab);