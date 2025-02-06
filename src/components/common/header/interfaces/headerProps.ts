export default interface HeaderProps {
    title: string;
    onCancelClick?: () => void;
    onCreateEventClick: () => void;
    showCancelButton?: boolean;
}