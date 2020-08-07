import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import 'app/containers/Config/common/style/listStyle.less'

import { Button, ButtonGroup, Icon, Container, ScrollView, Switch, Single, Row, Form, XfInput } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import { configCheck } from 'app/utils'
const { Item } = Form
import TypeTreeSelect from 'app/containers/components/TypeTreeSelect'

import * as projectConfActions from 'app/redux/Config/Project/projectConf.action.js'

@connect(state => state)
export default
class ProjectCard extends React.Component {

	static displayName = 'ProjectCard'

	static propTypes = {
		dispatch: PropTypes.func
	}

    constructor(props) {
		super(props)
		this.state = {
            showTypeModal: false,
        }
    }

    componentDidMount() {
        thirdParty.setTitle({title: '项目卡片'})
        thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })
    }

    render() {
        const { dispatch, projectConfState, history, homeState } = this.props
        const { showTypeModal } = this.state

        const highTypeList = projectConfState.get('highTypeList')
        const insertOrModify = projectConfState.getIn(['views', 'insertOrModify'])
        const fromPage = projectConfState.getIn(['views','fromPage'])
        const isFromOtherPage = fromPage !== 'project' ? true : false
		// const otherPageName = projectConfState.getIn(['views','otherPageName'])
        const psiData = projectConfState.getIn(['data', 'psiData'])
        const used = psiData.get('used')
        const isInsert = projectConfState.getIn(['views', 'insertOrModify']) == 'insert' ? true : false
		const treeList = projectConfState.get('treeList')
        const ctgyUuid = projectConfState.getIn(['views', 'ctgyUuid'])
        const projectProperty = psiData.get('projectProperty')
        const basicProductOpen = psiData.get('basicProductOpen')
        const contractCostOpen = psiData.get('contractCostOpen')//合同成本期初
        const contractProfitOpen = psiData.get('contractProfitOpen')//合同毛利期初
        const engineeringSettlementOpen = psiData.get('engineeringSettlementOpen')//工程结算期初
        const isCheckOut = psiData.get('isCheckOut')

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		let editPermission = configPermissionInfo.getIn(['edit', 'permission'])
		const isOpenedScxm = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('SCXM')//开启了生产项目
		const isOpenedSgxm = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('SGXM')//开启了施工项目

		if (isFromOtherPage) {
            // if (otherPageName === 'editRunning') {
                const lrAccountPermission = homeState.getIn(['permissionInfo', 'LrAccount'])
			    editPermission = lrAccountPermission.getIn(['edit', 'permission'])
            // }
            // else if (otherPageName === 'searchApproval') {
            //     const lrAccountPermission = homeState.getIn(['permissionInfo', 'LrAccount'])
            //     editPermission = lrAccountPermission.getIn(['edit', 'permission'])
            // }
        }
        
		let projectPropertyList = [{key: '损益项目', value: 'XZ_LOSS'}]
		if (isOpenedScxm) {
			projectPropertyList.push({key: '生产项目', value: 'XZ_PRODUCE'})
		}
		if (isOpenedSgxm) {
			projectPropertyList.push({key: '施工项目', value: 'XZ_CONSTRUCTION'})
        }        

        return(
            <Container className="project-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="编码" showAsterisk className="config-form-item-input-style">
                            <XfInput
                                placeholder='支持数字和英文大小写'
                                value={psiData.get('code')}
                                onChange={value => configCheck.inputCheck('code', value, () => {
                                    dispatch(projectConfActions.changeProjectData(['data', 'psiData','code'], value))
                                })}
                            />
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>
                        <Item label="名称" showAsterisk className="config-form-item-input-style">
                            <XfInput
                                placeholder='填写名称'
                                value={psiData.get('name')}
                                onChange={(value) => {
                                    dispatch(projectConfActions.changeProjectData(['data', 'psiData','name'], value))
                                }}
                            />
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>
                        <Item label="项目性质" showAsterisk>
                            <Single
                                district={projectPropertyList}
                                value={projectProperty}
                                onOk={value => {
                                    dispatch(projectConfActions.changeProjectData(['data', 'psiData','projectProperty'], value.value))
									highTypeList.map(v => {
										if (v.get('name')==value.key) {
											dispatch(projectConfActions.getProjectTree(v.get('uuid')))
										}
									})

                                }}
                            >
                                <Row className='config-form-item-select-item'>
                                    {{XZ_LOSS: '损益项目',  XZ_PRODUCE: '生产项目', XZ_CONSTRUCTION: '施工项目'}[projectProperty]}
                                </Row>
                            </Single>
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>
                        <Item label="类别" showAsterisk onClick={() => {
                            this.setState({showTypeModal: true})
                        }}>
                            {psiData.get('selectName')}
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>
                        <TypeTreeSelect
                            visible={showTypeModal}
                            dispatch={dispatch}
                            typeList={treeList}
							isSelectEnd={true}
                            onCancel={() => this.setState({showTypeModal: false})}
                            onChange={(item) => {
                                const uuid = item.key
                                const name = item.label
                                dispatch(projectConfActions.changeProjectData(['data', 'psiData', 'selectName'], name))
                                dispatch(projectConfActions.changeProjectData(['data', 'psiData', 'selectUuid'], uuid))
                                dispatch(projectConfActions.changeProjectData(['data', 'psiData', 'categoryTypeList', 0, 'subordinateUuid'], uuid))
                                this.setState({showTypeModal: false})
                            }}
                        >
                            <span></span>
                        </TypeTreeSelect>
                        <div className="config-form-sub-title" 
                            style={{display: ['XZ_PRODUCE', 'XZ_CONSTRUCTION'].includes(projectProperty) ? '' : 'none'}}
                        >
                                期初值
                        </div>
                        <Item label='基本生产成本' style={{display: projectProperty=='XZ_PRODUCE' ? '' : 'none'}} className="config-form-item-input-style">
                            <XfInput
                                mode='amount'
                                negativeAllowed={true}
                                placeholder={isCheckOut ? "已结账，不可更改" : "选填"}
                                value={basicProductOpen}
                                disabled={isCheckOut}
                                onChange={value => dispatch(projectConfActions.changeProjectData(['data', 'psiData', 'basicProductOpen'], value))}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label='合同成本' style={{display: projectProperty=='XZ_CONSTRUCTION' ? '' : 'none'}} className="config-form-item-input-style">
                            <XfInput
                                mode='amount'
                                negativeAllowed={true}
                                placeholder={isCheckOut ? "已结账，不可更改" : "选填"}
                                value={contractCostOpen}
                                disabled={isCheckOut}
                                onChange={value => dispatch(projectConfActions.changeProjectData(['data', 'psiData', 'contractCostOpen'], value))}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label='合同毛利' style={{display: projectProperty=='XZ_CONSTRUCTION' ? '' : 'none'}} className="config-form-item-input-style">
                            <XfInput
                                mode='amount'
                                negativeAllowed={true}
                                placeholder={isCheckOut ? "已结账，不可更改" : "选填"}
                                value={contractProfitOpen}
                                disabled={isCheckOut}
                                onChange={value => dispatch(projectConfActions.changeProjectData(['data', 'psiData', 'contractProfitOpen'], value))}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label='工程结算' style={{display: projectProperty=='XZ_CONSTRUCTION' ? '' : 'none'}} className="config-form-item-input-style">
                            <XfInput
                                mode='amount'
                                negativeAllowed={true}
                                placeholder={isCheckOut ? "已结账，不可更改" : "选填"}
                                value={engineeringSettlementOpen}
                                disabled={isCheckOut}
                                onChange={value => dispatch(projectConfActions.changeProjectData(['data', 'psiData', 'engineeringSettlementOpen'], value))}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label="启用/停用" style={{display: insertOrModify == 'insert' ? 'none' : '', marginTop: '.1rem'}}>
                            <span className="noTextSwitchShort">
                                <Switch
                                    checked={used}
                                    onClick={()=> {
                                        dispatch(projectConfActions.changeProjectData(['data', 'psiData','used'], !used))
                                    }}
                                />
                            </span>
                        </Item>
                    </Form>
                </ScrollView>

                <ButtonGroup>
                    <Button onClick={() => {
                        history.goBack()
                    }}>
                        <Icon type="cancel"/><span>取消</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        onClick={() => {
                        configCheck.beforeSaveCheck([
                            {
                                type: 'name',
                                value: psiData.get('name'),
                            }, {
                                type: 'code',
                                value: psiData.get('code')
                            }
                        ], () => {
                            dispatch(projectConfActions.checkProjectCard(fromPage, history))
                        })
                    }}>
                        <Icon type="save"/><span>保存</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        style={{display: insertOrModify == 'insert' && !isFromOtherPage ? '' : 'none'}}
                        onClick={() => {
                            configCheck.beforeSaveCheck([
                                {
                                    type: 'name',
                                    value: psiData.get('name')
                                }, {
                                    type: 'code',
                                    value: psiData.get('code')
                                }
                            ], () => {
                                dispatch(projectConfActions.checkProjectCard(fromPage, history, true))
                            })
                    }}>
                        <Icon type="new"/><span>保存并新增</span>
                    </Button>
                </ButtonGroup>
            </Container>

        )
    }
}
