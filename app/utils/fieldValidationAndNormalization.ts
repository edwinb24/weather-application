import {
    AddressType,
    LongitudeAndLatitudeType,
    NormalizeLocation,
} from '@/sharedTypes'
import {LOCATION_INPUT_TYPES} from '@/utils/constants'

const isValidZipcode = (zipcode: string) => {
    const zipcodeRegex = /^\d{5}(?:[-\s]\d{4})?$/
    return zipcodeRegex.test(zipcode)
}

const isValidGeolocation = ({lat, lon}: LongitudeAndLatitudeType) => {
    const regexLat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/
    const regexLon =
        /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/
    return regexLat.test(lat) && regexLon.test(lon)
}

export const isValidAddress = ({city, state, country}: AddressType) => {
    const regexAddress = /\d/
    return !(
        regexAddress.test(city) ||
        regexAddress.test(state) ||
        regexAddress.test(country)
    )
}

export const normalizeAndValidateLocationField = (
    value: string,
): NormalizeLocation => {
    let type: string
    let validationMessage = ''
    if (value.length < 1) {
        validationMessage = 'Please enter a location'
        type = LOCATION_INPUT_TYPES.address
    }

    const splittedValue = value.split(',')
    if (
        splittedValue.length == 2 &&
        // this could be remove as it is already part of the validation,
        // but this way it provide a better message for users that enter
        // only city and state and forget the country
        !isNaN(Number(splittedValue[0])) &&
        !isNaN(Number(splittedValue[1]))
    ) {
        type = LOCATION_INPUT_TYPES.geolocation
        const [lat, lon] = splittedValue
        if (!isValidGeolocation({lat, lon})) {
            validationMessage = 'Please enter a valid latitude and longitude'
        }
        return {
            type,
            value: {lat, lon},
            validationMessage,
        }
    } else if (splittedValue.length == 3) {
        type = LOCATION_INPUT_TYPES.address
        const [city, state, country] = splittedValue
        if (!isValidAddress({city, state, country}))
            validationMessage =
                'Please enter a valid city, state/province, country'
        return {
            type,
            value: {city, state, country},
            validationMessage,
        }
    }
    type = LOCATION_INPUT_TYPES.zipcode
    if (!isValidZipcode(value)) {
        validationMessage =
            'Please enter a valid location in the correct format'
    }
    return {
        type,
        value,
        validationMessage,
    }
}
