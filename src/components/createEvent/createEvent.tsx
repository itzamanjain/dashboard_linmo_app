import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import moment, { Moment } from "moment";
import { memo, useCallback, useEffect, useState } from "react";

import useReducerDispatch from "@/hooks/useReducerDispatch";
import useSliceSelector from "@/hooks/useSliceSelector";
import { addOrUpdateEvent, setActiveEventId, setIsEditingEvent,setIsEditingFollowingEvent, setMainActiveContent, setSelectedDate } from "@/reducers/dashboard/dashboardSlice";
import { currencies } from "../subscriptions/subscriptions";

import EventContent from "../eventContent/eventContent";
import EventSidebar from "../eventSidebar/eventSidebar";
import Modal from "../modals/modal/modal";
import SidebarLayout from "../sidebarLayout/sidebarLayout";

import Event from "@/app/models/Event";
import DescriptionField from "../common/descriptionFields/interfaces/descriptionField";
import ModalContent from "../modals/modal/interfaces/modalContent";
import { HOME_URL } from "../homeComponent/homeComponent";
import axios from "axios";

interface CreateEventProps {
    fetchEvents: () => Promise<void>;
}

const CreateEvent = (props: CreateEventProps) => {
    const { fetchEvents } = props;

    const [address, setAddress] = useState<string | undefined>("Carrer de Sant Quintí, 33, Barcelona");
    const [city, setCity] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [descriptionFields, setDescriptionFields] = useState<DescriptionField[]>([]);
    const [selectedButtons, setSelectedButtons] = useState<string[]>([]);
    const [isUnlimitedAttendees, setIsUnlimitedAttendees] = useState(true);
    const [maxAttendees, setMaxAttendees] = useState(0);
    const [isFree, setIsFree] = useState(true);
    const [price, setPrice] = useState(0);
    // const [eventMeetLink, seteventMeetingLink] = useState("");
    // const [isOnline, setIsEventOnline] = useState(false);
    const [priceCurrency, setPriceCurrency] = useState<string | undefined>(currencies[1].name);
    const [allowMembership, setAllowMembership] = useState(true);
    const [selectedStartDate, setSelectedStartDate] = useState<Moment | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Moment | null>(null);
    const [selectedStartTime, setSelectedStartTime] = useState<Moment | null>(null);
    const [selectedEndTime, setSelectedEndTime] = useState<Moment | null>(null);
    const [selectedDropdownOption, setSelectedDropdownOption] = useState<string | undefined>("No repeat");
    const [repeatEventFrequency, setRepeatEventFrequency] = useState<number | undefined>(0);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [activeEvent, setActiveEvent] = useState<Event>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [position, setPosition] = useState<google.maps.LatLngLiteral>({
        lat: 41.3963,
        lng: 2.1592,
    });
    const [isErrModal, setIsErrModal] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [meetLink, setMeetLink] = useState("");
    const [modalContent, setModalContent] = useState<ModalContent>({
        iconSrc: '',
        title: '',
        description: '',
        buttonText: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const userDetails = useSliceSelector(state => state.dashboard.userDetails);
    const uid = userDetails.uid;
    const allEvents = useSliceSelector(state => state.dashboard.allEvents);
    const isEditingEvent = useSliceSelector(state => state.dashboard.isEditingEvent);
    const isEditingFollowingEvent = useSliceSelector(state => state.dashboard.isEditingFollowingEvent)
    const activeEventId = useSliceSelector(state => state.dashboard.activeEventId);
    const subscriptions = useSliceSelector(state => state.dashboard.subscriptions);
    const [eventId, setEventId] = useState<string | undefined>();
    const [sessionId,setSessionId] = useState("");

    const dispatch = useReducerDispatch();


    useEffect(() => {
        console.log("Prefill effect triggered");
        console.log("isEditingEvent:", isEditingEvent);
        console.log("isEditingFollowingEvent:", isEditingFollowingEvent);
        console.log("activeEventId:", activeEventId);
        console.log("allEvents length:", allEvents.length);
        
        if ((isEditingEvent || isEditingFollowingEvent) && allEvents.length) {
            const eventToEdit = allEvents.find(event => event.trainingId === activeEventId);
            console.log("Event to edit found:", !!eventToEdit);
            
            if (eventToEdit) {
                console.log("Running prefill with event:", eventToEdit.title);
                prefillForm(eventToEdit);
                setActiveEvent(eventToEdit);
            }
        } else {
            console.log("Running reset form");
            resetForm();
        }
    }, [activeEventId, allEvents, isEditingEvent, isEditingFollowingEvent]);
    
    const subscriptionsAllowed = subscriptions.length > 0
        ? subscriptions.map(subscription => subscription.subscriptionId).filter((id): id is string => id !== undefined)
        : [];

    const prefillForm = (eventData: Event) => {
        let eventRepeatOption;
        if (eventData.repeatEventFrequency === 0) {
            eventRepeatOption = 'No repeat';
        } else if (eventData.repeatEventFrequency === 1) {
            eventRepeatOption = 'Every day';
        } else if (eventData.repeatEventFrequency === 7) {
            eventRepeatOption = 'Every week';
        } else if (eventData.repeatEventFrequency === 28) {
            eventRepeatOption = 'Every month';
        }

        const combinedImages = [eventData.coverPhotoUrl, ...(eventData.optionalPhotos || [])].filter(
            (image): image is string => image !== undefined
        );
        // const subLength = eventData.subscriptionsAllowed && eventData.subscriptionsAllowed.length > 0;
        setEventId(eventData.trainingId);
        setSessionId(eventData.sessionId || "")
        setAddress(eventData.trainingLocationString);
        setCity(eventData.trainingLocationString);
        setTitle(eventData.title);
        setDescription(eventData.description);
        setSelectedCategory(eventData.sport);
        setIsUnlimitedAttendees(eventData.isUnlimitedParticipants);
        setMaxAttendees(eventData.participantsLimit);
        setIsFree(eventData.price === 0);
        setPrice(eventData.price || 0);
        setPriceCurrency(eventData.priceCurrency);
        setIsOnline(eventData.isOnline);
        setMeetLink(eventData.meetLink);
        // setAllowMembership(subLength ? true : false);
        setSelectedStartDate(moment(eventData.trainingStartDateTime));
        setSelectedEndDate(moment(eventData.trainingEndDateTime));
        setSelectedStartTime(moment(eventData.trainingStartDateTime));
        setSelectedEndTime(moment(eventData.trainingEndDateTime));
        setRepeatEventFrequency(eventData.repeatEventFrequency);
        setSelectedDropdownOption(eventRepeatOption);
        setSelectedImages(combinedImages);
        console.log("eventData.trainingLocation.coordinates ✨✨", eventData.trainingLocation.coordinates);

        setPosition({
            lat: eventData.trainingLocation.coordinates[0],
            lng: eventData.trainingLocation.coordinates[1],
        });
    };

    // useEffect(() => {
    //     if ((isEditingEvent || isEditingFollowingEvent) && allEvents.length) {
    //         const eventToEdit = allEvents.find(event => event.trainingId === activeEventId);
    //         if (eventToEdit) {
    //             prefillForm(eventToEdit);
    //             setActiveEvent(eventToEdit);
    //         }
    //     } else {
    //         resetForm();
    //     }
    // }, [activeEventId, allEvents, isEditingEvent, isEditingFollowingEvent]);
    
    useEffect(() => {
        // Check for stored event ID from localStorage
        const storedEventId = localStorage.getItem('editingEventId');
        console.log("Stored event ID from localStorage:✨✨", storedEventId);
        
        if (storedEventId && (isEditingEvent || isEditingFollowingEvent) && allEvents.length) {
            console.log("Found stored event ID:", storedEventId);
            const eventToEdit = allEvents.find(event => event.trainingId === storedEventId);
            
            if (eventToEdit) {
                console.log("Found event to edit from localStorage ID");
                prefillForm(eventToEdit);
                setActiveEvent(eventToEdit);
                
                // Also update the active event ID in the store
                dispatch(setActiveEventId(storedEventId));
            }
        }
        
        // Clear the stored ID after use
        return () => {
            localStorage.removeItem('editingEventId');
        };
    }, [isEditingEvent, isEditingFollowingEvent, allEvents, dispatch]);

    const resetForm = () => {
        setAddress("Carrer de Sant Quintí, 33, Barcelona");
        setCity(undefined);
        setTitle("");
        setDescription("");
        setSelectedCategory("");
        setDescriptionFields([]);
        setSelectedButtons([]);
        setIsUnlimitedAttendees(true);
        setMaxAttendees(0);
        setIsFree(true);
        setPrice(0);
        setAllowMembership(true);
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        setSelectedStartTime(null);
        setSelectedEndTime(null);
        setSelectedDropdownOption("No repeat");
        setSelectedImages([]);
        setSelectedFiles([]);

        setPosition({
            lat: 41.3963,
            lng: 2.1592,
        });
    };

    const handleLocationSelect = (newPosition: google.maps.LatLngLiteral, address: string | undefined) => {
        setPosition(newPosition);
        setAddress(address)
    };

    const handleCityChange = (newCity: string) => {
        setCity(newCity);
    };

    const handleImageUpload = useCallback((urls: string[], files: File[]) => {
        setSelectedImages(urls);
        setSelectedFiles(files);
    }, [setSelectedImages, setSelectedFiles]);

    const uploadImages = async (files: File[], existingImages: string[]): Promise<string[]> => {
        const storage = getStorage();
        const updatedImages = [...existingImages];

        const uploadPromises = files.map(async (file) => {
            if (!file || !(file instanceof File)) {
                console.error("Invalid file:", file);
                return null;
            }

            const storageRef = ref(storage, `eventPhotos/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            const match = file.name.match(/_(\d+)\.jpg$/);
            const index = match ? parseInt(match[1], 10) : -1;

            if (index >= 0) {
                if (index < updatedImages.length) {
                    updatedImages[index] = downloadURL;
                } else if (index === updatedImages.length) {
                    updatedImages.push(downloadURL);
                } else {
                    updatedImages.length = index;
                    updatedImages[index] = downloadURL;
                }
            } else {
                console.error("Invalid index provided:", index);
            }
        });

        await Promise.all(uploadPromises);
        return updatedImages;
    };

    const handleCreateEventClick = async () => {
        if (!title || !description || !selectedCategory || !selectedStartDate || !selectedEndDate || !position) {
            setModalContent({
                iconSrc: '/static/caution.svg',
                title: 'Required fields!',
                description: "Please fill in all required fields",
                buttonText: 'Done',
            });
            setIsErrModal(true);
            return;
        }

        const newPrice = isFree ? 0 : price;
        if (!isFree && newPrice <= 0) {
            setModalContent({
                iconSrc: '/static/caution.svg',
                title: 'Invalid Price!',
                description: "Please enter a price greater than 0 for paid events.",
                buttonText: 'Done',
            });
            setIsErrModal(true);
            return;
        }

        const newMaxAttendees = isUnlimitedAttendees ? 0 : maxAttendees;
        if (!isUnlimitedAttendees && newMaxAttendees <= 0) {
            setModalContent({
                iconSrc: '/static/caution.svg',
                title: 'Invalid Participants!',
                description: "Please enter participants greater than 0.",
                buttonText: 'Done',
            });
            setIsErrModal(true);
            return;
        }

        const currentImages = [activeEvent?.coverPhotoUrl, ...(activeEvent?.optionalPhotos || [])].filter(
            (url): url is string => url !== undefined
        );
        setIsLoading(true);
        const imageUrls = await uploadImages(selectedFiles, currentImages);

        const trainingStartDateTime = moment(selectedStartDate)
            .set({
                hour: selectedStartTime?.get("hour"),
                minute: selectedStartTime?.get("minute"),
                second: 0,
                millisecond: 0
            })
            .format("YYYY-MM-DDTHH:mm:ss");

        const trainingEndDateTime = moment(selectedEndDate)
            .set({
                hour: selectedEndTime?.get("hour"),
                minute: selectedEndTime?.get("minute"),
                second: 0,
                millisecond: 0
            })
            .format("YYYY-MM-DDTHH:mm:ss");

        const subscriptionsAllowedToSend = !isFree && allowMembership ? subscriptionsAllowed : [];

        const eventData: Event = {
            creator: uid,
            // creator: 'b3Lske57swOPBcEGUKkA1CRnKRK2',
            type: 'Public',
            coverPhotoUrl: imageUrls[0],
            optionalPhotos: imageUrls.slice(1),
            sport: selectedCategory,
            title,
            description,
            cancelled: false,
            participants: [uid],
            participantsLimit: newMaxAttendees,
            isUnlimitedParticipants: isUnlimitedAttendees,
            trainingLocationString: address || "",
            trainingLocation: {
                type: 'Point',
                coordinates: [position.lat, position.lng],
            },
            likedBy: [],
            link: "",
            trainingStartDateTime,
            trainingEndDateTime,
            paymentMethods: price > 0 ? ['credit_card'] : [],
            price: newPrice,
            deleted: false,
            clubId: "",
            priceCurrency: !isFree ? priceCurrency?.toUpperCase() : '',
            subscriptionsAllowed: subscriptionsAllowedToSend,
            otherPaymentMethod: "",
            isRepeatEvent: repeatEventFrequency === 0 ? false : true,
            repeatEventFrequency: repeatEventFrequency,
            commentCount: 0,
            comments: [],
            sessionId: sessionId || "",
            isOnline,
            meetLink,
            createdAt: new Date().toISOString(),
            ...((isEditingEvent || isEditingFollowingEvent) && { trainingId: eventId })
        };

        console.log("eventData", eventData);

        try {
            let method, url;
            console.log("this is isEditingFollowingEvent ", isEditingFollowingEvent);
            console.log("this is isEditingEvent ", isEditingEvent);
            console.log("this is eventId ", eventId);
            
            if (isEditingFollowingEvent) {
                method = "PUT";
                url = `${HOME_URL}event/updateBulk`;
            } else if (isEditingEvent) {
                method = "PUT";
                url = `${HOME_URL}event/`;
            } else {
                method = "POST";
                url = `${HOME_URL}event/repeating`;
            }
        
            let response;
        
            if (url.includes("updateBulk")) {
                console.log("updating in bulk ");
                
                response = await axios.put(url, {
                    sessionId: sessionId,
                    currDateTime: new Date().toISOString(),
                    updatedEvent: eventData,
                });
                console.log("Response ", response);
        
                setModalContent({
                    iconSrc: '/static/checkmark.svg',
                    title: "Events Updated!",
                    description: 'All selected events have been updated!',
                    buttonText: 'Done',
                });
                setIsModalOpen(true);
                dispatch(addOrUpdateEvent(eventData));
                dispatch(setIsEditingFollowingEvent(false));
            } else {
                response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventData),
                });
        
                console.log("Response ", response);
        
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }
        
                await response.json();
        
                setModalContent({
                    iconSrc: '/static/checkmark.svg',
                    title: isEditingEvent ? "Event Updated!" : "Event Published!",
                    description: isEditingEvent
                        ? 'Your event has been updated!'
                        : 'Your event has been published!',
                    buttonText: 'Done',
                });
                setIsModalOpen(true);
                dispatch(addOrUpdateEvent(eventData));
                if (isEditingEvent) dispatch(setIsEditingEvent(false));
            }
        } catch (error) {
            console.error('Error creating/updating event:', error);
        } finally {
            setIsLoading(false);
        }
        

    };

    // const handleFollowingEventUpdate = async (sessionId: string, currDateTime: Date, eventData: Event) => {
    //     try {
    //         const path = `${HOME_URL}/event/updateBulk`
    //         const response = await axios.put(path, {
    //             sessionId,
    //             currDateTime: new Date().toISOString(),
    //             updatedEvent: eventData
    //         })

    //         console.log("thisi is response ", response);

    //         if (response.status >= 200 && response.status < 300) {
    //             return { data: true };
    //         } else {
    //             return { data: false };
    //         }
    //     } catch (error) {
    //         console.error('Error creating event:', error);

    //     }
    // }

    const closeModal = () => {
        setIsModalOpen(false);
        if (!isEditingEvent) {
            resetForm();
        }
    };

    const handleDone = async () => {
        setIsModalOpen(false);
        dispatch(setMainActiveContent('Calendar'));
        await fetchEvents();
        dispatch(setSelectedDate(''));
    };

    useEffect(() => {
        if (subscriptions.length > 0) {
            const subscriptionCurrencyCode = subscriptions[0].currency;
            const matchedCurrency = currencies.find(
                (currency) => currency.name === subscriptionCurrencyCode
            );

            setPriceCurrency(matchedCurrency?.name.toUpperCase() || currencies[1].name.toUpperCase());
        } else {
            setPriceCurrency(currencies[1].name.toUpperCase());
        }
    }, [subscriptions]);

    return (
        <SidebarLayout
            sidebarContent={
                <EventSidebar
                    position={position}
                    address={address}
                    onCityChange={handleCityChange}
                    onLocationSelect={handleLocationSelect}
                    city={city}
                    title={title}
                    description={description}
                    startDate={selectedStartDate}
                    startTime={selectedStartTime}
                    attendees={maxAttendees}
                    additionalField={descriptionFields.find(field => field.type === "Additional Information")?.value}
                    includedField={descriptionFields.find(field => field.type === "What's Included")?.value}
                    selectedImages={selectedImages}
                />
            }
        >{isLoading ? <div className="loading-state">
            <div className="loading"></div>
        </div> : ""}
            <EventContent
                onSelect={handleLocationSelect}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                descriptionFields={descriptionFields}
                setDescriptionFields={setDescriptionFields}
                selectedButtons={selectedButtons}
                setSelectedButtons={setSelectedButtons}
                isUnlimitedAttendees={isUnlimitedAttendees}
                setIsUnlimitedAttendees={setIsUnlimitedAttendees}
                maxAttendees={maxAttendees}
                setMaxAttendees={setMaxAttendees}
                isFree={isFree}
                setIsFree={setIsFree}
                price={price}
                setPrice={setPrice}
                isOnline={isOnline}
                setIsOnline={setIsOnline}
                meetLink={meetLink}
                setMeetLink={setMeetLink}
                priceCurrency={priceCurrency}
                setPriceCurrency={setPriceCurrency}
                allowMembership={allowMembership}
                setAllowMembership={setAllowMembership}
                onCreateEventClick={handleCreateEventClick}
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
                address={address}
                setAddress={setAddress}
                onImageUpload={handleImageUpload}
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                setSelectedDropdownFrequency={setRepeatEventFrequency}
            />
            {isModalOpen && (
                <Modal
                    onClose={closeModal}
                    iconSrc={modalContent.iconSrc}
                    title={modalContent.title}
                    description={modalContent.description}
                    buttonText={modalContent.buttonText}
                    buttonAction={handleDone}
                />
            )}
            {isErrModal && (
                <Modal
                    onClose={() => setIsErrModal(false)}
                    iconSrc={modalContent.iconSrc}
                    title={modalContent.title}
                    description={modalContent.description}
                    buttonText={modalContent.buttonText}
                    buttonAction={() => setIsErrModal(false)}
                />
            )}
        </SidebarLayout>
    )
}


  

export default memo(CreateEvent);