import browserNavigator from 'app/utils/browserNavigator'

if (browserNavigator.versions.DingTalk && !global.isplayground) {
    module.exports = require('./dingSinglePaker')
} else {
    module.exports = require('./AntdSinglePicer')
}
