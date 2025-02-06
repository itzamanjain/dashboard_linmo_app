import Image from 'next/image';
import { memo } from 'react';

import InfoBoxProps from './interfaces/InfoBoxProps';

const InfoBox = (props: InfoBoxProps) => {
    const { handleDismiss } = props;

    return (
        <div className="bg-darkMetal p-3 rounded-xl relative flex flex-col">
            <div className='flex justify-between items-center'>
                <h3 className="text-white font-semibold text-base">How to Use.</h3>
                <button
                    className="text-white p-2"
                    onClick={handleDismiss}
                >
                    <Image
                        src="/static/close.svg"
                        width={8}
                        height={8}
                        alt="Close"
                    />
                </button>
            </div>
            <p className='text-gray font-normal text-sm leading-custom-22 pt-[0.125rem]'>Check out the new features now.</p>
            <textarea
                className='bg-darkJungle rounded-lg my-4 text-white focus:outline-none p-2'
                name="whats-new"
                rows={4}
                autoFocus={false}
            />
            <div className="flex gap-4">
                <button
                    className="text-darkgray font-normal text-sm leading-custom-22"
                    onClick={handleDismiss}
                >
                    Dismiss
                </button>
                <button
                    className="text-swampGreen text-sm leading-custom-22 font-medium"
                    onClick={() => console.log('What&apos;s New clicked')}
                >
                    What&apos;s New
                </button>
            </div>
        </div>
    )
}

export default memo(InfoBox);