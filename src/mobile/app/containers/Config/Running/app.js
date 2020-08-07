import React from 'react'
import { connect }	from 'react-redux'
import { toJS, Map, fromJS } from 'immutable'
import './style/index.less'

import { Button, ButtonGroup, Icon, Container, Row } from 'app/components'
import thirdParty from 'app/thirdParty'

import Running from './Running'
import Tax from './Tax'

import { runningIndexActions } from 'app/redux/Config/Running/index'
import * as taxConfActions from 'app/redux/Config/Running/Tax/taxConf.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'
import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'

@connect(state => state)
export default
class RunningConfig extends React.Component {

    static displayName = 'RunningConfig'

    showActionSheet = () => {
        thirdParty.actionSheet({
            title: "更多",
            cancelButton: "取消",
            otherButtons: ['调整顺序','反悔模式','期初值'],
            onSuccess: (result) => {
                if (result.buttonIndex == -1 || result.buttonIndex >= 3) {
                    return
                }
                if (result.buttonIndex === 0) {
                    this.props.dispatch(runningConfActions.changeRunningConfData(['views','isChangePoistion'],true))
                    this.props.dispatch(runningConfActions.changeRunningConfData(['views','toolBarDisplayIndex'],3))
                } else if (result.buttonIndex === 1) {
                    this.props.dispatch(runningConfActions.beforeEditRnningRegret())
                    this.props.history.push('/config/running/regret')
                } else if(result.buttonIndex === 2) {
                    this.props.history.push('/Config/Lsqc')
                }
            }
        })

    }

    componentDidMount() {
        thirdParty.setTitle({title: '流水设置'})
        thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })
        if (sessionStorage.getItem('prevPage') === 'home') {
            sessionStorage.removeItem('prevPage')
            this.props.dispatch(runningIndexActions.switchRunningIndexPage('流水设置'))
            this.props.dispatch(allRunningActions.getRunningCategory())
        }
    }
    render() {
        const {
            dispatch,
            history,
            homeState,
            allState,
            taxConfState,
            runningIndexState,
            runningConfState
		} = this.props

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

        const views = taxConfState.get('views')
        const isTaxQuery = views.get('isTaxQuery')//是否预览税费设置

        const runningViews = runningConfState.get('views')
		const toolBarDisplayIndex = runningViews.get('toolBarDisplayIndex')

        const taxRateTemp = allState.get('taxRate')
        const title = runningIndexState.getIn(['views','title'])

        return(
            <Container className="ac-config">
                <Row className="ac-config-title">
                    <div className={title === '流水设置' ? 'select' : ''}
                        onClick={()=> {
                            if (!isTaxQuery) {
                                thirdParty.Confirm({
                                    message: '税费设置还未保存，是否保存',
                                    title: "提示",
                                    buttonLabels: ['取消', '保存'],
                                    onSuccess : (result) => {
                                        if (result.buttonIndex === 1) {
                                            dispatch(allRunningActions.saveAccountConfTaxRate(true))
                                            return
                                        }
                                        thirdParty.setTitle({title: '流水设置'})
                                        dispatch(runningIndexActions.switchRunningIndexPage('流水设置'))
                                    },
                                    onFail : (err) => alert(err)
                                })
                                return
                            }
                            thirdParty.setTitle({title: '流水设置'})
                            dispatch(runningIndexActions.switchRunningIndexPage('流水设置'))
                        }}
                    >
                        流水设置
                    </div>
                    <div className={title === '税费设置' ? 'select' : ''}
                        onClick={()=> {
                            dispatch(runningIndexActions.switchRunningIndexPage('税费设置'))
                            dispatch(taxConfActions.changeTaxConfQuery(true))
                            thirdParty.setTitle({title: '税费设置'})
                        }}
                    >
                       税费设置
                    </div>
                </Row>
                {
                   title === '流水设置' ?
                   <Running
                        history={history}
                        dispatch={dispatch}
                        editPermission={editPermission}
                    /> :
                    <Tax
                        history={history}
                        dispatch={dispatch}
                        isTaxQuery={isTaxQuery}
                        taxRateTemp={taxRateTemp}
                    />
                }
                <ButtonGroup
                    style={{display: title === '流水设置' && toolBarDisplayIndex === 1 ? '' : 'none'}}
                >
                    <Button
                        disabled={!editPermission}
                        onClick={() =>
                            dispatch(runningConfActions.showAllItemModifyButton())}
                    >
                        <Icon type="add-plus"/><span>新增</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        onClick={() =>
                            dispatch(runningConfActions.showAllItemCheckBox())
                        }
                    >
                        <Icon type="select" size='15'/><span>选择</span>
                    </Button>
                    <Button onClick={this.showActionSheet}>
                        <Icon type="more" size='15'/><span>更多</span>
                    </Button>
                </ButtonGroup>
                <ButtonGroup
                    style={{display: title === '流水设置' && toolBarDisplayIndex === 2 ? '' : 'none'}}
                >
                    <Button
                        onClick={() => {
                            dispatch(runningConfActions.hideChooseItemCheckBox())}
                        }
                    >
                        <Icon type="cancel"/><span>取消</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        onClick={() =>
                            dispatch(allRunningActions.deleteConfigRunningCategory())
                        }
                    >
                       <Icon type="delete"/><span>删除</span>
                    </Button>
                </ButtonGroup>

                <ButtonGroup
                    style={{display: title === '流水设置' && toolBarDisplayIndex === 3 ? '' : 'none'}}
                >
                    <Button
                        onClick={() =>
                            dispatch(runningConfActions.hideAllItemModifyButton())
                        }
                    >
                        <Icon type="cancel"/><span>取消</span>
                    </Button>
                </ButtonGroup>

                <ButtonGroup style={{display: title === '税费设置' ? '' : 'none'}}>
                    <Button
                        style={{display: isTaxQuery ? 'none' : ''}}
                        onClick={() => {
                            dispatch(allRunningActions.getRunningTaxRate())
                            dispatch(taxConfActions.changeTaxConfQuery(true))
                        }}
                    >
                        <Icon type="cancel"/><span>取消</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        onClick={() => {
                            if (isTaxQuery) {
                            dispatch(taxConfActions.changeTaxConfQuery(false))
                            } else {
                            dispatch(allRunningActions.saveAccountConfTaxRate())
                            }
                        }}
                    >
                        <Icon type={isTaxQuery ? 'modification' : 'save'} size='15'/>
                        <span>{isTaxQuery ? '修改' : '保存'}</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}
