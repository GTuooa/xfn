import view from '../app.js'

import projectConfState from 'app/redux/Config/Project/index.js'
import projectCardState from 'app/redux/Config/Project/editProjectCard.js'

const reducer = {
    projectConfState,
    projectCardState
}

export { reducer, view }
