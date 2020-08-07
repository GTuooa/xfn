import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map } from 'immutable'
import './style.less'

import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { runningStateType } from 'app/constants/editRunning.js'
import { Container, Row, ScrollView, ButtonGroup, Button, Icon } from 'app/components'

import Title from './Title'
import Calculation from './Calculation'
import EnclosurePreview from './EnclosurePreview'
import ProcessInfo from './ProcessInfo'
import * as runningItemComponents from './RunningItem'
import * as calculateItemComponents from './CalculationItem'
import { runningPreviewActions } from 'app/redux/Edit/RunningPreview'



@connect(state => state)
export default
class PreviewRunning extends React.Component {

	static displayName = 'PreviewRunning'

	static propTypes = {
		allState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func
	}

	constructor(props) {
		super(props)
		this.state = {
			isDetail: true
		}
	}

	componentDidMount() {
		thirdParty.setTitle({title: '预览流水'})
		thirdParty.setIcon({showIcon: false})
		thirdParty.setRight({show: false})

		const prevPage = sessionStorage.getItem('prevPage')
		if (['editrunning', 'searchrunning'].includes(prevPage)) {//从录入流水 查询流水的核算管理 返回预览流水重新获取流水
			sessionStorage.removeItem('prevPage')
			const oriUuid = this.props.runningPreviewState.getIn(['jrOri', 'oriUuid'])
			this.props.dispatch(runningPreviewActions.getPreviewNextRunningBusinessFetch(oriUuid))
		}
	}

	// componentWillReceiveProps() {
    //     this.setState({isDetail: true})
    // }

