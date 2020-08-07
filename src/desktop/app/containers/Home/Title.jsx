import React, { PropTypes } from 'react'
import { Map, List, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as homeActions from 'app/redux/Home/home.action.js'

import { ROOTURL, XFNVERSION, getUrlParam } from 'app/constants/fetch.constant.js'
import { Select, Button, Modal, message } from 'antd'
import XfnIcon from 'app/components/Icon'
import NoticeSwitch from 'app/components/NoticeSwitch'
const Option = Select.Option
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class Title extends React.Component {

	constructor() {
		super()
		this.state = {
			// chooseModal: false,
			chooseModal: global.isplayground ? true : false,
			demo: 'SMART_DEMO',
			modelId: '',
		}
	}

	render() {
		const { defaultSobName, sobList, dispatch, activeTabkey, itemlist, history, isPlay, packInfoList, moduleList, corpName, openHelpCenter, secret, showLockFilter } = this.props
		const { chooseModal, demo, modelId } = this.state

		const time = 3000

		const accountModelList = moduleList.get('accountModelList') ? moduleList.get('accountModelList') : fromJS([])
		const jrModelList = moduleList.get('jrModelList') ? moduleList.get('jrModelList') : fromJS([])

		const sobTypeList = [
			{
				value: 'SMART_DEMO',
				key: '智能版'
			},
			{
				value: 'ACCOUNTING_DEMO',
				key: '会计版'
			}
		]

		let sobModelList = []
		if (global.isplayground) {
			if (demo === 'SMART_DEMO') {
				jrModelList.map(v => sobModelList.push({
					value: v.get('modelId'),
					key: v.get('modelName')
				}))
			} else if (demo === 'ACCOUNTING_DEMO') {
				accountModelList.map(v => sobModelList.push({
					value: v.get('modelId'),
					key: v.get('modelName')
				}))
			}
		}

		return (
			<div className="home-main-title">
				<div className="home-topbar-select">
					<Select
						showSearch
						className="home-topbar-select-input"
						value={defaultSobName}
						onSelect={value=> {
							const sobId = value.split(Limit.TREE_JOIN_STR)[0]
							dispatch(homeActions.setDefaultDbFetch(sobId))
						}}
					>
						{sobList && sobList.map((v, i) => <Option key={i} value={`${v.get('sobId')}${Limit.TREE_JOIN_STR}${v.get('sobName')}`}>{v.get('sobName')}</Option>)}
					</Select>
				</div>
				<div className="home-topbar-notice-switch">
					<NoticeSwitch
						itemlist={itemlist}
						time={time}
					/>
				</div>
				{
					global.isInWeb ?
					<span className="home-topbar-corp-name-wrap">
						<span className="home-topbar-corp-name">
							当前公司：{corpName}
						</span>
					</span>
					: null
				}
				{
					isPlay ?
					<div className="home-topbar-notice-isplay-icon">
						<img src="https://www.xfannix.com/utils/img/icons/park.png"/>
					</div> : ''
				}
				{
					global.isInWeb || global.isplayground ? null :
					<Button className="home-topbar-btn" type="ghost" onClick={() => {
						// window.open(`${ROOTURL}/build/desktop/index.html`)
						// window.open(`${ROOTURL}/build/desktop/index.html?12`,'win1','width=600px,top=500,height=600')
						dispatch(homeActions.openLinkInBrowser())
					}}>浏览器中打开</Button>	
				}
				<Button className="home-topbar-btn" type="ghost" onClick={() => {
					dispatch(homeActions.addPageTabPane('ConfigPanes', 'Sob', 'Sob', '账套设置'))
					dispatch(homeActions.addHomeTabpane('Config', 'Sob', '账套设置'))
				}}>账套设置</Button>
				<Button className="home-topbar-btn" type="ghost" onClick={openHelpCenter}>帮助中心</Button>
				{
					global.isplayground || global.isInWeb ? null : (isPlay ?
					<Button
						className="home-topbar-btn home-topbar-attention-btn"
						type="ghost"
						onClick={() => {
							dispatch(homeActions.quitPleasureGround(history))
						}}
					>退出体验模式</Button> :
					<Button
						className="home-topbar-btn"
						type="ghost"
						onClick={() => {

							const href = location.href
                			const urlParam = getUrlParam(href)
							
							thirdParty.openLink({
								// url: ROOTURL + "/index.html?isOV=false&isplayground=true"
								url: ROOTURL + `/index.html?isOV=false&isplayground=true&urlbackup=${urlParam.urlbackup ? urlParam.urlbackup : 'false'}`
							})
							// window.open(ROOTURL + "/index.html?isOV=false&isplayground=true",'win2')
						}}
					>进入体验模式</Button>)
				}
				{
					secret ?	
					<div className="home-topbar-btn-lock" onClick={() => {
						dispatch(homeActions.changeHomeLockFilterShow(true))
					}}>
						<XfnIcon type={showLockFilter ? 'suoping' : 'weisuoping'} style={{fontSize: '26px'}} />
					</div>
					: ''
				}
				<Modal
					title="进入体验模式"
					visible={chooseModal}
					onCancel={() => global.isplayground ? {} : this.setState({chooseModal: false})}
					onOk={() => {
						dispatch(homeActions.enterPleasureGround(history, demo))
						this.setState({chooseModal: false})
					}}
					maskClosable={false}
					footer={null}
					width="481px"
					>
					<div className="playground-center-wrap">
						<div className="word-content">
							<p style={{fontWeight: 'bold'}}>即将进入小番财务体验模式，请注意：</p>
							<p>
								{
									global.isplayground ?
									`1、同一个wifi下的用户共用一个体验环境，环境中已经预置了一些模拟的业务数据；` : `1、每个公司共用一个体验环境，环境中已经预置了一些模拟的业务数据；`
								}
								<br />
								2、数据每晚定时清空，切勿录入正式数据；<br />
								3、有部分功能在体验环境中不能操作。<br />
							</p>
						</div>
						<div className="help-sob-select-wrap">
							<div className="help-sob-select-item">
								<span className="help-sob-label">版本选择：</span>
								<span className="help-sob-select">
									<Select
										value={sobTypeList.find(v => v.value === demo).key}
										// style={{width: 300}}
										onChange={value => {
											this.setState({demo: value, modelId: value == demo ? modelId : ''})
										}}
									>
										{sobTypeList.map((v, i) => <Select.Option value={v.value} key={i}>{v.key}</Select.Option>)}
									</Select>
								</span>
							</div>
							<div className="help-sob-select-item">
								<span className="help-sob-label">模板选择：</span>
								<span className="help-sob-select">
									<Select
										value={modelId ? sobModelList.find(v => v.value === modelId).key : ''}
										// style={{width: 300}}
										onChange={value => {
											this.setState({modelId: value})
										}}
									>
										{sobModelList.map((v, i) => <Select.Option value={v.value} key={i}>{v.key}</Select.Option>)}
									</Select>
								</span>
							</div>							
						</div>
						<div className="help-sob-select-btn-wrap">
							<span
								className="help-sob-select-btn"
								onClick={() => {
									if (modelId) {
										dispatch(homeActions.enterPleasureGround(history, demo, demo === 'SMART_DEMO' ? jrModelList.find(v => v.get('modelId') === modelId) : accountModelList.find(v => v.get('modelId') === modelId)))
										this.setState({chooseModal: false})
									} else {
										message.info('请选择账套模板')
									}
								}}
							>
								点击进入
							</span>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}
