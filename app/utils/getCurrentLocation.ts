import {LongitudeAndLatitudeType} from '@/sharedTypes'

export const getCurrentLocation = (): Promise<LongitudeAndLatitudeType> =>
    new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position =>
                resolve({
                    latitude: position.coords.latitude.toFixed(4),
                    longitude: position.coords.longitude.toFixed(4),
                }),
            error =>
                reject(
                    new Error(
                        error.code === error.PERMISSION_DENIED
                            ? 'Location permission denied'
                            : error.code === error.TIMEOUT
                              ? 'Timed out getting your location'
                              : 'Unable to determine your location',
                    ),
                ),
            {enableHighAccuracy: false, timeout: 10000, maximumAge: 300000},
        )
    })
