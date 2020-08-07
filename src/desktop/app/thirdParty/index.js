import browserNavigator from 'app/utils/browserNavigator'

if (browserNavigator.versions.DingTalk) {
    module.exports = require('./dingding')
} else {
    module.exports = require('./local')
}
