export default interface TabContentProps {
    activeTab: string;
    setEventCounts: (counts: { upcoming: number; week: number; }) => void;
}