import {CoordinateConvertionApiResponse} from '@/sharedTypes'

import {AddressType} from '@/sharedTypes'
import {ADDRESS_TO_GEOLOCATION_SS_API} from '@/utils/constants'

export const addressToGeolocation = async ({
    city,
    state,
    country,
}: AddressType): Promise<CoordinateConvertionApiResponse> => {
    const response = await fetch(ADDRESS_TO_GEOLOCATION_SS_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({city, state, country}),
    })

    return response.json()
}
