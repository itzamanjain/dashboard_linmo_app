import moment from "moment";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import Modal from "@/components/modals/modal/modal";
import Tooltip from "../tooltip/tooltip";

import useReducerDispatch from "@/hooks/useReducerDispatch";
import { removeEvent, setActiveContent, setActiveEventId, setAttendeesIds, setIsEditingEvent, setIsEditingFollowingEvent, setMainActiveContent } from "@/reducers/dashboard/dashboardSlice";

import TooltipOptions from "../tooltip/interfaces/tooltipOptions";
import EventCardProps from "./interfaces/eventCardProps";
import EditEventModal from "@/components/modals/modal/editEvent";

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

const EventCard = (props: EventCardProps) => {
    const { trainingId, trainingStartDateTime, title, trainingLocationString, participants, trainingEndDateTime, onEventClick, activeId, fromAttendees = false } = props;

    const eventStartDate = moment(trainingStartDateTime);
    const eventEndDate = moment.utc(trainingEndDateTime);
    const day = eventStartDate.format('ddd');
    const date = eventStartDate.format('D');
    const eventDuration = `${moment.utc(trainingStartDateTime).format('HH:mm')} - ${eventEndDate.format('HH:mm')}`;
    const attendees = participants.length;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccesModalOpen, setIsSuccesModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const tooltipRef = useRef<HTMLDivElement>(null);
    const dotsRef = useRef<HTMLDivElement>(null);
    const [activeTooltipId, setActiveTooltipId] = useState<string | undefined>('');
    const dispatch = useReducerDispatch();

    const handleDeleteClick = () => {
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!trainingId) return;
        setIsLoading(true);
        try {
            const response = await fetch(`https://prod-ts-liveliness-server.onrender.com/api/event/${trainingId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            await response.json();
            setIsModalOpen(false);
            setSuccessMessage('Event deleted successfully!');
            setIsSuccesModalOpen(true);
            setActiveTooltipId('');
            dispatch(removeEvent(trainingId));
            setIsLoading(false);
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const confirmDeleteMultiple = async () => {
        if (!trainingId) return;
        setIsLoading(true);
        try {
            const response = await fetch(`https://prod-ts-liveliness-server.onrender.com/api/event/session/${trainingId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const data = await response.json();

            setIsModalOpen(false);
            setSuccessMessage(`${data.deletedEvents.length} events deleted successfully!`);
            setIsSuccesModalOpen(true);
            setActiveTooltipId('');
            dispatch(removeEvent(data.deletedEvents));
            setIsLoading(false);
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    // const handleEditClick = useCallback(() => {
    //     console.log("Editing event:", trainingId);
    //     setIsEditModalOpen(true);
    //     // dispatch(setIsEditingEvent(true));
    //     // dispatch(setMainActiveContent('Create Event'));
    // }, [trainingId, dispatch]);


    // const handleEditOne = useCallback(() => {
    //     setIsEditingEvent(true);
    //     setIsEditingFollowingEvent(false);
    //     setIsEditModalOpen(true);
    //     dispatch(setIsEditingEvent(true));
    //     dispatch(setMainActiveContent('Create Event'));
    //     console.log("Editing single event");
    // }, [trainingId, dispatch]);

    // const handleEditAll = useCallback(() => {
    //     setIsEditingEvent(false);
    //     setIsEditingFollowingEvent(true);
    //     setIsEditModalOpen(true);
    //     dispatch(setIsEditingFollowingEvent(true));
    //     dispatch(setMainActiveContent('Create Event'));
    //     console.log("Editing this and following events");
    // }, [trainingId, dispatch]);

    // const handleEdit = useCallback((type: 'one' | 'all' | null) => {
    //     console.log("Editing event:", trainingId);
    //     console.log("Type: ✅✅✅", type);
    //     setIsEditModalOpen(true);

    //     if (type === 'one') {
    //         setIsEditingEvent(true);
    //         setIsEditingFollowingEvent(false);
    //         dispatch(setIsEditingEvent(true));
    //         console.log("Editing single event");
    //     } else if (type === 'all') {
    //         setIsEditingEvent(false);
    //         setIsEditingFollowingEvent(true);
    //         dispatch(setIsEditingFollowingEvent(true));
    //         console.log("Editing this and following events");
    //     }
    
    //     setIsEditModalOpen(true);
    //     dispatch(setMainActiveContent('Create Event'));
    // }, [trainingId, dispatch, setIsEditingEvent, setIsEditingFollowingEvent]);
    

    const handleEdit = useCallback((type: 'one' | 'all' | null) => {
        console.log("Editing event:", trainingId);
        
        // Make sure to set the active event ID again
        if (trainingId) {
            console.log("setting to localStorage", trainingId);
            
            localStorage.setItem('editingEventId', trainingId);
            dispatch(setActiveEventId(trainingId));
        }
        
        if (type === 'one') {
            dispatch(setIsEditingEvent(true));
            dispatch(setIsEditingFollowingEvent(false));
            console.log("Editing single event");
        } else if (type === 'all') {
            dispatch(setIsEditingEvent(false));
            dispatch(setIsEditingFollowingEvent(true));
            console.log("Editing this and following events");
        }
        
        // Make sure to set the main active content here
        dispatch(setMainActiveContent('Create Event'));
        
        // Close the modal
        setIsEditModalOpen(false);
    }, [trainingId, dispatch, setIsEditModalOpen]);

    const handleCancel = () => {
        setIsEditModalOpen(false);
        console.log("Edit cancelled");
    };

    const handleDuplicateClick = () => {
        console.log("Duplicating event:", trainingId);
    };

    const handleAttendeesClick = () => {
        console.log("Attendees:", trainingId);
        dispatch(setAttendeesIds(participants));
        dispatch(setActiveContent('attendees'));
    };

    const updatedTooltipOptions = tooltipOptions.map(option => {
        switch (option.option) {
            case 'Edit Event':
                return { 
                    ...option, 
                    action: () => {
                        if (trainingId) {
                            // Make sure to dispatch this first and wait for it to take effect
                            dispatch(setActiveEventId(trainingId));
                        }
                        setIsEditModalOpen(true);  // Just open the modal, don't call handleEdit yet
                        setActiveTooltipId('');    // Close tooltip after clicking
                    }
                 };
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


    const handleToggleTooltip = (e: React.MouseEvent, tooltipId: string | undefined) => {
        e.stopPropagation();
        setActiveTooltipId(prevId => (prevId === tooltipId ? '' : tooltipId));
        trainingId && dispatch(setActiveEventId(trainingId));
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

    const handleEventClick = () => {
        trainingId && onEventClick?.(trainingId, trainingStartDateTime);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside as EventListener);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside as EventListener);
        };
    }, []);

    const divider = () => {
        return <div className="border-l border-darkMetal h-14 hidden sm:block lg:hidden 2xl:block"></div>;
    }

    const isSelected = useMemo(() => activeId === trainingId && !fromAttendees, [activeId, trainingId, fromAttendees]);
    const activeTooltip = useMemo(() => activeTooltipId === trainingId, [activeTooltipId, trainingId]);

    return (
        <div className="cursor-pointer relative flex flex-col sm:flex-row lg:flex-col 2xl:flex-row items-start sm:items-center lg:items-start 2xl:items-center justify-between py-4 px-4 2xl:px-8 border border-darkMetal rounded-2xl gap-4 2xl:gap-8"
            onClick={handleEventClick}
        >
            {isLoading ? <div className="loading-state">
                <div className="loading"></div>
            </div> : ""}
            <div className="flex flex-col lg:flex-row 2xl:flex-col justify-center items-center gap-2 2xl:gap-0">
                <h2
                    className={`font-medium text-base leading-6 ${isSelected ? 'text-green' : 'text-white'}`}
                >
                    {day}
                </h2>
                <h3
                    className={`font-semibold text-custom-26 leading-8 ${isSelected ? 'text-green' : 'text-white'}`}
                >
                    {date}

                </h3>
            </div>
            {divider()}
            <div className="flex flex-col gap-3 w-auto lg:w-full 2xl:w-[auto] min-w-[220px] max-w-[220px]">
                <div className="flex gap-2">
                    <div className="min-w-[13.3px] flex justify-center items-center">
                        <Image
                            src={"/static/clock.svg"}
                            alt={"time"}
                            width={13.3}
                            height={13.3}
                        />
                    </div>
                    <h2 className="font-medium text-sm leading-custom-22 text-white">{eventDuration}</h2>
                </div>
                <div className="flex gap-2">
                    <div className="min-w-[13.3px] flex justify-center items-center">
                        <Image
                            src={"/static/pin.svg"}
                            alt={"location"}
                            width={10.6}
                            height={13.3}
                        />
                    </div>
                    <h2 className="font-medium text-xs leading-custom-18 text-gray">{trainingLocationString}</h2>
                </div>
            </div>
            {divider()}
            <div className="flex flex-col gap-2 flex-grow">
                <h2 className="font-semibold text-lg leading-6 text-white">{title}</h2>
                <p className="font-normal text-sm leading-custom-22 text-darkgray">{attendees} Going</p>
            </div>
            {!fromAttendees && (
                <div
                    className="top-6 right-4 absolute sm:static lg:absolute 2xl:static 2xl:ml-4 cursor-pointer py-1 min-w-[18px] min-h-[16px]"
                    onClick={(e) => handleToggleTooltip(e, trainingId)}
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
                            showTooltip={activeTooltipId === props.trainingId}
                            tooltipRef={tooltipRef}
                        />
                    }
                </div>
            )}
            {
                isEditModalOpen && (
                    <EditEventModal
                        handleEdit={handleEdit}
                        isOpen={isEditModalOpen}
                        onCancel={handleCancel}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setActiveTooltipId('');
                        }}
                    />
                )
            }

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
                    deleteMultiple={confirmDeleteMultiple}
                />
            )}
            {isSuccesModalOpen && (
                <Modal
                    onClose={() => setIsSuccesModalOpen(false)}
                    buttonAction={() => setIsSuccesModalOpen(false)}
                    buttonText="Done"
                    description={successMessage}
                    iconSrc="/static/checkmark.svg"
                    title={successMessage === 'Event deleted successfully!' ? "Event Deleted!" : "Events Deleted!"}
                />
            )}
        </div>
    )
}

export default memo(EventCard);