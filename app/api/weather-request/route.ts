import {WEATHER_UNIT, WEATHER_URL} from '@/utils/constants'

export async function POST(location: string) {
    console.log('location======')
    console.log(location)
    const lat = '52.2297'
    const lon = '21.0122'
    try {
        const url = new URL(WEATHER_URL)
        url.searchParams.set('lat', lat)
        url.searchParams.set('lon', lon)
        url.searchParams.set('appid', process.env.WEATHER_API_KEY!)
        url.searchParams.set('units', WEATHER_UNIT)

        console.log('!!!!!URLLLLL')
        console.log(url)

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
