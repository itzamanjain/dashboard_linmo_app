import { Dispatch, SetStateAction } from "react";

export default interface SearchLocationProps {
    onSelect: (location: google.maps.LatLngLiteral, address: string | undefined) => void;
    address: string | undefined;
    setAddress: Dispatch<SetStateAction<string | undefined>>;
}