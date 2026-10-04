import {WEATHER_UNIT, WEATHER_URL} from '@/utils/constants'

export async function POST(request: Request) {
    const requestInfo = await request.json()
    const {lat, lon} = requestInfo

    try {
        const url = new URL(WEATHER_URL)
        url.searchParams.set('lat', lat)
        url.searchParams.set('lon', lon)
        url.searchParams.set('appid', process.env.WEATHER_API_KEY!)
        url.searchParams.set('units', WEATHER_UNIT)

        const response = await fetch(url)
        const data = await response.json()
        console.log('RAW DATA')
        console.log(data)
        if (!response.ok || !data?.weather[0]) {
            return Response.json({
                weatherMain: '',
                weatherDescription: '',
                temperature: 0,
                displayMessage:
                    response.status === 400
                        ? "Weather information couldn't be found"
                        : response.status === 429
                          ? "Information can't be retrieve since the application already reach its use quota for the day, try again tomorrow"
                          : 'Error retrieving weather information',
                message: `Server Return ${response.status}: ${data?.message ?? 'OpenWeather API error'}`,
            })
        }

        return Response.json({
            weatherMain: data.weather[0].main || '',
            weatherDescription: data.weather[0].description || '',
            weatherIcon: data.weather[0].icon || '',
            temperature: data?.main?.temp ? Math.round(data.main.temp) : 0,
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
            message = 'Unknown Error While Excecuting at: ' + WEATHER_URL
        }
        console.error(message)

        return Response.json({
            weatherMain: '',
            weatherDescription: '',
            temperature: 0,
            weatherIcon: '',
            message,
            displayMessage,
        })
    }
}
