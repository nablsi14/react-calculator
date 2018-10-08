import { createStyles, Grid, WithStyles, withStyles } from '@material-ui/core'
import BackspaceOutlined from '@material-ui/icons/BackspaceOutlined'
import React, { PureComponent } from 'react'
import NumberButton from 'src/components/InputButton'
import OpertionButton from 'src/components/OperationButton'
import StyledButton from 'src/components/StyledButton'
import OutputDisplay from 'src/pages/app/calculator/OutputDisplay'
import { EvalStack, Operation, Parenthesis } from 'src/util/operations'

type PostfixStack = Array<number | Operation>
const styles = () =>
    createStyles({
        calculatorContainer: {
            width: 400
        },
        decimalButton: {
            fontSize: '2em'
        }
    })
interface FinishedExpression {
    expression: EvalStack
    result: number
}
interface Props {
    operations: Operation[]
}
interface State {
    readonly current: string
    readonly evaluated: boolean
    readonly history: FinishedExpression[]
    readonly result: number | null
    readonly stack: EvalStack
}

class CalculatorBase extends PureComponent<
    Props & WithStyles<typeof styles>,
    State
> {
    public readonly state: State = {
        current: '',
        evaluated: false,
        history: [],
        result: null,
        stack: []
    }

    public componentDidMount(): void {
        // setup key bindings
        window.addEventListener('keydown', this.handleKeyPress)
    }

    public componentWillUnmount(): void {
        window.removeEventListener('keydown', this.handleKeyPress)
    }

    public render(): React.ReactNode {
        const { classes } = this.props
        return (
            <div>
                <Grid
                    container={true}
                    className={classes.calculatorContainer}
                    spacing={8}
                >
                    <Grid item={true} xs={12}>
                        <OutputDisplay
                            expression={this.state.stack}
                            result={this.state.result}
                            value={this.state.current}
                        />
                    </Grid>
                    {/* buttons will be added here later */}
                    {/* <Grid item={true} xs={12} /> */}
                    <Grid
                        item={true}
                        xs={9}
                        sm={true}
                        container={true}
                        spacing={8}
                    >
                        <Grid item={true} xs={4}>
                            <StyledButton onClick={this.clearEntry}>
                                CE
                            </StyledButton>
                        </Grid>
                        <Grid item={true} xs={4}>
                            <StyledButton onClick={this.clear}>C</StyledButton>
                        </Grid>
                        <Grid item={true} xs={4}>
                            <StyledButton onClick={this.clearLast}>
                                <BackspaceOutlined />
                            </StyledButton>
                        </Grid>
                        {...this.createNumberButtons()}
                        <Grid item={true} xs={4}>
                            <StyledButton onClick={this.toggleSign}>
                                ± {/*  UTF-8 code: U+00B1  */}
                            </StyledButton>
                        </Grid>

                        <Grid item={true} xs={4}>
                            <NumberButton
                                onClick={this.handleNumberInput}
                                value={0}
                            />
                        </Grid>
                        <Grid item={true} xs={4}>
                            <StyledButton onClick={this.setDecimalPoint}>
                                <span className={classes.decimalButton}>.</span>
                            </StyledButton>
                        </Grid>
                    </Grid>
                    <Grid
                        item={true}
                        xs={3}
                        direction="column"
                        container={true}
                        spacing={8}
                    >
                        {this.props.operations.map(op => (
                            <Grid item={true} key={op.text}>
                                <OpertionButton
                                    operation={op}
                                    onClick={this.handleOperation}
                                />
                            </Grid>
                        ))}
                        <Grid item={true}>
                            <StyledButton onClick={this.evaluate}>
                                =
                            </StyledButton>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }

    private readonly clear = (): void => {
        this.setState({
            current: '',
            evaluated: false,
            result: null,
            stack: []
        })
    }

    private readonly clearEntry = (): void => {
        this.setState({
            current: ''
        })
    }

    private readonly clearLast = (): void => {
        // the last thing to have been clicked was an operation
        if (this.state.current === '') {
            this.setState(prev => ({
                // set curret to be the last number that was inputed
                current: String(prev.stack[prev.stack.length - 2]),
                // remove the last 2 items from the stack
                stack: prev.stack.slice(0, prev.stack.length - 2)
            }))
        } else {
            // the last thing to have been clicked was a digit
            this.setState(prev => {
                return {
                    // slice the last character from the string
                    current: prev.current.slice(0, prev.current.length - 1)
                }
            })
        }
    }
    private readonly createNumberButtons = (): JSX.Element[] => {
        const result: JSX.Element[] = []

        for (let i = 9; i > 0; i--) {
            result.push(
                <Grid item={true} xs={4} key={i}>
                    <NumberButton onClick={this.handleNumberInput} value={i} />
                </Grid>
            )
        }

        return result
    }

    private readonly evaluate = (): void => {
        if (this.state.evaluated || this.state.stack.length === 0) {
            return
        }
        try {
            const toEval = [...this.state.stack, Number(this.state.current)]
            const postfixStack = this.infixToPostfix(toEval)
            const result = this.evalPostfix(postfixStack)
            this.setState(prev => ({
                current: String(result),
                evaluated: true,
                history: [...prev.history, { expression: toEval, result }],
                result,
                stack: [...prev.stack, parseInt(prev.current, 10)]
            }))
        } catch (e) {
            // the stack was invalid
            // this is most likely caused by the user pressing the "=" button before finishing the expression
            // because of this, we are simply going to do nothing and wait for the user to finish the expression
            // tslint:disable-next-line:no-console
            console.log(e.message)
        }
    }

    private readonly evalPostfix = (postfixStack: PostfixStack): number => {
        const tempStack: number[] = []
        for (const item of postfixStack) {
            if (typeof item === 'number') {
                tempStack.push(item)
            } else {
                const num1 = tempStack.pop()
                const num2 = tempStack.pop()
                if (num1 !== undefined && num2 !== undefined) {
                    tempStack.push(item.evaluate(num1, num2))
                } else {
                    throw new Error('Invalid postfix stack')
                }
            }
        }
        return tempStack[0]
    }

    private readonly infixToPostfix = (input: EvalStack): PostfixStack => {
        const result: PostfixStack = []
        const operators: Array<Operation | Parenthesis> = []

        for (const item of input) {
            if (typeof item === 'number') {
                result.push(item)
            } else if (item === '(') {
                operators.push(item)
            } else if (item === ')') {
                while (
                    operators.length !== 0 &&
                    operators[operators.length - 1] !== ')'
                ) {
                    result.push(operators.pop() as Operation)
                }
                if (
                    operators.length !== 0 &&
                    operators[operators.length - 1] !== '('
                ) {
                    throw new Error('Invalid Expression')
                } else {
                    operators.pop()
                }
            } else {
                // item must be an Operation
                while (
                    operators.length !== 0 &&
                    item.precedence <=
                        (operators[operators.length - 1] as Operation)
                            .precedence
                ) {
                    result.push(operators.pop() as Operation)
                }
                operators.push(item)
            }
        }

        while (operators.length !== 0) {
            result.push(operators.pop() as Operation)
        }

        return result
    }

    private readonly setDecimalPoint = (): void => {
        // prevent multiple '.' from being in a number
        if (!this.state.current.includes('.')) {
            this.setState(prev => ({
                current: prev.current + (prev.current === '' ? '0.' : '.')
            }))
        }
    }

    private readonly toggleSign = (): void => {
        this.setState(prev => {
            if (prev.current.charAt(0) === '-') {
                return {
                    current: prev.current.slice(1)
                }
            } else {
                return {
                    current: '-' + prev.current
                }
            }
        })
    }
    private readonly handleKeyPress = (event: KeyboardEvent): void => {
        const { key } = event
        const customShortcutIsPressed = (
            e: KeyboardEvent,
            op: Operation
        ): boolean =>
            op.shortcut !== undefined &&
            op.shortcut.alt === e.altKey &&
            op.shortcut.ctrl === e.ctrlKey &&
            op.shortcut.key === e.key

        if (key !== 'Control' && key !== 'Alt' && key !== 'Shift') {
            if (/\d/g.test(key)) {
                this.handleNumberInput(Number(key))
            } else if (key === '.') {
                this.setDecimalPoint()
            } else if (key === 'Escape') {
                this.clear()
            } else if (key === 'Backspace') {
                this.clearLast()
            } else if (key === '=' || key === 'Enter') {
                event.preventDefault()
                this.evaluate()
            } else {
                for (const op of this.props.operations) {
                    if (customShortcutIsPressed(event, op)) {
                        this.handleOperation(op)
                        break
                    }
                }
            }
        }
    }
    private readonly handleNumberInput = (input: number): void => {
        this.setState(prev => ({
            current: prev.evaluated
                ? String(input)
                : prev.current + String(input),
            evaluated: false,
            result: null,
            stack: prev.evaluated ? [] : prev.stack
        }))
    }

    private readonly handleOperation = (operation: Operation): void => {
        this.setState(prev => ({
            current: '',
            evaluated: false,
            result: null,
            stack:
                prev.evaluated && prev.result !== null
                    ? [prev.result, operation]
                    : [...prev.stack, Number(prev.current), operation]
        }))
    }
}
const Calculator = withStyles(styles)(CalculatorBase)
export default Calculator