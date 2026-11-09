import {
    CurrentWeatherApiResponse,
    LongitudeAndLatitudeType,
} from '@/sharedTypes'
import {GET_WEATHER_SERVER_SIDE_API} from '@/utils/constants'

// TODO: Add weather return type
export const getWeather = async ({
    latitude,
    longitude,
}: LongitudeAndLatitudeType): Promise<CurrentWeatherApiResponse> => {
    const response = await fetch(GET_WEATHER_SERVER_SIDE_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            latitude,
            longitude,
        }),
    })

    return response.json()
}
