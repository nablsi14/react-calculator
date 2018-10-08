import React from 'react'

import StyledButton from 'src/components/StyledButton'
import { Operation } from '../util/operations'

interface Props {
    operation: Operation
    onClick: (operation: Operation) => void
}

const OpertionButton = (props: Props) => {
    const click = () => props.onClick(props.operation)
    return <StyledButton onClick={click}>{props.operation.text}</StyledButton>
}
export default OpertionButton
