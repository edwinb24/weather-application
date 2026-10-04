/**Open Weather API Routes */
export const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
export const ZIP_TO_GEOLOCATION_URL =
    'http://api.openweathermap.org/geo/1.0/zip'
export const CITY_COUNTRY_TO_GEOLOCATION_URL =
    'http://api.openweathermap.org/geo/1.0/direct'
export const WEATHER_ICON_URL =
    'https://openweathermap.org/payload/api/media/file/'

/** Local Server Side APIs */
export const GET_WEATHER_SS_API = '/api/weather-request'
export const ZIP_TO_GEOLOCATION_SS_API = '/api/zipcode-to-geolocation'
export const ADDRESS_TO_GEOLOCATION_SS_API = '/api/address-to-geolocation'

export const WEATHER_UNIT = 'imperial'

export enum LOCATION_INPUT_TYPES {
    zipcode = 'zipcode',
    geolocation = 'geolocation',
    address = 'address',
}
