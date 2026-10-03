import {
    CurrentWeatherApiResponse,
    LongitudeAndLatitudeType,
} from '@/sharedTypes'
import {GET_WEATHER_SS_API} from '@/utils/constants'

// TODO: Add weather return type
export const getWeather = async ({
    lat,
    lon,
}: LongitudeAndLatitudeType): Promise<CurrentWeatherApiResponse> => {
    const response = await fetch(GET_WEATHER_SS_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            lat,
            lon,
        }),
    })

    return response.json()
}
