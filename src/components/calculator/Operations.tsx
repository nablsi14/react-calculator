export type Parenthesis = '(' | ')'

export type EvalFunc = (left: number, right: number) => number

export interface Operation {
    evaluate: EvalFunc
    precedence: number
    text: string
}

export const standard: Operation[] = [
    {
        evaluate: (left: number, right: number) => left + right,
        precedence: 1,
        text: '+'
    },
    {
        evaluate: (left: number, right: number) => right - left,
        precedence: 1,
        text: '−'
    },
    {
        evaluate: (left: number, right: number) => right / left,
        precedence: 2,
        text: '÷'
    },
    {
        evaluate: (left: number, right: number) => right * left,
        precedence: 2,
        text: '×'
    }
]
