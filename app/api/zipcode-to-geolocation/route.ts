export async function POST(request: Request) {
    const requestInfo = await request.json()
    const {zipcode} = requestInfo

    console.log('**********************************zipcode:', zipcode)
    try {
        const url = new URL(ZIP_TO_GEOLOCATION_URL)
        url.searchParams.set('zip', `${zipcode}`)
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
