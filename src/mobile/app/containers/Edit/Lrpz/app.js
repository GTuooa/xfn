import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action'
import * as lrpzExportActions from 'app/redux/Edit/Lrpz/lrpzExport.action.js'
import * as allActions from 'app/redux/Home/All/other.action'
import * as draftActions from 'app/redux/Edit/Draft/draft.action.js'
import { homeActions } from 'app/redux/Home/home.js'

import { Button, ButtonGroup, Icon, Container, Row, ScrollView, AmountInput, TextInput, Radio,PopUp,SinglePicker} from 'app/components'
import Title from './Title.jsx'
import Jv from './Jv.jsx'
import Ckpz from './Ckpz.jsx'
// import UploadPzFj from './UploadPzFj.jsx'
import Enclosure from 'app/containers/components/Enclosure'
import AcSelect from './AcSelect'
import * as thirdParty from 'app/thirdParty'
import { TopDatePicker } from 'app/containers/components'
import { fromJS, toJS, Map } from 'immutable'
import { ascOrder, showImg, DateLib } from 'app/utils'

import './lrpz.less'

function valueToAcnameAndAcCode(value) {
	let acid = value.match(/^\d*/) || '';
	let acname = value.match(/_.*$/) || '';
	return {
		acname: acname.toString().replace('_', ''),
		acid: acid.toString()
	}
}

@connect(state => state)
export default
class Lrpz extends React.Component {

    static propTypes = {
	}

	state = {
		autoEncode:'true',
		codeRepeatModal:false,
		showAcSelect: false,
		selestStatus: {
			acid: '',
			index: '',
			acunitOpen: '0'
		}
	}

    componentDidMount() {
		thirdParty.setIcon({
            showIcon: false
        })

		if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')

			sessionStorage.setItem("lrpzHandleMode", "insert")
			const period = this.props.allState.get('period')
			const year = period.get('openedyear')
			const month = period.get('openedmonth')

			// 提取
			const now = new Date()
			const nowYear = now.getFullYear()
			const nowMonth = now.getMonth() + 1

			let vcdate = ''
			if (!year) {
				vcdate = new Date()
			} else {
				const lastDate = new Date(year, month, 0)
				const currentDate = new Date()
				vcdate = nowYear == year && nowMonth == month ? currentDate : lastDate
			}

			this.props.dispatch(lrpzExportActions.initLrpz())
			this.props.dispatch(lrpzExportActions.getLastVcIdFetch(vcdate))
			this.props.dispatch(lrpzExportActions.setCkpzIsShow(false))
		}
		sessionStorage.setItem("prevPage", "cxpz")
		const moduleInfo = this.props.homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		//有没有开启附件
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_GL') > -1 ? true : false) : true
		const checkMoreFj = this.props.homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
		if(enCanUse && checkMoreFj){
			this.props.dispatch(lrpzActions.initLabel())
		}

