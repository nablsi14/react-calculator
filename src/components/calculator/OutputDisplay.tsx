import { Paper, Typography } from '@material-ui/core'
import React from 'react'

interface Props {
    value: number
}

const OutputDisplay = (props: Props) => {
    return (
        <Paper>
            <Typography variant="body1">{props.value}</Typography>
        </Paper>
    )
}
export default OutputDisplay
