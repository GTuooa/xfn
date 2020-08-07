import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import { Row, Single, Icon, Amount, Switch, TextListInput } from 'app/components'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { decimal } from 'app/utils'
import { systemProJectCodeCommon } from 'app/containers/Config/Approval/components/common.js'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

export default class Poundage extends Component {
    state = {
        checkedCurrent: false,
        checkedProject: false,
    }
    componentDidMount() {
        const uuid = this.props.accountPoundage.get('categoryUuid')
        if (uuid) {
            this.props.dispatch(searchApprovalActions.getSearchApprovalAccountRunningCate(uuid))
        }
    }
    render() {
        const {
            type,
            dispatch,
            account,
            needUsedPoundage,
            accountPoundage,
            poundageCurrentList,
            poundageProjectList,
            poundageCurrentCardList,
            poundageProjectCardList,
            accountProjectRange,
            accountContactsRange,
            receiveAmount,
            handlingFeeType,
        } = this.props
        const { checkedCurrent, checkedProject } = this.state

        const poundageNeedCurrent = accountPoundage.get('poundageNeedCurrent')
        const poundageNeedProject = accountPoundage.get('poundageNeedProject')

        const currentCard = poundageCurrentCardList.get(0) ? poundageCurrentCardList.get(0) : fromJS({})
        const projectCard = poundageProjectCardList.get(0) ? poundageProjectCardList.get(0) : fromJS({})
        let showName = `${projectCard.get('code')} ${projectCard.get('name')}`
        if (systemProJectCodeCommon.includes(projectCard.get('code'))) {
            showName = projectCard.get('name')
        }

        let projectCardSource = []
        let currentCardSource = []

        poundageCurrentList.forEach(v => {
            currentCardSource.push({
                value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`,
                key: `${v.get('code')} ${v.get('name')}`
            })
        })
        poundageProjectList.forEach(v => {
            projectCardSource.push({
                value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`,
                key: `${systemProJectCodeCommon.indexOf(v.get('code')) === -1 ? v.get('code') : ''} ${v.get('name')}`
            })
        })

        let inTypePoundageAmount = 0
        let outTypePoundageAmount = 0
        if (type == '核记') {

            inTypePoundageAmount = Math.abs(decimal(receiveAmount*account.getIn(['poundage', 'poundageRate'])/1000))
            
            if (account.getIn(['poundage', 'poundage']) && account.getIn(['poundage', 'poundage']) > 0 && Number(inTypePoundageAmount) > account.getIn(['poundage', 'poundage'])) {
                inTypePoundageAmount = account.getIn(['poundage', 'poundage'])
            }

            outTypePoundageAmount = Math.abs(decimal(receiveAmount/(1+Number(account.getIn(['poundage', 'poundageRate'])/1000))*account.getIn(['poundage', 'poundageRate'])/1000))
                                
            if (account.getIn(['poundage', 'poundage']) && account.getIn(['poundage', 'poundage']) > 0 && Number(outTypePoundageAmount) > account.getIn(['poundage', 'poundage'])) {
                outTypePoundageAmount = account.getIn(['poundage', 'poundage'])
            }
        }

        return (
            <div className='lrls-card'>
                <Row className='lrls-more-card'>
                    <span>账户手续费</span>
                    <div className='noTextSwitch'>
                        <Switch
                            checked={needUsedPoundage}
                            onClick={() => {
                                dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('needUsedPoundage', !needUsedPoundage))
                                if (needUsedPoundage) {
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))
                                }
                            }}
                        />
                    </div>
                </Row>

                <div style={{ display: needUsedPoundage ? '' : 'none' }}>
                    <div className='lrls-more-card margin-top-bot lrls-jzsy' style={{ display: poundageNeedCurrent ? '' : 'none' }}>
                        <label>往来单位:</label>
                        {
                            checkedCurrent ?
                                <Single
                                    className='lrls-single'
                                    district={currentCardSource}
                                    value={currentCard.get('cardUuid') ? `${currentCard.get('cardUuid')}${Limit.TREE_JOIN_STR}${currentCard.get('code')}${Limit.TREE_JOIN_STR}${currentCard.get('name')}` : ''}
                                    onOk={value => {
                                        const valueList = value.value.split(Limit.TREE_JOIN_STR)
                                        const cardUuid = valueList[0]
                                        const code = valueList[1]
                                        const name = valueList[2]
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([{ cardUuid, name, code }])))
                                    }}
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

                        <div className='noTextSwitch' style={{ marginLeft: '6px' }}>
                            <Switch
                                checked={checkedCurrent}
                                onClick={() => {
                                    this.setState({ checkedCurrent: !checkedCurrent })

                                    if (!checkedCurrent) {
                                        dispatch(searchApprovalActions.getApprovalRelativeCardList(accountContactsRange))
                                    }
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
                                }}
                            />
                        </div>
                    </div>

                    <div className='lrls-more-card margin-top-bot lrls-jzsy' style={{ display: poundageNeedProject ? '' : 'none' }}>
                        <label>项目:</label>
                        {
                            checkedProject ?
                                <Single
                                    className='lrls-single'
                                    district={projectCardSource}
                                    value={projectCard.get('cardUuid') ? `${projectCard.get('cardUuid')}${Limit.TREE_JOIN_STR}${projectCard.get('code')}${Limit.TREE_JOIN_STR}${projectCard.get('name')}` : ''}
                                    onOk={value => {
                                        const valueList = value.value.split(Limit.TREE_JOIN_STR)
                                        const cardUuid = valueList[0]
                                        const code = valueList[1]
                                        const name = valueList[2]
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([{ cardUuid, name, code }])))
                                    }}
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

                        <div className='noTextSwitch' style={{ marginLeft: '6px' }}>
                            <Switch
                                checked={checkedProject}
                                onClick={() => {
                                    this.setState({ checkedProject: !checkedProject })

                                    if (!checkedProject) {
                                        dispatch(searchApprovalActions.getApprovalProjectCardList(accountProjectRange))
                                    }

                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))
                                }}
                            />
                        </div>
                    </div>
                    <Row style={{display: type == '核记' ? 'none' : ''}}>
                        <label>收款金额: &nbsp;</label>
                        <Amount>{receiveAmount}</Amount>
                    </Row>
                    <Row className='lrls-more-card'>
                        <label>手续费:</label>
                        <TextListInput
                            placeholder='填写手续费'
                            value={account.get('poundageAmount')}
                            onChange={(value) => {
                                if (/^\d*\.?\d{0,2}$/g.test(value)) {

                                    if (account.getIn(['poundage', 'poundage']) && account.getIn(['poundage', 'poundage']) > 0 && Number(value) > account.getIn(['poundage', 'poundage'])) {
                                        thirdParty.toast.info('输入金额不可大于手续费上限')
                                        return
                                    }

                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['account', 'poundageAmount'], value))
                                }
                            }}
                        />
                    </Row>
                    <Row className="search-approval-poundage-amount" style={{display: type == '核记' ? '' : 'none'}}>
                        <ul
                            className={handlingFeeType === 'INCLUDE' ? "search-approval-poundage-amount-item search-approval-poundage-amount-item-cur" : "search-approval-poundage-amount-item"}
                            onClick={() => {
                                dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('handlingFeeType', 'INCLUDE'))
                                dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['account', 'poundageAmount'], inTypePoundageAmount))
                            }}
                        >
                            <li>
                                <span>转出金额：</span><span>{decimal(Number(receiveAmount)+Number(inTypePoundageAmount), 2, true)}</span>
                            </li>
                            <li>
                                <span>到账金额：</span><span>{decimal(receiveAmount, 2, true)}</span>
                            </li>
                            <Icon className="search-approval-poundage-check" type='tick' style={{display: handlingFeeType === 'INCLUDE' ? '' : 'none'}} />
                        </ul>
                        <ul
                            className={handlingFeeType === 'EXCLUDE' ? "search-approval-poundage-amount-item search-approval-poundage-amount-item-cur" : "search-approval-poundage-amount-item"}
                            onClick={() => {
                                dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('handlingFeeType', 'EXCLUDE'))
                                dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['account', 'poundageAmount'], outTypePoundageAmount))
                            }}
                        >
                            <li>
                                <span>转出金额：</span><span>{decimal(receiveAmount, 2, true)}</span>
                            </li>
                            <li>
                                <span>到账金额：</span><span>{decimal(receiveAmount-outTypePoundageAmount, 2, true)}</span>
                            </li>
                            <Icon className="search-approval-poundage-check" type='tick' style={{display: handlingFeeType === 'EXCLUDE' ? '' : 'none'}} />
                        </ul>
                    </Row>
                </div>
            </div>
        )
    }
}