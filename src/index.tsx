import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from 'src/pages/App'
import registerServiceWorker from 'src/util/registerServiceWorker'
import 'typeface-roboto'

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
registerServiceWorker()
