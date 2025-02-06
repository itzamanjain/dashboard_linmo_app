import Image from "next/image";
import { memo, useState } from "react";

import useSliceSelector from "@/hooks/useSliceSelector";
import SidebarLayoutProps from "./interfaces/sidebarLayoutProps";

const SidebarLayout = (props: SidebarLayoutProps) => {
    const { children, sidebarContent } = props;

    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const activeTab = useSliceSelector((state) => state.dashboard.activeTab);
    const notifications = useSliceSelector(state => state.dashboard.notifications);
    const activeContent = useSliceSelector(state => state.dashboard.mainActiveContent);

    const handleRightSidebarToggle = () => {
        setIsRightSidebarOpen(!isRightSidebarOpen);
    };

    const checkContent = notifications.length && activeContent === 'Calendar';

    const sidebar = () => {
        return (
            <div className={`bg-black fixed inset-y-0 right-0 py-8 pr-2 lg:static w-full custom-mobile-417:w-[407px] flex flex-col z-40
        transition-transform duration-300 ease-in-out ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto
        lg:translate-x-0 ${activeContent === 'Calendar' ? 'lg:border-l border-darkMetal' : ''} ${checkContent || activeContent === 'Create Event' ? 'h-max' : 'h-full'}`}>
                {sidebarContent}
            </div>
        )
    }

    let content;

    if (activeTab != 'Week') {
        content = sidebar();

    } else if (activeContent === 'Create Event') {
        content = sidebar();
    }

    return (
        <>
            {children}
            <button
                onClick={handleRightSidebarToggle}
                className="lg:hidden fixed top-2 right-4 p-2 z-50"
            >
                <Image
                    src="/static/right-sidebar.svg"
                    width={20}
                    height={20}
                    alt="right"
                />
            </button>
            {content}
        </>
    );
};

export default memo(SidebarLayout);