import Image from "next/image";
import { ChangeEvent, memo, useCallback, useEffect, useState } from "react";

import CurrencyModal from "../modals/currencyModal/currencyModal";
import SubscriptionForm from "./subscriptionForm/subscriptionForm";
import Modal from "../modals/modal/modal";

import useReducerDispatch from "@/hooks/useReducerDispatch";
import { removeSubscription, setMainActiveContent, setSubscriptions } from "@/reducers/dashboard/dashboardSlice";

import SubscriptionModel from "@/app/models/subscriptionModel";
import useSliceSelector from "@/hooks/useSliceSelector";
import CurrenciesInterface from "./interfaces/currenciesInterface";
import ModalContent from "../modals/modal/interfaces/modalContent";
import Creator from "@/app/models/Creator";
import { getStripeAccount } from "../../../stripeConfig";
import { HOME_URL } from "../homeComponent/homeComponent";
import axios from "axios";
import { Gift, Info, Loader2, PlusCircle } from "lucide-react";

export const currencies: CurrenciesInterface[] = [
    {
        currencyName: 'United States Dollar',
        name: 'usd',
        code: '$',
        flag: '/static/us.svg',
    },
    {
        currencyName: 'Euro',
        name: 'eur',
        code: '€',
        flag: '/static/eu.svg',
    }
];

