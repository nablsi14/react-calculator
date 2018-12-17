import { createStyles, Grid, WithStyles, withStyles } from '@material-ui/core'
import BackspaceOutlined from '@material-ui/icons/BackspaceOutlined'
import React, { PureComponent } from 'react'
import {
    GridWithNumberButton,
    GridWithOperationButton,
    GridWithStyledButton
} from 'src/components/GridButton'
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
                        <GridWithStyledButton onClick={this.clearEntry}>
                            CE
                        </GridWithStyledButton>

                        <GridWithStyledButton onClick={this.clear}>
                            C
                        </GridWithStyledButton>

                        <GridWithStyledButton onClick={this.clearLast}>
                            <BackspaceOutlined />
                        </GridWithStyledButton>

                        {...this.createNumberButtons()}
                        <GridWithStyledButton onClick={this.toggleSign}>
                            ± {/*  UTF-8 code: U+00B1  */}
                        </GridWithStyledButton>

                        <GridWithNumberButton
                            onClick={this.handleNumberInput}
                            value={0}
                        />
                        <GridWithStyledButton onClick={this.setDecimalPoint}>
                            <span className={classes.decimalButton}>.</span>
                        </GridWithStyledButton>
                    </Grid>
                    <Grid
                        item={true}
                        xs={3}
                        direction="column"
                        container={true}
                        spacing={8}
                    >
                        {this.props.operations.map((op, i) => (
                            <GridWithOperationButton
                                xs="auto"
                                operation={op}
                                onClick={this.handleOperation}
                                key={i}
                            />
                        ))}
                        <GridWithStyledButton xs="auto" onClick={this.evaluate}>
                            =
                        </GridWithStyledButton>
                    </Grid>
                </Grid>
                <Grid item={true} direction="row" container={true} spacing={8}>
                    <GridWithStyledButton xs="auto" onClick={this.openParen}>
                        (
                    </GridWithStyledButton>
                    <GridWithStyledButton xs="auto" onClick={this.closeParen}>
                        )
                    </GridWithStyledButton>
                </Grid>
            </div>
        )
    }
    private readonly openParen = (): void => {
        if (this.state.evaluated) {
            return
        }
        this.setState(({ stack }) => {
            const last = stack[stack.length - 1]
            if (typeof last === 'number') {
                return {
                    stack: [...stack.slice(0, stack.length - 2), '(', last]
                }
            }
            return {
                stack: [...stack, '(']
            }
        })
    }
    private readonly closeParen = (): void => {
        if (this.state.evaluated) {
            return
        }
        this.setState(({ current, stack }) => {
            const last = stack[stack.length - 1]
            if (current !== '' || last === ')' || last === '(') {
                return {
                    current: '',
                    stack: [...stack, parseFloat(current), ')']
                }
            }
            // last is an operation
            return {
                current,
                stack: [...stack.slice(0, stack.length - 1), ')']
            }
        })
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
                // set current to be the last number that was inputted
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
                <GridWithNumberButton
                    key={i}
                    onClick={this.handleNumberInput}
                    value={i}
                />
            )
        }

        return result
    }

    private readonly evaluate = (): void => {
        if (this.state.evaluated || this.state.stack.length === 0) {
            return
        }
        try {
            const toEval =
                this.state.current !== ''
                    ? [...this.state.stack, Number(this.state.current)]
                    : this.state.stack
            const postfixStack = this.infixToPostfix(toEval)
            const result = this.evalPostfix(postfixStack)
            this.setState(prev => ({
                current: String(result),
                evaluated: true,
                history: [...prev.history, { expression: toEval, result }],
                result,
                stack:
                    prev.current !== ''
                        ? [...prev.stack, parseFloat(prev.current)]
                        : prev.stack
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
                    operators[operators.length - 1] !== '('
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
            } else if (key === '(') {
                this.openParen()
            } else if (key === ')') {
                this.closeParen()
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
                    : prev.current === ''
                        ? [...prev.stack, operation]
                        : [...prev.stack, Number(prev.current), operation]
        }))
    }
}
const Calculator = withStyles(styles)(CalculatorBase)
export default Calculator
