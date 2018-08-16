import { createStyles, Grid, WithStyles, withStyles } from '@material-ui/core'
import React, { PureComponent } from 'react'
import NumberButton from './InputButton'
import OpertionButton from './OperationButton'
import { Operation } from './Operations'
import OutputDisplay from './OutputDisplay'
import StyledButton from './StyledButton'

const styles = () =>
    createStyles({
        grid: {
            border: '1px solid black',
            maxWidth: '400px'
        }
    })
interface Props {
    operations: Operation[]
}
interface State {
    readonly accumulator: number
    readonly operand: number
    readonly operation: Operation | null
}

class CalculatorBase extends PureComponent<
    Props & WithStyles<typeof styles>,
    State
> {
    public readonly state: State = {
        accumulator: 0,
        operand: 0,
        operation: null
    }

    public render(): React.ReactNode {
        return (
            <Grid
                container={true}
                className={this.props.classes.grid}
                justify="center"
                spacing={8}
                direction="row"
            >
                <Grid item={true} xs={12}>
                    <OutputDisplay value={this.state.accumulator} />
                </Grid>
                <Grid item={true} xs={8}>
                    <Grid container={true} spacing={8} wrap="wrap">
                        {...this.createNumberButtons()}
                        <Grid item={true} xs={4}>
                            <StyledButton
                                onClick={this.evaluate}
                                color="primary"
                            >
                                =
                            </StyledButton>
                        </Grid>
                        <Grid item={true} xs={4}>
                            <StyledButton
                                onClick={this.clear}
                                color="secondary"
                            >
                                C
                            </StyledButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item={true} xs={4}>
                    <Grid container={true} spacing={8} direction="column">
                        {this.props.operations.map(op => (
                            <Grid item={true} xs={4} key={op.text}>
                                <OpertionButton
                                    operation={op}
                                    onClick={this.handleOperationClick}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        )
    }
    private readonly clear = (): void => {
        this.setState({
            accumulator: 0,
            operand: 0,
            operation: null
        })
    }
    private readonly createNumberButtons = (): JSX.Element[] => {
        const result: JSX.Element[] = []

        for (let i = 9; i >= 0; i--) {
            result.push(
                <Grid item={true} xs={4} key={i}>
                    <NumberButton onClick={this.handleClick} value={i} />
                </Grid>
            )
        }

        return result
    }
    private readonly evaluate = (): void => {
        if (this.state.operation) {
            const { accumulator, operand, operation } = this.state
            const result = operation.evaluate(accumulator, operand)
            this.setState({
                accumulator: result,
                operand: 0,
                operation: null
            })
        }
    }
    private readonly handleClick = (input: number): void => {
        this.setState(prev => ({
            accumulator: prev.accumulator * 10 + input
        }))
    }
    private readonly handleOperationClick = (operation: Operation): void => {
        this.setState(prev => ({
            accumulator: 0,
            operand: prev.accumulator,
            operation
        }))
    }
}
const Calculator = withStyles(styles)(CalculatorBase)
export default Calculator
