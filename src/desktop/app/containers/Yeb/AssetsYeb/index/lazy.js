import view from '../app.js'

import assetsYebState from 'app/redux/Yeb/AssetsYeb'
import assetsMxbState from 'app/redux/Mxb/AssetsMxb'

const reducer = {
    assetsYebState,
    assetsMxbState,
}

export { reducer, view }
