import React, { PropTypes } from 'react'
import { Map,List } from 'immutable'
import { connect } from 'react-redux'
import { toJS } from 'immutable'

import { ROOT, ROOTURL } from 'app/constants/fetch.constant.js'
import logGetformatDate from './logGetformatDate'
import { Button, Tooltip, Icon, Input, Modal } from 'antd'
import { TableWrap, TableBody, TableTitle, TableItem, TableOver, TableAll, TableTree, ExportModal } from 'app/components'
import SobItem from './SobItem'
import * as thirdParty from 'app/thirdParty'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as sobConfigActions from 'app/redux/Config/Sob/sobConfig.action.js'
import * as middleActions from 'app/redux/Home/middle.action.js'

import './style.less'

@connect(state => state)
export default
class Sob extends React.Component {

	constructor() {
		super()
		this.state = { deleteModalShow: false, inputValue: '', deleteSobName: '', deleteSobId: '', chooseModal: false, demo: 'ACCOUNTING_DEMO'}
	}

	componentDidMount() {
		this.props.dispatch(sobConfigActions.getSobList())
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState != nextprops.allState || this.props.sobConfigState != nextprops.sobConfigState || this.props.homeState != nextprops.homeState || this.state !== nextstate
	}

	render() {

		const { dispatch, allState, sobConfigState, homeState } = this.props
		const { deleteModalShow, inputValue, deleteSobName, deleteSobId, chooseModal, demo } = this.state

		const newEquity = homeState.getIn(['data', 'userInfo', 'newEquity'])
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'moduleInfo'])
		const GLCanUse = moduleInfo ? (moduleInfo.get('GL') && moduleInfo.get('GL') === true ? true : false) : false

		const sobList = sobConfigState.get('sobList')

		// 钉钉管理员
		const isAdmin = homeState.getIn(['data', 'userInfo', 'isAdmin']) === 'TRUE'
		// 财务负责人
		const isFinance = homeState.getIn(['data', 'userInfo', 'isFinance']) === 'TRUE'
		const isDdAdmin = homeState.getIn(['data', 'userInfo', 'isDdAdmin']) === 'TRUE'
		const isDdPriAdmin = homeState.getIn(['data', 'userInfo', 'isDdPriAdmin']) === 'TRUE'
		const emplID = homeState.getIn(['data', 'userInfo', 'emplID'])

		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		const userInfo = homeState.getIn(['data', 'userInfo'])
		const sobInfo = userInfo.get('sobInfo')
		const corpId = userInfo.get('corpId')
		const user = `${userInfo.get('useruuid')}_${userInfo.get('username')}`

		const visibilityList = ['ding50f34631d604e77935c2f4657eb6378f', 'ding75d2d8a9cfb940bf', 'dingcb3d1516c40fded835c2f4657eb6378f', 'ding9849431a8160211e', 'ding9e1aa64cbe4d3b3435c2f4657eb6378f']

		return (
			<ContainerWrap type="config-four" className="sob-wrap">
				<FlexTitle>
					<div className="flex-title-left"></div>
					<div className="flex-title-right">
						{
							visibilityList.indexOf(corpId) > -1 ?
							<Button type="ghost" onClick={() => {
								window.location.href = `${ROOTURL}/opt/desktop/app/index.html?isOV=true&corpid=${corpId}&user=${user}`
							}}>消息触达</Button> : null
						}
						<Button
							style={{display: (ROOTURL.indexOf('dtst.xfannix.com') > -1 || ROOTURL.indexOf('dpre.xfannix.com') > -1) ? '' : 'none'}}
							disabled={(!isAdmin && !isFinance) || !GLCanUse}
							className="creat-sob-btn title-right"
							onClick={() => {
								this.setState({chooseModal: true})
							}}
						>
							创建测试账套
						</Button>
						<Tooltip placement="bottom" title={!GLCanUse ? '总账不可用' : (!isAdmin && !isFinance) ? '请联系超级管理员或财务经理新建账套' : ''}>
							<Button
								// 新增账套： 必须开启了新权益以及是钉钉管理员或者财务负责人才可以
								disabled={(!isAdmin && !isFinance && !isDdAdmin && !isDdPriAdmin) || !GLCanUse}
								// disabled={(!isAdmin && !isFinance) || !GLCanUse}
								className="add-sob-btn title-right"
								onClick={() => {
									const init = () =>{
										dispatch(homeActions.addPageTabPane('ConfigPanes', 'SobOption', 'SobOption', '账套新增'))
										dispatch(homeActions.addHomeTabpane('Config', 'SobOption', '账套新增'))
									}
									dispatch(middleActions.sobOptionInit('',init))
								}}
							>
								创建新账套
							</Button>
						</Tooltip>
						<Button
							className="refresh-btn title-right"
							onClick={() => {
								// 刷新
								dispatch(allActions.closeConfigPage('账套设置'))
								dispatch(sobConfigActions.getSobList())
							}}
						>刷新</Button>
						{
							(ROOT.indexOf('fannixddfe1.hz') > -1 || ROOT.indexOf('fannixddfe0.hz') > -1) ?
								<Modal
									title="创建测试账套"
									visible={chooseModal}
									onCancel={() => this.setState({chooseModal: false})}
									onOk={() => {
										dispatch(homeActions.createTestSob(history, demo))
										this.setState({chooseModal: false})
									}}
									maskClosable={false}
									footer={null}
									width="480px"
									>
									<div className="playground-center-wrap">
										<div className="word-content">
											<p>创建测试账套，请注意：</p>
											<p>
												1、每个公司共用一个体验环境，环境中已经预置了一些模拟的业务数据；<br />
												2、数据每晚定时清空，切勿录入正式数据；<br />
												3、有部分功能在体验环境中不能操作。<br />
											</p>
										</div>
										<div className="help-btn-wrap">
											<div className="help-btn-left">
												<h1>智能版</h1>
												<p>无需会计基础，财务小白也能零门槛输出专业报表</p>
												<div className='help-btn-click' onClick={() => {
													dispatch(homeActions.createTestSob(history, 'SMART_DEMO'))
													this.setState({chooseModal: false})
												}}>点击进入</div>
											</div>
											<div className="help-btn-right">
												<h1>会计版</h1>
												<p>传统总账系统</p>
												<div className='help-btn-click' onClick={() => {
													dispatch(homeActions.createTestSob(history, 'ACCOUNTING_DEMO'))
													this.setState({chooseModal: false})
												}}>点击进入</div>
											</div>
										</div>
									</div>
								</Modal>
								: ''
						}
					</div>
				</FlexTitle>

				<div className="sob-list">
					{
						sobList.map((item,index) =>{
							return <SobItem
								key={item.get('sobid')}
								item={item}
								index={index}
								dispatch={dispatch}
								isFinance={isFinance}
								isAdmin={isAdmin}
								emplID={emplID}
								beforeDeleteSob={(sobId, sobName) => {
									this.setState({
										deleteSobId: sobId,
										deleteSobName: sobName,
										deleteModalShow: true
									})
								}}
								URL_POSTFIX={URL_POSTFIX}
								isPlay={isPlay}
							/>
						})
					}
				</div>
				<Modal
                    title="删除账套"
                    visible={deleteModalShow}
                    onOk={() => {
                        const reg = /\s/g
                        const sobNameTrim = inputValue.replace(reg, "")
                        const deleteSobNameTrim = deleteSobName.replace(reg, "")

                        if (sobNameTrim === deleteSobNameTrim) {
                            dispatch(sobConfigActions.deleteSobItemFetch([deleteSobId]))
                        } else {
                            thirdParty.Alert('账套删除失败，账套名称与勾选账套名称不匹配')
                        }
                        this.setState({deleteModalShow: false})
                        this.setState({inputValue: ''})
                    }}
                    onCancel={() => {
                        this.setState({deleteModalShow: false})
                        this.setState({inputValue: ''})
                    }}
                    okText="删除"
                    cancelText="取消"
                >
                    <p className="pay-delete-text">确认删除吗？删除后数据将不可恢复哦</p>
                    <Input
                        style={{ width: 300 }}
                        placeholder="请输入需要删除的账套名称"
                        value={inputValue}
                        onChange={(e)=> this.setState({inputValue: e.target.value})}
                    />
                </Modal>
			</ContainerWrap>
		)
	}
}
