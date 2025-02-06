import { signOut } from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { memo } from 'react';

import { auth } from '../../../firebaseConfig';

import useFirebaseAuth from '@/hooks/useFirebaseAuth';
import useReducerDispatch from '@/hooks/useReducerDispatch';
import useSliceSelector from '@/hooks/useSliceSelector';
import { setMainActiveContent, setUserDetails } from '@/reducers/dashboard/dashboardSlice';

// import InfoBox from '../common/infoBox/infoBox';

import moment from 'moment';
import SidebarProps from './interfaces/sidebarProps';

const SidebarMenu = (props: SidebarProps) => {
    const { closeSidebar } = props;
    const router = useRouter();
    const dispatch = useReducerDispatch();
    // const [showInfoBox, setShowInfoBox] = useState(true);
    const { user } = useFirebaseAuth();
    const allEvents = useSliceSelector(state => state.dashboard.allEvents);
    const userDetails = useSliceSelector(state => state.dashboard.userDetails);

    const currentTime = moment();
    const upcomingEvents = allEvents.filter(event => moment(event.trainingStartDateTime).isAfter(currentTime));
    const upcomingEventsLength = upcomingEvents.length;

    const tabs = [
        { name: 'Calendar', icon: '/static/grid.svg', notifications: upcomingEventsLength, width: 18, height: 18 },
        { name: 'Create Event', icon: '/static/circled-plus.svg', notifications: 0, width: 20, height: 20 },
        { name: 'Memberships', icon: '/static/card.svg', notifications: 0, width: 20, height: 14 },
        // { name: 'Stripe', icon: '/static/dollar.svg', notifications: 0, width: 12, height: 20 },
    ];

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(setUserDetails({
                name: '',
                uid: '',
                email: '',
                mainProfilePhoto: ''
            }))
            router.push('/login');
        } catch (error) { }
    };

    // const handleDismiss = () => {
    //     setShowInfoBox(false);
    // };

    const handleTabClick = (tabName: string) => {
        dispatch(setMainActiveContent(tabName));
        closeSidebar();
    };

    const handleStripe = () => {
        window.open("https://dashboard.stripe.com/register", "_blank");
    }

    const displayName = userDetails.name || user?.displayName || 'Anonymous';
    const userEmail = userDetails.email || user?.email || 'No Email';
    const userPhoto = userDetails.mainProfilePhoto || user?.photoURL || '/static/user.svg';

    return (
        <div className="bg-rangoonGreen py-8 px-4 rounded-xl flex flex-col gap-8 h-full">
            <Image
                src="/static/logo.svg"
                width={97}
                height={24}
                alt="LINMO"
                className='cursor-pointer'
                onClick={() => dispatch(setMainActiveContent('Calendar'))}
            />
            <div className='flex flex-col gap-[0.375rem] grow'>
                {tabs.map((tab) => (
                    <div
                        key={tab.name}
                        className={`flex px-2.5 py-2 justify-between items-center rounded-lg bg-transparent cursor-pointer hover:bg-darkMetal transition-colors duration-300`}
                        onClick={() => {
                            tab.name !== 'Stripe' ? handleTabClick(tab.name) : handleStripe()
                        }}
                    >
                        <div className='flex gap-3 items-center'>
                            <div className="min-w-[20px] flex justify-center items-center">
                                <Image
                                    src={tab.icon}
                                    width={tab.width}
                                    height={tab.height}
                                    alt={tab.name}
                                />
                            </div>
                            <h3 className={'font-semibold text-base leading-6 text-white'}>
                                {tab.name}
                            </h3>
                        </div>
                        {tab.name === 'Calendar' && tab.notifications > 0 && (
                            <div className='w-6 h-6 bg-custard rounded-full flex items-center justify-center'>
                                <p className='font-semibold text-black text-xs leading-custom-18'>
                                    {tab.notifications}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {/* {showInfoBox && (
                <InfoBox handleDismiss={handleDismiss} />
            )} */}
            <div className='flex items-center justify-between'>
                <div className='flex gap-2 justify-center items-center'>
                    <div className='w-[39px] h-[39px] rounded-full overflow-hidden'>
                        <Image
                            src={userPhoto}
                            width={39}
                            height={39}
                            alt=""
                        />
                    </div>
                    <div className='flex flex-col gap-[0.125rem]'>
                        <h2 className='text-white font-semibold text-sm leading-5'>{displayName}</h2>
                        <p className='text-gray font-normal text-xs leading-custom-18 break-words max-w-[5.625rem]'>{userEmail}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className='flex items-center justify-center p-1'>
                    <Image
                        src="/static/logout.svg"
                        width={12}
                        height={12}
                        alt="Logout"
                    />
                </button>
            </div>
        </div>
    )
}

export default memo(SidebarMenu);