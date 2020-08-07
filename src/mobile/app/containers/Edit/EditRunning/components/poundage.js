import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import { Row, Single, Icon, Amount, Switch, XfInput } from 'app/components'
import { decimal, formatMoney } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'

//营业收入存货卡片
export default class Poundage extends Component {
    amountChanged = false
    lastAmount = 0
    funcList = []
    componentDidMount () {
        const routerPage = sessionStorage.getItem('routerPage')
        if (['routerStock', 'routerSfgl', 'routerPoundage'].includes(routerPage)) {//从选择页面返回不需要重新获取
			return
        }
        const accountPoundage = this.props.accountPoundage
        if (accountPoundage.get('uuid')) {
            const poundageNeedCurrent = accountPoundage.get('poundageNeedCurrent')
            const poundageNeedProject = accountPoundage.get('poundageNeedProject')
            const categoryUuid = accountPoundage.get('categoryUuid')

            if (poundageNeedCurrent || poundageNeedProject) {
                this.props.dispatch(editRunningActions.getPoundageCategory(categoryUuid, poundageNeedCurrent, poundageNeedProject))
            }
        }
    }

    componentDidUpdate (prevProps) {
        const prevNeedUsedPoundage = prevProps.oriTemp.get('needUsedPoundage')
        const needUsedPoundage = this.props.oriTemp.get('needUsedPoundage')
        const usedAccounts = this.props.oriTemp.get('usedAccounts')
        const accountUuid = this.props.accounts.getIn([0, 'accountUuid'])
        const prevAccountUuid = prevProps.accounts.getIn([0, 'accountUuid'])

        let canAuto = false
        if (prevNeedUsedPoundage!=needUsedPoundage && needUsedPoundage) {
            canAuto = true
        }
        if (accountUuid!=prevAccountUuid && accountUuid) {
            canAuto = true
        }

        if (this.amountChanged || canAuto || usedAccounts) {
            this.funcList.forEach(v => v())
        }
    }

    array_includes (arr1, arr2) {
        let temp = new Set([...arr1, ...arr2])
        return arr1.length === temp.size
    }

