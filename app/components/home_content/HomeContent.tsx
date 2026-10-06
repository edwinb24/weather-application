'use client'
import formClasses from '@/globalFormStyles.module.css'
import {addressToGeolocation} from '@/lib/addressToGeolocation'
import {getWeather} from '@/lib/getWeather'
import {zipToGeolocation} from '@/lib/zipToGeolocation'

import {
    AddressType,
    DisplayWeatherResult,
    FormDataType,
    LongitudeAndLatitudeType,
} from '@/sharedTypes'
import {LOCATION_INPUT_TYPES, WEATHER_URL} from '@/utils/constants'
import {normalizeAndValidateLocationField} from '@/utils/fieldValidationAndNormalization'
import {useState} from 'react'
import styles from './homeContent.module.css'
import WeatherResult from './weather_result/weatherResult'

export default function HomeContent() {
    const [formInputs, setFormInputs] = useState<FormDataType>({
        location: {value: '', validationMessage: '', edited: false},
    })
    const [formErrorMessage, setFormErrorMessage] = useState<string>('')
    const [currWeather, setCurrWeather] = useState<DisplayWeatherResult>({
        weatherMain: '',
        weatherDescription: '',
        temperature: 0,
        weatherIcon: '',
        location: '',
    })
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

            const response = await getWeather({lat, lon})
            const data = await response

            message = data.message
            displayErrorMessage = data.displayMessage
            if (message.length > 0) {
                throw new Error('Error during type convertion: ' + message)
            }

            setCurrWeather({
                weatherMain: data.weatherMain,
                weatherDescription: data.weatherDescription,
                temperature: data.temperature,
                weatherIcon: data.weatherIcon,
                location: formInputs.location.value,
            })
        } catch (e) {
            if (e instanceof Error) {
                message = e.message
            } else message = 'Unknown Error While Excecuting at: ' + WEATHER_URL
            console.error(message)
            setFormErrorMessage(displayErrorMessage)
        }
    }
    const handleFieldChange = (val: string) => {
        setFormErrorMessage(`${val.length < 1 ? 'Location required' : ''}`)
        setFormInputs({
            ...formInputs,
            location: {value: val, validationMessage: '', edited: true},
        })
    }

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
                    comma (,) or your zipcode follow by the 2 letter country
                    code.
                </p>
                <input
                    autoComplete='zip'
                    className={`${formClasses.genericFormField} ${formErrorMessage.length > 0 && formClasses.genericFormFieldError}`}
                    type='text'
                    name='location'
                    placeholder='City, state and country, zip code and country, or geo coordinates'
                    onChange={e => handleFieldChange(e.target.value)}
                    value={formInputs.location.value}
                ></input>
                <div className={formClasses.formFieldErrorMessage}>
                    {`${formErrorMessage ? '❌ ' + formErrorMessage : ''}`}
                </div>
                <button
                    type='submit'
                    className={formClasses.genericFormSubmitButton}
                    disabled={formInputs.location.value.length < 1}
                >
                    Submit
                </button>
            </form>
            {currWeather.weatherMain.length > 0 && (
                <WeatherResult
                    location={currWeather.location}
                    weatherMain={currWeather.weatherMain}
                    weatherDescription={currWeather.weatherDescription}
                    temperature={currWeather.temperature}
                    weatherIcon={currWeather.weatherIcon}
                />
            )}
        </div>
    )
}
