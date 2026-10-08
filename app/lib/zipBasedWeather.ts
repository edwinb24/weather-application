import {CurrentWeatherApiResponse} from '@/sharedTypes'
import {ZIP_TO_GEOLOCATION_SS_API} from '@/utils/constants'

export const zipBasedWeather = async (
    zipcode: string,
): Promise<CurrentWeatherApiResponse> => {
    const response = await fetch(ZIP_TO_GEOLOCATION_SS_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            zipcode,
        }),
    })

    return response.json()
}
