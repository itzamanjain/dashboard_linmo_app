import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { memo, useEffect, useRef } from 'react';

import { googleMapsApiConfig } from '../../../../googleMapsConfig';

import MapProps from './interfaces/mapProps';

const containerStyle = {
    height: "219px",
    borderRadius: "12px",
};

const mapStyles = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{
            "saturation": 36
        }, {
            "color": "#484848"
        }, {
            "lightness": 30
        }]
    }, {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "visibility": "on"
        }, {
            "color": "#000000"
        }, {
            "lightness": 6
        }]
    }, {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 0
        }]
    }, {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 17
        }, {
            "weight": 1.2
        }]
    }, {
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "administrative.country",
        "elementType": "all",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "administrative.country",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "administrative.country",
        "elementType": "labels.text",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "administrative.locality",
        "elementType": "all",
        "stylers": [{
            "visibility": "simplified"
        }, {
            "saturation": "-100"
        }, {
            "lightness": "20"
        }]
    }, {
        "featureType": "administrative.neighborhood",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "administrative.land_parcel",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{
            "visibility": "simplified"
        }, {
            "gamma": "0.00"
        }, {
            "lightness": "64"
        }]
    }, {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 10
        }]
    }, {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [{
            "lightness": "3"
        }]
    }, {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 1
        }]
    }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#383838"
        }, {
            "lightness": 7
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#383838"
        }, {
            "lightness": 9
        }, {
            "weight": 0.2
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
            "color": "#383838"
        }, {
            "lightness": 8
        }]
    }, {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
            "color": "#383838"
        }, {
            "lightness": 6
        }]
    }, {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 9
        }]
    }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 7
        }]
    }
];

const Map = (props: MapProps) => {
    const { position, onLocationSelect, onCityChange } = props;

    const { isLoaded } = useJsApiLoader(googleMapsApiConfig);
    const mapRef = useRef<google.maps.Map | null>(null);

    const getCityFromCoordinates = async (lat: number, lng: number): Promise<string | undefined> => {
        const geocoder = new google.maps.Geocoder();

        return new Promise<string | undefined>((resolve, reject) => {
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                    const addressComponents = results[0].address_components;

                    const locality = addressComponents.find(component => component.types.includes("locality"))?.long_name;
                    const administrativeArea = addressComponents.find(component => component.types.includes("administrative_area_level_1"))?.long_name;
                    const country = addressComponents.find(component => component.types.includes("country"))?.long_name;

                    if (locality && country) {
                        const formattedAddress = `${locality}, ${administrativeArea ? `${administrativeArea}, ` : ''}${country}`;
                        resolve(formattedAddress);
                    } else {
                        resolve(undefined);
                    }
                } else {
                    reject(new Error('Geocoder failed due to: ' + status));
                }
            });
        });
    };

    useEffect(() => {
        if (isLoaded && mapRef.current && position) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: position }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                    const address = results[0].formatted_address;
                    onLocationSelect(position, address);
                }
            });

            const fetchCity = async () => {
                const city = await getCityFromCoordinates(position.lat, position.lng);
                if (city) {
                    onCityChange(city);
                }
            };

            fetchCity();
        }
    }, [isLoaded, position, onCityChange, onLocationSelect]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={8}
            onLoad={(map) => {
                mapRef.current = map;
            }}
            options={{
                disableDefaultUI: true,
                styles: mapStyles,
            }}
        >
            <Marker
                position={position}
                icon={{
                    url: "/static/map-pin.svg",
                    scaledSize: new google.maps.Size(24, 24)
                }}
            />
        </GoogleMap>
    );
};

export default memo(Map);