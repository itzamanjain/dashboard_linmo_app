import { memo } from "react";

import useSliceSelector from "@/hooks/useSliceSelector";
import HeaderProps from "./interfaces/headerProps";

const Header = (props: HeaderProps) => {
    const { title, onCancelClick, onCreateEventClick, showCancelButton = false, } = props;

    const isEditingEvent = useSliceSelector(state => state.dashboard.isEditingEvent);
    const isEditingFollowingEvent = useSliceSelector(state => state.dashboard.isEditingFollowingEvent);
    return (
        <div className="flex justify-between flex-row">
            <h1 className="text-white font-bold text-custom-32 leading-9">{title}</h1>
            <div className="flex gap-4">
                {showCancelButton && (
                    <button
                        className="bg-darkJungle px-4 py-2 text-white font-bold text-sm leading-custom-22 rounded-[0.625rem]"
                        onClick={onCancelClick}
                    >
                        Cancel
                    </button>
                )}
                <button
                    className="bg-green px-4 py-2 text-black font-bold text-sm leading-custom-22 rounded-[0.625rem]"
                    onClick={onCreateEventClick}
                >
                    {isEditingEvent || isEditingFollowingEvent ? 'Update Event' : 'Create Event'}

                </button>
            </div>
        </div>
    )
}

export default memo(Header);