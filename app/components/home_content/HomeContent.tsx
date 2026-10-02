'use client'
import formClasses from '@/globalFormStyles.module.css'
import {FormDataType} from '@/sharedTypes'
import {useState} from 'react'
import styles from './homeContent.module.css'

export default function HomeContent() {
    const [formInputs, setFormInputs] = useState<FormDataType>({
        location: {value: '', validationMessage: '', edited: false},
    })

    const handleFormSubmittion = () => {
        clearFields()
    }
    const handleFieldBlur = (position: string) => {
        console.log(position)
    }
    const handleFieldChange = (position: string) => {
        setFormInputs({
            ...formInputs,
            location: {value: position, validationMessage: '', edited: false},
        })
        console.log(position)
    }

    const clearFields = () => {
        setFormInputs({
            location: {value: '', validationMessage: '', edited: false},
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
                    To get started, enter your city, zip code or geo coordinates
                    separated by a comma (,)
                </p>
                <input
                    autoComplete='address'
                    className={formClasses.genericFormField}
                    type='text'
                    name='location'
                    placeholder='City, zip code or geo coordinates'
                    onChange={e => handleFieldChange(e.target.value)}
                    onBlur={e => {
                        handleFieldBlur(e.target.value)
                    }}
                    value={formInputs.location.value}
                ></input>
                <button
                    type='submit'
                    className={formClasses.genericFormSubmitButton}
                >
                    Submit
                </button>
            </form>
        </div>
    )
}