const Subscriptions = () => {
    const [isCreateSubs, setIsCreateSubs] = useState(false);
    const [isUnlimitedCredits, setIsUnlimitedCredits] = useState(true);
    const [maxCredits, setMaxCredits] = useState(1);
    const [months, setMonths] = useState(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number | undefined>(0);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isCurrencymodal, setIsCurrencyModal] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<CurrenciesInterface>(currencies[1]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
    const [selectedDurationOption, setSelectedDurationOption] = useState('Every Month');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<ModalContent>({
        iconSrc: '',
        title: '',
        description: '',
        buttonText: '',
    });
    const [isNoClubModalOpen, setIsNoClubModalOpen] = useState(false);
    const [isCheckSubModalOpen, setIsCheckSubModalOpen] = useState(false);
    const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useReducerDispatch();
    const subscriptions = useSliceSelector(state => state.dashboard.subscriptions);
    const adminClubId = useSliceSelector(state => state.dashboard.adminClubId);
    const user = useSliceSelector((state => state.dashboard.userDetails));
    const userId = user.uid;
    console.log("user ", user);
    const [connectedAccountId, setConnectedAccountId] = useState("");
    const [connectedAccountStatus, setConnectedAccountStatus] = useState("");

    const dropdownOnClose = useCallback(() => setIsDurationDropdownOpen(false), [setIsDurationDropdownOpen]);
    const incrementCredits = useCallback(() => setMaxCredits(prev => prev + 1), [setMaxCredits]);
    const decrementCredits = useCallback(() => setMaxCredits(prev => Math.max(prev - 1, 1)), [setMaxCredits]);
    const handleMaxCreditsChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setMaxCredits(Number(e.target.value)), [setMaxCredits]);
    const incrementMonths = useCallback(() => setMonths((prev) => prev + 1), [setMonths]);
    const decrementMonths = useCallback(() => setMonths((prev) => Math.max(prev - 1, 1)), [setMonths]);
    const handleMonthsChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setMonths(Number(e.target.value)), [setMonths]);
    const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value), [setTitle]);
    const handleDescriptionChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value), [setDescription]);
    const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value), [setSearchQuery]);
    const handleModalVisibility = useCallback(() => setIsCurrencyModal(false), [setIsCurrencyModal]);
    const handleDurationDropdown = useCallback(() => setIsDurationDropdownOpen(!isDurationDropdownOpen), [isDurationDropdownOpen, setIsDurationDropdownOpen]);

    const closeModal = () => {
        setIsModalOpen(false);
        setIsNoClubModalOpen(false);
        setIsStripeModalOpen(false);
        resetForm();
    };

    const handleDone = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (user.connectedAccountId) {
            setConnectedAccountId(user.connectedAccountId);
        }
    }, [])

    console.log("connectedAccountId ", connectedAccountId);


    const handleCreateSub = async () => {
        try {
            setIsLoading(true);
            const stripeAccount = await fetchUserStripeAccount(user);
            setIsLoading(false);
            if (stripeAccount) {
                setIsCreateSubs(true);
            } else {
                setModalContent({
                    iconSrc: '/static/caution.svg',
                    title: 'A Stripe account is required',
                    description: 'You must create or connect a Stripe account.',
                    buttonText: 'Create',
                });
                setIsStripeModalOpen(true);
            }
        } catch (error) {
            setIsLoading(false);
            setModalContent({
                iconSrc: '/static/caution.svg',
                title: 'A Stripe account is required',
                description: 'You must create or connect a Stripe account.',
                buttonText: 'Create',
            });
            setIsStripeModalOpen(true);
        }
    }

    const doneRedirect = () => {
        setIsNoClubModalOpen(false);
        dispatch(setMainActiveContent('Calendar'));
    }

    const handleFormVisibility = useCallback(() => {
        setIsCreateSubs(false);
        resetForm();
    }, [setIsCreateSubs]);

    const handlePriceChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (/^\d*\.?\d*$/.test(e.target.value)) {
            setPrice(Number(e.target.value))
        }
    }, [setPrice]);

    const handleUnlimitedAttendeesChange = useCallback(() => {
        setIsUnlimitedCredits(prev => !prev);
        if (isUnlimitedCredits) {
            setMaxCredits(0);
        }
    }, [setIsUnlimitedCredits, setMaxCredits, isUnlimitedCredits]);

    const handleDuration = useCallback((option: string) => {
        setSelectedDurationOption(option);
        setIsDurationDropdownOpen(false);
    }, [setSelectedDurationOption, setIsDurationDropdownOpen]);

    const handleCheckSub = () => {
        setIsCheckSubModalOpen(false);
    };

    const canCreateSubscription = async () => {
        setIsLoading(true)
        const path = `${HOME_URL}/payments/getOnboardingStatus`;
        try {
            const response = await axios.post(path, {
                connectedAccountId
            })
            console.log("this is response canCreateSub", response);
            setConnectedAccountStatus(response.data.status);

            if (response.data.status != "completed") {
                setModalContent({
                    iconSrc: '/static/caution.svg',
                    title: 'Your Account Is not Connect!',
                    description: 'You cant create memenerships!',
                    buttonText: 'Done',
                });
                setIsModalOpen(true);
            }


        } catch (error) {
            console.log("something went wrong while checking canCreateSubscription", error);

        } finally {
            setIsLoading(false)
        }

    }


    useEffect(() => {
        canCreateSubscription();
    }, [connectedAccountId])

    const handleSaveSubscription = useCallback(async () => {
        if (!title) {
            setModalContent({
                iconSrc: '/static/caution.svg',
                title: 'Name Required!',
                description: "You must enter name.",
                buttonText: 'Done',
            });
            setIsCheckSubModalOpen(true);
            return;
        }
        if (price === 0) {
            setModalContent({
                iconSrc: '/static/caution.svg',
                title: 'Price Required!',
                description: "You must enter price.",
                buttonText: 'Done',
            });
            setIsCheckSubModalOpen(true);
            return;
        }
        if (!isUnlimitedCredits && maxCredits === 0) {
            setModalContent({
                iconSrc: '/static/caution.svg',
                title: 'Credits required!',
                description: "Bookings can't be zero.",
                buttonText: 'Done',
            });
            setIsCheckSubModalOpen(true);
            return;
        }
        // if (months === 0) {
        //     setModalContent({
        //         iconSrc: '/static/caution.svg',
        //         title: 'Valid duration required!',
        //         description: "Valid duration can't be zero.",
        //         buttonText: 'Done',
        //     });
        //     setIsCheckSubModalOpen(true);
        //     return;
        // }

        const newSubscription: SubscriptionModel = {
            subscriptionName: title,
            subscriptionDescription: description,
            credits: isUnlimitedCredits ? 0 : maxCredits,
            userId,
            isDeleted: false,
            clubId: adminClubId,
            intervalCount: months,
            price,
            createdAt: new Date().toISOString(),
            isBookingUnlimited: isUnlimitedCredits,
            isValidityUnlimited: false,
            intervalType: selectedDurationOption.toLowerCase() || 'month',
            currency: selectedCurrency.name || currencies[1].name,
            stripePriceId: '',
            stripeProductId: '',
            connectedAccountId: connectedAccountId || "",
        };

        await createSubscription(newSubscription);

        if (editingIndex !== null) {
            const updatedSubscriptions = [...subscriptions];
            updatedSubscriptions[editingIndex] = newSubscription;
            dispatch(setSubscriptions(updatedSubscriptions));
        } else {
            dispatch(setSubscriptions([...subscriptions, newSubscription]));
        }
        resetForm();
    }, [title, description, price, maxCredits, months, editingIndex, subscriptions, userId,
        isUnlimitedCredits, selectedCurrency, selectedDurationOption, adminClubId, dispatch]);

    const handleStripe = () => {
        window.open("https://dashboard.stripe.com/register", "_blank");
    }

    const resetForm = () => {
        setIsCreateSubs(false);
        setEditingIndex(null);
        setTitle("");
        setDescription("");
        setPrice(0);
        setMaxCredits(1);
        setMonths(1);
        setIsUnlimitedCredits(true);
        setSelectedDurationOption('');
    };

    const handleCurrency = useCallback((currency: CurrenciesInterface) => {
        setSelectedCurrency(currency);
        setIsCurrencyModal(false);
    }, [setSelectedCurrency, setIsCurrencyModal]);

    const handleDeleteSubscription = useCallback(async (subId: string | undefined) => {
        await deleteSubscription(subId);
        dispatch(removeSubscription(subId));
    }, [dispatch]);

    const createSubscription = async (subscription: SubscriptionModel) => {
        if (connectedAccountId === "") return;

        try {

            const response = await fetch('https://prod-ts-liveliness-server.onrender.com/api/subscriptions/create/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscription),
            });

            if (!response.ok) {
                throw new Error('Failed to create subscription');
            }

            const result = await response.json();
            console.log("", result);

            setModalContent({
                iconSrc: '/static/caution.svg',
                title: 'Membership created!',
                description: 'Your membership has been created!',
                buttonText: 'Done',
            });
            setIsModalOpen(true);

        } catch (error) {
            console.error('Error creating subscription:', error);
        }
    };

    const deleteSubscription = async (id: string | undefined) => {
        try {
            const response = await fetch(`https://prod-ts-liveliness-server.onrender.com/api/subscriptions/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete subscription');
            }

            const result = await response.json();
            console.log(result);
            setModalContent({
                iconSrc: '/static/checkmark.svg',
                title: "Subscription Deleted!",
                description: 'Your subscription has been deleted!',
                buttonText: 'Done',
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error creating subscription:', error);
        }
    };

    const fetchUserStripeAccount = async (user: Pick<Creator, 'uid' | 'email' | 'mainProfilePhoto' | 'name'> & { connectedAccountId?: string }) => {
        try {
            const accountId = user.connectedAccountId;
            if (!accountId) return;

            const stripeAccount = await getStripeAccount(accountId);
            console.log('Stripe Account Data:', stripeAccount);
            return stripeAccount;
        } catch (error) {
            console.error("Error fetching Stripe account data:", error);
            throw error;
        }
    }

    useEffect(() => {
        if (!adminClubId) {
            setModalContent({
                iconSrc: '/static/caution.svg',
                title: "No club found.",
                description: 'You must create a club to offer a membership.',
                buttonText: 'Done',
            });
            setIsNoClubModalOpen(true);
        }
    }, [adminClubId]);

    useEffect(() => {
        if (subscriptions.length > 0) {
            const subscriptionCurrencyCode = subscriptions[0].currency;
            const matchedCurrency = currencies.find(
                (currency) => currency.name === subscriptionCurrencyCode
            );

            setSelectedCurrency(matchedCurrency || currencies[1]);
        } else {
            setSelectedCurrency(currencies[1]);
        }
    }, [subscriptions]);

    if (isLoading) {
        return (
            <div className="flex">
                <Loader2 className="animate-spin text-center w-6 h-6 text-white" />
            </div>
        );
    }


    return (
        <div className={`flex flex-col gap-[1.563rem] pt-12 p-4 lg:px-8 lg:pt-14 pb-2 
            lg:pb-4 h-full w-full lg:w-[910px] lg:mx-auto mb-24`}>
            <div className="flex justify-between flex-row items-center">
                <div className="flex gap-6">
                    <Image
                        src={"/static/back-circle.svg"}
                        alt={"back"}
                        width={24}
                        height={24}
                        className="cursor-pointer"
                        onClick={() => dispatch(setMainActiveContent('Calendar'))}
                    />
                    <h1 className="text-white font-bold text-custom-32 leading-9">Membership</h1>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <h3 className="text-white font-semibold text-lg leading-6">Select your currency</h3>
                <p className="text-buff font-normal text-sm leading-custom-22">
                    *The currency cannot be changed once the subscription is created.
                </p>
                <div className="flex justify-between bg-ash rounded-[10px] p-3 items-center">
                    <div className="flex gap-3">
                        <Image
                            src={"/static/coins.svg"}
                            alt={"currency"}
                            width={24}
                            height={24}
                        />
                        <h3 className="text-white font-semibold text-base leading-6">
                            {selectedCurrency?.currencyName} ({selectedCurrency?.code})
                        </h3>
                    </div>
                    {subscriptions.length === 0 && <div className="flex justify-center items-center">
                        <button
                            onClick={() => setIsCurrencyModal(true)}
                            type="button"
                            className="bg-black rounded-full px-3 py-1 text-white font-bold text-xs leading-custon-18"
                        >
                            Edit
                        </button>
                    </div>}
                </div>
            </div>
            <div className="pt-3 flex flex-col gap-4">
                {isLoading ? <div className="loading-state">
                    <div className="loading"></div>
                </div> : ""}
                {subscriptions.length > 0 && (
                    <>
                        <h3 className="text-white font-semibold text-lg leading-6">This class is available for</h3>
                        {
                            subscriptions.map((sub, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="flex justify-between bg-darkMetal rounded-[10px] p-3 items-center"
                                    >
                                        <div className="flex gap-3">
                                            <Image
                                                src={"/static/gift.svg"}
                                                alt={"sub"}
                                                width={24}
                                                height={24}
                                            />
                                            <h3 className="text-white font-semibold text-base leading-6">{sub.subscriptionName}</h3>
                                        </div>
                                        <div className="flex justify-center items-center">
                                            <Image
                                                src={"/static/trash-01.svg"}
                                                alt={"trash"}
                                                width={16}
                                                height={16}
                                                className="cursor-pointer"
                                                onClick={() => handleDeleteSubscription(sub.subscriptionId)}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </>
                )}
                {!isCreateSubs && subscriptions.length <= 2 && (
                    <>
                        <h3 className="text-green font-bold text-lg leading-6">Create your club membership</h3>
                        <button
                            type="button"
                            className="w-max flex gap-2 border border-darkMetal bg-black px-4 py-2 rounded-[10px] text-white text-sm leading-custom-22 font-bold"
                            onClick={handleCreateSub}
                        >
                            <Image
                                src={"/static/plus.svg"}
                                alt={"add"}
                                width={16}
                                height={16}
                            />
                            Create Membership
                        </button>
                    </>
                )}
                
            </div>
            {isCreateSubs && (
                <SubscriptionForm
                    editingIndex={editingIndex}
                    title={title}
                    description={description}
                    price={price}
                    maxCredits={maxCredits}
                    months={months}
                    isUnlimitedCredits={isUnlimitedCredits}
                    selectedCurrency={selectedCurrency}
                    selectedDurationOption={selectedDurationOption}
                    isDurationDropdownOpen={isDurationDropdownOpen}
                    handleTitleChange={handleTitleChange}
                    handleDescriptionChange={handleDescriptionChange}
                    handlePriceChange={handlePriceChange}
                    handleMonthsChange={handleMonthsChange}
                    handleMaxCreditsChange={handleMaxCreditsChange}
                    incrementCredits={incrementCredits}
                    decrementCredits={decrementCredits}
                    incrementMonths={incrementMonths}
                    decrementMonths={decrementMonths}
                    handleUnlimitedAttendeesChange={handleUnlimitedAttendeesChange}
                    handleSaveSubscription={handleSaveSubscription}
                    handleDuration={handleDuration}
                    handleDurationDropdown={handleDurationDropdown}
                    onClose={handleFormVisibility}
                    dropdownOnClose={dropdownOnClose}
                />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {/* Card 1 */}
                    <div className="bg-neutral-800 text-white p-4 rounded-xl">
                        <div className="flex items-start gap-2">
                            <PlusCircle className="text-white text-lg" />
                            <div>
                                <h3 className="font-semibold">How to create a membership</h3>
                                <p className="text-sm text-neutral-300">
                                    Paid membership for a club is a subscription that provides access to the club’s facilities, activities, and services in exchange for a fee.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-neutral-800 text-white p-4 rounded-xl">
                        <div className="flex items-start gap-2">
                            <Gift className="text-white text-lg" />
                            <div>
                                <h3 className="font-semibold">Class Packs vs. Memberships: A Quick Comparison</h3>
                                <p className="text-sm text-neutral-300">
                                    Why you should offer memberships instead of class packs.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 - Full width on large screens */}
                    <div className="bg-neutral-800 text-white p-4 rounded-xl md:col-span-2">
                        <div className="flex items-start gap-2">
                            <Info className="text-white text-lg" />
                            <div>
                                <h3 className="font-semibold">Cancellation Policy</h3>
                                <p className="text-sm text-neutral-300">
                                    Refunds are only available for memberships. If a user cancels at least 24 hours before the event, the credit will be returned to their account. One-time payments are non-refundable.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            {isCurrencymodal && (
                <CurrencyModal
                    currencies={currencies}
                    selectedCurrency={selectedCurrency}
                    searchQuery={searchQuery}
                    onSearch={handleSearch}
                    onSelectCurrency={handleCurrency}
                    onClose={handleModalVisibility}
                />
            )}
            {isModalOpen && (
                <Modal
                    onClose={closeModal}
                    iconSrc={modalContent.iconSrc}
                    title={modalContent.title}
                    description={modalContent.description}
                    buttonText={modalContent.buttonText}
                    buttonAction={handleDone}
                />
            )}
            {isNoClubModalOpen && (
                <Modal
                    onClose={doneRedirect}
                    iconSrc={modalContent.iconSrc}
                    title={modalContent.title}
                    description={modalContent.description}
                    buttonText={modalContent.buttonText}
                    buttonAction={doneRedirect}
                />
            )}
            {isCheckSubModalOpen && (
                <Modal
                    onClose={handleCheckSub}
                    iconSrc={modalContent.iconSrc}
                    title={modalContent.title}
                    description={modalContent.description}
                    buttonText={modalContent.buttonText}
                    buttonAction={handleCheckSub}
                />
            )}
            {isStripeModalOpen && (
                <Modal
                    onClose={closeModal}
                    iconSrc={modalContent.iconSrc}
                    title={modalContent.title}
                    description={modalContent.description}
                    buttonText={modalContent.buttonText}
                    buttonAction={handleStripe}
                />
            )}
        </div>
    )
}

export default memo(Subscriptions);