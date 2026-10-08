/**Open Weather API Routes */
export const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
export const ZIP_BASED_WEATHER =
    'https://api.openweathermap.org/data/2.5/weather'
export const ADDRESS_BASED_WEATHER_URL =
    'https://api.openweathermap.org/data/2.5/weather'
export const WEATHER_ICON_URL =
    'https://openweathermap.org/payload/api/media/file/'
export const OPENWEATHER_LINK = 'https://openweathermap.org/'

/** Local Server Side APIs */
export const GET_WEATHER_SS_API = '/api/weather-request'
export const ZIP_BASED_WEATHER_SS_API = '/api/zipcode-based-weather'
export const ADDRESS_BASED_WEATHER_SS_API = '/api/address-based-weather'

export const WEATHER_UNIT = 'imperial'

export enum LOCATION_INPUT_TYPES {
    zipcode = 'zipcode',
    geolocation = 'geolocation',
    address = 'address',
}
