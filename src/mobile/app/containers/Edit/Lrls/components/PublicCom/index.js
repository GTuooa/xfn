import React, { Component }  from 'react'
import { toJS, fromJS } from 'immutable'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { Row, SinglePicker, Icon, SwitchText, TreeSelect, Single } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { connect }	from 'react-redux'

@connect(state => state)
export default
class Account extends Component {
    // static contextTypes = { router: PropTypes.object }

    render() {

        const { dispatch, accountList, accountUuid, accountName, onOk, history, noInsert } = this.props
        // const { router } = this.context

        let dataList = accountList.toJS()
        if (!noInsert) {//查询流水中的账户不需要新增
            dataList.unshift({key: '新增账户', value: `insert${Limit.TREE_JOIN_STR}`})
        }

        return (
            <SinglePicker
                className='antd-single-picker'
                district={dataList}
                value={`${accountUuid}${Limit.TREE_JOIN_STR}${accountName}`}
                onOk={value => {
                    if (value.value.split(Limit.TREE_JOIN_STR)[0]=='insert') {
                        dispatch(push('/lrls-account'))
                        return
                    }
                    onOk(value.value)
                }}
            >
                {/* <div> */}
                    <Row style={{color: accountName ? '' : '#999'}} className='lrls-account lrls-type'>
                        <span className='overElli'>{ accountName ? accountName : '点击选择账户' }</span>
                        <Icon type="triangle" />
                    </Row>
                {/* </div> */}
            </SinglePicker>
        )
    }
}

//流水类别组件
export class CategoryCom extends Component {

    render() {

        const {
            isModify,
            categoryName,
            dispatch,
            showProject,
            project,
            noAmount,
            changeAmount,
            lastCategory,
            categoryUuid
        } = this.props

        let projectCard = [], usedProject, totalAmount = 0
        if (showProject) {
            usedProject = project.get('usedProject')
            project.get('projectCard').forEach(v => totalAmount += Number(v.get('amount')))
        }

        return (
            <Row className='lrls-type'>
                <TreeSelect
                    disabled={isModify}
					district={lastCategory.toJS()}
                    value={categoryUuid}
					onChange={(item) => {
						dispatch(homeAccountActions.changeLrlsData(['project', 'projectCard'], fromJS([{amount: ''}])))
                        dispatch(homeAccountActions.changeLrlsEnclosureList())
						if (item['canShow']) {
							const value = `${item['uuid']}${Limit.TREE_JOIN_STR}${item['name']}`
							dispatch(homeAccountActions.getCardDetail(value))
						} else {//核算管理
							const value = `${item['uuid']}${Limit.TREE_JOIN_STR}${item['name']}${Limit.TREE_JOIN_STR}${item['categoryType']}`
							dispatch(homeAccountActions.toManageType(value, item))
						}
					}}
				>
                    <Row>
                        <span style={{color: categoryName == '请选择类别' ? '#ccc' : ''}}>{categoryName}</span>
                        <Icon type="triangle" style={{color: isModify ? '#ccc' : ''}}/>
                    </Row>
                </TreeSelect>
                {
                    showProject ? <SwitchText
                        checked={usedProject}
                        checkedChildren='项目'
                        unCheckedChildren=''
                        className='topBarSwitch'
                        onChange={(value) => {
                            dispatch(homeAccountActions.changeHomeAccountData('project', !usedProject))
                            if (noAmount) {
                                return
                            }
                            if (usedProject) {//从开启到关闭
                                changeAmount(0)
                            } else {//从关闭到开启
                                changeAmount(totalAmount)
                            }
                        }}
                    /> : null
                }
            </Row>


        )
    }
}

//摘要
export function abstractFun (runningState, data) {
    const propertyCarryover = data.get('propertyCarryover')
    const categoryName = data.get('categoryName') ?  data.get('categoryName') : data.get('name')
    const propertyPay = data.get('propertyPay')
    const propertyTax = data.get('propertyTax')
    return {
        STATE_YYSR_DJ:'收到预收款',
        STATE_YYSR_XS:`销售${propertyCarryover === 'SX_HW'?'存货':''}收入`,
        STATE_YYSR_TS:`${propertyCarryover === 'SX_HW'?'销货':'销售'}退回支出`,
        STATE_YYZC_DJ:'支付预付款',
        STATE_YYZC_GJ:`采购${propertyCarryover === 'SX_HW'?'存货':''}支出`,
        STATE_YYZC_TG:`${propertyCarryover === 'SX_HW'?'购货':'采购'}退还收入`,
        STATE_FY_DJ:'支付预付款',
        STATE_FY_YF:`${categoryName}支出`,
        STATE_FY_WF:`${categoryName}支出`,
        STATE_XC_JT:`计提${{SX_GZXJ:'工资薪金',SX_SHBX:'社会保险',SX_ZFGJJ:'住房公积金',SX_QTXC:categoryName}[propertyPay]}`,
        STATE_XC_FF:`发放${{SX_GZXJ:'工资薪金',SX_QTXC:categoryName}[propertyPay]}`,
        STATE_XC_JN:`缴纳${{SX_SHBX:'社会保险',SX_ZFGJJ:'住房公积金'}[propertyPay]}`,
        STATE_XC_YF:'福利费支出',
        STATE_SF_YJZZS:'预缴增值税',
        STATE_SF_JN:`${{SX_QYSDS:'缴纳企业所得税',SX_GRSF:'代缴个人税费',SX_QTSF:`缴纳${categoryName}`,SX_ZZS:'缴纳增值税'}[propertyTax]}`,
        STATE_SF_JT:`计提${{SX_QYSDS:'企业所得税',SX_GRSF:'个人税费',SX_QTSF:`${categoryName}`,SX_ZZS:'增值税'}[propertyTax]}`,
        STATE_YYWSR_WS:categoryName,
        STATE_YYWSR_YS:categoryName,
        STATE_YYWZC_WF:categoryName,
        STATE_YYWZC_YF:categoryName,
        STATE_ZS_SQ:'暂收款',
        STATE_ZS_TH:'暂收款退还',
        STATE_ZF_FC:'暂付款',
        STATE_ZF_SH:'暂付款收回',
        STATE_CQZC_WF:'购进资产支出',
        STATE_CQZC_YF:'购进资产支出',
        STATE_CQZC_ZJTX:'资产折旧摊销',
        STATE_CQZC_WS:'处置资产收入',
        STATE_CQZC_YS:'处置资产收入',
        STATE_CQZC_JZSY:'处置资产处置损益',
        STATE_JK_YS:'收到借款',
        STATE_JK_JTLX:'计提借款利息',
        STATE_JK_ZFLX:'支付借款利息',
        STATE_JK_YF:'偿还本金支出',
        STATE_TZ_YF:'对外投资支出',
        STATE_TZ_SRGL:'收到投资收益',
        STATE_TZ_JTGL:'计提投资收益',
        STATE_TZ_JTLX:'计提投资收益',
        STATE_TZ_SRLX:'收到投资收益',
        STATE_TZ_WS:'收回投资款',
        STATE_TZ_YS:'收回投资款',
        STATE_ZB_ZZ:'增加注册资本',
        STATE_ZB_ZFLR:'支付分配利润',
        STATE_ZB_LRFP:'计提分配利润',
        STATE_ZB_JZ:'减少注册资本'
    }[runningState]
}
