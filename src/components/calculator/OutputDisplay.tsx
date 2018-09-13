import {
    createStyles,
    Grid,
    Paper,
    Theme,
    Typography,
    WithStyles,
    withStyles
} from '@material-ui/core'
import React from 'react'
import { EvalStack } from './Operations'

const styles = (theme: Theme) =>
    createStyles({
        display: {
            marginTop: theme.spacing.unit * 2,
            padding: theme.spacing.unit,
            width: '100%'
        },
        grid: {
            height: 100
        }
    })

interface Props {
    evalStack: EvalStack
    value: string
}

const OutputDisplayBase = (props: Props & WithStyles<typeof styles>) => {
    return (
        <Paper className={props.classes.display}>
            <Grid
                container={true}
                alignItems="flex-end"
                className={props.classes.grid}
            >
                <Grid item={true} xs={12}>
                    <Typography variant="title" align="right">
                        {props.evalStack
                            .map(
                                i =>
                                    typeof i === 'number' ||
                                    i === '(' ||
                                    i === ')'
                                        ? i
                                        : i.text
                            )
                            .join(' ') +
                            ' ' +
                            (props.value === '' && props.evalStack.length === 0
                                ? '0'
                                : props.value)}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    )
}
const OutputDisplay = withStyles(styles)(OutputDisplayBase)
export default OutputDisplay
