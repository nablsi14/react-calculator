export type EvalFunc = (left: number, right: number) => number

export interface Operation {
    evaluate: EvalFunc
    text: string
}

export const standard: Operation[] = [
    {
        evaluate: (left: number, right: number) => left + right,
        text: '+'
    },
    {
        evaluate: (left: number, right: number) => right - left,
        text: '−'
    },
    {
        evaluate: (left: number, right: number) => right / left,
        text: '÷'
    },
    {
        evaluate: (left: number, right: number) => right * left,
        text: '×'
    }
]
