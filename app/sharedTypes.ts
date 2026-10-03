type FormInputType = {
    value: string
    validationMessage: string
    edited: boolean
}

export type LongitudeAndLatitudeType = {
    lat: string
    lon: string
}

export type AddressType = {
    city: string
    state: string
    country: string
}

export type FormDataType = Record<string, FormInputType>
