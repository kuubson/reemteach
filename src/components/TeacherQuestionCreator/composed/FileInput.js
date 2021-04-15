import React, { useState } from 'react'
import styled from 'styled-components/macro'

import AHTCForm from 'components/AdminHeadTeacherCreator/styled/Form'
import StyledFileInput from '../styled/FileInput'

import { setFeedbackData } from 'utils'

const FileInputContainer = styled.div`
    margin-bottom: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    :last-of-type {
        margin-bottom: 0px;
    }
`

const FileInput = ({ id, label, buttonText, image, onChange }) => {
    const [shouldFileInputAppear, setShouldFileInputAppear] = useState(true)
    const [shouldFileInputBeActive, setShouldFileInputBeActive] = useState(true)
    const resetFileInput = () => {
        setShouldFileInputAppear(false)
        setShouldFileInputAppear(true)
    }
    const handleOnChange = ({ target }) => {
        const allowedExtenstions = /\.(gif|jpe?g|tiff|png|webp|bmp)$/i
        const [image] = target.files
        if (image) {
            switch (true) {
                case !allowedExtenstions.test(image.name):
                    resetFileInput()
                    setFeedbackData('Wybrany plik ma niedozwolone rozszerzenie!', 'Ok')
                    break
                case image.size > 2097152:
                    resetFileInput()
                    setFeedbackData('Wybrany plik ma za duży rozmiar!', 'Ok')
                    break
                default:
                    onChange(image)
            }
        }
    }
    return (
        <FileInputContainer>
            {label && <AHTCForm.Label htmlFor={id}>{label}</AHTCForm.Label>}
            <StyledFileInput.Label htmlFor={id} withImage={image}>
                {image ? image.name : buttonText}
                {image && (
                    <StyledFileInput.RemoveButton
                        onClick={() => {
                            setShouldFileInputBeActive(false)
                            setTimeout(() => {
                                setShouldFileInputBeActive(true)
                                resetFileInput()
                            }, 0)
                            onChange()
                        }}
                    />
                )}
            </StyledFileInput.Label>
            {shouldFileInputAppear && (
                <StyledFileInput.FileInput
                    id={shouldFileInputBeActive ? id : undefined}
                    type="file"
                    onChange={handleOnChange}
                />
            )}
        </FileInputContainer>
    )
}

export default FileInput
