import {CITY_COUNTRY_TO_GEOLOCATION_URL} from '@/utils/constants'

export async function POST(request: Request) {
    const requestInfo = await request.json()
    const {city, state, country} = requestInfo

    console.log(
        '**********************************zipcode:',
        city,
        state,
        country,
    )
    try {
        const url = new URL(CITY_COUNTRY_TO_GEOLOCATION_URL)
        url.searchParams.set('q', `${city},${state},${country}`)
        url.searchParams.set('appid', process.env.WEATHER_API_KEY!)

        const response = await fetch(url)
        const data = await response.json()

        console.log('Response')
        console.log(data)
    } catch (e) {
        console.log('error here')
        console.log(e)
    }
    return Response.json({message: 'Hello World'})
}
