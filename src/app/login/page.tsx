"use client";

import { GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, memo, useCallback, useState } from 'react';

import { auth } from '../../../firebaseConfig';

import Modal from '@/components/modals/modal/modal';

import ModalContent from '@/components/modals/modal/interfaces/modalContent';
import { HOME_URL } from '@/components/homeComponent/homeComponent';
import Creator from '../models/Creator';

const content = [
    {
        image: '/static/login3.svg',
        quote: "Con esta app he conectado con muchos más alumnos. ¡Pruébala y expande tu comunidad también!",
        name: 'Elena Isa',
        occupation: 'Yoga Teacher'
    },
    {
        image: '/static/login4.svg',
        quote: "Con esta app he encontrado una comunidad súper activa y motivada.",
        name: 'Sonia Zwoleska',
        occupation: 'Fitness Coach'
    },
];

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<ModalContent>({
        iconSrc: '',
        title: '',
        description: '',
        buttonText: '',
    });

    const fetchUserDetails = useCallback(async (userId: string) => {
        const requestOptions: RequestInit = {
            method: "GET"
        };

        try {
            const response = await fetch(`${HOME_URL}user/${userId}`, requestOptions);
            // const response = await fetch(`${HOME_URL}user/b3Lske57swOPBcEGUKkA1CRnKRK2`, requestOptions);


            if (!response.ok) throw new Error("Failed to fetch user details");

            const data: Creator = await response.json();
            return data;

        } catch (error) {
            console.error("Error fetching user details:", error);
            return null;
        }
    }, []);

    const handleLogin = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email && password) {
            try {
                const data = await signInWithEmailAndPassword(auth, email, password);
                const user = data.user;
                const userDetails = await fetchUserDetails(user.uid);

                if (userDetails) {
                    if (userDetails.userType !== 'coach') {
                        setModalContent({
                            iconSrc: '/static/coach.svg',
                            title: 'Only for coaches',
                            description: 'You must have a coach profile to access this dashboard.',
                            buttonText: 'Close',
                        });
                        setIsModalOpen(true);
                    } else {
                        setModalContent({
                            iconSrc: '/static/checkmark.svg',
                            title: "Let's go!",
                            description: 'You have successfully logged in.',
                            buttonText: 'Done',
                        });
                        setIsModalOpen(true);
                        router.push('/');
                    }
                } else {
                    setModalContent({
                        iconSrc: '/static/coach.svg',
                        title: 'Only for coaches',
                        description: 'You must have a coach profile to access this dashboard.',
                        buttonText: 'Close',
                    });
                    setIsModalOpen(true);
                }

            } catch (error) { }
        }
    }, [email, password, router, fetchUserDetails]);

    const handleGoogleLogin = useCallback(async () => {
        const provider = new GoogleAuthProvider();
        try {
            const data = await signInWithPopup(auth, provider);
            const user = data.user;
            const userDetails = await fetchUserDetails(user.uid);
            if (userDetails) {
                if (userDetails.userType !== 'coach') {
                    setModalContent({
                        iconSrc: '/static/coach.svg',
                        title: 'Only for coaches',
                        description: 'You must have a coach profile to access this dashboard.',
                        buttonText: 'Close',
                    });
                    setIsModalOpen(true);
                } else {
                    setModalContent({
                        iconSrc: '/static/checkmark.svg',
                        title: "Let's go!",
                        description: 'You have successfully logged in.',
                        buttonText: 'Done',
                    });
                    setIsModalOpen(true);
                    router.push('/');
                }
            } else {
                setModalContent({
                    iconSrc: '/static/coach.svg',
                    title: 'Only for coaches',
                    description: 'You must have a coach profile to access this dashboard.',
                    buttonText: 'Close',
                });
                setIsModalOpen(true);
            }

        } catch (error) { }
    }, [router, fetchUserDetails]);

    const handleAppleLogin = useCallback(async () => {
        const provider = new OAuthProvider('apple.com');
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;

            const userDetails = await fetchUserDetails(user.uid);
            if (userDetails) {
                if (userDetails.userType !== 'coach') {
                    setModalContent({
                        iconSrc: '/static/coach.svg',
                        title: 'Only for coaches',
                        description: 'You must have a coach profile to access this dashboard.',
                        buttonText: 'Close',
                    });
                    setIsModalOpen(true);
                } else {
                    setModalContent({
                        iconSrc: '/static/checkmark.svg',
                        title: "Let's go!",
                        description: 'You have successfully logged in.',
                        buttonText: 'Done',
                    });
                    setIsModalOpen(true);
                    router.push('/');
                }
            } else {
                setModalContent({
                    iconSrc: '/static/coach.svg',
                    title: 'Only for coaches',
                    description: 'You must have a coach profile to access this dashboard.',
                    buttonText: 'Close',
                });
                setIsModalOpen(true);
            }

        } catch (error) { }
    }, [router, fetchUserDetails]);

    const handleForgotPassword = useCallback(() => {
        setModalContent({
            iconSrc: '/static/lock.svg',
            title: 'Recover Password',
            description:
                'To recover your password and regain access to your account, please use our app.',
            buttonText: 'Done',
        });
        setIsModalOpen(true);
    }, []);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(!showPassword);
    }, [showPassword]);

    const handleNextImage = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
    }, []);

    const handlePreviousImage = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + content.length) % content.length);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return (
        <div className="flex flex-col md:flex-row h-screen w-full">
            <div className="w-full lg:w-2/4 flex items-center justify-center bg-black px-4 lg:px-0 h-[100vh]">
                <form onSubmit={handleLogin} className="flex flex-col w-full gap-3 text-left mx-auto max-w-sm-web 2xl:max-w-md-web 3xl:max-w-lg-web">
                    <div className='flex flex-col gap-2 mb-8 text-center md:text-left'>
                        <div className="flex flex-col md:flex-row items-center gap-2">
                            <h1 className="font-bold text-custom-32 leading-9 text-white">Welcome to</h1>
                            <Image
                                src="/static/logo.svg"
                                width={97}
                                height={24}
                                alt="LINMO"
                            />
                        </div>
                        <p className='font-normal leading-custom-22 text-sm text-gray'>
                            Please enter your details.
                        </p>
                    </div>
                    <Link href="#" onClick={handleGoogleLogin} className='bg-white font-bold text-sm leading-custom-22 text-black rounded-xl flex items-center py-3 justify-center gap-2'>
                        <Image
                            src="/static/google.svg"
                            width={24}
                            height={24}
                            alt="google"
                        />
                        Login with Google
                    </Link>
                    <Link href="#" onClick={handleAppleLogin} className='bg-white font-bold text-sm leading-custom-22 text-black rounded-xl flex items-center py-3 justify-center gap-2'>
                        <Image
                            src="/static/apple.svg"
                            width={24}
                            height={24}
                            alt="google"
                        />
                        Login with Apple
                    </Link>
                    <div className='flex gap-3 mt-3'>
                        <div className="grow flex items-center">
                            <div className="w-full border-t border-darkMetal"></div>
                        </div>
                        <p className='text-sm font-normal leading-custom-22 text-darkgray'>Or login with</p>
                        <div className="grow flex items-center">
                            <div className="w-full border-t border-darkMetal"></div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="email" className='font-medium leading-custom-22 text-sm text-white'>Your email</label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter your email address'
                            className='font-normal leading-custom-22 text-sm text-white bg-black border border-darkMetal rounded-xl py-2 px-3 focus:outline-none'
                            required
                        />
                    </div>
                    <div className='flex flex-col gap-2 mt-2'>
                        <label htmlFor="password" className='font-medium leading-custom-22 text-sm text-white'>Your Password</label>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter your password'
                                className='font-normal leading-custom-22 text-sm text-white bg-black border border-darkMetal rounded-xl py-2 px-3 w-full focus:outline-none'
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className='absolute right-4 top-1/2 transform -translate-y-1/2'
                            >
                                <Image
                                    src={showPassword ? "/static/eye.svg" : "/static/eye-off.svg"}
                                    alt="show/hide password"
                                    width={16}
                                    height={16}
                                />
                            </button>
                        </div>
                    </div>
                    <Link
                        href="#"
                        onClick={handleForgotPassword}
                        className='text-green font-medium leading-custom-22 text-sm self-end mt-1'
                    >
                        Forgot Password?
                    </Link>
                    <button type='submit' className='bg-green font-bold text-base leading-6 text-black rounded-xl py-3 mt-5 text-center mb-5'>
                        Login
                    </button>
                    <p className='font-normal text-xs leading-custom-18 text-white text-center px-0 md:px-custom-70'>
                        By continuing you agree to our
                        <Link href={'#'} className='text-sandstone px-1'>Privacy Policy</Link>
                        and
                        <Link href={'#'} className='text-sandstone px-1'>
                            Terms & Conditions
                        </Link>
                    </p>
                </form>
            </div>
            <div className="w-2/4 hidden lg:flex flex-col">
                <div className="flex flex-1 bg-cover bg-center relative transition-opacity duration-500" style={{ backgroundImage: `url('${content[currentIndex].image}')` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="flex-1 flex items-end">
                        <div className="w-full px-10 pb-20 z-10 flex flex-col gap-8">
                            <h2 className='text-white font-bold text-base sm:text-custom-32 leading-5 sm:leading-9 text-left'>
                                {content[currentIndex].quote}
                            </h2>
                            <div className='flex justify-between items-center'>
                                <div className='flex flex-col gap-custom-2'>
                                    <h2 className='font-semibold text-white text-custom-22 leading-7'>
                                        {content[currentIndex].name}
                                    </h2>
                                    <p className='font-medium text-green text-base leading-6'>
                                        {content[currentIndex].occupation}
                                    </p>
                                </div>
                                <div className='flex gap-4 items-center justify-center'>
                                    <button type='button' onClick={handlePreviousImage}>
                                        <Image
                                            src={'/static/left-circle.svg'}
                                            alt={'left'}
                                            width={48}
                                            height={48}
                                        />
                                    </button>
                                    <button type='button' onClick={handleNextImage}>
                                        <Image
                                            src={'/static/right-circle.svg'}
                                            alt={'right'}
                                            width={48}
                                            height={48}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <Modal
                    onClose={closeModal}
                    iconSrc={modalContent.iconSrc}
                    title={modalContent.title}
                    description={modalContent.description}
                    buttonText={modalContent.buttonText}
                    buttonAction={closeModal}
                />
            )}
        </div>
    )
}

export default memo(LoginPage);