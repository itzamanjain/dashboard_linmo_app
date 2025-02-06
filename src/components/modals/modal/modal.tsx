import Image from 'next/image';
import { memo } from 'react';

import ModalProps from './interfaces/modalProps';

const Modal = (props: ModalProps) => {
    const { buttonAction, buttonText, description, iconSrc, onClose, title, isDeleteModal = false, deleteMultiple } = props;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm p-4 sm:p-0"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            onClick={onClose}
        >
            <div
                className="bg-black rounded-2xl p-10 w-[628px] max-w-full flex flex-col items-center justify-center gap-2"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={iconSrc}
                    alt={'modal icon'}
                    width={72}
                    height={72} />
                <h2 className='text-white font-semibold text-custom-32 leading-9 pt-8'>
                    {title}
                </h2>
                <p className='text-darkgray font-normal text-base leading-6 text-center pb-8 px-8'>
                    {description}
                </p>
                <div className="flex gap-4 justify-center items-center">
                    {isDeleteModal ? (
                        <div className='flex flex-col gap-3'>
                            <div
                                className='p-4 bg-darkJungle border border-darkMetal rounded-xl flex gap-3'
                                onClick={buttonAction}
                            >
                                <Image
                                    src="/static/del-activity.svg"
                                    alt='delete'
                                    width={48}
                                    height={48}
                                />
                                <div className='flex flex-col gap-0.5'>
                                    <h3 className='font-semibold text-lg leading-6 text-white'>This activity only</h3>
                                    <h4 className='text-gray font-normal text-sm leading-custom-22'>Delete just on this activity</h4>
                                </div>
                            </div>
                            <div
                                className='p-4 bg-darkJungle border border-darkMetal rounded-xl flex gap-3'
                                onClick={deleteMultiple}
                            >
                                <Image
                                    src="/static/repeated-activity.svg"
                                    alt='delete'
                                    width={48}
                                    height={48}
                                />
                                <div className='flex flex-col gap-0.5'>
                                    <h3 className='font-semibold text-lg leading-6 text-white'>This and repeated Events</h3>
                                    <h4 className='text-gray font-normal text-sm leading-custom-22'>Will delete all the repeated events</h4>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={buttonAction}
                            className="bg-green font-bold text-base leading-6 text-black rounded-xl py-3 px-8"
                        >
                            {buttonText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}


export default memo(Modal);