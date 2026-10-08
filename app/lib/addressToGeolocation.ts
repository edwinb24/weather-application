import {CurrentWeatherApiResponse} from '@/sharedTypes'

import {AddressType} from '@/sharedTypes'
import {ADDRESS_BASED_WEATHER_SS_API} from '@/utils/constants'

export const addressToGeolocation = async ({
    city,
    state,
    country,
}: AddressType): Promise<CurrentWeatherApiResponse> => {
    const response = await fetch(ADDRESS_BASED_WEATHER_SS_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({city, state, country}),
    })

    return response.json()
}
