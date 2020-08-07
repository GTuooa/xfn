import view from '../app.js'

import bossState from 'app/redux/Report/Boss'
import kmmxbState from 'app/redux/Mxb/Kmmxb'

const reducer = {
    kmmxbState,
    'bossState': bossState
}

export { reducer, view }
