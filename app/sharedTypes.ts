type FormInputType = {
    value: string
    validationMessage: string
    edited: boolean
}

export type FormDataType = Record<string, FormInputType>
