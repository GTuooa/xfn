import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, ScrollView, Form, Switch, Multiple, XfInput } from 'app/components'
const { Label, Item } = Form

import * as thirdParty from 'app/thirdParty'
import TreeCom from 'app/containers/components/TreeCom/index.js'

import * as projectConfActions from 'app/redux/Config/Project/projectConf.action.js'

@connect(state => state)
export default
class ProjectType extends React.Component {

    static displayName = 'ProjectType'

    constructor(props) {
		super(props)
		this.state = {
            isSort: false,
            isAdd: false,
            isDelete: false
        }
    }

    componentDidMount() {
        thirdParty.setTitle({title: '类别设置'})
        thirdParty.setIcon({ showIcon: false })
        thirdParty.setRight({ show: false })
        
        const highTypeIdx = this.props.projectConfState.getIn(['views', 'highTypeIdx'])
        const uuid = this.props.projectConfState.getIn(['highTypeList', highTypeIdx, 'uuid'])
        this.props.dispatch(projectConfActions.getProjectConfigHighTypeOne(uuid))
    }

    componentWillUnmount(){
        const state = this.props.projectConfState
        const currentType = state.getIn(['views', 'currentType'])
        const uuid = state.getIn(['highTypeData', 'uuid'])

        if ([uuid].includes(currentType)) {
            this.props.dispatch(projectConfActions.getProjectListAndTree())
        }
    }

