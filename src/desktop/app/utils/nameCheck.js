import * as Limit from 'app/constants/Limit.js'
export default function nameCheck (str) {//校验名称 中文32个 纯英文64个
    let hasCh = false
    if(/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
        hasCh = true
    }
    if (hasCh && str.length > Limit.AC_CHINESE_NAME_LENGTH) {
        return true
    }
    if (!hasCh && str.length > Limit.AC_NAME_LENGTH) {
        return true
    }
    return false
}