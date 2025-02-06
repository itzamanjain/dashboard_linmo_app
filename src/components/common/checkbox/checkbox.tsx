import { memo, useState } from 'react';

import CheckboxProps from './interfaces/checkboxProps';

const Checkbox = (props: CheckboxProps) => {
    const { checked, onChange, isSub = false } = props;

    const [isChecked, setIsChecked] = useState(checked);

    const handleToggle = () => {
        setIsChecked(!isChecked);
        onChange();
    };

    return (
        <div
            className={`flex items-center justify-between w-14 h-8 rounded-full p-1 cursor-pointer
                transition-all duration-300 ease-in-out ${isChecked ? 'bg-green' : isSub ? 'bg-woodsmoke' : 'bg-darkJungle'}`}
            onClick={handleToggle}
        >
            <div className={`w-6 h-6 rounded-full transition-transform duration-300 ease-in-out
                ${isChecked ? 'transform translate-x-6 bg-black' : 'bg-white'}`}></div>
        </div>
    );
};

export default memo(Checkbox);