	render() {

		const { allState, dispatch, runningPreviewState, history, homeState } = this.props
		const { isDetail } = this.state

		// 生成或修改凭证权限
		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const reviewLrAccountPermission = LrAccountPermissionInfo.getIn(['review', 'permission'])
		const editPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])

		//发票
		const isEnable = allState.getIn(['taxRate', 'scale'])

		const views = runningPreviewState.get('views')
		const uuidList = views.get('uuidList')

		const jrOri = runningPreviewState.get('jrOri')
		const category = runningPreviewState.get('category')
		const processInfo = runningPreviewState.get('processInfo')
		// 不要用 currentItem 因为其他页面来的可能字段都不对
		// const currentItem = runningPreviewState.get('currentItem')

		const oriDate = jrOri.get('oriDate')
		const oriUuid = jrOri.get('oriUuid')
		const jrIndex = jrOri.get('jrIndex')
		const enclosureList = jrOri.get('enclosureList')
		const categoryFullName = jrOri.get('categoryFullName')
		const categoryType = category.get('categoryType')
		const oriState = jrOri.get('oriState')
		let runningState = oriState
		if (categoryType=='LB_CHYE') {
			runningState = jrOri.get('jrState') ? jrOri.get('jrState') : ''
		}
		if (categoryType=='LB_CHTRXM') {
			runningState = 'STATE_CHTRXM'
		}

		const hasPz = jrOri.get('vcList') ? true : false
		//有无开启仓库
		const isOpenedWarehouse = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')

		const runningItemNameJson = {
			LB_YYSR: 'Yysz',  // 类别对应的组件名字
			LB_YYZC: 'Yysz',
			LB_FYZC: 'Fyzc',
			LB_XCZC: 'Xczc',
			LB_SFZC: 'Sfzc',
			LB_CQZC: 'Cqzc',
			LB_YYWSR: 'Yywsz',
			LB_YYWZC: 'Yywsz',
			LB_ZSKX: 'Zszf',
			LB_ZFKX: 'Zszf',
			LB_JK: 'JkTzZb',
			LB_TZ: 'JkTzZb',
			LB_ZB: 'JkTzZb',
			LB_JZCB: 'Jzcb',
			LB_SYJZ: 'Syjz',
		}
		const calculateItemJson = {
			STATE_FPRZ_CG:'FpKr',
			STATE_FPRZ_TG:'FpKr',
			STATE_KJFP_XS:'FpKr',
			STATE_KJFP_TS:'FpKr',
			STATE_ZCWJZZS:'Zcwjzzs',
			STATE_ZZ:'Nbzz',
			STATE_CQZC_ZJTX:'Zjtx',
			STATE_CQZC_JZSY:'Jzsy',
			STATE_SFGL: 'Sfgl',
			STATE_SFGL_ML: 'Sfgl',
			STATE_GGFYFT: 'Xmft',
			STATE_FZSCCB:'Xmft',
			STATE_ZZFY:'Xmft',
			STATE_JJFY:'Xmft',
			STATE_JXZY:'Xmft',
			STATE_CHDB: 'Chdb',
			STATE_CHYE: 'Chye',
			STATE_JXSEZC_FS: 'Jxsezc',
			STATE_JXSEZC_TFS: 'Jxsezc',
			STATE_CHTRXM: 'Chtrxm',
			STATE_CHZZ_ZZCX: 'Zzcx',
			STATE_CHZZ_ZZD: 'Zzcx',
			STATE_XMJZ_JZRK: 'Xmjz',
			STATE_XMJZ_XMJQ: 'Xmjz',
			STATE_XMJZ_QRSRCB: 'Xmjz',
		}

		// 所有流水部分
		const runningContain = (name) => {
			const Component = name ? runningItemComponents[name] : runningItemComponents['Other']
			return (
				<Component
					dispatch={dispatch}
					jrOri={jrOri}
					category={category}
					oriState={oriState}
					isEnable={isEnable}
				/>
			)
		}

		// 核算管理主体部分
		const calculateContain = (name) => {
			const Component = calculateItemComponents[name]
			return <Component
				dispatch={dispatch}
				jrOri={jrOri}
				category={category}
				oriState={oriState}
				isOpenedWarehouse={isOpenedWarehouse}
			/>
		}

		// 流水分录
        const jrFlowList = jrOri.get('jrFlowList')
		let copyDisabled = jrOri.get('modelNo') && jrOri.get('modelNo').startsWith('X')//X 派生(不能被复制) Y原生
		if (categoryType=='LB_JZCB' && ['STATE_YYSR_XS', 'STATE_YYSR_TS'].includes(oriState)) {
			copyDisabled = true
		}

		//制单人信息
		const modifyUserName = jrOri.get('modifyUserName')
		const modifyTime = jrOri.get('modifyTime')
		const auditUserName = jrOri.get('auditUserName')
		const auditTime = jrOri.get('auditTime')

		//结账的结转损益不可进行造作
		const disabled = categoryType=='LB_SYJZ'

		return (
			<Container className="running-preview">
				<Title
					dispatch={dispatch}
					oriDate={oriDate}
					oriUuid={oriUuid}
					uuidList={uuidList}
				/>
				<ScrollView flex="1">
					<div>
						<div className='running-preview-commom-card'>
							<div className='running-preview-title'>
								<span className='running-preview-category'>{categoryFullName}</span>
								<span className='running-preview-state'>
									{category.get('propertyPay')=='SX_FLF' && oriState=='STATE_XC_FF' ? '支付' : (runningStateType[runningState] ? runningStateType[runningState] : '')}
								</span>
							</div>
							<div className='running-preview-item'>
								<div className='running-preview-item-title'>流水号：</div>
								<div className='running-preview-item-content'>{jrIndex} 号</div>
							</div>
							<div className='running-preview-item'>
								<div className='running-preview-item-title'>流水日期：</div>
								<div className='running-preview-item-content'>{oriDate}</div>
							</div>
							<div className='running-preview-item'>
								<div className='running-preview-item-title'>摘要：</div>
								<div className='running-preview-item-content'>{jrOri.get('oriAbstract')}</div>
							</div>
							<Icon style={{display: hasPz ? '' : 'none'}} className="title-item-icon" color="#ff943e" type="yishenhe" size="50"/>
						</div>

						<div className='running-preview-toggle'>
							<div className='running-preview-toggle-left'>
								<div className={isDetail ? 'active' : ''} onClick={() => this.setState({isDetail: true})}>
									流水详情
								</div>
								<div className={isDetail ? '' : 'active'} onClick={() => this.setState({isDetail: false})}>
									流水分录
								</div>
							</div>
							<div>制单人：{`${jrOri.get('createUserName')} ${jrOri.get('createTime')}`}</div>
						</div>

						<div style={{display: isDetail ? '' : 'none'}}>
							{calculateItemJson[oriState] ? calculateContain(calculateItemJson[oriState]) : runningContain(runningItemNameJson[categoryType])}
						</div>

						<div style={{display: isDetail ? 'none' : ''}}>
							<Calculation
								itemList={jrFlowList}
								dispatch={dispatch}
								history={history}
								editPermission={editPermission}
							/>
						</div>

						{
							isDetail && enclosureList && enclosureList.size ?
							<EnclosurePreview
								enclosureList={enclosureList}
								dispatch={dispatch}
								history={history}
							/>
							: ''
						}
						{
							processInfo ?
							<ProcessInfo
								processInfo={processInfo}
							/>
							: null
						}
						<div className='running-preview-other'>
							{ auditUserName ? <div>审核人：{`${auditUserName} ${auditTime}`}</div> : <span></span> }
							{ modifyUserName ? <div>修改人：{`${modifyUserName} ${modifyTime}`}</div> : null }
						</div>
					</div>
				</ScrollView>

				<ButtonGroup style={{backgroundColor: '#F8F8F8'}}>
					<Button
						disabled={hasPz || (!editPermission) || disabled}
						onClick={() => {
							sessionStorage.setItem("ylToLr", 'MODIFY')
							history.push('/editrunning/index')
					}}>
						<Icon type="edit"/>
						<span>修改</span>
					</Button>
					<Button
						disabled={disabled}
						onClick={() => {
							if (copyDisabled) {
								return thirdParty.toast.info('有关联流水,不可复制')
							}
							sessionStorage.setItem("ylToLr", 'COPY')
							history.push('/editrunning/index')
					}}>
						<Icon type="copy"/>
						<span>复制</span>
					</Button>
					<Button
						disabled={!editPermission || hasPz || disabled}
						onClick={() => {
							dispatch(runningPreviewActions.deleteRunning(oriUuid, uuidList, history))
					}}>
						<Icon type="delete"/>
						<span>删除</span>
					</Button>
					<Button
						disabled={!reviewLrAccountPermission || disabled}
						onClick={() => {
						if (hasPz) {//去反审核
							let deleteVcId = [], deleteYear, deleteMonth
							jrOri.get('vcList').map((u, i) => {
								deleteVcId.push(u.get('vcIndex'))
								deleteYear = u.get('year')
								deleteMonth = u.get('month')
							})
							dispatch(runningPreviewActions.deleteRunningBusinessVc(deleteYear, deleteMonth, deleteVcId, oriUuid))
						} else {//去审核
							dispatch(runningPreviewActions.insertRunningBusinessVc(oriUuid, oriDate, jrIndex))
						}

					}}>
						<Icon type={hasPz ? 'chexiao' : 'shenhe'}/><span>{hasPz ? '反审核' : '审核'}</span>
					</Button>
					<Button onClick={() => {
						sessionStorage.setItem('prevPage', 'runningpreview')
						history.push('/editrunning/index')
					}}>
						<Icon type="add-plus"/><span>新增</span>
					</Button>
				</ButtonGroup>
			</Container>
		)
	}
}
