import { Grid } from '@material-ui/core'
import React from 'react'
import Calculator from './calculator/Calculator'
import { standard } from './calculator/Operations'

const App = () => (
    <Grid
        container={true}
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
    >
        <Grid item={true} xs={12}>
            <Calculator operations={standard} />
        </Grid>
    </Grid>
)

export default App
