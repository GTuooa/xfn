import view from '../app.js'

import bossState from 'app/redux/Report/Boss'
import jrBossState from 'app/redux/Report/JrBoss'
import kmmxbState from 'app/redux/Mxb/Kmmxb'
import runningTypeMxbState from 'app/redux/Mxb/RunningTypeMxb'
import runningPreviewState from 'app/redux/Edit/RunningPreview'

const reducer = {
    kmmxbState,
    'bossState': bossState,
    jrBossState,
    runningTypeMxbState,
    runningPreviewState
}

export { reducer, view }
