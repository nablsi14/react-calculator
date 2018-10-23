import Grid, { GridSize } from '@material-ui/core/Grid'
import React from 'react'
import NumberButton from 'src/components/InputButton'
import OpertionButton from 'src/components/OperationButton'
import StyledButton from 'src/components/StyledButton'

interface Props {
    xs?: GridSize
    onClick?: (e: any) => void
}

const gridWithComponent = <P extends object>(
    Component: React.ComponentType<P>
) =>
    class GridWithComponent extends React.Component<P & Props> {
        public render() {
            return (
                <Grid item={true} xs={this.props.xs || 4}>
                    <Component {...this.props} />
                </Grid>
            )
        }
    }

export const GridWithNumberButton = gridWithComponent(NumberButton)
export const GridWithOperationButton = gridWithComponent(OpertionButton)
export const GridWithStyledButton = gridWithComponent(StyledButton)
