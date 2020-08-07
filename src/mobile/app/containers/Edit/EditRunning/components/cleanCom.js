import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import { Row, Single, Icon, Amount, Switch, XfInput } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import * as editRunning from 'app/constants/editRunning.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'

//长期资产处置损益
export default class CleanCom extends Component {
    render () {
        const { dispatch, beCleaning, assets, amount, beProject, usedProject, projectList, projectCardList } = this.props

        const originalAssetsAmount = assets.get('originalAssetsAmount')// 资产原值
        const depreciationAmount = assets.get('depreciationAmount')// 折旧累计
        const cleaningAmount = assets.get('cleaningAmount')


        const projectCard = projectCardList.get(0)
        let showName = `${projectCard.get('code')} ${projectCard.get('name')}`
        let filterProjectList = projectList.filter(v => v.get('value').includes('COMNCRD')==false)

        return (
            <Row className='lrls-card'>
                <Row className='lrls-more-card'>
                    <span>处置损益</span>
                    <div className='noTextSwitch'>
                        <Switch
                            checked={beCleaning}
                            onClick={() => {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'beCleaning'], !beCleaning))
                                if (!beCleaning) {//开启时
                                    dispatch(editRunningActions.autoCqzcCzAmount())
                                    // if (beProject) {
                                    //     dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedProject'], true))
                                    // }
                                } else {
                                    // dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedProject'], false))
                                    // dispatch(editRunningActions.changeLrlsData(['oriTemp', 'projectCardList', 0], fromJS([{amount: ''}])))
                                }
                            }}
                        />
                    </div>
                </Row>
                {/* <div className='lrls-more-card margin-top-bot lrls-jzsy' style={{display: beProject && beCleaning ? '' : 'none'}}>
                    <label>项目:</label>
                    {
                        usedProject ?
                        <Single
                            className='lrls-single'
                            district={filterProjectList.toJS()}
                            value={projectCard.get('uuid') ? `${projectCard.get('uuid')}${Limit.TREE_JOIN_STR}${projectCard.get('code')}${Limit.TREE_JOIN_STR}${projectCard.get('name')}` : ''}
                            onOk={value => { dispatch(editRunningActions.changeProjectCard('card', value.value, 0)) }}
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
                            checked={usedProject}
                            onClick={() => {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedProject'], !usedProject))
                                if (usedProject) {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'projectCardList', 0], fromJS([{amount: ''}])))
                                }
                            }}
                        />
                    </div>
                </div> */}
                {
                    beCleaning ?
                    <Row>
                        <Row>
                            <label style={{marginRight: '.15rem'}}>{cleaningAmount >= 0 ? '净收益金额：' : '净损失金额：'}</label>
                            <Amount showZero>{Math.abs(cleaningAmount)}</Amount>
                        </Row>
                        <Row className='yysr-amount margin-top-bot lrls-jzsy'>
                            <label>资产原值:</label>
                            <XfInput.BorderInputItem
                                mode='amount'
                                placeholder='请填写资产原值'
                                value={originalAssetsAmount}
                                onChange={(value) => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'assets', 'originalAssetsAmount'], value))
                                    dispatch(editRunningActions.autoCqzcCzAmount())
                                }}
                            />
                        </Row>
                        <Row className='yysr-amount margin-top-bot lrls-jzsy'>
                            <label>累计折旧余额:</label>
                            <XfInput.BorderInputItem
                                mode='amount'
                                placeholder='请填写累计折旧余额'
                                value={depreciationAmount}
                                onChange={(value) => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'assets', 'depreciationAmount'], value))
                                    dispatch(editRunningActions.autoCqzcCzAmount())
                                }}
                            />
                        </Row>
                    </Row> : null
                }
            </Row>
        )

    }

}
