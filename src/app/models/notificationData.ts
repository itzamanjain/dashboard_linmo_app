import Creator from "./Creator";

type NotificationToModel = Pick<Creator,
    | 'uid'
    | 'mainProfilePhoto'
    | 'name'>;

export default interface NotificationData {
    notificationId: string;
    notificationTo: string;
    notificationBy: string;
    type: string;
    contentId: string;
    isRead: boolean;
    createdAt: string;
    notificationToModel: NotificationToModel;
    notificationByModel: NotificationToModel;
} 