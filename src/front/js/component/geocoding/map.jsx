import React, { useEffect, useState, useRef } from 'react';
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';

const MapComponent = (props) => {
    const mapContainerRef = useRef(null);
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const [zoom, setZoom] = useState(3);

    useEffect(() => {
        let isMounted = true;

        const calculateCenterAndZoom = (markers, containerWidth) => {
            let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
            
            markers.forEach(marker => {
                if (marker[0] < minLat) minLat = marker[0];
                if (marker[0] > maxLat) maxLat = marker[0];
                if (marker[1] < minLng) minLng = marker[1];
                if (marker[1] > maxLng) maxLng = marker[1];
            });

            const centerLat = (minLat + maxLat) / 2;
            const centerLng = (minLng + maxLng) / 2;
            setCenter({ lat: centerLat, lng: centerLng });

            const GLOBE_WIDTH = 256; 
            const WORLD_DIM = { height: props.height, width: containerWidth };

            const latFraction = (maxLat - minLat) / 360;
            const lngDiff = maxLng - minLng;
            const lngFraction = lngDiff < 0 ? (lngDiff + 360) / 360 : lngDiff / 360;

            const latZoom = Math.log(WORLD_DIM.height / GLOBE_WIDTH / latFraction) / Math.LN2;
            const lngZoom = Math.log(WORLD_DIM.width / GLOBE_WIDTH / lngFraction) / Math.LN2;

            const newZoom = Math.min(latZoom, lngZoom) * 0.95;

            if (isMounted) {
                setZoom(Math.floor(newZoom));
            }
        };

        if (props.markers.length > 0 && mapContainerRef.current) {
            const width = mapContainerRef.current.offsetWidth;
            calculateCenterAndZoom(props.markers, width);
        }

        return () => {
            isMounted = false;
        };
    }, [props.markers]);
    
    return(
        <div ref={mapContainerRef} style={{ width: '100%', height: props.height + "px" }}>
            <APIProvider apiKey={'AIzaSyAbDzpCV-I2_PaflkmFtXby6R0WelVOapw'} libraries={['marker']}>
                <Map
                    style={{width: '100%', height: props.height + "px" }}
                    defaultCenter={center}
                    defaultZoom={zoom}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                
                />
                {props.markers.map((marker, index) => { 
                    return <Marker key={index} position={{lat: marker[0], lng: marker[1]}} />
                })}
            </APIProvider>
        </div>
    )
};

export default MapComponent;