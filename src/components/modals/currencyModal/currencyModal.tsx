import Image from "next/image";
import { memo } from "react";

import CurrencyModalProps from "./interfaces/currencyModalProps";

const CurrencyModal = (props: CurrencyModalProps) => {
    const { currencies, onClose, onSearch, onSelectCurrency, searchQuery, selectedCurrency } = props;
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm p-4 sm:p-0"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            onClick={onClose}
        >
            <div
                className="bg-black rounded-2xl p-6 w-[628px] h-[628px] max-w-full flex flex-col items-center gap-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col w-full gap-6">
                    <div className="flex justify-between">
                        <h2 className="text-white font-semibold text-custom-22 leading-7">Choose a currency</h2>
                        <div
                            className="p-3 cursor-pointer"
                            onClick={onClose}
                        >
                            <Image
                                src="/static/w-close.svg"
                                alt="close"
                                width={12}
                                height={12}
                            />
                        </div>
                    </div>
                    <div
                        className="relative flex items-center"
                    >
                        <div className="absolute top-[0.875] left-4 z-10">
                            <Image
                                src="/static/search.svg"
                                alt="search"
                                width={18}
                                height={18}
                            />
                        </div>
                        <input
                            type="text"
                            name="search"
                            value={searchQuery}
                            onChange={onSearch}
                            placeholder="Search currency"
                            className={`font-normal text-sm leading-custom-22 text-white rounded-xl
                                            placeholder:text-darkgray border border-darkMetal py-3 px-4 pl-[3.125rem] focus:outline-none w-full bg-woodsmoke`}
                        />
                    </div>
                </div>
                <div className="w-full flex flex-col gap-3">
                    {currencies.map((currency, index) => {
                        const isSelected = selectedCurrency?.code === currency.code;

                        return (
                            <div
                                key={index}
                                className={`flex py-4 px-3 gap-4 items-center cursor-pointer rounded-xl
                                            ${isSelected ? 'bg-graphite' : ''}`}
                                onClick={() => onSelectCurrency(currency)}
                            >
                                <div className="rounded-full overflow-hidden w-10 h-10 relative">
                                    <Image
                                        src={currency.flag}
                                        alt={currency.name}
                                        width={40}
                                        height={40}
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <h3 className="text-white font-semibold text-lg leading-6">{currency.currencyName}</h3>
                                    <h4 className="font-normal text-base leading-6 text-gray">{currency.name}</h4>
                                </div>
                                {isSelected && (
                                    <Image
                                        src="/static/check.svg"
                                        alt="checked"
                                        width={24}
                                        height={24}
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default memo(CurrencyModal);