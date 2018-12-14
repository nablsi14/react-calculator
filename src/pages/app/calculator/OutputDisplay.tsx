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
import { EvalStack, stringifyEvalStack } from 'src/util/operations'

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
    expression: EvalStack
    result: number | null
    value: string
}

const OutputDisplayBase = (props: Props & WithStyles<typeof styles>) => {
    const expression: string =
        props.expression.length === 0 && props.value === ''
            ? '0'
            : stringifyEvalStack(props.expression) + ' ' + props.value

    return (
        <Paper className={props.classes.display}>
            <Grid
                container={true}
                alignItems="flex-end"
                className={props.classes.grid}
            >
                <Grid item={true} xs={12}>
                    {props.result !== null && (
                        <Typography variant="subheading" align="right">
                            {stringifyEvalStack(props.expression)}
                        </Typography>
                    )}{' '}
                    <Typography variant="title" align="right">
                        {props.result === null ? expression : props.result}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    )
}

const OutputDisplay = withStyles(styles)(OutputDisplayBase)
export default OutputDisplay
