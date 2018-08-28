export type Parenthesis = '(' | ')'

export type EvalFunc = (left: number, right: number) => number

interface KeyboardShortcut {
    alt: boolean
    ctrl: boolean
    key: string
}
export interface Operation {
    evaluate: EvalFunc
    precedence: number
    shortcut?: KeyboardShortcut
    text: string
}

export const standard: Operation[] = [
    {
        evaluate: (left: number, right: number) => left + right,
        precedence: 1,
        shortcut: { alt: false, ctrl: false, key: '+' },
        text: '+'
    },
    {
        evaluate: (left: number, right: number) => right - left,
        precedence: 1,
        shortcut: { alt: false, ctrl: false, key: '-' },
        text: '−'
    },
    {
        evaluate: (left: number, right: number) => right / left,
        precedence: 2,
        shortcut: { alt: false, ctrl: false, key: '/' },
        text: '÷'
    },
    {
        evaluate: (left: number, right: number) => right * left,
        precedence: 2,
        shortcut: { alt: false, ctrl: false, key: '*' },
        text: '×'
    }
]
