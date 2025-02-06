export default interface MonthCalendarProps {
    selectedStartDate?: moment.Moment | null;
    onStartDateSelect?: (date: moment.Moment) => void;
    onEndDateSelect?: (date: moment.Moment) => void;
    showEvents?: boolean;
}