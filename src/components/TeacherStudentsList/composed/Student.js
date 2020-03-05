import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

const StudentContainer = styled.video`
    width: 300px;
    height: 300px;
    object-fit: cover;
`

const Student = ({ stream, fullName }) => {
    const videoRef = useRef()
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream
        }
    }, [stream])
    return <StudentContainer ref={videoRef} autoPlay />
}

export default Student
