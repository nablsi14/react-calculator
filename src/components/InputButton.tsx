import React from 'react'
import StyledButton from 'src/components/StyledButton'

interface NumberButtonProps {
    value: number
    onClick: (value: number) => void
}

const NumberButton = (props: NumberButtonProps) => {
    const click = () => props.onClick(props.value)
    return <StyledButton onClick={click}>{props.value}</StyledButton>
}

export default NumberButton
