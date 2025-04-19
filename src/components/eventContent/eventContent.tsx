import Image from "next/image";
import { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from "react";

import useReducerDispatch from "@/hooks/useReducerDispatch";
import { setActiveEventId, setIsEditingEvent, setMainActiveContent } from "@/reducers/dashboard/dashboardSlice";
import { currencies } from "../subscriptions/subscriptions";
import useSliceSelector from "@/hooks/useSliceSelector";

import Categories from "../common/categories/categories";
import Checkbox from "../common/checkbox/checkbox";
import DatePicker from "../common/datePicker/datePicker";
import Header from "../common/header/header";
import SearchLocation from "../common/searchLocation/searchLocation";
import EventImageUpload from "../eventImageUpload/eventImageUpload";

import EventContentProps from "./interfaces/eventContentProps";
import CurrenciesInterface from "../subscriptions/interfaces/currenciesInterface";
import { cn } from "@/lib/utils";
import { Link } from "lucide-react";

const EventContent = (props: EventContentProps) => {
    const { onSelect,
        title,
        description,
        selectedCategory,
        isUnlimitedAttendees,
        maxAttendees,
        isFree,
        isOnline,
        price,
        priceCurrency,
        allowMembership,
        selectedDropdownOption,
        selectedEndDate,
        selectedEndTime,
        selectedStartDate,
        selectedStartTime,
        address,
        selectedImages,
        selectedFiles,
        setAddress,
        onCreateEventClick,
        setAllowMembership,
        setDescription,
        setIsFree,
        setIsOnline,
        setIsUnlimitedAttendees,
        setMaxAttendees,
        setPrice,
        setPriceCurrency,
        setSelectedCategory,
        setTitle,
        setMeetLink,
        meetLink,
        setSelectedDropdownOption,
        setSelectedEndDate,
        setSelectedEndTime,
        setSelectedStartDate,
        setSelectedStartTime,
        onImageUpload,
        setSelectedImages,
        setSelectedFiles,
        setSelectedDropdownFrequency
    } = props;

    const dispatch = useReducerDispatch();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<CurrenciesInterface>(currencies[1]);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [locationType, setLocationType] = useState<"inperson" | "online">("inperson")
    // const [isOnline, setIsOnline] = useState(false);
    // const [address, setAddress] = useState("")
    // const [meetLink, setMeetLink] = useState("")

    const subscriptions = useSliceSelector(state => state.dashboard.subscriptions);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCurrencySelect = (currency: CurrenciesInterface) => {
        setSelectedCurrency(currency);
        setPriceCurrency(currency.name);
        setIsDropdownOpen(false);
    }

    const handleCancelClick = useCallback(() => {
        dispatch(setMainActiveContent('Calendar'));
        dispatch(setActiveEventId(''));
        dispatch(setIsEditingEvent(false));
    }, [dispatch]);

    const handleUnlimitedAttendeesChange = useCallback(() => {
        setIsUnlimitedAttendees(prev => !prev);
        if (!isUnlimitedAttendees) {
            setMaxAttendees(0);
        }
    }, [setIsUnlimitedAttendees, setMaxAttendees, isUnlimitedAttendees]);

    const handleFreeToggle = useCallback(() => {
        setIsFree((prevIsFree) => {
            if (!prevIsFree) {
                setPrice(0);
            }
            return !prevIsFree;
        });
        setIsDropdownOpen(false);
    }, [setIsFree, setPrice]);

    const incrementAttendees = useCallback(() => setMaxAttendees(prev => prev + 1), [setMaxAttendees]);
    const decrementAttendees = useCallback(() => setMaxAttendees(prev => Math.max(prev - 1, 0)), [setMaxAttendees]);
    const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value), [setTitle]);
    const handleDescriptionChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value), [setDescription]);
    const handleMembershipChange = useCallback(() => setAllowMembership((prev) => !prev), [setAllowMembership]);

    const handlePriceChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (/^\d*\.?\d*$/.test(e.target.value)) {
            setPrice(Number(e.target.value));
        }
    }, [setPrice]);

    const handleMaxAttendeesChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (/^\d*\.?\d*$/.test(e.target.value)) {
            setMaxAttendees(Number(e.target.value));
        }
    }, [setMaxAttendees]);

    const getCurrencyCode = (currencyName: string | undefined) => {
        const currency = currencies.find(cur => cur.name === currencyName);
        return currency ? currency.code : '$';
    };

    useEffect(() => {
        if (subscriptions.length > 0) {
            const subscriptionCurrencyCode = subscriptions[0].currency;
            const matchedCurrency = currencies.find(
                (currency) => currency.name === subscriptionCurrencyCode
            );

            setSelectedCurrency(matchedCurrency || currencies[1]);
        } else {
            setSelectedCurrency(currencies[1]);
        }
    }, [subscriptions]);

    return (
        <div className="flex-1 transition-all duration-300 ease-in-out h-full">
            <div className={`flex flex-col gap-[1.563rem] pt-12 p-4 lg:px-8 lg:pt-10 pb-2 
                lg:pb-4 h-full`}>
                <Header
                    title="Create Event"
                    onCreateEventClick={onCreateEventClick}
                    onCancelClick={handleCancelClick}
                    showCancelButton={true}
                />
                <div className="flex flex-col gap-8 py-6">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white text-lg font-semibold leading-6">Title</h3>
                        <input
                            type="text"
                            name="class"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="E.g Morning Yoga in the Park"
                            className="font-normal text-sm leading-custom-22 bg-black text-white rounded-xl
                            border border-darkMetal py-3 px-4 placeholder:text-darkgray focus:outline-none opacity-90"
                        />
                    </div>
                    <DatePicker
                        selectedStartDate={selectedStartDate}
                        setSelectedStartDate={setSelectedStartDate}
                        selectedEndDate={selectedEndDate}
                        setSelectedEndDate={setSelectedEndDate}
                        selectedStartTime={selectedStartTime}
                        setSelectedStartTime={setSelectedStartTime}
                        selectedEndTime={selectedEndTime}
                        setSelectedEndTime={setSelectedEndTime}
                        selectedDropdownOption={selectedDropdownOption}
                        setSelectedDropdownOption={setSelectedDropdownOption}
                        setSelectedDropdownFrequency={setSelectedDropdownFrequency}
                    />
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-white font-semibold text-lg leading-6">Description</h3>
                            <textarea
                                className="bg-black font-normal text-sm leading-custom-22 text-white opacity-90
                            focus:outline-none py-3 px-4 border border-darkMetal rounded-xl placeholder:text-darkgray"
                                placeholder="Where to meet,What to bring , what language it is in,and who it is for (e.g beginner,all levels)"
                                name="description"
                                rows={6}
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                        </div>
                        {/* <DescriptionFields
                            selectedButtons={selectedButtons}
                            setSelectedButtons={setSelectedButtons}
                            descriptionFields={descriptionFields}
                            setDescriptionFields={setDescriptionFields}
                        /> */}
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white text-lg font-semibold leading-6">Upload cover Image (Max 3 Photos)</h3>
                        <EventImageUpload
                            onImageUpload={onImageUpload}
                            selectedImages={selectedImages}
                            setSelectedImages={setSelectedImages}
                            selectedFiles={selectedFiles}
                            setSelectedFiles={setSelectedFiles}
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white text-lg font-semibold leading-6">Location</h3>

                        <div className="flex rounded-lg bg-[#1F1F1F] overflow-hidden">
                            <button
                                onClick={() => setLocationType("inperson")}
                                className={cn(
                                    "flex-1 py-3 text-center font-semibold transition-colors",
                                    locationType === "inperson" ? "bg-white rounded-2xl text-black" : "text-white",
                                )}
                            >
                                In Person
                            </button>
                            <button
                                onClick={() => {
                                    setLocationType("online");
                                    setIsOnline(true);
                                    
                                }}
                                className={cn(
                                    "flex-1 py-3 text-center font-semibold transition-colors",
                                    locationType === "online" ? "bg-white rounded-2xl text-black" : "text-white",
                                )}
                            >
                                Online
                            </button>
                        </div>

                        {locationType === "inperson" ? (
                            <div className="relative">
                                <SearchLocation
                                    onSelect={onSelect}
                                    address={address}
                                    setAddress={setAddress}
                                />
                                <div
                                    className={`absolute flex items-center justify-center top-2 right-2 cursor-pointer py-1 px-3 rounded-full`}
                                >
                                    <Image
                                        src="/static/pin.svg"
                                        alt="location"
                                        width={14}
                                        height={14}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="flex items-center font-normal text-sm leading-custom-22 bg-black text-white rounded-xl
                    border border-darkMetal py-3 px-4 placeholder:text-darkgray focus:outline-none opacity-90 w-full bg-gray-800 ">
                                    <Link width={16} height={16} className="mr-2 text-white" />
                                    <input
                                        type="url"
                                        value={meetLink}
                                        onChange={(e) => setMeetLink(e.target.value)}
                                        placeholder="Enter meeting link"
                                        className="bg-transparent text-white w-full outline-none placeholder:text-gray-400"
                                    />
                                </div>
                            </div>
                        )}


                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white text-lg font-semibold leading-6">Category</h3>
                        <Categories
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white text-lg font-semibold leading-6">Participant Limit</h3>
                        <div className="flex gap-6 items-center">
                            {
                                !isUnlimitedAttendees && (
                                    <div className="relative flex flex-grow">
                                        <input
                                            type="text"
                                            name="maxAttendees"
                                            value={maxAttendees}
                                            onChange={handleMaxAttendeesChange}
                                            className="font-normal text-sm leading-custom-22 bg-black text-white rounded-xl
                                                    border border-darkMetal py-3 px-4 focus:outline-none opacity-90 w-full"
                                        />
                                        <div className="absolute flex gap-3 top-3 right-4">
                                            <div
                                                className="flex justify-center items-center min-w-[24px] min-h-[24px]
                                                    bg-darkMetal rounded-full cursor-pointer"
                                                onClick={decrementAttendees}
                                            >
                                                <Image
                                                    src="/static/minus.svg"
                                                    alt="decrement"
                                                    width={9}
                                                    height={0}
                                                />
                                            </div>
                                            <div
                                                className="flex justify-center items-center min-w-[24px] min-h-[24px]
                                                    bg-white rounded-full cursor-pointer"
                                                onClick={incrementAttendees}
                                            >
                                                <Image
                                                    src="/static/d-plus.svg"
                                                    alt="increment"
                                                    width={9}
                                                    height={9}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            <div className="flex gap-2 items-center py-3">
                                <h3
                                    className="text-white font-normal text-sm leading-custom-22"
                                >
                                    Unlimited Attendees
                                </h3>
                                <Checkbox checked={isUnlimitedAttendees} onChange={handleUnlimitedAttendeesChange} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white text-lg font-semibold leading-6">Ticket Price</h3>
                        <div
                            className={`relative flex ${isFree ? 'bg-darkJungle overflow-hidden rounded-xl' : ''}`}
                            ref={dropdownRef}
                        >
                            <div
                                className={`absolute flex items-center justify-center top-4 left-4 z-10 gap-2
                                    ${isFree ? 'cursor-default' : 'cursor-pointer'}`}
                                onClick={() => {
                                    !isFree && setIsDropdownOpen(!isDropdownOpen)
                                }}
                            >
                                <h4 className="text-white font-bold text-base leading-custom-18">
                                    {selectedCurrency?.code || getCurrencyCode(priceCurrency)}
                                </h4>
                                <Image
                                    src="/static/d-arr.svg"
                                    alt="currencies"
                                    width={8}
                                    height={4}
                                />
                            </div>
                            <input
                                type="text"
                                name="price"
                                value={price}
                                onChange={handlePriceChange}
                                placeholder={`${isFree ? 'Free' : 'Enter price'}`}
                                className={`font-normal text-sm leading-custom-22 text-white rounded-xl opacity-70
                                            placeholder:text-darkgray border border-darkMetal py-3 px-4 pl-14 focus:outline-none w-full
                                            ${isFree ? 'bg-darkJungle' : 'bg-black'}`}
                                disabled={isFree}
                            />
                            <div
                                className={`absolute flex items-center justify-center top-3 right-4 cursor-pointer py-1 px-3 rounded-full
                                    ${isFree ? 'bg-white' : 'bg-darkJungle'}`}
                                onClick={handleFreeToggle}
                            >
                                <h4
                                    className={`font-bold text-xs leading-custom-18 ${isFree ? 'text-black' : 'text-white'}`}
                                >
                                    Free
                                </h4>
                            </div>
                            {isDropdownOpen && (
                                <div className="absolute left-0 top-12 text-center rounded-lg shadow-[0px_4px_20px_0px_#1413181A] z-10 w-[3.75rem]">
                                    <div className="flex flex-col">
                                        {currencies.map((currency, index) => {
                                            const isSelected = selectedCurrency?.code === currency.code;
                                            return (
                                                <div
                                                    key={index}
                                                    className={`px-3 py-2 cursor-pointer border-b-darkMetal border-b
                                                        ${isSelected ? 'bg-graphite' : 'bg-black'}`}
                                                    onClick={() => handleCurrencySelect(currency)}
                                                >
                                                    <h4 className="font-medium text-sm leading-custom-22 text-white">
                                                        {currency.code}
                                                    </h4>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {!isFree && subscriptions.length !== 0 && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-white text-lg font-semibold leading-6">Memberships</h3>
                            {subscriptions.map((sub, index) => (
                                <div
                                    key={index}
                                    className="flex rounded-[10px] p-3 items-center cursor-pointer bg-rangoonGreen"
                                >
                                    <div className="flex gap-3">
                                        <Image
                                            src={'/static/gift.svg'}
                                            alt={"sub"}
                                            width={24}
                                            height={24}
                                        />
                                        <h3
                                            className="font-semibold text-base leading-6 text-white"
                                        >
                                            {sub.subscriptionName}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-center rounded-xl py-3 px-4 w-full gap-3 border border-darkMetal cursor-pointer">
                                <Image
                                    src="/static/info.svg"
                                    alt="info"
                                    width={20}
                                    height={20}
                                />
                                <p className="text-white opacity-90 font-normal text-sm leading-custom-22">
                                    You can manage your membership on the club settings page.
                                </p>
                            </div>
                            <div className="flex justify-between items-center bg-darkMetal rounded-xl p-3">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-white font-medium text-base leading-6">Allow Memberships</h3>
                                    <h2 className="leading-6 text-base font-normal text-custard">Enable booking this event using membership credits.</h2>
                                </div>
                                <Checkbox checked={allowMembership} onChange={handleMembershipChange} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default memo(EventContent);