import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import { Radio } from 'app/components'
import * as editRunning from 'app/constants/editRunning.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'

//流水状态组件
export default class RadioCom extends Component {
    render () {
        const { isModify, dispatch, oriTemp, isOpenedWarehouse, openQuantity, projectShareType, isCopy } = this.props

        const oriState = oriTemp.get('oriState')
        const categoryType = oriTemp.get('categoryType')
        const beAccrued = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beAccrued'])//是否开启计提
        let disabled = isModify && !oriTemp.get('canBeModifyCategory')
        if (isCopy) {
            disabled = false
        }

        let radioList = [], radioListDouble = []
        let showRadio = false

        switch (categoryType) {
            case 'LB_ZSKX': {
                showRadio = true
                radioList = [{key: 'STATE_ZS_SQ', value: '收取'}, {key: 'STATE_ZS_TH', value: '退还'}]
                break
            }
            case 'LB_ZFKX': {
                showRadio = true
                radioList = [{key: 'STATE_ZF_FC', value: '付出'}, {key: 'STATE_ZF_SH', value: '收回'}]
                break
            }
            case 'LB_JK': {
                const handleType = oriTemp.get('handleType')
                if (handleType === 'JR_HANDLE_CHLX') {
                    showRadio = true
                    radioList = [
                        {key: 'STATE_JK_JTLX', value: '计提利息', disabled: !beAccrued, message: '流水设置中未启用'},
                        {key: 'STATE_JK_ZFLX', value: '支付利息'}
                    ]
                }
                break
            }
            case 'LB_TZ': {
                const handleType = oriTemp.get('handleType')
                const propertyInvest = oriTemp.get('propertyInvest')
                if (handleType === 'JR_HANDLE_QDSY') {
                    showRadio = true
                    radioList = [
                        {key: 'STATE_TZ_JTGL', value: '计提股利', disabled: !beAccrued, message: '流水设置中未启用'},
                        {key: 'STATE_TZ_SRGL', value: '收入股利'}
                    ]
                    if (propertyInvest == 'SX_ZQ') {//取得收益--债权
                        radioList = [
                            {key: 'STATE_TZ_JTLX', value: '计提利息', disabled: !beAccrued, message: '流水设置中未启用'},
                            {key: 'STATE_TZ_SRLX', value: '收入利息'}
                        ]
                    }
                }
                break
            }
            case 'LB_ZB': {
                const handleType = oriTemp.get('handleType')
                if (handleType === 'JR_HANDLE_LRFP') {
                    showRadio = true
                    radioList = [
                        {key: 'STATE_ZB_LRFP', value: '利润分配', disabled: !beAccrued, message: '流水设置中未启用'},
                        {key: 'STATE_ZB_ZFLR', value: '支付利润'}
                    ]
                }
                break
            }
            case 'LB_YYSR': {
                showRadio = true
                const beDeposited = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beDeposited'])//是否开启定金管理
                const beSellOff = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beSellOff'])//是否开启退售

                radioList = [
                    {key: 'STATE_YYSR_DJ', value: '预收', disabled: !beDeposited, message: '流水设置中未启用'},
                    {key: 'STATE_YYSR_XS', value: '销售'},
                    {key: 'STATE_YYSR_TS', value: '退销', disabled: !beSellOff, message: '流水设置中未启用'}
                ]
                break
            }
            case 'LB_YYZC': {
                showRadio = true
                const beDeposited = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beDeposited'])//是否开启定金管理
                const beSellOff = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beSellOff'])//是否开启退售

                radioList = [
                    {key: 'STATE_YYZC_DJ', value: '预付', disabled: !beDeposited, message: '流水设置中未启用'},
                    {key: 'STATE_YYZC_GJ', value: '购进'},
                    {key: 'STATE_YYZC_TG', value: '退购', disabled: !beSellOff, message: '流水设置中未启用'}
                ]
                break
            }
            case 'LB_FYZC': {
                showRadio = true
                const beDeposited = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beDeposited'])//是否开启定金管理
                const beManagemented = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beManagemented'])//是否开启收付管理

                radioList = [
                    {key: 'STATE_FY_DJ', value: '预付', disabled: beManagemented && beDeposited ? false : true, message: '流水设置中未启用'},
                    {key: 'STATE_FY', value: '发生'},
                ]
                break
            }
            case 'LB_SFZC': {
                showRadio = true
                const propertyTax = oriTemp.get('propertyTax')//税费属性
                const acTax = oriTemp.get('acTax')
                const beInAdvance = acTax.get("beInAdvance")// 是否预交增值税
                ;({
                    'SX_ZZS': () => {//增值税
                        radioList = [
                            {key: 'STATE_SF_YJZZS', value: '预缴', disabled: !beInAdvance, message: '流水设置中未启用'},
                            {key: 'STATE_SF_ZCWJZZS', value: '转出未交'},
                            {key: 'STATE_SF_JN', value: '缴纳'},
                        ]
                    },
                    'SX_GRSF': () => {//个人税费
                        showRadio = false
                        radioList = [{key: 'STATE_SF_JN', value: '缴纳'}]
                    },
                    'SX_QTSF': () => {//其他税费
                        radioList = [
                            {key: 'STATE_SF_JT', value: '计提', disabled: !beAccrued, message: '流水设置中未启用'},
                            {key: 'STATE_SF_JN', value: '缴纳'}
                        ]
                    },
                    'SX_QYSDS': () => {//企业所得税
                        radioList = [
                            {key: 'STATE_SF_JT', value: '计提', disabled: !beAccrued, message: '流水设置中未启用'},
                            {key: 'STATE_SF_JN', value: '缴纳'}
                        ]
                    }
                }[propertyTax] || (() => null))()

                if (oriState=='STATE_SF_SFJM') {//修改独有的
                    radioList = [
                        {key: 'STATE_SF_SFJM', value: '减免'}
                    ]
                }
                break
            }
            case 'LB_XCZC': {
                showRadio = true
                const propertyPay = oriTemp.get('propertyPay')//税费属性
                ;({
                    'SX_GZXJ': () => {
                        radioList = [
                            {key: 'STATE_XC_JT', value: '计提', disabled: !beAccrued, message: '流水设置中未启用'},
                            {key: 'STATE_XC_FF', value: '发放'}
                        ]
                        if (oriState=='STATE_XC_DK') {
                            radioList = [{key: 'STATE_XC_DK', value: '代扣'}]
                        }
                    },
                    'SX_SHBX': () => {
                        radioList = [
                            {key: 'STATE_XC_JT', value: '计提', disabled: !beAccrued, message: '流水设置中未启用'},
                            {key: 'STATE_XC_JN', value: '缴纳'}
                        ]
                        if (oriState=='STATE_XC_DJ') {
                            radioList = [{key: 'STATE_XC_DJ', value: '代缴'}]
                        }
                    },
                    'SX_ZFGJJ': () => {
                        radioList = [
                            {key: 'STATE_XC_JT', value: '计提', disabled: !beAccrued, message: '流水设置中未启用'},
                            {key: 'STATE_XC_JN', value: '缴纳'}
                        ]
                        if (oriState=='STATE_XC_DJ') {
                            radioList = [{key: 'STATE_XC_DJ', value: '代缴'}]
                        }
                    },
                    'SX_FLF': () => {
                        const beWelfare = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beWelfare'])// 是否过渡福利费
                        radioList = [
                            {key: 'STATE_XC_JT', value: '计提', disabled: !beWelfare, message: '流水设置中未启用'},
                            {key: 'STATE_XC_FF', value: '支付'}
                        ]
                    },
                    'SX_QTXC': () => {
                        radioList = [
                            {key: 'STATE_XC_JT', value: '计提', disabled: !beAccrued, message: '流水设置中未启用'},
                            {key: 'STATE_XC_FF', value: '发放'}
                        ]
                    }
                }[propertyPay] || (() => null))()
                break
            }
            case 'LB_KJFP': {
                showRadio = true
                radioList = [{key: 'STATE_KJFP_XS', value: '销售开票'}, {key: 'STATE_KJFP_TS', value: '退售开票'}]
                break
            }
            case 'LB_FPRZ': {
                showRadio = true
                radioList = [{key: 'STATE_FPRZ_CG', value: '采购发票认证'}, {key: 'STATE_FPRZ_TG', value: '退购发票认证'}]
                break
            }
            case 'LB_JZCB': {
                showRadio = true
                radioList = [
                    {key: 'STATE_YYSR_XS', value: '销售结转'},
                    {key: 'STATE_YYSR_TS', value: '退销转回'},
                    {key: 'STATE_YYSR_ZJ', value: '直接结转'}
                ]
                break
            }
            case 'LB_CHYE': {
                showRadio = isOpenedWarehouse
                radioList = [
                    {key: 'STATE_CHYE_CK', value: '按仓库'},
                    {key: 'STATE_CHYE_CH', value: '按存货'},
                ]
                // if (openQuantity && isOpenedWarehouse) {
                //     radioList.push({key: 'STATE_CHYE_TYDJ', value: '统一单价'})
                // }
                break
            }
            case 'LB_CHZZ': {
                showRadio = true
                radioList = [{key: 'STATE_CHZZ_ZZCX', value: '组装拆卸'}]
                if (openQuantity) {
                    radioList.push({key: 'STATE_CHZZ_ZZD', value: '组装单组装'})
                }
                break
            }
            case 'LB_GGFYFT': {
                showRadio = true
                projectShareType.map(v => {
                    const oriStateValue = v.get('oriState')
                    let typeName = v.get('typeName')
                    if (oriStateValue=='STATE_FZSCCB') {
                        typeName = '辅助成本'
                    }
                    if (oriStateValue=='STATE_GGFYFT') {
                        typeName = '损益项目'
                    }
                    radioList.push({key: oriStateValue, value: typeName})
                })
                if (radioList.length > 3) {
                    radioListDouble = radioList.splice(3,2)
                }
                break
            }
            case 'LB_XMJZ': {
                showRadio = true
                const projectProperty = oriTemp.getIn(['projectCardList', 0, 'projectProperty'])
                radioList = [
                    {key: 'STATE_XMJZ_JZRK', value: '结转入库'},
                    {key: 'STATE_XMJZ_XMJQ', value: '项目结清'},
                ]
                if (projectProperty=='XZ_CONSTRUCTION') {
                    radioList = [
                        {key: 'STATE_XMJZ_QRSRCB', value: '确认收入成本'},
                        {key: 'STATE_XMJZ_XMJQ', value: '项目结清'},
                    ]
                }
                break
            }
            default: null
        }

        const onChange = (key) => {
            if (key==oriState) {//同一状态
                return
            }
            if (isCopy) {
                return dispatch(editRunningActions.changeLrlsOriState(key))
            }
            if (isModify) {
                const contactsManagement = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'contactsManagement'])//是否开启往来管理
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'oriState'], key))
                // dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentCardList'], fromJS([])))
                let billList = oriTemp.get('billList')
                if (billList && billList.size == 0) {
                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'billList'], fromJS([{
                        "billType": "bill_other",
                        "billState": "",
                        "taxRate": '',
                        "tax": ''
                    }])))
                }
                if (contactsManagement) {
                    dispatch(editRunningActions.getCardList('contactsRange'))
                }
                return
            }
            dispatch(editRunningActions.changeLrlsOriState(key))
        }



        return showRadio ? (
            <div>
                <Radio
                    disabled={disabled}
                    list={radioList}
                    value={oriState}
                    onChange={(key) => {
                        onChange(key)
                    }}
                />
                {
                    radioListDouble.length ? <Radio
                        className='radio-list-double'
                        disabled={disabled}
                        list={radioListDouble}
                        value={oriState}
                        onChange={(key) => {
                            onChange(key)
                        }}
                    /> : null
                }
            </div>

        ) : null
    }

}
