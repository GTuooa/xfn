import view from '../app.js'

import projectYebState from 'app/redux/Yeb/ProjectYeb'
import projectMxbState from 'app/redux/Mxb/ProjectMxb'

const reducer = {
    projectYebState,
    projectMxbState
}

export { reducer, view }
