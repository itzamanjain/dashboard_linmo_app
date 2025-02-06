import { ChangeEvent } from "react";

import CurrenciesInterface from "@/components/subscriptions/interfaces/currenciesInterface";

export default interface CurrencyModalProps {
    currencies: CurrenciesInterface[];
    selectedCurrency: CurrenciesInterface;
    searchQuery: string | undefined;
    onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
    onSelectCurrency: (currency: CurrenciesInterface) => void;
    onClose: () => void;
}