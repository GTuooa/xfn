import view from '../app.js'

import assetsYebState from 'app/redux/Yeb/AssetsYeb'
import assetsState from 'app/redux/Config/Assets'

const reducer = {
    assetsYebState,
    assetsState
}

export { reducer, view }
