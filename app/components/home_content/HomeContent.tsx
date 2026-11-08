'use client'
import LocationPinIcon from '@/components/svgs/LocationPinIcon'
import WeatherBackground from '@/components/weather_background/WeatherBackground'
import WeatherPreview, {
    PreviewWeather,
} from '@/components/weather_preview/WeatherPreview'
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

const HomeContent = () => {
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
    const [previewWeather, setPreviewWeather] = useState<PreviewWeather | null>(
        null,
    )

    const handleUseCurrentLocation = () => {
        if (!('geolocation' in navigator)) {
            setFormErrorMessage('Geolocation is not supported by your browser')
            return
        }
        setIsLocating(true)
        setPreviewWeather(null)
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

    const hasError = formErrorMessage.length > 0

    return (
        <>
            <WeatherBackground
                weatherMain={
                    previewWeather?.weatherMain ?? currWeather.weatherMain
                }
                weatherIcon={
                    previewWeather?.weatherIcon ?? currWeather.weatherIcon
                }
            />
            <WeatherPreview
                value={previewWeather}
                onChange={setPreviewWeather}
            />
            <div className={styles.homeContentWrapper}>
                <form
                    className={`${styles.searchCard} ${hasError ? styles.searchCardError : ''}`}
                    onSubmit={e => {
                        e.preventDefault()
                        setPreviewWeather(null)
                        handleFormSubmittion()
                    }}
                >
                    <label htmlFor='location' className={styles.visuallyHidden}>
                        Location
                    </label>
                    <div className={styles.searchRow}>
                        <button
                            type='button'
                            className={styles.locationButton}
                            onClick={handleUseCurrentLocation}
                            disabled={isLocating}
                            title='Use my current location'
                            aria-label='Use my current location'
                        >
                            {isLocating ? (
                                <span className={styles.spinner} />
                            ) : (
                                <LocationPinIcon size={22} />
                            )}
                        </button>
                        <input
                            id='location'
                            autoComplete='postal-code'
                            className={styles.searchInput}
                            type='text'
                            name='location'
                            placeholder='Try “Austin, TX” or “78701”'
                            aria-invalid={hasError}
                            aria-describedby='location-hint location-error'
                            onChange={e => handleFieldChange(e.target.value)}
                            value={formInputs.location.value}
                        ></input>
                        <button
                            type='submit'
                            className={styles.submitButton}
                            disabled={formInputs.location.value.length < 1}
                        >
                            Search
                        </button>
                    </div>
                </form>
                <p id='location-hint' className={styles.hint}>
                    City, state (US assumed), for other cities include the
                    country separated by a comma (City, state, country) · Zip
                    code and country code · Latitude, longitude
                </p>
                <p
                    id='location-error'
                    className={styles.errorMessage}
                    role='alert'
                >
                    {formErrorMessage}
                </p>
                {currWeather.weatherMain.length > 0 && (
                    <WeatherResult
                        key={`${currWeather.location}-${currWeather.weatherMain}-${currWeather.temperature}`}
                        location={currWeather.location}
                        weatherMain={currWeather.weatherMain}
                        weatherDescription={currWeather.weatherDescription}
                        temperature={currWeather.temperature}
                        weatherIcon={currWeather.weatherIcon}
                    />
                )}
            </div>
        </>
    )
}

export default HomeContent
