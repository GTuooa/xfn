import view from '../app.js'

import assetsState from 'app/redux/Config/Assets'
import assetsMxbState from 'app/redux/Mxb/AssetsMxb'

const reducer = {
    assetsState,
    assetsMxbState
}

export { reducer, view }
