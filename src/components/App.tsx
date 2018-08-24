import {
    AppBar,
    createStyles,
    CssBaseline,
    Grid,
    Theme,
    Toolbar,
    Typography,
    withStyles,
    WithStyles
} from '@material-ui/core'
import React, { Fragment } from 'react'
import Calculator from './calculator/Calculator'
import { standard } from './calculator/Operations'

const styles = (theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1
        }
    })

const App = (props: {} & WithStyles<typeof styles>) => (
    <Fragment>
        <CssBaseline />
        <div className={props.classes.root}>
            <AppBar position="static" color="default">
                <Toolbar>
                    <Typography variant="title" color="inherit" align="center">
                        Calculator
                    </Typography>
                </Toolbar>
            </AppBar>
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
        </div>
    </Fragment>
)

export default withStyles(styles)(App)
