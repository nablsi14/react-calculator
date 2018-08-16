import React from 'react'

import { Operation } from './Operations'
import StyledButton from './StyledButton'

interface Props {
    operation: Operation
    onClick: (operation: Operation) => void
}

const OpertionButton = (props: Props) => {
    const click = () => props.onClick(props.operation)
    return <StyledButton onClick={click}>{props.operation.text}</StyledButton>
}
export default OpertionButton
