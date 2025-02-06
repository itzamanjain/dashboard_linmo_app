export default interface TabProps {
    label: string;
    notifications: number;
    isActive: boolean;
    setActive: () => void;
}