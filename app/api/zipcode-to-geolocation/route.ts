import {ZIP_TO_GEOLOCATION_URL} from '@/utils/constants'

export async function POST(request: Request): Promise<Response> {
    const requestInfo = await request.json()
    const {zipcode} = requestInfo
    try {
        const url = new URL(ZIP_TO_GEOLOCATION_URL)
        url.searchParams.set('zip', `${zipcode}`)
        url.searchParams.set('appid', process.env.WEATHER_API_KEY!)

        const response = await fetch(url)
        const data = await response.json()

        if (!response.ok) {
            return Response.json({
                lat: '',
                lon: '',
                displayMessage:
                    response.status === 400
                        ? 'Zipcode not found, verify you added the correct zip/country combination'
                        : response.status === 429
                          ? "Zipcode information can't be retrieve since the application already reach its use quota for the day, try again tomorrow"
                          : 'Error retrieving coordinates for zipcode',
                message: `Server Return ${response.status}: ${data?.message ?? 'OpenWeather API error'}`,
            })
        }

        return Response.json({
            lat: data.lat,
            lon: data.lon,
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
                'Unknown Error While Excecuting at: ' + ZIP_TO_GEOLOCATION_URL
        }
        console.error(message)

        return Response.json({lat: '', lon: '', message, displayMessage})
    }
}
