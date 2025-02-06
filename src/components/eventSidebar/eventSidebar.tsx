import Image from "next/image";
import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import Map from "../common/map/map";

import useSliceSelector from "@/hooks/useSliceSelector";

import EventSidebarProps from "./interfaces/eventSidebarProps";

const EventSidebar = (props: EventSidebarProps) => {
    const {
        position,
        onLocationSelect,
        address,
        onCityChange,
        city,
        startTime,
        attendees,
        description,
        startDate,
        title,
        selectedImages
    } = props;

    // const [isIncludedOpen, setIsIncludedOpen] = useState(false);
    // const [isAdditionalInfoOpen, setIsAdditionalInfoOpen] = useState(false);
    const userDetails = useSliceSelector(state => state.dashboard.userDetails);
    const displayName = userDetails.name || 'Anonymous';
    const userPhoto = userDetails.mainProfilePhoto || '/static/user.svg';

    // const handleToggleIncluded = () => {
    //     setIsIncludedOpen(!isIncludedOpen);
    // };

    // const handleToggleAdditionalInfo = () => {
    //     setIsAdditionalInfoOpen(!isAdditionalInfoOpen);
    // };

    const formattedStartDateTime = startDate && startTime
        ? `${startDate.format('dddd, MMMM D')} at ${startTime.format('HH:mm')}`
        : "Sunday, May 29 at 19:00";

    const maxVisibleAttendees = 6;

    return (
        <div className="bg-darkJungle rounded-3xl">
            <div className="py-4 px-3 flex flex-col gap-4">
                <h3 className="text-white font-semibold text-lg leading-6 text-center">
                    Preview On App
                </h3>
                <div className="flex flex-col gap-3 p-4 bg-black border-2 border-darkMetal rounded-3xl">
                    <Swiper
                        spaceBetween={10}
                        slidesPerView={1.06}
                        className="w-full"
                        draggable={true}
                    >
                        {selectedImages && selectedImages.length > 0 ? (
                            selectedImages.map((imageUrl, index) => (
                                <SwiperSlide key={index} className="min-h-[320px] !flex justify-center items-center">
                                    <Image
                                        src={imageUrl}
                                        alt={`Selected Image ${index + 1}`}
                                        width={320}
                                        height={320}
                                        objectFit="cover"
                                        className="rounded-xl"
                                    />
                                </SwiperSlide>
                            ))
                        ) : (
                            <>
                                <SwiperSlide>
                                    <Image
                                        src="/static/event.svg"
                                        alt="Fallback event image"
                                        width={320}
                                        height={320}
                                    />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Image
                                        src="/static/event.svg"
                                        alt="Fallback event image"
                                        width={320}
                                        height={320}
                                    />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Image
                                        src="/static/event.svg"
                                        alt="Fallback event image"
                                        width={320}
                                        height={320}
                                    />
                                </SwiperSlide>
                            </>
                        )}
                    </Swiper>
                    <div className="flex flex-col gap-1">
                        <h4 className="text-white font-bold text-custom-22 leading-7">
                            {title ? title : 'Running to the beach from city'}
                        </h4>
                        <div className="flex gap-2 items-center">
                            <div className="flex gap-1">
                                <Image
                                    src="/static/star.svg"
                                    alt="reviews"
                                    width={12.5}
                                    height={12}
                                />
                                <p className="text-white text-sm font-semibold leading-5">4.5</p>
                            </div>
                            <p className="text-gray font-normal text-sm leading-custom-22">100 reviews</p>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex gap-3 items-center border-b border-darkMetal py-3">
                            <div className="min-w-[1.125rem]">
                                <Image
                                    src="/static/calendar.svg"
                                    alt="Sunday, May 29 at 19:00"
                                    width={18}
                                    height={20}
                                />
                            </div>
                            <h3 className="text-white font-semibold text-base leading-6">
                                {formattedStartDateTime}
                            </h3>
                        </div>
                        <div className="flex gap-3 items-center border-b border-darkMetal py-3">
                            <div className="min-w-[1.125rem]">
                                <Image
                                    src="/static/pin.svg"
                                    alt="Sants Estacio, Barcelona, Spain"
                                    width={16}
                                    height={20}
                                />
                            </div>
                            <h3 className="text-white font-semibold text-base leading-6">
                                {city ? city : 'Sants Estacio, Barcelona, Spain'}
                            </h3>
                        </div>
                    </div>
                    <div className="bg-rangoonGreen rounded-xl p-3 flex flex-col gap-2 items-start">
                        <div className="justify-between items-center flex w-full">
                            <div className="flex gap-3 items-center">
                                <div className="w-[2rem] h-[2rem] overflow-hidden rounded-full">
                                    <Image
                                        src={userPhoto}
                                        alt="Nolan Dorwart"
                                        width={32}
                                        height={32}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-gray text-xs font-normal leading-custom-18">Hosted by</p>
                                    <h3 className="font-semibold text-white text-sm leading-5">{displayName}</h3>
                                </div>
                            </div>
                            <>
                                <button className="text-black text-xs font-bold leading-custom-18 py-1 px-3 bg-white rounded-full">
                                    Message
                                </button>
                            </>
                        </div>
                        <div className="border-t border-darkJungle"></div>
                        <button className="text-green text-xs leading-custom-18 font-normal flex gap-2 items-center">
                            See more events from this coach
                            <Image
                                src={"/static/btn-arr.svg"}
                                alt="More"
                                width={4}
                                height={8}
                            />
                        </button>
                    </div>
                    <div className="flex- flex-col gap-[0.125rem]">
                        <h3 className="text-white font-semibold text-base leading-6">Description</h3>
                        <p className="text-iron font-normal text-base leading-6">
                            {description ?
                                description :
                                `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Felis nunc purus urna,
                            nisi nulla rhoncus vel, non. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Felis nunc purus urna, nisi nulla rhoncus vel, non. consectetur adipiscing elit.
                            Felis nunc purus urna, nisi nulla rhoncus vel, non. consectetur adipiscing elit.
                            Felis nunc purus urna, nisi nulla rhoncus vel, non.`
                            }
                        </p>
                    </div>
                    {/* <div className="flex flex-col border-y border-darkJungle">
                        <div className="py-5">
                            <div className="flex justify-between cursor-pointer" onClick={handleToggleIncluded}>
                                <h3 className="text-white font-semibold text-base leading-6">What&apos;s included</h3>
                                <Image
                                    src="/static/d-arr.svg"
                                    alt=""
                                    width={8}
                                    height={4}
                                    className={`transition-transform duration-300 ease-in-out ${isIncludedOpen ? 'rotate-180' : ''}`}
                                />
                            </div>
                            <div
                                className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isIncludedOpen ? 'max-h-screen' : 'max-h-0'}`}
                            >
                                <p className="text-iron font-normal text-base leading-6">
                                    {includedField ?
                                        includedField :
                                        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Felis nunc purus urna`
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-darkJungle"></div>
                        <div className="py-5">
                            <div className="flex justify-between cursor-pointer" onClick={handleToggleAdditionalInfo}>
                                <h3 className="text-white font-semibold text-base leading-6">Additional information</h3>
                                <Image
                                    src="/static/d-arr.svg"
                                    alt=""
                                    width={8}
                                    height={4}
                                    className={`transition-transform duration-300 ease-in-out ${isAdditionalInfoOpen ? 'rotate-180' : ''}`}
                                />
                            </div>
                            <div
                                className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isAdditionalInfoOpen ? 'max-h-screen' : 'max-h-0'}`}
                            >
                                <p className="text-iron font-normal text-base leading-6">
                                    {additionalField ?
                                        additionalField :
                                        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Felis nunc purus urna`
                                    }
                                </p>
                            </div>
                        </div>
                    </div> */}
                    <div className="border-y border-darkJungle py-4 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-1 items-center">
                                <h3 className="text-white font-semibold text-base leading-6">Attendees</h3>
                                <p className="text-davyGray font-medium text-xs leading-custom-18">
                                    {attendees > 0 ? attendees - 1 : attendees}/{attendees}
                                </p>
                            </div>
                            <h3 className="text-white font-bold text-xs leading-custom-18 cursor-pointer">See All</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            {attendees === 0 ?
                                <div className="w-[2.5rem] h-[2.5rem] overflow-hidden rounded-full">
                                    <Image
                                        src="/static/user.svg"
                                        alt="Attendee"
                                        width={40}
                                        height={40}
                                    />
                                </div> :
                                <>
                                    {Array.from({ length: Math.min(attendees, maxVisibleAttendees) }, (_, i) => (
                                        <div key={i} className="w-[2.5rem] h-[2.5rem] overflow-hidden rounded-full">
                                            <Image
                                                src="/static/user.svg"
                                                alt={`Attendee ${i + 1}`}
                                                width={40}
                                                height={40}
                                            />
                                        </div>
                                    ))}
                                    {attendees > maxVisibleAttendees && (
                                        <div className="w-[2.5rem] h-[2.5rem] flex items-center justify-center bg-darkJungle rounded-full text-center p-1">
                                            <p className="text-white text-xs font-normal leading-4">
                                                +{attendees - maxVisibleAttendees}
                                            </p>
                                        </div>
                                    )}
                                </>
                            }
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-center">
                        <div className="flex">
                            <div className="flex gap-1">
                                <Image
                                    src="/static/star.svg"
                                    alt="reviews"
                                    width={18}
                                    height={18}
                                />
                                <p className="text-white text-base font-semibold leading-6">4.5</p>
                            </div>
                            <div className="flex gap-1">
                                <Image
                                    src="/static/dot.svg"
                                    alt="reviews"
                                    width={6}
                                    height={6}
                                />
                                <p className="text-gray font-normal text-base leading-6">22 reviews</p>
                            </div>
                        </div>
                        <Swiper
                            spaceBetween={10}
                            slidesPerView={1.06}
                            className="w-full"
                            draggable={true}
                        >
                            <SwiperSlide className="bg-rangoonGreen rounded-xl p-4 !flex flex-col gap-2">
                                <p className="text-white font-normal text-sm leading-custom-18 opacity-90">
                                    lot nisi amet vulputate imperdiet. Ut et cras ultrices etiam aenean nunc turpisc ds sdsdsdds dsds...
                                </p>
                                <div className="flex gap-2 items-center">
                                    <div className="w-[1.5rem] h-[1.5rem] overflow-hidden rounded-full">
                                        <Image
                                            src="/static/user.svg"
                                            alt="user"
                                            width={24}
                                            height={24}
                                        />
                                    </div>
                                    <h3 className="text-white font-normal text-sm leading-custom-18">Warren</h3>
                                    <p className="text-gray text-[0.625rem] font-normal leading-[0.875rem]">1 week ago</p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide className="bg-rangoonGreen rounded-xl p-4 !flex flex-col gap-2">
                                <p className="text-white font-normal text-sm leading-custom-18 opacity-90">
                                    lot nisi amet vulputate imperdiet. Ut et cras ultrices etiam aenean nunc turpisc ds sdsdsdds dsds...
                                </p>
                                <div className="flex gap-2 items-center">
                                    <div className="w-[1.5rem] h-[1.5rem] overflow-hidden rounded-full">
                                        <Image
                                            src="/static/user.svg"
                                            alt="user"
                                            width={24}
                                            height={24}
                                        />
                                    </div>
                                    <h3 className="text-white font-normal text-sm leading-custom-18">Warren</h3>
                                    <p className="text-gray text-[0.625rem] font-normal leading-[0.875rem]">1 week ago</p>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                    <div className="py-4 border-t border-darkJungle flex flex-col gap-2">
                        <h3 className="text-white font-semibold text-base leading-6">Location</h3>
                        <p className="text-gray font-normal text-sm leading-custom-22">{address}</p>
                        <Map position={position} onLocationSelect={onLocationSelect} onCityChange={onCityChange} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(EventSidebar);