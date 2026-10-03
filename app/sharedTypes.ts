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

export interface CurrentWeatherApiResponse extends WeatherApiResponse {
    message: string
    displayMessage: string
}

export type WeatherApiResponse = {
    weatherMain: string
    weatherDescription: string
    temperature: number
}

export type AddressType = {
    city: string
    state: string
    country: string
}

export type FormDataType = Record<string, FormInputType>

export type NormalizeLocation = {
    value: string | AddressType | LongitudeAndLatitudeType
    validationMessage: string
    type: string
}
