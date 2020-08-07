import browserNavigator from 'app/utils/browserNavigator'

// if (browserNavigator.versions.DingTalk && !global.isplayground) {
//     module.exports = require('./dingSinglePaker')
// } else {
    // module.exports = require('./AntdSinglePicer')
// }

import dingSinglePaker from './dingSinglePaker'
import AntdSinglePicer from './AntdSinglePicer'

const SinglePicer = browserNavigator.versions.DingTalk ? dingSinglePaker : AntdSinglePicer

export default SinglePicer