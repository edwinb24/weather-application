import {
    AddressType,
    LongitudeAndLatitudeType,
    NormalizeLocation,
} from '@/sharedTypes'
import {LOCATION_INPUT_TYPES} from '@/utils/constants'

const isValidZipcode = (zipcode: string) => {
    const splittedCode = zipcode.split(',')
    if (splittedCode.length < 2) {
        const usZipCodeRegex = /^\d{5}(?:[-\s]\d{4})?$/
        return usZipCodeRegex.test(zipcode)
    } else {
        const internationalZipCodeRegex = /^[a-zA-Z0-9 -]+$/

        return (
            internationalZipCodeRegex.test(splittedCode[0]) &&
            splittedCode[0].length <= 20 &&
            splittedCode[0].trim().split(' ').length <= 2 &&
            splittedCode[1].trim().length == 2
        )
    }
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
    let normalizedZipcode = ''
    if (splittedValue.length < 2) {
        // US Zipcodes entries without country code
        normalizedZipcode = value.trim().substring(0, 5)
    } else {
        // International Zipcodes with country code
        normalizedZipcode =
            splittedValue[0].trim().split(' ')[0] +
            ',' +
            splittedValue[1].trim()
    }
    return {
        type,
        value: normalizedZipcode,
        validationMessage,
    }
}
