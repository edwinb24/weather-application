import {CITY_COUNTRY_TO_GEOLOCATION_URL} from '@/utils/constants'

export async function POST(request: Request): Promise<Response> {
    const requestInfo = await request.json()
    const {city, state, country} = requestInfo

    try {
        const url = new URL(CITY_COUNTRY_TO_GEOLOCATION_URL)
        url.searchParams.set('q', `${city},${state},${country}`)
        url.searchParams.set('appid', process.env.WEATHER_API_KEY!)

        const response = await fetch(url)
        const data = await response.json()

        if (!response.ok || data.length < 1) {
            return Response.json({
                lat: '',
                lon: '',
                displayMessage:
                    response.status === 400 || response.status === 200
                        ? 'City not found, verify you are adding a city, state/province, and a country, separated by a comma.'
                        : response.status === 429
                          ? "City information can't be retrieve since the application already reach its use quota for the day, try again tomorrow"
                          : 'Error retrieving coordinates for city',
                message: `Server Return ${response.status}: ${data?.message ?? 'OpenWeather API error'}`,
            })
        }

        return Response.json({
            lat: data[0]?.lat ?? 0,
            lon: data[0]?.lon ?? 0,
            displayMessage: data?.message || '',
            message: data?.message || '',
        })
    } catch (e) {
        let message = ''
        let displayMessage = ''
        if (e instanceof Error) {
            message = e.message
        } else {
            displayMessage = 'Error retrieving coordinates for zipcode'
            message =
                'Unknown Error While Excecuting at: ' +
                CITY_COUNTRY_TO_GEOLOCATION_URL
        }
        console.error(message)

        return Response.json({lat: '', lon: '', message, displayMessage})
    }
}
