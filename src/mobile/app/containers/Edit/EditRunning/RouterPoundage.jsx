import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextListInput, Single, Switch, XfInput } from 'app/components'

import { decimal } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'


@connect(state => state)
export default
class RouterPoundage extends React.Component {

    componentDidMount() {
        thirdParty.setTitle({title: '账户手续费'})
		thirdParty.setIcon({showIcon: false})
		thirdParty.setRight({ show: false })
        sessionStorage.setItem('routerPage', 'routerPoundage')
    }

	render () {
		const { dispatch, history, editRunningState, allState } = this.props

        const accountPoundage = allState.get('accountPoundage')
        const poundageNeedCurrent = accountPoundage.get('poundageNeedCurrent')
        const poundageNeedProject = accountPoundage.get('poundageNeedProject')
        const poundageCurrentList = editRunningState.get('poundageCurrentList')
		const poundageProjectList = editRunningState.get('poundageProjectList')
        const oriTemp = editRunningState.get('oriTemp')
        const needUsedPoundage = oriTemp.get('needUsedPoundage')
		const poundageCurrentCardList = oriTemp.get('poundageCurrentCardList')
		const poundageProjectCardList = oriTemp.get('poundageProjectCardList')
        const projectRange = oriTemp.get('projectRange') ? oriTemp.get('projectRange').toJS() : []
        const poundageCurrent = oriTemp.get('poundageCurrent')
        const poundageProject = oriTemp.get('poundageProject')
        const usedCurrent = oriTemp.get('usedCurrent')//流水是否开启往来单位
        const includesPoundage = oriTemp.get('includesPoundage')//转账模式

        const currentCard = poundageCurrentCardList.get(0) ? poundageCurrentCardList.get(0) : fromJS({})
        const projectCard = poundageProjectCardList.get(0) ? poundageProjectCardList.get(0) : fromJS({})
        let showName = `${projectCard.get('code')} ${projectCard.get('name')}`
        if (['COMNCRD', 'ASSIST', 'MAKE', 'INDIRECT', 'MECHANICAL'].includes(projectCard.get('code'))) {
            showName = projectCard.get('name')
        }

        const poundage = oriTemp.getIn(['accounts', 0, 'poundage', 'poundage'])//上限金额
        const poundageRate = oriTemp.getIn(['accounts', 0, 'poundage', 'poundageRate'])//比例
        const poundageAmount = oriTemp.getIn(['accounts', 0, 'poundageAmount'])
        const isManual = oriTemp.getIn(['accounts', 0, 'isManual'])
        const amount = oriTemp.get('amount')

        const auto = (isAuto, modeType=includesPoundage, shouldReturn) => {
            let autoAmount = 0, outPoundageAmount = amount, shouldAuto = false
            if (isManual) {//手动填写
                autoAmount = poundageAmount
                outPoundageAmount = decimal(Math.abs(amount)-poundageAmount)
                if (outPoundageAmount < 0) {
                    shouldAuto = true
                }
            }
            if (!isManual || shouldAuto || isAuto) {//自动填写
                autoAmount = Math.abs(decimal(amount*poundageRate/1000))
                if (modeType) {
                    autoAmount = Math.abs(decimal(amount/(1+Number(poundageRate/1000))*poundageRate/1000))
                }
                if (poundage && poundage > 0 && autoAmount > poundage) {
                    autoAmount = poundage
                }

                if (shouldReturn) {return autoAmount}

                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'accounts', 0, 'poundageAmount'], Math.abs(autoAmount)))
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'accounts', 0, 'isManual'], false))
            }
        }

        let modeOneAmount = auto(true, false, true)
        let modeTwoAmount = auto(true, true, true)//模式二手续费
        if (isManual) {
            if (includesPoundage) {
                modeTwoAmount = poundageAmount
            } else {
                modeOneAmount = poundageAmount
            }
        }

		return(
			<Container className="edit-running">
				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll">
                    <div className='lrls-card'>
                        <Row className='lrls-more-card'>
                            <span>账户手续费</span>
                            <div className='noTextSwitch'>
                                <Switch
                                    checked={needUsedPoundage}
                                    onClick={() => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'needUsedPoundage'], !needUsedPoundage))
                                        if (needUsedPoundage) {
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'includesPoundage'], false))
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'poundageCurrentCardList'], fromJS([])))
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'poundageProjectCardList'], fromJS([])))
                                        } else {
                                            auto()
                                        }
                                    }}
                                />
                            </div>
                        </Row>

                        <div className='lrls-more-card lrls-margin-top' style={{display: needUsedPoundage && poundageNeedCurrent ? '' : 'none'}}>
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
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'poundageCurrentCardList'], fromJS([])))
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className='lrls-more-card lrls-margin-top' style={{display: needUsedPoundage && poundageNeedProject ? '' : 'none'}}>
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
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'poundageProjectCardList'], fromJS([])))
                                        }
                                    }}
                                />
                            </div>
                        </div>

                    </div>

                    <div className='lrls-card' style={{display: needUsedPoundage ? '' : 'none'}}>
                        <Row className='lrls-more-card lrls-bottom'>
                            <label>手续费:</label>
                            <XfInput.BorderInputItem
                                mode='amount'
                                placeholder='填写金额'
                                value={poundageAmount}
                                onChange={(value) => {
                                    if (poundage && poundage > 0 && value > poundage) {
                                        thirdParty.toast.info('输入金额不可大于手续费上限')
                                        return
                                    }
                                    if (decimal(Math.abs(amount)-value) < 0) {
                                        thirdParty.toast.info('手续费不可大于转出金额')
                                        return
                                    }

                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'accounts', 0, 'poundageAmount'], value))
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'accounts', 0, 'isManual'], true))
                                }}
                            />
                        </Row>

                        <div className='lrls-more-card'>
                            <div className='lrls-poundage' style={{borderColor: includesPoundage ? '' : '#FF8348'}}
                                onClick={() => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'includesPoundage'], false))
                                    auto(true, false)
                                }}
                            >
                                <div className='lrls-margin-bottom'>
                                    <span className='lrls-placeholder lrls-margin-bottom'>转出金额:</span>
                                    <Amount showZero>{decimal(Number(amount)+Number(modeOneAmount))}</Amount>
                                </div>
                                <div>
                                    <span className='lrls-placeholder'>到账金额:</span>
                                    <Amount showZero>{decimal(Number(amount))}</Amount>
                                </div>
                                <div style={{display: includesPoundage ? 'none' : ''}}>
                                    <div className='triangle'></div>
                                    <Icon type="tick"/>
                                </div>
                            </div>
                            {/* {计费模式二} */}
                            <div  className='lrls-poundage lrls-margin-left' style={{borderColor: includesPoundage ? '#FF8348' : ''}}
                                onClick={() => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'includesPoundage'], true))
                                    auto(true, true)
                                }}
                            >
                                <div className='lrls-margin-bottom'>
                                    <span className='lrls-placeholder'>转出金额:</span>
                                    <Amount showZero>{decimal(Number(amount))}</Amount></div>
                                <div>
                                    <span className='lrls-placeholder'>到账金额:</span>
                                    <Amount showZero>{decimal(Number(amount)-Number(modeTwoAmount))}</Amount>
                                </div>
                                <div style={{display: includesPoundage ? '' : 'none'}}>
                                    <div className='triangle'></div>
                                    <Icon type="tick"/>
                                </div>
                            </div>

                        </div>
                    </div>

				</ScrollView>


				<ButtonGroup>
					<Button onClick={() => {history.goBack()}}>
						<Icon type="confirm"/>
						<span>确定</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
