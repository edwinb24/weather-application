'use client'
import formClasses from '@/globalFormStyles.module.css'
import {addressToGeolocation} from '@/lib/addressToGeolocation'
import {getWeather} from '@/lib/getWeather'
import {zipToGeolocation} from '@/lib/zipToGeolocation'
import {
    AddressType,
    FormDataType,
    LongitudeAndLatitudeType,
    WeatherApiResponse,
} from '@/sharedTypes'
import {LOCATION_INPUT_TYPES, WEATHER_URL} from '@/utils/constants'
import {normalizeAndValidateLocationField} from '@/utils/fieldValidationAndNormalization'
import {useState} from 'react'
import styles from './homeContent.module.css'

export default function HomeContent() {
    const [formInputs, setFormInputs] = useState<FormDataType>({
        location: {value: '', validationMessage: '', edited: false},
    })
    const [formErrorMessage, setFormErrorMessage] = useState<string>('')
    const [currWeather, setCurrWeather] = useState<WeatherApiResponse>({
        weatherMain: '',
        weatherDescription: '',
        temperature: 0,
    })

    const handleFieldFocus = () => setFormErrorMessage('')

    const handleFormSubmittion = async () => {
        const normalizedValue = normalizeAndValidateLocationField(
            formInputs.location.value,
        )
        if (normalizedValue.validationMessage.length > 0) {
            setFormInputs({
                ...formInputs,
                location: {
                    ...formInputs.location,
                    validationMessage: normalizedValue.validationMessage,
                },
            })
            setFormErrorMessage(normalizedValue.validationMessage)
            return
        }
        let lat = ''
        let lon = ''
        let message = ''
        let displayErrorMessage = ''
        try {
            if (normalizedValue.type === LOCATION_INPUT_TYPES.zipcode) {
                const response = await zipToGeolocation(
                    normalizedValue.value as string,
                )
                const data = await response
                lat = data.lat
                lon = data.lon
                message = data.message
                displayErrorMessage = data.displayMessage
            } else if (normalizedValue.type === LOCATION_INPUT_TYPES.address) {
                const response = await addressToGeolocation(
                    normalizedValue.value as AddressType,
                )
                const data = await response
                lat = data.lat
                lon = data.lon
                message = data.message
                displayErrorMessage = data.displayMessage
            } else {
                const coordinates =
                    normalizedValue.value as LongitudeAndLatitudeType
                lat = coordinates.lat
                lon = coordinates.lon
            }
            if (message.length > 0) {
                throw new Error('Error during type convertion: ' + message)
            }
            console.log('LAT AND LON')
            console.log(lat + ',' + lon)

            const response = await getWeather({lat, lon})
            const data = await response
            console.log('WEATHER DATA RECEIVED')
            console.log(data)
            message = data.message
            displayErrorMessage = data.displayMessage
            if (message.length > 0) {
                throw new Error('Error during type convertion: ' + message)
            }

            setCurrWeather({
                weatherMain: data.weatherMain,
                weatherDescription: data.weatherDescription,
                temperature: data.temperature,
            })
            clearFields()
        } catch (e) {
            if (e instanceof Error) {
                message = e.message
            } else message = 'Unknown Error While Excecuting at: ' + WEATHER_URL
            console.log(message)
            setFormErrorMessage(displayErrorMessage)
        }
    }
    const handleFieldChange = (val: string) => {
        setFormInputs({
            ...formInputs,
            location: {value: val, validationMessage: '', edited: true},
        })
    }

    const clearFields = () =>
        setFormInputs({
            location: {value: '', validationMessage: '', edited: true},
        })

    return (
        <div className={styles.homeConentWrapper}>
            <form
                className={formClasses.genericForm}
                onSubmit={e => {
                    e.preventDefault()
                    handleFormSubmittion()
                }}
            >
                <p className={formClasses.formDescription}>
                    To get started, enter your city in the format city,
                    state/province, country, your geo coordinates separated by a
                    comma (,) or your zipcode
                </p>
                <input
                    autoComplete='address'
                    className={formClasses.genericFormField}
                    type='text'
                    name='location'
                    placeholder='City, zip code or geo coordinates'
                    onChange={e => handleFieldChange(e.target.value)}
                    value={formInputs.location.value}
                    onFocus={() => handleFieldFocus()}
                ></input>
                <button
                    type='submit'
                    className={formClasses.genericFormSubmitButton}
                >
                    Submit
                </button>
                <p className={formClasses.formFieldErrorMessage}>
                    {formErrorMessage}
                </p>
            </form>
        </div>
    )
}
