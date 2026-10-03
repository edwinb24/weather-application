import {ZIP_TO_GEOLOCATION_SS_API} from '@/utils/constants'

export const zipToGeolocation = async (zipcode: string) => {
    const location = await fetch(ZIP_TO_GEOLOCATION_SS_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            zipcode,
        }),
    })

    return location
}
