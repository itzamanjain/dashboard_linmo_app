import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import Creator from '@/app/models/Creator';
import Event from '@/app/models/Event';
import NotificationData from '@/app/models/notificationData';
import SubscriptionModel from '@/app/models/subscriptionModel';

interface DashboardState {
    selectedDate: string | null;
    activeTab: string;
    activeContent: string;
    mainActiveContent: string;
    allEvents: Event[];
    upcomingEventsContainerClass: string;
    pastEventsContainerClass: string;
    activeEventId: string;
    isEditingEvent: boolean;
    isEditingFollowingEvent: boolean;
    isLoading: boolean;
    userDetails: Pick<Creator, 'uid' | 'email' | 'mainProfilePhoto' | 'name'> & { connectedAccountId?: string };
    notifications: NotificationData[];
    attendeesIds: string[];
    subscriptions: SubscriptionModel[];
    adminClubId: string | null;
}

const initialState: DashboardState = {
    selectedDate: null,
    activeTab: 'Upcoming',
    activeContent: 'calendar',
    mainActiveContent: 'Calendar',
    allEvents: [],
    upcomingEventsContainerClass: 'h-auto',
    pastEventsContainerClass: 'h-auto',
    activeEventId: '',
    isEditingEvent: false,
    isEditingFollowingEvent: false,
    isLoading: true,
    userDetails: {
        uid: '',
        name: '',
        email: '',
        mainProfilePhoto: ''
    },
    notifications: [],
    attendeesIds: [],
    subscriptions: [],
    adminClubId: ''
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setSelectedDate(state, action: PayloadAction<string>) {
            state.selectedDate = action.payload;
        },
        setActiveTab(state, action: PayloadAction<string>) {
            state.activeTab = action.payload;
        },
        setActiveContent(state, action: PayloadAction<string>) {
            state.activeContent = action.payload;
        },
        setMainActiveContent(state, action: PayloadAction<string>) {
            state.mainActiveContent = action.payload;
        },
        setAllEvents(state, action: PayloadAction<Event[]>) {
            state.allEvents = action.payload;
        },
        setUpcomingEventsContainerClass(state, action: PayloadAction<string>) {
            state.upcomingEventsContainerClass = action.payload;
        },
        setPastEventsContainerClass(state, action: PayloadAction<string>) {
            state.pastEventsContainerClass = action.payload;
        },
        setActiveEventId(state, action: PayloadAction<string>) {
            state.activeEventId = action.payload;
        },
        setIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setUserDetails(state, action: PayloadAction<Pick<Creator, 'uid' | 'email' | 'mainProfilePhoto' | 'name'>>) {
            state.userDetails = action.payload;
        },
        setNotifications(state, action: PayloadAction<NotificationData[]>) {
            state.notifications = action.payload;
        },
        setIsEditingEvent(state, action: PayloadAction<boolean>) {
            state.isEditingEvent = action.payload;
        },
        setIsEditingFollowingEvent(state, action: PayloadAction<boolean>) {
            state.isEditingFollowingEvent = action.payload;
        },
        setAttendeesIds(state, action: PayloadAction<string[]>) {
            state.attendeesIds = action.payload;
        },
        addOrUpdateEvent(state, action: PayloadAction<Event>) {
            const index = state.allEvents.findIndex(event => event.trainingId === action.payload.trainingId);
            if (index !== -1) {
                state.allEvents[index] = action.payload;
            } else {
                state.allEvents.push(action.payload);
            }
        },
        removeEvent: (state, action: PayloadAction<string | string[]>) => {
            if (Array.isArray(action.payload)) {
                state.allEvents.forEach(event => {
                    if (event.trainingId && action.payload.includes(event.trainingId)) {
                        event.deleted = true;
                    }
                });
            } else {
                const event = state.allEvents.find(event => event.trainingId === action.payload);
                if (event) {
                    event.deleted = true;
                }
            }
            state.allEvents = state.allEvents.filter(event => !event.deleted);
        },
        setSubscriptions: (state, action: PayloadAction<SubscriptionModel[]>) => {
            state.subscriptions = action.payload;
        },
        removeSubscription: (state, action: PayloadAction<string | undefined>) => {
            const index = state.subscriptions.findIndex(sub => sub.subscriptionId === action.payload);
            if (index !== -1) {
                state.allEvents[index] = {
                    ...state.allEvents[index],
                    deleted: true
                };
            }
            state.subscriptions = state.subscriptions.filter(sub => sub.subscriptionId !== action.payload);
        },
        setAdminClubId: (state, action: PayloadAction<string | null>) => {
            state.adminClubId = action.payload;
        }
    }
});

export const {
    setSelectedDate,
    setActiveTab,
    setActiveContent,
    setMainActiveContent,
    setAllEvents,
    setUpcomingEventsContainerClass,
    setPastEventsContainerClass,
    setActiveEventId,
    setIsEditingEvent,
    setIsEditingFollowingEvent,
    setIsLoading,
    setUserDetails,
    setNotifications,
    setAttendeesIds,
    addOrUpdateEvent,
    removeEvent,
    setSubscriptions,
    removeSubscription,
    setAdminClubId
} = dashboardSlice.actions;

export default dashboardSlice.reducer;