    render () {
        const {
            dispatch,
            oriTemp,
            accounts,
            accountPoundage,
            poundageCurrentList,
            poundageProjectList,
            contactsRange,
            poundageProjectRange,
            poundageCurrentRange,
            beManagemented,
            usedProject,
            usedCurrent,
            history,
        } = this.props

        const needUsedPoundage = oriTemp.get('needUsedPoundage')
        const poundageNeedCurrent = accountPoundage.get('poundageNeedCurrent')
        const poundageNeedProject = accountPoundage.get('poundageNeedProject')
		const poundageCurrentCardList = oriTemp.get('poundageCurrentCardList')
		const poundageProjectCardList = oriTemp.get('poundageProjectCardList')
        const projectRange = oriTemp.get('projectRange') ? oriTemp.get('projectRange').toJS() : []
        const poundageCurrent = oriTemp.get('poundageCurrent')
        const poundageProject = oriTemp.get('poundageProject')
        const includesPoundage = oriTemp.get('includesPoundage')

        const currentCard = poundageCurrentCardList.get(0) ? poundageCurrentCardList.get(0) : fromJS({})
        const projectCard = poundageProjectCardList.get(0) ? poundageProjectCardList.get(0) : fromJS({})
        let showName = `${projectCard.get('code')} ${projectCard.get('name')}`
        if (['COMNCRD', 'ASSIST', 'MAKE', 'INDIRECT', 'MECHANICAL'].includes(projectCard.get('code'))) {
            showName = projectCard.get('name')
        }

        let hasNeedPoundage = false, poundageLength = 0
        const usedAccounts = oriTemp.get('usedAccounts')

        accounts.forEach((v, i) => {
            if (!usedAccounts && i > 0) {
                return
            }
            if (v.getIn(['poundage', 'needPoundage'])) {
                hasNeedPoundage = true
                poundageLength++
            }
        })

        let categoryTypeShow = false
        let amount = oriTemp.get('amount')
        const categoryType = oriTemp.get('categoryType')
        const oriState =  oriTemp.get('oriState')
        const currentAmount = Number(oriTemp.get('currentAmount'))
        let isZz = false//是否是内部转账
        let zzPoundageAmount = 0

        switch (categoryType) {
            case 'LB_YYSR': {
                categoryTypeShow = ['STATE_YYSR_DJ', 'STATE_YYSR_XS'].includes(oriState)
                if (currentAmount) {
                    amount = currentAmount
                }
                if (oriState=='STATE_YYSR_XS' && beManagemented && !currentAmount) {
                    categoryTypeShow = false
                    amount = 0
                }
                break
            }
            case 'LB_YYZC': {
                categoryTypeShow = oriState == 'STATE_YYZC_TG' ? true : false
                if (currentAmount) {
                    amount = currentAmount
                }
                if (oriState=='STATE_YYZC_TG' && beManagemented && !currentAmount) {
                    categoryTypeShow = false
                    amount = 0
                }
                break
            }
            case 'LB_FYZC': {
                if (amount < 0) {
                    if (!beManagemented) {
                        categoryTypeShow = true
                    }
                    if (beManagemented && currentAmount) {
                        categoryTypeShow = true
                        amount = currentAmount
                    }
                }
                break
            }
            case 'LB_XCZC': {
                const propertyPay = oriTemp.get('propertyPay')
                const jrAmount = oriTemp.get('jrAmount')
                const beAccrued = oriTemp.getIn(['acPayment', 'beAccrued'])//是否开启计提
                const beWelfare = oriTemp.getIn(['acPayment', 'beWelfare'])// 是否过渡福利费

                if (['STATE_XC_JN','STATE_XC_FF'].includes(oriState)) {
                    if (beAccrued && propertyPay=='SX_GZXJ') {
                        amount = oriTemp.getIn(['payment', 'actualAmount'])
                    }
                    if (beAccrued && propertyPay=='SX_SHBX') {
                        amount = oriTemp.getIn(['payment', 'companySocialSecurityAmount'])
                    }
                    if (beAccrued && propertyPay=='SX_ZFGJJ') {
                        amount = oriTemp.getIn(['payment', 'companyAccumulationAmount'])
                    }
                    if (jrAmount < 0 || amount < 0) {
                        categoryTypeShow = true
                    }
                }

                break
            }
            case 'LB_YYWSR': {
                categoryTypeShow = amount > 0 ? true : false
                if (beManagemented) {
                    amount = currentAmount
                    if (!amount) {
                        categoryTypeShow = false
                    }
                }

                break
            }
            case 'LB_YYWZC': {
                categoryTypeShow = amount < 0 ? true : false
                if (beManagemented) {
                    amount = currentAmount
                    if (!amount) {
                        categoryTypeShow = false
                    }
                }

                break
            }
            case 'LB_ZSKX': {
                categoryTypeShow = oriState == 'STATE_ZS_SQ' ? true : false
                break
            }
            case 'LB_ZFKX': {
                categoryTypeShow = oriState == 'STATE_ZF_SH' ? true : false
                break
            }
            case 'LB_CQZC': {
                const handleType = oriTemp.get('handleType')

                if (handleType == 'JR_HANDLE_GJ') {
                    if (amount < 0) {
                        categoryTypeShow = true
                    }
                } else {
                    if (amount > 0) {
                        categoryTypeShow = true
                    }
                }

                if (beManagemented) {
                    amount = currentAmount
                    if (!amount) {
                        categoryTypeShow = false
                    }
                }

                break
            }
            case 'LB_JK': {
                categoryTypeShow = oriState == 'STATE_JK_YS' ? true : false
                break
            }
            case 'LB_TZ': {
                categoryTypeShow = ['STATE_TZ_SRGL', 'STATE_TZ_SRLX', 'STATE_TZ_YS'].includes(oriState)
                break
            }
            case 'LB_ZB': {
                categoryTypeShow = oriState == 'STATE_ZB_ZZ' ? true : false
                break
            }
            case 'LB_SFGL': {
                const isManualWriteOff = oriTemp.getIn(['pendingManageDto', 'isManualWriteOff'])

                if (oriTemp.get('jrAmount') >= 0) {
                    categoryTypeShow = true
                }

                if (isManualWriteOff) {
                    const allHandleAmount = oriTemp.get('allHandleAmount')
                    categoryTypeShow = allHandleAmount >= 0 ? true : false
                }

                break
            }
            case 'LB_ZZ': {
                categoryTypeShow = true
                isZz = true
                const poundageAmount = oriTemp.getIn(['accounts', 0, 'poundageAmount'])
                zzPoundageAmount = poundageAmount ? poundageAmount : 0
                break
            }
            default: null
        }


        if (!(hasNeedPoundage && categoryTypeShow)) {
            return null
        }
        this.funcList = []
        this.amountChanged = decimal(amount) == decimal(this.lastAmount) ?  false : true
        this.lastAmount = decimal(amount)


        return (
                <div className='lrls-card' style={{display: (hasNeedPoundage && categoryTypeShow) ? '' : 'none'}}>
                    <Row className='lrls-more-card'>
                        <span>账户手续费</span>
                        <div className='noTextSwitch' style={{display: isZz ? 'none' : '' }}>
                            <Switch
                                checked={needUsedPoundage}
                                onClick={() => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'needUsedPoundage'], !needUsedPoundage))
                                    if (needUsedPoundage) {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'poundageCurrentCardList'], fromJS([])))
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'poundageProjectCardList'], fromJS([])))
                                    }
                                }}
                            />
                        </div>
                        <span className='lrls-placeholder' style={{display: isZz ? '' : 'none' }}
                            onClick={() => history.push('/editrunning/poundage')}
                        >
                            {needUsedPoundage ? '已启用' : '未启用'} <Icon type="arrow-right"/>
                        </span>
                    </Row>

                    <div style={{display: !isZz && needUsedPoundage ? '' : 'none'}}>
                        <div className='lrls-more-card margin-top-bot lrls-jzsy' style={{display: poundageNeedCurrent ? '' : 'none'}}>
                            <label>往来单位:</label>
                            {
                                poundageCurrent ?
                                <Single
                                    className='lrls-single'
                                    district={poundageCurrentList.toJS()}
                                    value={currentCard.get('cardUuid') ? `${currentCard.get('cardUuid')}${Limit.TREE_JOIN_STR}${currentCard.get('code')}${Limit.TREE_JOIN_STR}${currentCard.get('name')}` : ''}
                                    onOk={value => { dispatch(editRunningActions.changeCurrentCardList(value.value, 'poundageCurrent')) }}
                                >
                                    <Row className='lrls-category lrls-padding'>
                                        {
                                            currentCard.get('cardUuid') ? <span> {`${currentCard.get('code')} ${currentCard.get('name')}`} </span>
                                            : <span className='lrls-placeholder'>点击选择往来卡片</span>
                                        }
                                        <Icon type="triangle" />
                                    </Row>
                                </Single> : null
                            }

                            <div className='noTextSwitch' style={{marginLeft: '6px'}}>
                                <Switch
                                    checked={poundageCurrent}
                                    onClick={() => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'poundageCurrent'], !poundageCurrent))
                                        if (poundageCurrent) {
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'poundageCurrentCardList'], fromJS([])))
                                        } else {
                                            let item = fromJS([])
                                            let rangeIncludes = this.array_includes(poundageCurrentRange, contactsRange)
                                            const currentCardList = oriTemp.get('currentCardList')
                                            if (usedCurrent && rangeIncludes && currentCardList.size) {
                                                item = currentCardList
                                            }
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'poundageCurrentCardList'], item))
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className='lrls-more-card margin-top-bot lrls-jzsy' style={{display: poundageNeedProject ? '' : 'none'}}>
                            <label>项目:</label>
                            {
                                poundageProject ?
                                <Single
                                    className='lrls-single'
                                    district={poundageProjectList.toJS()}
                                    value={projectCard.get('cardUuid') ? `${projectCard.get('cardUuid')}${Limit.TREE_JOIN_STR}${projectCard.get('code')}${Limit.TREE_JOIN_STR}${projectCard.get('name')}` : ''}
                                    onOk={value => { dispatch(editRunningActions.changeProjectCard('poundageProject', value.value, 0)) }}
                                >
                                    <Row className='lrls-category lrls-padding'>
                                        {
                                            projectCard.get('cardUuid') ? <span> {showName} </span>
                                            : <span className='lrls-placeholder'>点击选择项目卡片</span>
                                        }
                                        <Icon type="triangle" />
                                    </Row>
                                </Single> : null
                            }

                            <div className='noTextSwitch' style={{marginLeft: '6px'}}>
                                <Switch
                                    checked={poundageProject}
                                    onClick={() => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'poundageProject'], !poundageProject))
                                        if (poundageProject) {
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'poundageProjectCardList'], fromJS([])))
                                        } else {
                                            let item = fromJS([])
                                            let rangeIncludes = this.array_includes(poundageProjectRange, projectRange)
                                            const projectCardList = oriTemp.get('projectCardList')
                                            if (usedProject && rangeIncludes && projectCardList.size && projectCardList.getIn([0, 'cardUuid'])) {
                                                item = projectCardList
                                            }
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'poundageProjectCardList'], item))
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>


                    <div>
                        {
                            needUsedPoundage && accounts.map((v, i) => {

                                const accountUuid = v.get('accountUuid')
                                const accountName = v.get('accountName')

                                if (!v.getIn(['poundage', 'needPoundage'])) {
                                    return null
                                }

                                if (!usedAccounts && i > 0) {
                                    return null
                                }

                                let poundageAmount = 0
                                const poundage = v.getIn(['poundage', 'poundage'])
                                const poundageRate = v.getIn(['poundage', 'poundageRate'])

                                poundageAmount = Math.abs(decimal(amount*poundageRate/1000))
                                if (isZz && includesPoundage) {
                                    poundageAmount = Math.abs(decimal(amount/(1+Number(poundageRate/1000))*poundageRate/1000))
                                }

                                if (usedAccounts) {
                                    poundageAmount = decimal(v.get('amount')*poundageRate/1000)
                                }

                                if (poundage && poundage > 0 && poundageAmount > poundage) {
                                    poundageAmount = poundage
                                }

                                if (!(usedAccounts && v.get('isManual'))) {
                                    //除了开启多账户并且该账户是手动填写的其余都是自动填写
                                    this.funcList.push(()=>{
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'accounts', i, 'poundageAmount'], Math.abs(poundageAmount)))
                                    })
                                }

                                if (isZz) { return null }

                                return (
                                    <div key={i} style={{paddingBottom: poundageLength > 1 && (i != poundageLength-1) ? '10px' : ''}}>
                                        <Row className='lrls-more-card lrls-bottom'>
                                            <span>账户明细({i+1})：</span>
                                            <span className="overElli" style={{flex: '1'}}>
                                                {`${accountName}`}
                                            </span>
                                        </Row>

                                        <Row className='lrls-more-card'>
                                            <label>支出金额:</label>
                                            <XfInput.BorderInputItem
                                                mode='amount'
                                                placeholder='填写支出金额'
                                                value={v.get('poundageAmount')}
                                                onChange={(value) => {
                                                    if (poundage && poundage > 0 && value > poundage) {
                                                        thirdParty.toast.info('输入金额不可大于手续费上限')
                                                        return
                                                    }
                                                    let outPoundageAmount = decimal(Math.abs(amount)-value)
                                                    if (usedAccounts) {
                                                        outPoundageAmount = decimal(Math.abs(v.get('amount'))-value)
                                                    }
                                                    if (outPoundageAmount < 0) {
                                                        thirdParty.toast.info('输入金额不可大于收款金额')
                                                        return
                                                    }

                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'accounts', i, 'poundageAmount'], value))
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'accounts', i, 'isManual'], true))
                                                }}
                                            />
                                        </Row>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className='hx-top-line lrls-placeholder lrls-margin-top'
                        style={{display: needUsedPoundage && isZz ? '' : 'none'}}
                    >
                        <div className='lrls-margin-bottom lrls-padding-top'>
                            <span className='lrls-placeholder'>转出金额：</span>
                            <Amount showZero>{includesPoundage ? decimal(Number(amount)) : decimal(Number(amount)+Number(zzPoundageAmount))}</Amount>元
                            {!includesPoundage ? <span>{`(含手续费${formatMoney(zzPoundageAmount, 2)}元)`}</span> :  null}
                        </div>
                        <div>
                            <span className='lrls-placeholder'>到账金额：</span>
                            <Amount showZero>{includesPoundage ? decimal(Number(amount)-Number(zzPoundageAmount)) : decimal(Number(amount))}</Amount>元
                        </div>
                    </div>
                </div>
        )
    }

}
