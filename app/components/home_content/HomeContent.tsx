'use client'
import formClasses from '@/globalFormStyles.module.css'
import {getWeather} from '@/lib/getWeather'
import {zipBasedWeather} from '@/lib/zipBasedWeather'

import {addressToGeolocation} from '@/lib/addressToGeolocation'
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
    const [isLocating, setIsLocating] = useState<boolean>(false)

    const handleUseCurrentLocation = () => {
        if (!('geolocation' in navigator)) {
            setFormErrorMessage('Geolocation is not supported by your browser')
            return
        }
        setIsLocating(true)
        setFormErrorMessage('')
        navigator.geolocation.getCurrentPosition(
            async position => {
                const lat = position.coords.latitude.toFixed(4)
                const lon = position.coords.longitude.toFixed(4)
                const locationLabel = `${lat},${lon}`
                setFormInputs({
                    ...formInputs,
                    location: {
                        value: locationLabel,
                        validationMessage: '',
                        edited: true,
                    },
                })
                try {
                    const data = await getWeather({lat, lon})
                    if (data.message.length > 0) {
                        console.error(
                            'Error retrieving weather: ' + data.message,
                        )
                        setFormErrorMessage(
                            data.displayMessage ||
                                'Error retrieving weather information',
                        )
                        return
                    }
                    setCurrWeather({
                        weatherMain: data.weatherMain,
                        weatherDescription: data.weatherDescription,
                        temperature: data.temperature,
                        weatherIcon: data.weatherIcon,
                        location: locationLabel,
                    })
                } catch (e) {
                    console.error(e)
                    setFormErrorMessage('Error retrieving weather information')
                } finally {
                    setIsLocating(false)
                }
            },
            error => {
                setIsLocating(false)
                setFormErrorMessage(
                    error.code === error.PERMISSION_DENIED
                        ? 'Location permission denied'
                        : error.code === error.TIMEOUT
                          ? 'Timed out getting your location'
                          : 'Unable to determine your location',
                )
            },
            {enableHighAccuracy: false, timeout: 10000, maximumAge: 300000},
        )
    }

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
                const response = await zipBasedWeather(
                    normalizedValue.value as string,
                )
                const data = await response
                displayErrorMessage = data.displayMessage
                message = data.message

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
            } else if (normalizedValue.type === LOCATION_INPUT_TYPES.address) {
                const {city, state, country} =
                    normalizedValue.value as AddressType
                const response = await addressToGeolocation({
                    city,
                    state,
                    country,
                })
                const data = await response
                displayErrorMessage = data.displayMessage
                message = data.message

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
            } else {
                // lat and lon
                const coordinates =
                    normalizedValue.value as LongitudeAndLatitudeType
                lat = coordinates.lat
                lon = coordinates.lon
                const response = await getWeather({lat, lon})
                const data = await response
                if (message.length > 0) {
                    throw new Error('Error during type convertion: ' + message)
                }

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
            }
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
                    state/province, country (country defaults to the US if
                    omitted), your geo coordinates separated by a
                    comma (,) or your zipcode follow by the 2 letter country
                    code.
                </p>
                <div className={styles.inputRow}>
                    <input
                        autoComplete='zip'
                        className={`${formClasses.genericFormField} ${formErrorMessage.length > 0 && formClasses.genericFormFieldError}`}
                        type='text'
                        name='location'
                        placeholder='City, state and country, zip code and country, or geo coordinates'
                        onChange={e => handleFieldChange(e.target.value)}
                        value={formInputs.location.value}
                    ></input>
                    <button
                        type='button'
                        className={styles.locationButton}
                        onClick={handleUseCurrentLocation}
                        disabled={isLocating}
                        title='Use my current location'
                        aria-label='Use my current location'
                    >
                        {isLocating ? '…' : '🌐'}
                    </button>
                </div>
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
