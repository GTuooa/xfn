import browserNavigator from 'app/utils/browserNavigator'

import * as dingThirdParty from './dingding'
import * as localThirdParty from './local'

const ThirdParty = browserNavigator.versions.DingTalk ? dingThirdParty : localThirdParty

export default ThirdParty