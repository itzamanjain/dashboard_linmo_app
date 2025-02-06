export default interface MapProps {
    position: google.maps.LatLngLiteral;
    onLocationSelect: (location: google.maps.LatLngLiteral, address: string) => void;
    onCityChange: (city: string) => void;
}