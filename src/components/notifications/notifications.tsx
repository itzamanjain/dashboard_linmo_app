import moment from 'moment';
import Image from 'next/image';
import { memo } from 'react';

import useSliceSelector from '@/hooks/useSliceSelector';

import NotificationData from '@/app/models/notificationData';

const Notifications = () => {
    const notifications = useSliceSelector(state => state.dashboard.notifications);
    const isLoading = useSliceSelector(state => state.dashboard.isLoading);

    const formatDate = (dateString: string) => {
        const now = moment();
        const date = moment(dateString);

        const duration = moment.duration(now.diff(date));
        const months = Math.floor(duration.asMonths());
        const days = Math.floor(duration.asDays());
        const hours = Math.floor(duration.asHours()) % 24;
        const minutes = Math.floor(duration.asMinutes()) % 60;

        let result = '';
        if (months > 0) {
            result = `${months}mo`;
        } else if (days > 0) {
            result = `${days}d`;
        } else if (hours > 0) {
            result = `${hours}h`;
        } else if (minutes > 0) {
            result = `${minutes}m`;
        } else {
            result = 'Now';
        }

        return result.trim();
    }

    const formatNotificationText = (notification: NotificationData) => {
        const { name } = notification.notificationByModel;
        switch (notification.type) {
            case 'Event Created':
                return { name, action: 'created an', detail: 'Event' };
            case 'Event Comment':
                return { name, action: 'commented on your', detail: 'Event' };
            case 'Club Join Request':
                return { name, action: 'requested to Join your', detail: 'Club' };
            case 'Event Joined':
                return { name, action: 'joined your', detail: 'Event' };
            default:
                return { name, action: '', detail: '' };
        }
    };

    const filteredNotifications = notifications?.filter(notification =>
        notification.type === 'Event Created' || notification.type === 'Event Joined'
    );

    if (filteredNotifications?.length === 0 && !isLoading) {
        return (
            <div className='flex flex-col px-8 pt-8 justify-center items-center gap-2'>
                <h2 className='text-white font-bold text-custom-22 leading-7'>
                    No booking requests
                </h2>
                <p className='text-charcoal font-normal text-base leading-6'>
                    Currently there is no booking request
                </p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className='flex flex-col px-8 pt-8 justify-center items-center gap-2'>
                <h2 className='text-white font-bold text-custom-22 leading-7'>
                    Loading...
                </h2>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-3 pl-8 pt-4 justify-center">
            <h1 className="text-darkgray font-bold text-custom-22 leading-7 pb-3">Notifications</h1>
            <div className={`flex flex-col gap-3`}>
                {filteredNotifications?.slice(0, 20).map(notification => {
                    const { name, action, detail } = formatNotificationText(notification);
                    return (
                        <div key={notification.notificationId} className="flex gap-4 items-start">
                            <div className="w-8 h-8 overflow-hidden rounded-full">
                                <Image
                                    src={notification.notificationByModel.mainProfilePhoto}
                                    width={32}
                                    height={32}
                                    alt="User"
                                />
                            </div>
                            <h2 className='font-bold text-white text-sm leading-custom-22'>
                                {name}
                                <span className='font-normal text-sm text-gray px-1'>{action}</span>
                                {detail}
                                <span className='font-normal text-xs text-gray leading-[1.125rem] pl-1'>{formatDate(notification.createdAt)}</span>
                            </h2>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default memo(Notifications);