import view from '../app.js'

import relativeConfState from 'app/redux/Config/Relative/index.js'
import relativeCardState from 'app/redux/Config/Relative/editRelativeCard.js'
import lrAccountState from 'app/redux/Edit/LrAccount'

const reducer = {
    relativeConfState,
    relativeCardState,
    lrAccountState,
}

export { reducer, view }
