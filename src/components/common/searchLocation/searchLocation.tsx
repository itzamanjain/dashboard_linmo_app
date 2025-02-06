import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { ChangeEvent, memo, useEffect, useRef, useState } from 'react';

import { googleMapsApiConfig } from '../../../../googleMapsConfig';

import SearchLocationProps from './interfaces/searchLocationProps';

const SearchLocation = (props: SearchLocationProps) => {
    const { onSelect, address, setAddress } = props;

    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [userInput, setUserInput] = useState<string>(address || '');

    const { isLoaded } = useJsApiLoader(googleMapsApiConfig);

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.geometry) {
            const location = {
                lat: place.geometry.location!.lat(),
                lng: place.geometry.location!.lng(),
            };
            setAddress(place.formatted_address || '');
            setUserInput(place.formatted_address || '');
            onSelect(location, place.formatted_address);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setUserInput(newValue);
        setAddress(newValue);
    };

    const injectAutocompleteStyles = () => {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
            .pac-container {
                background-color: #1f1f1f !important;
                color: white !important;
                border: 1px solid #292929 !important;
                font-family: Inter, sans-serif !important;
                font-size:14px !important;
            }
            .pac-item {
                padding: 10px !important;
                background-color: #1f1f1f !important;
                color: white !important;
                border-color:#292929 !important;
                cursor: pointer !important;
            }
            .pac-item-query, .pac-matched {
                color: white !important;
            }
            .pac-item:hover {
                background-color: #1f1f1f !important;
            }
        `;
        document.head.appendChild(styleTag);
    };

    useEffect(() => {
        if (isLoaded) {
            injectAutocompleteStyles();
        }
    }, [isLoaded]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
        >
            <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Enter a location"
                className="font-normal text-sm leading-custom-22 bg-black text-white rounded-xl
                    border border-darkMetal py-3 px-4 placeholder:text-darkgray focus:outline-none opacity-90 w-full"
            />
        </Autocomplete>
    );
};

export default memo(SearchLocation);