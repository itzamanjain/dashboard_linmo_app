import { doc, getDoc, getFirestore } from "firebase/firestore";
import Image from "next/image";
import { memo, useCallback, useEffect, useState } from "react";

import useReducerDispatch from "@/hooks/useReducerDispatch";
import useSliceSelector from "@/hooks/useSliceSelector";
import { setActiveContent } from "@/reducers/dashboard/dashboardSlice";
import { HOME_URL } from "../homeComponent/homeComponent";

import EventCard from "../common/eventCard/eventCard";

import Creator from "@/app/models/Creator";
import ResponseData from "@/app/models/responseData";
import TransactionData from "@/app/models/transactionsData";

const Attendees = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const attendeesIds = useSliceSelector(state => state.dashboard.attendeesIds);
    const [attendeesData, setAttendeesData] = useState<Creator[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useReducerDispatch();
    const activeEventId = useSliceSelector(state => state.dashboard.activeEventId);
    const allEvents = useSliceSelector(state => state.dashboard.allEvents);
    const activeEvent = allEvents.find(event => event.trainingId === activeEventId);
    const loggedInUser = useSliceSelector(state => state.dashboard.userDetails);

    const fetchUserDetails = useCallback(async (userId: string) => {
        const requestOptions: RequestInit = {
            method: "GET",
        };

        try {
            const response = await fetch(`https://prod-ts-liveliness-server.onrender.com/api/user/${userId}`, requestOptions);
            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching user details:", error);
            return null;
        }
    }, []);

    const fetchFirebaseUserDetails = useCallback(async (userId: string) => {
        const db = getFirestore();
        const docRef = doc(db, "participants", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No such document in Firebase!");
            return null;
        }
    }, []);

    const fetchTransactions = useCallback(async () => {
        if (!activeEvent) return;

        try {
            const response = await fetch(`${HOME_URL}payments/getTransactionsOfTraining`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ trainingID: activeEvent.trainingId }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch transactions");
            }

            const data: ResponseData<TransactionData> = await response.json();
            return data.data;

        } catch (error) {
            console.error("Error fetching transactions:", error);
            return [];
        }
    }, [activeEvent]);

    useEffect(() => {
        const fetchAllUserDetails = async () => {
            const usersData = await Promise.all(
                attendeesIds.map(async (id) => {
                    const apiUser = await fetchUserDetails(id);
                    return apiUser ? apiUser : await fetchFirebaseUserDetails(id);
                })
            );

            const transactions = await fetchTransactions();

            if (!transactions) return setLoading(false);

            const filteredtransactions = transactions?.filter(transaction => transaction.trainingId === activeEvent?.trainingId);

            const uniqueTransactionsMap = new Map();
            filteredtransactions.forEach(transaction => {
                const key = `${transaction.fromUserId}-${transaction.method}`;
                if (!uniqueTransactionsMap.has(key)) {
                    uniqueTransactionsMap.set(key, transaction);
                }
            });

            const uniqueTransactions: TransactionData[] = Array.from(uniqueTransactionsMap.values());

            const updatedAttendeesData: Creator[] = usersData
                .filter(user => user.uid !== loggedInUser.uid)
                .map((user: Creator) => {
                    const transaction = uniqueTransactions.find(
                        t => t.fromUserId === user.uid
                    );
                    return {
                        ...user,
                        method: activeEvent?.price === 0
                            ? activeEvent?.trainingLocationString
                            : transaction?.method === 'subscription'
                                ? 'Membership'
                                : 'Paid one time'
                    };
                });

            setAttendeesData(updatedAttendeesData);

            setLoading(false);
        };

        if (attendeesIds.length > 0) {
            fetchAllUserDetails();
        } else {
            setLoading(false);
        }
    }, [attendeesIds, fetchUserDetails, fetchFirebaseUserDetails, fetchTransactions, activeEvent, loggedInUser]);

    const filteredAttendees = attendeesData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.locationString.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const goBack = () => {
        dispatch(setActiveContent('calendar'));
    }

    return (
        <div className="flex flex-col py-12 md:py-[2.125rem] px-4 sm:px-16 lg:px-32 w-full gap-8">
            <div className="flex flex-row gap-6">
                <button
                    onClick={goBack}
                    className="p-[0.813rem] bg-darkJungle rounded-full overflow-hidden"
                >
                    <Image
                        src="static/back.svg"
                        alt="back"
                        width={14}
                        height={14}
                    />
                </button>
                <h1 className="text-white font-bold text-custom-32 leading-9">Attendees</h1>
            </div>
            {activeEvent && <EventCard
                {...activeEvent}
                activeId={activeEventId}
                fromAttendees={true}
            />}
            <div className="relative w-full">
                <Image
                    src="static/search.svg"
                    alt="back"
                    width={18}
                    height={18}
                    className="absolute top-1/2 left-3 transform -translate-y-1/2"
                />
                <input
                    className="bg-black font-normal text-sm leading-custom-22 text-darkgray focus:outline-none pl-11 px-4 py-3 border border-darkMetal rounded-xl w-full"
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search attendees"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="bg-[rgb(20,20,20,1)] rounded-2xl px-4 md:px-6 pt-6 flex flex-col">
                <h2 className="font-semibold text-custom-22 leading-7 text-white mb-6">Going</h2>
                <div className="border-darkMetal border-t py-6">
                    <div className="flex justify-between flex-col custom-mobile-417:flex-row gap-4 md:gap-0">
                        <div className="flex gap-3">
                            <div className="rounded-full w-[48px] h-[48px] overflow-hidden">
                                <Image
                                    src={loggedInUser.mainProfilePhoto}
                                    alt={loggedInUser.name}
                                    width={48}
                                    height={48}
                                />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <h3 className="text-white font-semibold text-base leading-6">{loggedInUser.name}</h3>
                                <div className="w-max py-0.5 rounded-s rounded-e bg-transparent">
                                    <p className="font-normal text-darkgray text-xs leading-custom-18">
                                        Host
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center border-darkMetal border-t py-6">
                        <div className="font-bold text-custom-22 leading-7 text-white">Loading...</div>
                    </div>
                ) : filteredAttendees.length >= 1 ? (
                    filteredAttendees.map((item, index) => {
                        return (
                            <div key={index} className="border-darkMetal border-t py-6">
                                <div className="flex justify-between flex-col custom-mobile-417:flex-row gap-4 md:gap-0">
                                    <div className="flex gap-3">
                                        <div className="rounded-full w-[48px] h-[48px] overflow-hidden">
                                            <Image
                                                src={item.mainProfilePhoto}
                                                alt={item.name}
                                                width={48}
                                                height={48}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <h3 className="text-white font-semibold text-base leading-6">{item.name}</h3>
                                            <div
                                                className={`w-max py-0.5 rounded-s rounded-e 
                                                    ${activeEvent?.price === 0 ? 'bg-transparent' :
                                                        item.method === 'subscription'
                                                            ? 'bg-custard px-1.5' : 'bg-mantis px-1.5'}`
                                                }
                                            >
                                                <p
                                                    className={`font-normal ${activeEvent?.price === 0
                                                        ? 'text-darkgray text-xs leading-custom-18'
                                                        : 'text-black text-custom-10 leading-custom-14'}`
                                                    }
                                                >
                                                    {item.method}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="flex justify-center border-darkMetal border-t py-6">
                        <div className="font-bold text-custom-22 leading-7 text-white">No Attendees</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(Attendees);