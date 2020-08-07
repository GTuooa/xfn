import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import { Row, Single, Icon, Amount, Switch, XfInput } from 'app/components'
import { decimal } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action.js'

export default class Poundage extends Component {
    state={
        checkedCurrent: false,
        checkedProject: false,
    }
    componentDidMount () {
        const accountPoundage = this.props.accountPoundage
        if (accountPoundage.get('uuid')) {
            const poundageNeedCurrent = accountPoundage.get('poundageNeedCurrent')
            const poundageNeedProject = accountPoundage.get('poundageNeedProject')
            const categoryUuid = accountPoundage.get('categoryUuid')

            if (poundageNeedCurrent || poundageNeedProject) {
                this.props.dispatch(searchRunningActions.getPoundageCategory(categoryUuid, poundageNeedCurrent, poundageNeedProject))
            }
        }
    }
    render () {
        const {
            dispatch,
            data,
            accounts,
            accountPoundage,
            poundageCurrentList,
            poundageProjectList,
        } = this.props
        const { checkedCurrent, checkedProject } = this.state

        const needUsedPoundage = data.get('needUsedPoundage')
        const poundageNeedCurrent = accountPoundage.get('poundageNeedCurrent')
        const poundageNeedProject = accountPoundage.get('poundageNeedProject')
		const poundageCurrentCardList = data.get('poundageCurrentCardList')
		const poundageProjectCardList = data.get('poundageProjectCardList')

        const currentCard = poundageCurrentCardList.get(0) ? poundageCurrentCardList.get(0) : fromJS({})
        const projectCard = poundageProjectCardList.get(0) ? poundageProjectCardList.get(0) : fromJS({})
        let showName = `${projectCard.get('code')} ${projectCard.get('name')}`
        if (['COMNCRD', 'ASSIST', 'MAKE', 'INDIRECT', 'MECHANICAL'].includes(projectCard.get('code'))) {
            showName = projectCard.get('name')
        }

        let hasNeedPoundage = false
        accounts.forEach(v => {
            if (v.getIn(['poundage', 'needPoundage'])) {
                hasNeedPoundage = true
            }
        })

        let amount = data.get('amount')
        if (data.get('oriState')=='STATE_XC_JN') {
			amount = data.getIn(['payment', 'actualAmount'])
		}

        return (
                <div className='lrls-card' style={{display: hasNeedPoundage ? '' : 'none'}}>
                    <Row className='lrls-more-card'>
                        <span>账户手续费</span>
                        <div className='noTextSwitch'>
                            <Switch
                                checked={needUsedPoundage}
                                onClick={() => {
                                    dispatch(searchRunningActions.changeCxlsData(['data', 'needUsedPoundage'], !needUsedPoundage))
                                    if (needUsedPoundage) {
                                        dispatch(searchRunningActions.changeCxlsData(['data', 'poundageCurrentCardList'], fromJS([])))
                                        dispatch(searchRunningActions.changeCxlsData(['data', 'poundageProjectCardList'], fromJS([])))
                                    }
                                }}
                            />
                        </div>
                    </Row>

                    <div style={{display: needUsedPoundage ? '' : 'none'}}>
                        <div className='lrls-more-card margin-top-bot lrls-jzsy' style={{display: poundageNeedCurrent ? '' : 'none'}}>
                            <label>往来单位:</label>
                            {
                                checkedCurrent ?
                                <Single
                                    className='lrls-single'
                                    district={poundageCurrentList.toJS()}
                                    value={currentCard.get('cardUuid') ? `${currentCard.get('cardUuid')}${Limit.TREE_JOIN_STR}${currentCard.get('code')}${Limit.TREE_JOIN_STR}${currentCard.get('name')}` : ''}
                                    onOk={value => {
                                        let item = [{
                                            cardUuid: value['uuid'],
                                            code: value['code'],
                                            name: value['name'],
                                        }]
                                        dispatch(searchRunningActions.changeCxlsData(['data', 'poundageCurrentCardList'], fromJS(item)))
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

                            <div className='noTextSwitch' style={{marginLeft: '6px'}}>
                                <Switch
                                    checked={checkedCurrent}
                                    onClick={() => {
                                        this.setState({checkedCurrent: !checkedCurrent})
                                        dispatch(searchRunningActions.changeCxlsData(['data', 'poundageCurrentCardList'], fromJS([])))
                                    }}
                                />
                            </div>
                        </div>

                        <div className='lrls-more-card margin-top-bot lrls-jzsy' style={{display: poundageNeedProject ? '' : 'none'}}>
                            <label>项目:</label>
                            {
                                checkedProject ?
                                <Single
                                    className='lrls-single'
                                    district={poundageProjectList.toJS()}
                                    value={projectCard.get('cardUuid') ? `${projectCard.get('cardUuid')}${Limit.TREE_JOIN_STR}${projectCard.get('code')}${Limit.TREE_JOIN_STR}${projectCard.get('name')}` : ''}
                                    onOk={value => {
                                        let item = [{
                                            cardUuid: value['uuid'],
                                            code: value['code'],
                                            name: value['name'],
                                        }]
                                        dispatch(searchRunningActions.changeCxlsData(['data', 'poundageProjectCardList'], fromJS(item)))
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

                            <div className='noTextSwitch' style={{marginLeft: '6px'}}>
                                <Switch
                                    checked={checkedProject}
                                    onClick={() => {
                                        this.setState({checkedProject: !checkedProject})
                                        dispatch(searchRunningActions.changeCxlsData(['data', 'poundageProjectCardList'], fromJS([])))
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

                                let poundageAmount = 0, outPoundageAmount = amount, shouldAuto = false
                                const poundage = v.getIn(['poundage', 'poundage'])
                                const poundageRate = v.getIn(['poundage', 'poundageRate'])

                                if (v.get('isManual')) {//手动填写
                                    poundageAmount = v.get('poundageAmount')
                                    outPoundageAmount = decimal(Math.abs(amount)-poundageAmount)
                                    if (outPoundageAmount < 0) {
                                        shouldAuto = true
                                    }
                                }

                                if (!v.get('isManual') || shouldAuto) {//自动填写
                                    poundageAmount = Math.abs(decimal(amount*poundageRate/1000))
                                    outPoundageAmount = decimal(Math.abs(amount)-poundageAmount)

                                    if (poundage && poundage > 0 && poundageAmount > poundage) {
                                        poundageAmount = poundage
                                        outPoundageAmount = decimal(Math.abs(amount)-poundageAmount)
                                    }

                                    dispatch(searchRunningActions.changeCxlsData(['data', 'accounts', i, 'poundageAmount'], Math.abs(poundageAmount)))
                                    dispatch(searchRunningActions.changeCxlsData(['data', 'accounts', i, 'isManual'], false))
                                }



                                return (
                                    <div key={i}>
                                        <Row className='lrls-margin-top'>
                                            <Row className='lrls-more-card lrls-bottom'>
                                                <label>账户：</label>
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
                                                        outPoundageAmount = decimal(Math.abs(amount)-value)
                                                        if (outPoundageAmount < 0) {
                                                            thirdParty.toast.info('输入金额不可大于收款金额')
                                                            return
                                                        }
                                                        dispatch(searchRunningActions.changeCxlsData(['data', 'accounts', i, 'poundageAmount'], value))
                                                        dispatch(searchRunningActions.changeCxlsData(['data', 'accounts', i, 'isManual'], true))
                                                    }}
                                                />
                                            </Row>
                                        </Row>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
        )
    }

}
