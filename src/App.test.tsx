import enzyme from 'enzyme'
import React from 'react'
import App from './App'

it('renders without crashing', () => {
    enzyme.render(<App />)
})
