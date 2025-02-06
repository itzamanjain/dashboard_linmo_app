import CurrenciesInterface from "../../interfaces/currenciesInterface";

export default interface SubscriptionFormProps {
    title: string;
    description: string;
    price: number | undefined;
    maxCredits: number;
    months: number;
    isUnlimitedCredits: boolean;
    selectedCurrency: CurrenciesInterface;
    selectedDurationOption: string;
    isDurationDropdownOpen: boolean;
    editingIndex: number | null;
    handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleMonthsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleMaxCreditsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    incrementCredits: () => void;
    decrementCredits: () => void;
    incrementMonths: () => void;
    decrementMonths: () => void;
    handleUnlimitedAttendeesChange: () => void;
    handleSaveSubscription: () => void;
    handleDuration: (option: string) => void;
    handleDurationDropdown: () => void;
    onClose: () => void;
    dropdownOnClose: () => void;
}