    render() {
        const { dispatch, projectConfState, history, homeState } = this.props
        const { isSort, isAdd, isDelete } = this.state

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
        const editPermission = configPermissionInfo.getIn(['edit', 'permission'])
        
        const highTypeData = projectConfState.get('highTypeData')
        const commonFee = highTypeData.get('commonFee')
		const beAssist = highTypeData.get('beAssist')
		const beMake = highTypeData.get('beMake')
		const beIndirect = highTypeData.get('beIndirect')
        const beMechanical = highTypeData.get('beMechanical')
        const isCheckOut = highTypeData.get('isCheckOut')
        const assistOpen = highTypeData.get('assistOpen')//辅助生产成本期初
        const makeOpen = highTypeData.get('makeOpen')//制造费用期初
        const indirectOpen = highTypeData.get('indirectOpen')//间接费用期初
        const mechanicalOpen = highTypeData.get('mechanicalOpen')//机械成本期初

		let multipleList = []
		if (highTypeData.get('name')=='生产项目') {
			if (beAssist) {
				multipleList.push('beAssist')
			}
			if (beMake) {
				multipleList.push('beMake')
			}
		}
		if (highTypeData.get('name')=='施工项目') {
			if (beIndirect) {
				multipleList.push('beIndirect')
			}
			if (beMechanical) {
				multipleList.push('beMechanical')
			}
        }

        const uuid = highTypeData.get('uuid')
        const treeList = highTypeData.get('treeList') ? highTypeData.get('treeList') : []
        const callBack = () => this.setState({ isAdd: false, isSort: false, isDelete: false})

        return(
            <Container className="iuManage-config project-config">
                <ScrollView flex='1' className='iuManage-type-tree border-top'>
                    <Form style={{marginBottom: '.1rem'}}>
                        <Item label="类别名称" showAsterisk>
                            <div>
                                {highTypeData.get('name')}
                            </div>
                        </Item>
                        <Item label="启用损益公共项目" style={{display: highTypeData.get('name')=='损益项目' ? '' : 'none'}}>
                            <span className='noTextSwitchShort'>
                                <Switch
                                    checked={commonFee}
                                    onClick={() => {
                                        dispatch(projectConfActions.changeProjectData(['highTypeData', 'commonFee'], !commonFee))
                                    }}
                                />
                            </span>
                        </Item>
						{
							highTypeData.get('name')=='生产项目' ? <Multiple
								district={[{key: '辅助生产成本', value: 'beAssist'}, {key: '制造费用', value: 'beMake'}]}
								value={multipleList}
								title={'功能'}
								className={'config-form-item-auto-heigth-row'}
								onOk={(value) => {
									const valueArr = value.map(v => v.value);
									['beAssist', 'beMake'].map(v => {
										if (valueArr.includes(v)) {
											dispatch(projectConfActions.changeProjectData(['highTypeData', v], true))
										} else {
											dispatch(projectConfActions.changeProjectData(['highTypeData', v], false))
										}
									})

								}}
								>
								<Label>功能</Label>
								<div className="config-form-item-auto-height-row-item">
									{
										multipleList.map((item,index) => {
											return (
												<span
													key={index}
													className="config-form-item-type-choose-lable"
													style={{'paddingLeft': '8px'}}
												>
													{{'beAssist': '辅助生产成本', 'beMake': '制造费用'}[item]}
												</span>
											)
										})
									}
									{multipleList.length ? null : <span>请选择</span>}
								</div>
								&nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
							</Multiple> : null
						}
						{
							highTypeData.get('name')=='施工项目' ? <Multiple
								district={[{key: '间接费用', value: 'beIndirect'}, {key: '机械作业', value: 'beMechanical'}]}
								value={multipleList}
								title={'功能'}
								className={'config-form-item-auto-heigth-row'}
								onOk={(value) => {
									const valueArr = value.map(v => v.value);
									['beIndirect', 'beMechanical'].map(v => {
										if (valueArr.includes(v)) {
											dispatch(projectConfActions.changeProjectData(['highTypeData', v], true))
										} else {
											dispatch(projectConfActions.changeProjectData(['highTypeData', v], false))
										}
									})

								}}
								>
								<Label>功能</Label>
								<div className="config-form-item-auto-height-row-item">
									{
										multipleList.map((item,index) => {
											return (
												<span
													key={index}
													className="config-form-item-type-choose-lable"
													style={{'paddingLeft': '8px'}}
												>
													{{'beIndirect': '间接费用', 'beMechanical': '机械作业'}[item]}
												</span>
											)
										})
									}
									{multipleList.length ? null : <span>请选择</span>}
								</div>
								&nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
							</Multiple> : null
						}
                        <div className="config-form-sub-title" 
                            style={{display: (beAssist||beMake||beIndirect||beMechanical) ? '' : 'none'}}
                        >
                                期初值
                        </div>
                        <Item label='辅助生产成本' style={{display: beAssist ? '' : 'none'}} className="config-form-item-input-style">
                            <XfInput
                                mode='amount'
                                negativeAllowed={true}
                                placeholder={isCheckOut ? "已结账，不可更改" : "选填"}
                                value={assistOpen}
                                disabled={isCheckOut}
                                onChange={value => dispatch(projectConfActions.changeProjectData(['highTypeData', 'assistOpen'], value))}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label='制造费用' style={{display: beMake ? '' : 'none'}} className="config-form-item-input-style">
                            <XfInput
                                mode='amount'
                                negativeAllowed={true}
                                placeholder={isCheckOut ? "已结账，不可更改" : "选填"}
                                value={makeOpen}
                                disabled={isCheckOut}
                                onChange={value => dispatch(projectConfActions.changeProjectData(['highTypeData', 'makeOpen'], value))}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label='间接费用' style={{display: beIndirect ? '' : 'none'}} className="config-form-item-input-style">
                            <XfInput
                                mode='amount'
                                negativeAllowed={true}
                                placeholder={isCheckOut ? "已结账，不可更改" : "选填"}
                                value={indirectOpen}
                                disabled={isCheckOut}
                                onChange={value => dispatch(projectConfActions.changeProjectData(['highTypeData', 'indirectOpen'], value))}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label='机械作业' style={{display: beMechanical ? '' : 'none'}} className="config-form-item-input-style">
                            <XfInput
                                mode='amount'
                                negativeAllowed={true}
                                placeholder={isCheckOut ? "已结账，不可更改" : "选填"}
                                value={mechanicalOpen}
                                disabled={isCheckOut}
                                onChange={value => dispatch(projectConfActions.changeProjectData(['highTypeData', 'mechanicalOpen'], value))}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                    </Form>

                    <TreeCom
                        dispatch={dispatch}
                        treeList={treeList}
                        itemClick={(uuid, name) => {
                            if (name=='全部') { return }
                            dispatch(projectConfActions.getProjectTreeOne(uuid))
                            history.push('/config/project/projectTypeInsert')
                        }}
                        isSort={isSort}
                        sortClick={(selectedUuid, swappedUuid) => {
                            dispatch(projectConfActions.swapProjectTypePosition(uuid, selectedUuid, swappedUuid))
                        }}
                        isAdd={isAdd}
                        addClick={(uuid, name)=>{
                            dispatch(projectConfActions.initProjectData('treeData'))
                            dispatch(projectConfActions.changeProjectData(['treeData', 'parentUuid'], uuid))
                            dispatch(projectConfActions.changeProjectData(['treeData', 'parentName'], name))
                            history.push('/config/project/projectTypeInsert')
                        }}
                        isDelete={isDelete}
                        deleteClick={(uuid, name, value) => {
                            if (name != '全部') {
                                dispatch(projectConfActions.checkedProjectCategory(uuid, value))
                            }
                        }}
                    />
                </ScrollView>

                <ButtonGroup
                    disabled={!editPermission}
                    style={{display: isAdd || isSort || isDelete ? 'none' : ''}}>
                    <Button
                        disabled={!editPermission}
                        onClick={() => {
                        this.setState({ isAdd: true, isSort: false, isDelete: false})
                    }}>
                        <Icon type="add-plus"/><span>新增</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        onClick={() => {
                        this.setState({ isAdd: false, isSort: false, isDelete: true})
                    }}>
                        <Icon type="select" /><span>选择</span>
                    </Button>
                    <Button onClick={() => {
                        this.setState({ isAdd: false, isSort: true, isDelete: false})
                    }}>
                        <Icon type="swap-position-small" /><span>调整顺序</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        onClick={() => {
                        dispatch(projectConfActions.modifyProjectConfigHighType())
                    }}>
                        <Icon type="save"/><span>保存</span>
                    </Button>
                </ButtonGroup>

                <ButtonGroup style={{display: isAdd || isSort || isDelete ? '' : 'none'}}>
                    <Button onClick={() => {
                        this.setState({ isAdd: false, isSort: false, isDelete: false})
                        if (isDelete) {
                            dispatch(projectConfActions.uncheckedProject('category'))
                        }
                    }}>
                        <Icon type="cancel"/><span>取消</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        style={{display: isDelete ? '' : 'none'}}
                        onClick={() => {
                            dispatch(projectConfActions.deleteProjectType(uuid, treeList, callBack))
                    }}>
                        <Icon type="delete"/><span>删除</span>
                    </Button>
                </ButtonGroup>
            </Container>

        )
    }
}
