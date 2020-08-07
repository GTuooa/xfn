import { toJS, fromJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'
import { nameCheck } from 'app/utils'
// 保存前要做的校验
export default function beforeSaveCheck (runningTemp,categoryTypeObj,isShowAbout) {
    const categoryType = runningTemp.get('categoryType')
    const parentUuid = runningTemp.get('parentUuid')
    const name = runningTemp.get('name')
    const beWelfare = runningTemp.getIn([categoryTypeObj, 'beWelfare'])
    const beWithholding = runningTemp.getIn([categoryTypeObj, 'beWithholding'])
    const propertyAssets = runningTemp.get('propertyAssets')
    const beCarryover = runningTemp.getIn([categoryTypeObj,'beCarryover'])
    const beDeposited = runningTemp.getIn([categoryTypeObj, 'beDeposited'])
    const beSpecial = runningTemp.get('beSpecial')
    const canDelete = runningTemp.get('canDelete')
    const propertyCostList = runningTemp.get('propertyCostList')? runningTemp.get('propertyCostList') : fromJS([])
    const propertyPay = runningTemp.get('propertyPay')
    const propertyCarryover = runningTemp.get('propertyCarryover')
    const propertyTax = runningTemp.get('propertyTax')
    const beAccrued = runningTemp.getIn([categoryTypeObj, 'beAccrued'])
    const beInAdvance = runningTemp.getIn([categoryTypeObj, 'beInAdvance'])
    const beTurnOut = runningTemp.getIn([categoryTypeObj, 'beTurnOut'])
    const propertyInvest = runningTemp.get('propertyInvest')
    let errorList = []

    if (parentUuid === '') {
        errorList.push('上级类别必填')
    }
    if (name === '') {
        errorList.push('类别名称必填')
    } else if (nameCheck(name)) {
        errorList.push(`名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
    }
    if (runningTemp.get('runningAbstract') && runningTemp.get('runningAbstract').length > 45) {
        errorList.push('摘要最长45个字符')
    }
    if (runningTemp.get('remark') && runningTemp.get('remark').length > 60) {
        errorList.push('备注最长60个字符')
    }
    //费用性质校验
    if (categoryType === 'LB_FYZC' || categoryType === 'LB_XCZC') {
        if (!propertyCostList.size) {
            errorList.push('费用性质至少填一项')
        }
    }

    // 营业收入校验
    if (categoryType === 'LB_YYSR') {
        if (!propertyCarryover) {
            errorList.push('收入属性必填')
        }
    }
    //营业支出校验
    if (categoryType === 'LB_YYZC') {
        if (!propertyCarryover) {
            errorList.push('成本属性必填')
        }

    }

    //薪酬支出校验
    if (categoryType === 'LB_XCZC') {
        if (!propertyPay) {
            errorList.push('薪酬属性必填')
        }

    }
    //税费支出校验
    if (categoryType === 'LB_SFZC') {
        if (!propertyTax) {
            errorList.push('税费属性必填')
        }

    }

    //长期资产
    if (categoryType === 'LB_CQZC') {
        if (!propertyAssets) {
            errorList.push('资产属性必填')
        }

    }

    //投资
    if (categoryType === 'LB_TZ') {
        if (!propertyInvest) {
            errorList.push('投资属性必填')
        }

    }
    return errorList
}
