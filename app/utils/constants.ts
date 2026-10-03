/**Open Weather API Routes */
export const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
export const ZIP_TO_GEOLOCATION_URL =
    'http://api.openweathermap.org/geo/1.0/zip'
export const CITY_COUNTRY_TO_GEOLOCATION_URL =
    'http://api.openweathermap.org/geo/1.0/direct'

/** Local Server Side APIs */
export const GET_WEATHER_SS_API = '/api/weather-request'
export const ZIP_TO_GEOLOCATION_SS_API = '/api/zip-to-geolocation'
export const CITY_TO_GEOLOCATION_SS_API = '/api/city-to-geolocation'

export const WEATHER_UNIT = 'imperial'

export enum LOCATION_INPUT_TYPES {
    zipcode = 'zipcode',
    geolocation = 'geolocation',
    address = 'address',
}
