"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { memo, useMemo, useState } from 'react';

import SidebarMenu from '@/components/sidebarMenu/sidebarMenu';

import useSliceSelector from "@/hooks/useSliceSelector";
import LayoutWrapperProps from "./interfaces/layoutWrapperProps";

const LayoutWrapper = (props: LayoutWrapperProps) => {
    const { children } = props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";
    const selectedDate = useSliceSelector(state => state.dashboard.selectedDate);
    const activeTab = useSliceSelector(state => state.dashboard.activeTab);

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    const containerHeight = useMemo(() => selectedDate || activeTab === 'Past' ? 'h-screen' : 'h-full', [selectedDate, activeTab])

    return (
        <div className="flex relative h-screen box-border mx-auto font-inter antialiased">
            <button
                onClick={handleSidebarToggle}
                className="lg:hidden fixed top-2 left-4 p-2 z-50"
            >
                <Image
                    src="/static/left-sidebar.svg"
                    width={20}
                    height={20}
                    alt="left"
                />
            </button>
            {!isLoginPage && (
                <div className={`p-3 fixed inset-y-0 left-0 w-56 lg:static flex flex-col h-full z-40 
                    transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                    <SidebarMenu closeSidebar={handleCloseSidebar} />
                </div>
            )}
            <div className={`flex-1 flex overflow-y-auto ${containerHeight}`}>
                {children}
            </div>
        </div>
    )
}

export default memo(LayoutWrapper);