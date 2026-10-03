'use client'
import formClasses from '@/globalFormStyles.module.css'
import {addressToGeolocation} from '@/lib/addressToGeolocation'
import {getWeather} from '@/lib/getWeather'
import {zipToGeolocation} from '@/lib/zipToGeolocation'
import {FormDataType} from '@/sharedTypes'
import {LOCATION_INPUT_TYPES} from '@/utils/constants'
import {normalizeAndValidateLocationField} from '@/utils/fieldValidationAndNormalization'
import {useState} from 'react'
import styles from './homeContent.module.css'

export default function HomeContent() {
    const [formInputs, setFormInputs] = useState<FormDataType>({
        location: {value: '', validationMessage: '', edited: false},
    })
    const [formErrorMessage, setFormErrorMessage] = useState<string>('')

    const handleFormSubmittion = async () => {
        console.log('formInputs.location.value-----')
        console.log(formInputs.location.value)
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
        try {
            let lat = ''
            let lon = ''
            if (normalizedValue.type === LOCATION_INPUT_TYPES.zipcode) {
                const response = await zipToGeolocation(normalizedValue.value)
                const data = await response.json()
            } else if (normalizedValue.type === LOCATION_INPUT_TYPES.address) {
                const response = await addressToGeolocation(
                    normalizedValue.value,
                )
            } else {
                ;[lat, lon] = normalizedValue.value.split(',')
            }

            const response = await getWeather(lat, lon)
            console.log('WEATHER DATA')
            console.log(data)
        } catch (error) {
            console.log('error====')
            console.log(error)
        }

        clearFields()
    }
    const handleFieldChange = (val: string) => {
        setFormInputs({
            ...formInputs,
            location: {value: val, validationMessage: '', edited: true},
        })
        console.log(val)
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
