export type FormDataType = Record<string, FormInputType>

type FormInputType = {
    value: string
    validationMessage: string
    edited: boolean
}

export interface LongitudeAndLatitudeType {
    lat: string
    lon: string
}

export interface CoordinateConvertionApiResponse extends LongitudeAndLatitudeType {
    message: string
    displayMessage: string
}

export type WeatherInfo = {
    weatherMain: string
    weatherDescription: string
    temperature: number
    weatherIcon: string
}

export interface CurrentWeatherApiResponse extends WeatherInfo {
    message: string
    displayMessage: string
}

export interface DisplayWeatherResult extends WeatherInfo {
    location: string
}

export type AddressType = {
    city: string
    state: string
    country: string
}

export type NormalizeLocation = {
    value: string | AddressType | LongitudeAndLatitudeType
    validationMessage: string
    type: string
}
