'use client'
import LocationPinIcon from '@/assets/svgs/LocationPinIcon'
import WeatherBackground from '@/components/weather_background/WeatherBackground'
import WeatherPreview from '@/components/weather_preview/WeatherPreview'
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
import {getCurrentLocation} from '@/utils/getCurrentLocation'
import {useState} from 'react'
import styles from './homeContent.module.css'
import WeatherResult from './weather_result/weatherResult'

const HomeContent = () => {
    const [formInputs, setFormInputs] = useState<FormDataType>({
        location: {value: '', validationMessage: '', edited: false},
    })
    const [formErrorMessage, setFormErrorMessage] = useState<string>('')
    const [currentWeather, setCurrentWeather] = useState<DisplayWeatherResult>({
        weatherMain: '',
        weatherDescription: '',
        temperature: 0,
        weatherIcon: '',
        location: '',
    })
    const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false)
    const [previewWeather, setPreviewWeather] = useState<{
        weatherMain: string
        weatherIcon: string
    } | null>(null)

    const fetchWeatherAtCoordinates = async ({
        latitude,
        longitude,
    }: LongitudeAndLatitudeType) => {
        const locationLabel = `${latitude},${longitude}`
        setFormInputs({
            ...formInputs,
            location: {
                value: locationLabel,
                validationMessage: '',
                edited: true,
            },
        })
        try {
            const data = await getWeather({latitude, longitude})
            if (data.message.length > 0) {
                console.error('Error retrieving weather: ' + data.message)
                setFormErrorMessage(
                    data.displayMessage ||
                        'Error retrieving weather information',
                )
                return
            }
            setCurrentWeather({
                weatherMain: data.weatherMain,
                weatherDescription: data.weatherDescription,
                temperature: data.temperature,
                weatherIcon: data.weatherIcon,
                location: locationLabel,
            })
        } catch (e) {
            console.error(e)
            setFormErrorMessage('Error retrieving weather information')
        }
    }

    const handleUseCurrentLocation = async () => {
        setIsLoadingLocation(true)
        setPreviewWeather(null)
        setFormErrorMessage('')
        try {
            const coordinates = await getCurrentLocation()
            await fetchWeatherAtCoordinates(coordinates)
        } catch (e) {
            setFormErrorMessage(
                e instanceof Error
                    ? e.message
                    : 'Unable to determine your location',
            )
        }
        setIsLoadingLocation(false)
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
        let message = ''
        let displayErrorMessage = ''
        try {
            if (normalizedValue.type === LOCATION_INPUT_TYPES.zipcode) {
                const data = await zipBasedWeather(
                    normalizedValue.value as string,
                )
                displayErrorMessage = data.displayMessage
                message = data.message

                if (message.length > 0) {
                    throw new Error('Error during type convertion: ' + message)
                }
                setCurrentWeather({
                    weatherMain: data.weatherMain,
                    weatherDescription: data.weatherDescription,
                    temperature: data.temperature,
                    weatherIcon: data.weatherIcon,
                    location: formInputs.location.value,
                })
            } else if (normalizedValue.type === LOCATION_INPUT_TYPES.address) {
                const {city, state, country} =
                    normalizedValue.value as AddressType
                const data = await addressToGeolocation({
                    city,
                    state,
                    country,
                })
                displayErrorMessage = data.displayMessage
                message = data.message

                if (message.length > 0) {
                    throw new Error('Error during type convertion: ' + message)
                }
                setCurrentWeather({
                    weatherMain: data.weatherMain,
                    weatherDescription: data.weatherDescription,
                    temperature: data.temperature,
                    weatherIcon: data.weatherIcon,
                    location: formInputs.location.value,
                })
            } else {
                const coordinates =
                    normalizedValue.value as LongitudeAndLatitudeType
                const {latitude, longitude} = coordinates
                const data = await getWeather({latitude, longitude})
                message = data.message
                displayErrorMessage = data.displayMessage
                if (message.length > 0) {
                    throw new Error('Error during type convertion: ' + message)
                }

                setCurrentWeather({
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
    const handleFieldChange = (value: string) => {
        setFormErrorMessage(`${value.length < 1 ? 'Location required' : ''}`)
        setFormInputs({
            ...formInputs,
            location: {value, validationMessage: '', edited: true},
        })
    }

    const hasError = formErrorMessage.length > 0

    return (
        <>
            <WeatherBackground
                weatherMain={
                    previewWeather?.weatherMain ?? currentWeather.weatherMain
                }
                weatherIcon={
                    previewWeather?.weatherIcon ?? currentWeather.weatherIcon
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
                    <div className={styles.searchRow}>
                        <button
                            type='button'
                            className={styles.locationButton}
                            onClick={handleUseCurrentLocation}
                            disabled={isLoadingLocation}
                            title='Use my current location'
                            aria-label='Use my current location'
                        >
                            {isLoadingLocation ? (
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
                            placeholder='Try “Austin, TX” or “10004”'
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
                    Enter your city, state and country separated by commas · Zip
                    code and country code · Latitude, longitude. If city is
                    ommitted, US is assumed
                </p>
                <p
                    id='location-error'
                    className={styles.errorMessage}
                    role='alert'
                >
                    {formErrorMessage}
                </p>
                {currentWeather.weatherMain.length > 0 && (
                    <WeatherResult
                        key={`${currentWeather.location}-${currentWeather.weatherMain}-${currentWeather.temperature}`}
                        location={currentWeather.location}
                        weatherMain={currentWeather.weatherMain}
                        weatherDescription={currentWeather.weatherDescription}
                        temperature={currentWeather.temperature}
                        weatherIcon={currentWeather.weatherIcon}
                    />
                )}
            </div>
        </>
    )
}

export default HomeContent
