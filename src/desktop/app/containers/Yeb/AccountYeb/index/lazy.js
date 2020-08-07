import view from '../app.js'

import accountYebState from 'app/redux/Yeb/AccountYeb'
import accountMxbState from 'app/redux/Mxb/AccountMxb'

const reducer = {
    accountYebState,
    accountMxbState,
}

export { reducer, view }
