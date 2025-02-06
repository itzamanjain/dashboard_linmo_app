import Image from "next/image";
import { memo } from "react";

import TooltipProps from "./interfaces/tooltipProps";

const Tooltip = (props: TooltipProps) => {
    const { options, showTooltip, tooltipRef } = props;

    if (!showTooltip) return null;
    return (
        <div
            ref={tooltipRef}
            className="absolute top-2/3 right-6 bg-darkJungle rounded-lg shadow-[0px_4px_20px_0px_#1413181A] z-10 w-[9.375rem]">
            <div className="flex flex-col">
                {options.map((item, index) => {
                    const isLastItem = index === options.length - 1;
                    return (
                        <div
                            key={index}
                            className={`flex justify-between px-3 py-2 
                                ${!isLastItem ? 'border-b-darkMetal border-b ' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (item.action) {
                                    item.action();
                                }
                            }}
                        >
                            <h4
                                className={`font-medium text-sm leading-custom-22 
                                    ${item.option === 'Delete' ? 'text-orange' : 'text-white'}`}
                            >
                                {item.option}
                            </h4>
                            <div className="min-w-[16px] flex justify-center items-center">
                                <Image
                                    src={item.icon.src}
                                    alt={item.option}
                                    width={item.icon.width}
                                    height={item.icon.height}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default memo(Tooltip);