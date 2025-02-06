import { Library } from "@googlemaps/js-api-loader";

export const googleMapsApiConfig = {
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places', 'maps', 'marker'] as Library[],
    version: 'beta',
};