"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useState } from "react";

import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import useReducerDispatch from "@/hooks/useReducerDispatch";
import useSliceSelector from "@/hooks/useSliceSelector";
import { setAdminClubId, setAllEvents, setIsLoading, setNotifications, setSubscriptions, setUserDetails } from "@/reducers/dashboard/dashboardSlice";

import CreateEvent from "../createEvent/createEvent";
import MyCalendar from "../mainContent/myCalendar";
import Subscriptions from "../subscriptions/subscriptions";

import Creator from "@/app/models/Creator";
import Event from "@/app/models/Event";
import NotificationData from "@/app/models/notificationData";
import ResponseData from "@/app/models/responseData";
import SubscriptionModel from "@/app/models/subscriptionModel";

export const HOME_URL = 'https://prod-ts-liveliness-server.onrender.com/api/';

const HomeComponent = () => {
    const { user, isLoading, providerId } = useFirebaseAuth();
    const router = useRouter();
    const dispatch = useReducerDispatch();
    const activeContent = useSliceSelector(state => state.dashboard.mainActiveContent);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const fetchUserDetails = useCallback(async (userId: string) => {
        const requestOptions: RequestInit = {
            method: "GET"
        };

        try {
            const response = await fetch(`${HOME_URL}user/${userId}`, requestOptions);
            // const response = await fetch(`${HOME_URL}user/b3Lske57swOPBcEGUKkA1CRnKRK2`, requestOptions);

            if (!response.ok) throw new Error("Failed to fetch user details");

            const data: Creator = await response.json();
            dispatch(setUserDetails(data));
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }, [dispatch]);

    const fetchEvents = useCallback(async () => {
        if (!user?.uid) return;

        const requestOptions: RequestInit = {
            method: "GET"
        };

        try {
            const response = await fetch(`${HOME_URL}event/admin/${user?.uid}`, requestOptions);
            // const response = await fetch(`${HOME_URL}event/admin/b3Lske57swOPBcEGUKkA1CRnKRK2`, requestOptions);

            if (!response.ok) throw new Error("Failed to fetch events");

            const { data }: ResponseData<Event> = await response.json();
            const filteredEvents = data.filter(event => !event.deleted);

            dispatch(setAllEvents(filteredEvents));
        } catch (error) {
            console.error("Failed to fetch events:", error);
        }
    }, [dispatch, user?.uid]);

    const fetchNotifications = useCallback(async () => {
        if (!user?.uid) return;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            uid: user?.uid as string,
            type: "Event Joined"
        });

        const requestOptions: RequestInit = {
            method: "POST",
            headers: myHeaders,
            body: raw
        };

        try {
            const response = await fetch(`${HOME_URL}notification/type`, requestOptions);

            if (!response.ok) throw new Error("Failed to fetch notifications");

            const { data }: ResponseData<NotificationData> = await response.json();
            dispatch(setNotifications(data));
        } catch (error) {
            console.error("Failed to fetch events:", error);
        }
    }, [dispatch, user?.uid]);

    const getAdminClubId = useCallback(async (): Promise<string | null> => {
        if (!user?.uid) return null;

        const requestOptions: RequestInit = {
            method: "GET"
        };

        try {
            const response = await fetch(`${HOME_URL}club/userAdminClubId/${user.uid}`, requestOptions);
            // const response = await fetch(`${HOME_URL}club/userAdminClubId/b3Lske57swOPBcEGUKkA1CRnKRK2`, requestOptions);

            if (!response.ok) throw new Error("Failed to fetch club id");

            const data = await response.json();
            return data.data;

        } catch (error) {
            console.error('Error fetching club ID:', error);
            return null;
        }
    }, [user?.uid]);

    const getAllClubSubscriptions = useCallback(async (clubId: string) => {
        try {
            const response = await fetch(`${HOME_URL}subscriptions/getAll/${clubId}`);

            if (!response.ok) throw new Error("Failed to fetch club details");

            const data: ResponseData<SubscriptionModel> = await response.json();
            dispatch(setSubscriptions(data.data));
            setIsLoading(false);

        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        }
    }, [dispatch]);

    useEffect(() => {
        if (!isLoading) {
            if (user) {
                setIsAuthenticated(true);
                fetchUserDetails(user.uid);
            } else {
                setIsAuthenticated(false);
                router.push('/login');
            }
        }
    }, [user, isLoading, providerId, fetchUserDetails, router]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchEvents(),
                    fetchNotifications()
                ]);

                const clubId = await getAdminClubId();
                dispatch(setAdminClubId(clubId));
                if (clubId) {
                    await getAllClubSubscriptions(clubId);
                }

                dispatch(setIsLoading(false));
            } catch (error) {
                console.error("Error fetching data:", error);
                dispatch(setIsLoading(false));
            }
        };

        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated, dispatch, fetchEvents, fetchNotifications, getAllClubSubscriptions, getAdminClubId]);

    return (
        <>
            {activeContent === 'Calendar' && <MyCalendar />}
            {activeContent === 'Create Event' && <CreateEvent fetchEvents={fetchEvents} />}
            {activeContent === 'Memberships' && <Subscriptions />}
        </>
    )

}

export default memo(HomeComponent);