		this.props.dispatch(homeActions.setDdConfig())
	}

	componentWillUnmount() {
        sessionStorage.removeItem('router-from')
    }

    render() {

        const {
			history,
			lrpzState,
			allState,
			cxpzState,
			kmmxbState,
			assMxbState,
			dispatch,
			amountMxbState,
			homeState,
			cxAccountState,
			currencyMxbState,
		} = this.props

		const { autoEncode, codeRepeatModal, showAcSelect, selestStatus } = this.state
		const pzPermissionInfo = homeState.getIn(['permissionInfo', 'Pz'])
		const sobInfo = homeState.getIn(['data', 'userInfo','sobInfo'])
		const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 : false
		const editPermission = pzPermissionInfo.getIn(['edit', 'permission'])
		const reviewPermission = pzPermissionInfo.getIn(['review', 'permission'])
		const unitDecimalCount = allState.getIn(['systemInfo', 'unitDecimalCount'])

		const jvlist = lrpzState.get('jvlist')
		const jvListLength = jvlist.size
		const vcindex = lrpzState.get('vcindex')
		const vcdate = lrpzState.get('vcdate')
		const enclosureCountUser = lrpzState.get('enclosureCountUser')
		const closedby = lrpzState.get('closedby') ? true : false
		const reviewedby = lrpzState.get('reviewedby') ? true : false
		const showckpz = lrpzState.getIn(['flags', 'showckpz'])
		const currencyList = lrpzState.getIn(['flags', 'currencyList'])

		if ((showckpz && sessionStorage.getItem('router-from') === 'cxpz') || (showckpz && sessionStorage.getItem('router-from') === 'lrpz') || (showckpz &&  sessionStorage.getItem('router-from') === 'mxb') || (showckpz &&  sessionStorage.getItem('router-from') === 'assmxb') || (showckpz &&  sessionStorage.getItem('from-cxls'))){
			thirdParty.setTitle({title: '查看凭证'})
			// export
			const ddPDFCallback =
			isRunning?
			(needA4, needCreatedby, needReviewedBy,reviewedBy='') => dispatch => dispatch(allActions.allExportDo('cxpzpdfexport', {year, month, 'vcIndexList':[vcindex], needA4, needCreatedby, needReviewedBy,reviewedBy}))
			:
			(needA4, needCreatedby, needAss) => dispatch => dispatch(allActions.allExportDo('cxpzpdfexport', {year, month, 'vcIndexList':[vcindex], needA4, needCreatedby, needAss}))
			dispatch(allActions.navigationSetMenu('PDF-vc', ddPDFCallback))

		} else if (sessionStorage.getItem('lrpzHandleMode') === 'modify'){
			thirdParty.setTitle({title: '修改凭证'})
			thirdParty.setRight({show: false})
		} else if(sessionStorage.getItem('enterDraft') === 'draft' && sessionStorage.getItem('lrpzHandleMode') === 'insert') {
			thirdParty.setTitle({title: '查看草稿'})
			thirdParty.setRight({show: false})
		} else {
			thirdParty.setTitle({title: '录入凭证'})
			thirdParty.setRight({show: false})
			dispatch(lrpzExportActions.setCkpzIsShow(false))
		}

		const deletable = jvlist.size > 1

		const flags = lrpzState.get('flags')
		const jvSelectedIdx = flags.get('jvSelectedIdx')

		const acasslist = allState.get('acasslist')

		const aclist = allState.get('aclist')

		// const aclistable = aclist ? aclist.map((v, i) => {
		// 	const curentacid = v.get('acid')
		// 	const nextacid = aclist.getIn([i + 1, 'acid'])
		//
		// 	return v.set('hasSub', !!nextacid && nextacid.indexOf(curentacid) === 0)
		// }).filter(v => !v.get('hasSub')) : fromJS([])


		const jv = jvlist.get(jvSelectedIdx)
		const acinfo = jv.get('acid') + jv.get('acname')
		const cascadeDataAclist = allState.get('cascadeDataAclist')

		const year = lrpzState.get('year')
		const month = lrpzState.get('month')

		// 草稿
		const vckey = lrpzState.get('vckey')
		const locked = lrpzState.getIn(['flags', 'locked'])

		//当前编辑模式
		const lrpzHandleMode = sessionStorage.getItem('lrpzHandleMode')
		const button = showckpz ? sessionStorage.getItem('enterDraft') === 'draft' ? (
			<ButtonGroup style={{backgroundColor: '#F8F8F8', display: showckpz ? '' : 'none'}}>
				<Button key="usage" disabled={!editPermission}
					style={{display: locked == '1' ? '' : 'none'}}
					onClick={() => {
						let vcDate = ''
						const openYear = allState.getIn(['period', 'openedyear'])
						const openMonth = allState.getIn(['period', 'openedmonth'])
						const now = new Date()

						const nowYear = now.getFullYear()
						const nowMonth = now.getMonth() + 1
						if (!year) {
							vcDate = new Date()
						} else {
							const lastDate = new Date(openYear, openMonth, 0)
							const currentDate = new Date()
							vcDate = nowYear == openYear && nowMonth == openMonth ? currentDate : lastDate
						}
						sessionStorage.setItem('router-from', '')
						sessionStorage.setItem('lrpzHandleMode', 'insert')
						sessionStorage.removeItem('enterDraft')
						dispatch(lrpzExportActions.setCkpzIsShow(false))
						dispatch(lrpzExportActions.getLastVcIdFetch(vcDate))
					}}
				>
					<Icon type="usage"/>
					<span>使用</span>
				</Button>
				<Button key="lock-open" disabled={!editPermission}
					style={{display: locked == '1' ? '' : 'none'}}
					onClick={() => {
						dispatch(lrpzActions.unLockDraft(vckey))
					}}
					>
					<Icon type="lock-open"/>
					<span>解锁</span>
				</Button>
				<Button key="usaged" disabled={!editPermission}
					style={{display: locked == '1' ? 'none' : ''}}
					onClick={() => {
						sessionStorage.setItem('router-from', '')
						sessionStorage.setItem('lrpzHandleMode', 'insert')
						sessionStorage.removeItem('enterDraft')
						dispatch(lrpzExportActions.setCkpzIsShow(false))
					}}
					>
					<Icon type="usage"/>
					<span>用掉</span>
				</Button>
				<Button key="delete" disabled={!editPermission}
					style={{display: locked == '1' ? 'none' : ''}}
					onClick={() => {
						sessionStorage.removeItem('enterDraft')
						dispatch(lrpzActions.deleteDraft(vckey, history))
					}}
					>
					<Icon type="delete"/>
					<span>删除</span>
				</Button>
				<Button key="lock-close" disabled={!editPermission}
					style={{display: locked == '1' ? 'none' : ''}}
					onClick={() => {
						dispatch(lrpzActions.lockDraft(vckey))
					}}
					>
					<Icon type="lock-close"/>
					<span>锁定</span>
				</Button>

			</ButtonGroup>
		) : (
			<ButtonGroup style={{backgroundColor: '#F8F8F8', display: showckpz ? '' : 'none'}}>

				<Button key="modification" disabled={!editPermission || reviewedby}
					onClick={() => {
						dispatch(lrpzExportActions.setCkpzIsShow(false))
						const haveFCNmuber = jvlist.some(v => v.get('fcNumber'))
			            //判断凭证是否有外币
			            if (haveFCNmuber) {
			                dispatch(lrpzActions.getFCListDataFetch('modify'))
			            }
					}}>
					<Icon style={closedby ? {color: '#d9d9d9'} : undefined} type="modification"/>
					<span style={closedby ? {color: '#d9d9d9'} : undefined}>修改</span>
				</Button>
				<Button key="delete" disabled={!editPermission|| reviewedby}
					onClick={() => {
						//sessionStorage.removeItem('enterDraft')
						//dispatch(lrpzActions.deleteDraft(vckey, history))
						dispatch(lrpzActions.deletePz(year, month, vcindex,history))
					}}
					>
					<Icon style={closedby ? {color: '#d9d9d9'} : undefined} type="delete"/>
					<span style={closedby ? {color: '#d9d9d9'} : undefined}>删除</span>
				</Button>
				<Button key="shenhe" disabled={!reviewPermission} style={{display: reviewedby ? 'none' : ''}} onClick={() => dispatch(lrpzActions.reviewedJvlist(year, month, vcindex))}>
					<Icon style={closedby ? {color: '#d9d9d9'} : undefined} type="shenhe"/>
					<span style={closedby ? {color: '#d9d9d9'} : undefined}>审核</span>
				</Button>
				<Button key="chexiao" disabled={!reviewPermission} style={{display: reviewedby ? '' : 'none'}} onClick={() => dispatch(lrpzActions.cancelReviewedJvlist(year, month, vcindex))}>
					<Icon style={closedby ? {color: '#d9d9d9'} : undefined} type="chexiao"/>
					<span style={closedby ? {color: '#d9d9d9'} : undefined}>反审核</span>
				</Button>
				<Button key="locked" disabled={!editPermission || reviewedby}
					onClick={() => {
						sessionStorage.setItem("lrpzHandleMode", "insert")
						sessionStorage.removeItem('enterDraft')
						sessionStorage.removeItem('router-from')
						// const now = new Date()
						// const nowYear = now.getFullYear()
						// const nowMonth = now.getMonth() + 1
						// const openedyear = allState.get(['period', 'openedyear'])
						// const openedmonth = allState.get(['period', 'openedmonth'])
						// let vcdate = ''
						// if (!openedyear) {
						// 	vcdate = new Date()
						// }
						// else {
						// 	const lastDate = new Date(openedyear, openedmonth, 0)
						// 	const currentDate = new Date()
						// 	vcdate = nowYear == openedyear && nowMonth == openedmonth ? currentDate : lastDate
						// }

						let vcdate = ''
						const now = new Date()

						// console.log('now', now)
						const nowYear = `${now.getFullYear()}`
						const monthNum = now.getMonth() + 1
						const nowMonth = `${monthNum > 10 ? monthNum : '0' + monthNum}`

						const openedyear = allState.getIn(['period', 'openedyear'])
						const openedmonth = allState.getIn(['period', 'openedmonth'])

						if (nowYear == openedyear && nowMonth == openedmonth) {
							vcdate = new Date()
						} else {
							vcdate = new Date(openedyear, openedmonth, 0)
						}

						dispatch(lrpzExportActions.initLrpz())
						dispatch(lrpzExportActions.getLastVcIdFetch(vcdate))
						dispatch(lrpzExportActions.setCkpzIsShow(false))
					}}
					>
					<Icon style={closedby ? {color: '#d9d9d9'} : undefined} type="add-plus"/>
					<span style={closedby ? {color: '#d9d9d9'} : undefined}>新增</span>
				</Button>
			</ButtonGroup>
		) : (
			<ButtonGroup style={{backgroundColor: '#F8F8F8'}}>
				<Button
					key="draftBox"
					style={{display: sessionStorage.getItem('lrpzHandleMode') == 'insert' ? '' : 'none'}}
					onClick={() => {
						history.push('/draft')
						dispatch(draftActions.getDraftListFetch('全部'))
					}}
				>
					<Icon type="draftBox"/>
					<span>草稿箱</span>
				</Button>
				<Button
					key="temporary"
					style={{display: sessionStorage.getItem('lrpzHandleMode') == 'insert' ? '' : 'none'}}
					onClick={() => dispatch(lrpzActions.draftSaveFetch())}
					>
					<Icon type="temporary"/>
					<span>暂存</span>
				</Button>
				<Button key="save" onClick={() => {
					sessionStorage.removeItem('enterDraft')
					const openModal = () =>{
						this.setState({'codeRepeatModal':true})
					}
					dispatch(lrpzActions.enterJvFetch('',openModal,'',pzPermissionInfo))
				}}>
					<Icon type="save"/>
					<span>保存</span>
				</Button>
				{/* <Button onClick={() => dispatch(lrpzActions.enterJvFetch(true))} style={{display: lrpzHandleMode === 'insert' ? '' : 'none'}}>
					<Icon type="new"/>
					<span>保存并新增</span>
				</Button> */}
				{/* <Button
					style={{display: lrpzHandleMode === 'modify' ? '' : 'none'}}
					onClick={() => dispatch(lrpzExportActions.setCkpzIsShow(true))}>
					<Icon type="cancel"/>
					<span>取消</span>
				</Button> */}
			</ButtonGroup>
		)

		//获取来源地址的vclist
		let vcIndexArr = []
		const routerFrom = sessionStorage.getItem('router-from');

		if (routerFrom === 'cxpz') {
			cxpzState.get('vclist').map(v => vcIndexArr.push(v.get('vcindex')))
			vcIndexArr.sort(ascOrder)
		}  else if (routerFrom === 'mxb') {
			kmmxbState.getIn(['ledger', 'detailList']).forEach(v => {

				if (v.get('vcindex') && vcIndexArr.indexOf(v.get('vcindex')) === -1) {
					vcIndexArr.push(v.get('vcindex'))
				}
			})
			vcIndexArr.sort(ascOrder)
		} else if (routerFrom === 'assmxb') {
			assMxbState.getIn(['reportassdetail', 'jvlist']).forEach(v => {
				if (vcIndexArr.indexOf(v.get('vcindex')) === -1) {
					vcIndexArr.push(v.get('vcindex'))
				}
			})
			vcIndexArr.sort(ascOrder)
		} else if (routerFrom === 'lrpz') {
			vcIndexArr.push(vcindex)
		} else if (routerFrom === 'amountmxb') {
			amountMxbState.getIn(['ledger', 'jvlist']).forEach(v => {
				if (vcIndexArr.indexOf(v.get('vcindex')) === -1) {
					vcIndexArr.push(v.get('vcindex'))
				}
			})
			vcIndexArr.sort(ascOrder)
		} else if (routerFrom === 'currencymxb') {
			currencyMxbState.getIn(['currencyDetailList', 'jvList']).forEach(v => {
				if (vcIndexArr.indexOf(v.get('vcindex')) === -1) {
					vcIndexArr.push(v.get('vcindex'))
				}
			})
			vcIndexArr.sort(ascOrder)
		} else if (routerFrom === 'cxls') {
			cxAccountState.get('dataList').forEach(v => {
				if (v.get('vcList').size && vcIndexArr.indexOf(v.getIn(['vcList', 0, 'vcIndex'])) === -1) {
					vcIndexArr.push(v.getIn(['vcList', 0, 'vcIndex']))
				}
			})
			vcIndexArr.sort(ascOrder)
		}


		//定位当前编辑的vc的数组位置
		const idx = vcIndexArr.findIndex(v => v == vcindex)

		//获取上一张vc的编号
		const prevIndex = idx > 0 ? vcIndexArr[idx - 1] : 0
		const nextIndex = idx < (vcIndexArr.length -1) ? vcIndexArr[idx + 1] : idx
		// 图片上传
		const moduleInfo = this.props.homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		//有没有开启附件
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_GL') > -1 ? true : false) : true
		const checkMoreFj = this.props.homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
		const enclosureList = lrpzState.get('enclosureList');
		// const previewImageList = lrpzState.get('previewImageList').toJS();
		let previewImageList=[]
		enclosureList.map(v => {
			if (v.get('imageOrFile') == 'TRUE') {
				// previewImageList.push(v.get('enclosurepath'))
				previewImageList.push(v.get('signedUrl'))
			}
		})
		const label = lrpzState.get('label');
		const isAllImage = enclosureList.every(v => v.get('imageOrFile')=='TRUE')

		let deleteAndLabel=false;//删除图标和标签图标出现的状态
		if(editPermission && !closedby && !reviewedby){//是管理员观察员且未结账未审核
			deleteAndLabel = true;//出现
		}
		let showFj = true;
		if((closedby || reviewedby) && !enclosureList.size){//结账或审核且没有附件
			showFj = false
		}

		const isloading = allState.get('isloading')
		const uploadKeyJson = allState.get('uploadKeyJson')

        return (
			<Container className="lrpz">
				{isloading ? <div className="unloadedMask">
					<div className="unloadedMask-tip-text">
						凭证如果有附件，需要较长的时间加载，请耐心等待
					</div>
				</div> : ''}
				<TopDatePicker
					style={{display: showckpz ? 'none' : ''}}
					value={vcdate}
					callback={(value) => {
						if (sessionStorage.getItem('lrpzHandleMode') === 'modify') {
							dispatch(lrpzActions.modifyVcDate(value, vcdate))
						} else {
							// dispatch(lrpzExportActions.getLastVcIdFetch(value))
							dispatch(lrpzActions.modifyVcDate(value, vcdate))
						}
					}}
					onChange={value => {
						if (sessionStorage.getItem('lrpzHandleMode') === 'modify') {
							dispatch(lrpzActions.modifyVcDate(value, vcdate))
						} else {
							// dispatch(lrpzExportActions.getLastVcIdFetch(value))
							dispatch(lrpzActions.modifyVcDate(value, vcdate))
						}
					}}
				/>
				<Row className="date-header-wrap lrpz" style={{display: showckpz && sessionStorage.getItem('enterDraft')!=='draft' ? '' : 'none'}}>
					<span
						className="date-header-btn-wrap"
						onClick={() => {
							if (idx !== 0) {
								prevIndex && dispatch(lrpzActions.getVcFetch(vcdate, prevIndex))
							}
						}}
					>
						<Icon
							className="header-left"
							type="last"
							style={{visibility: idx === 0 ? 'hidden' : ''}}
						/>
					</span>
					<div className="thirdparty-date-select">
						<span className="thirdparty-date-date">{vcdate.replace(/-/g, '/')}</span>
					</div>
					<span
						className="date-header-btn-wrap"
						onClick={() => {
							if (idx !== vcIndexArr.length - 1) {
								nextIndex && dispatch(lrpzActions.getVcFetch(vcdate, nextIndex))
							}
						}}
					>
						<Icon
							className="header-right"
							type="next"
							style={{visibility: idx === vcIndexArr.length - 1 ? 'hidden' : ''}}

						/>
					</span>
				</Row>
				<Title
					vcindex={vcindex}
					showckpz={showckpz}
					closedby={closedby}
					reviewedby={reviewedby}
					creditTotal={lrpzState.getIn(['flags', 'creditTotal'])}
					debitTotal={lrpzState.getIn(['flags', 'debitTotal'])}
					dispatch={dispatch}
					locked={locked}
					vcdate={vcdate}
				/>
				<AcSelect
					aclist={aclist}
					visible={showAcSelect}
					dispatch={dispatch}
					value={selestStatus.acid}
					onChange={(item) => {
						// const value = item.key
						const idx = selestStatus.index

						const acid = item.key
						const acitem = aclist.find(v => v.get('acid') == acid)
						const asscategorylist = acitem ? acitem.get('asscategorylist') : fromJS({})
						dispatch(lrpzActions.changeJvAcIdAndAcNameAndAssCategoryList(idx, acid, acitem ? acitem.get('acfullname') : '', acitem ? acitem.get('acname') : '', asscategorylist))

						if(acid && acitem.get('acunitOpen') == '1'){
							selestStatus.unitCallBack(acitem.get('acunitOpen'))
							if (!acitem.get('asscategorylist').size) {
								dispatch(lrpzActions.getAmountDataFetch(acid, vcdate, idx))	//获取数量一栏的数据
							}
						} else {
							dispatch(lrpzActions.clearAcUnitOpen(idx)) //将 acunitOpen 设置为‘0’
						}
						if (acid && acitem.get('fcStatus') == '1') {
							dispatch(lrpzActions.getFCListDataFetch(idx))	//获取外币
						} else {
							dispatch(lrpzActions.clearFCListData(idx))	//清除数据
						}

						this.setState({
							showAcSelect: false,
							selestStatus: {
								index: '',
								acid: '',
								unitCallBack: () => {}
							}
						})
					}}
					parentDisabled={true}
					onCancel={() => {
						this.setState({
							showAcSelect: false,
							selestStatus: {
								index: '',
								acid: '',
							}
						})
					}}
				>
					<span></span>
				</AcSelect>
				<ScrollView ref="lrpzScrollContainer" flex="1" uniqueKey="lrpz-scroll" savePosition>
					<div style={{display: showckpz ? 'none' : ''}} className="jv-list">
						{jvlist.map((v, i) =>
							<Jv
								idx={i}
								key={i}
								jv={v}
								vcdate={vcdate}
								deletable={deletable}
								// aclist={aclistable}
								dispatch={dispatch}
								acasslist={acasslist}
								jvListLength={jvListLength}
								// cascadeDataAclist={cascadeDataAclist}
								lrpzScrollContainer={this.refs.lrpzScrollContainer}
								currencyList={currencyList}
								unitDecimalCount={unitDecimalCount}
								onAcSelectClick={(idx, acid, unitCallBack) => this.setState({
									showAcSelect: true,
									selestStatus: {
										index: idx,
										acid: acid,
										unitCallBack: unitCallBack
									}
								})}
							/>
						)}
					</div>
					<div style={{display: showckpz ? '' : 'none'}} className="ckjv-list">
						{jvlist.map((v, i) =>
							<Ckpz
								idx={i}
								key={i}
								jv={v}
							/>
						)}
						<div className="vc-jv vc-info-bottom vc-jv-info" style={{display: showckpz ? '' : 'none'}}>
							<span>{`制单人: ${lrpzState.get('createdby') ? lrpzState.get('createdby') : ''}`}</span>
							<span>{lrpzState.get('reviewedby') && !isRunning ? `审核人: ${lrpzState.get('reviewedby')}` : ''}</span>
						</div>
					</div>
					<div className={showckpz ? 'ckjv-enclosure-count-user' : 'ckjv-enclosure-count-user ckjv-enclosure-count-user-input'}>
						<span>
							附件数：
						</span>
						{
							showckpz ?
							<span>
								{enclosureCountUser && enclosureCountUser !== '' ? enclosureCountUser : '0'} 个
							</span> :
							<span>
								<TextInput
									textAlign="right"
									value={enclosureCountUser}
									onChange={value => {
										if (/^\d*$/.test(value) && value.length <= 2) {
											dispatch(lrpzActions.changeVcEnclosureCountUser(value))
										}
									}}
								/>
								&nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
							</span>
						}
					</div>

					<Enclosure
						fromPage={'Lrpz'}
						className="lrpz-enclosure-wrap"
						dispatch={dispatch}
						enCanUse={enCanUse}
						editPermission={editPermission}
						enclosureList={enclosureList}
						checkMoreFj={checkMoreFj}
						showPzfj={showFj}
						label={label}
						enclosureCountUser={enclosureCountUser}
						previewImageList={previewImageList}
						showckpz={showckpz}
						uploadFiles={(value) => dispatch(lrpzActions.uploadFiles(...value))}
						getUploadGetTokenFetch={() => dispatch(lrpzActions.getUploadGetTokenFetch())}
						getLabelFetch={() => dispatch(lrpzActions.getLabelFetch())}
						deleteUploadImgUrl={(index) => dispatch(lrpzActions.deleteUploadImgUrl(index))}
						changeTagName={(index, tagValue) => dispatch(lrpzActions.changeTagName(index, tagValue))}
						uploadKeyJson={uploadKeyJson}
						history={history}
					/>
					{/* <UploadPzFj
						dispatch={dispatch}
						enCanUse={enCanUse}
						editPermission={editPermission}
						enclosureList={enclosureList}
						showPzfj={showFj}
						checkMoreFj={checkMoreFj}
						label={label}
						enclosureCountUser={enclosureCountUser}
						previewImageList={previewImageList}
						showckpz={showckpz}
					/> */}
				</ScrollView>
				<Row>
					{closedby ? '' : button}
				</Row>
				<PopUp
	                title={`凭证号：${vcindex}已存在，您可以：`}
	                onCancel={() => this.setState({autoEncode:'true',codeRepeatModal:false})}
	                visible={codeRepeatModal}
	                footerVisible={false}
	                footer={[
	                    <span key='cancel' onClick={() => this.setState({autoEncode:'true',codeRepeatModal:false})}>取消</span>,
	                    <span key='sure'
	                        onClick={() => {
								sessionStorage.removeItem('enterDraft')
								const openModal = () =>{
									this.setState({autoEncode:'true','codeRepeatModal':false})
								}
								dispatch(lrpzActions.enterJvFetch('',openModal,autoEncode,pzPermissionInfo))
							}}>
	                        确定
	                    </span>
	                ]}
	                >
					<div className="code-repeat-select">
						<Radio
							list={[{key:'true',value:'系统自动编号'},{key:'false',value:'插入凭证号'}]}
							value={autoEncode}
							onChange={(value) => {
								this.setState({'autoEncode':value})
							}}
						/>
					</div>
	            </PopUp>
			</Container>
		)
    }
}
