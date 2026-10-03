import {GET_WEATHER_SS_API} from '@/utils/constants'

export const getWeather = async (lat: string, lon: string) => {
    const location = await fetch(GET_WEATHER_SS_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            lat,
            lon,
        }),
    })

    return location
}
