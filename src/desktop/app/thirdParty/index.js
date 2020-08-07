import browserNavigator from 'app/utils/browserNavigator'

import * as dingThirdParty from './dingding'
import * as localThirdParty from './local'
// import * as dingThirdParty from 'bundle-loader?lazy&name=DingThirdParty!./dingding'
// import * as localThirdParty from 'bundle-loader?lazy&name=LocalThirdParty!./local'

const ThirdParty = browserNavigator.versions.DingTalk ? dingThirdParty : localThirdParty

export default ThirdParty