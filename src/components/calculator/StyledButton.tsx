import React from 'react'

import {
    Button,
    createStyles,
    Theme,
    withStyles,
    WithStyles
} from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        button: {}
    })
interface Props {
    children: any
    color?: 'primary' | 'secondary'
    onClick?: (e: any) => void
}
const StyledButton = (props: Props & WithStyles<typeof styles>) => (
    <Button
        variant="contained"
        onClick={props.onClick}
        className={props.classes.button}
        color={props.color || 'default'}
        fullWidth={true}
    >
        {props.children}
    </Button>
)
export default withStyles(styles)(StyledButton)
