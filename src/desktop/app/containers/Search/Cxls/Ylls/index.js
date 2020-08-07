import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Drawer, Modal, Button, Icon, message, DatePicker, Input, Select, Switch } from 'antd'
import { fromJS } from 'immutable'
import { XfnIcon } from 'app/components'
import moment from 'moment'
import * as Limit from 'app/constants/Limit.js'
import { categoryTypeAll, type, business, beforejumpCxToLr, runningStateType, categoryTypeName } from 'app/containers/components/moduleConstants/common'
import {  showImg, formatNum, formatDate, formatMoney, numberTest } from 'app/utils'
import { Yysz, Fyzc, Xczc, Sfzc, Cqzc, Yywsz, Zszf, JkTzZb, Other } from './LsItem'
import { Nbzz, Sfgl, Jzcb, FpKr, Zcwjzzs, Xmft, Zjtx, Jzsy } from './CalLsItem'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as accountActions from 'app/redux/Search/account/accountUnuse.action'
import './style.less'
import EnclosurePreview from 'app/containers/components/EnclosurePreview'
import { allDownloadEnclosure } from 'app/redux/Home/All/all.action'

@immutableRenderDecorator
export default
class Ylls extends React.Component {

	constructor() {
		super()
		this.state = {
			activeKey: ['1'],
			deleteModal:false,
			tagModal: false, //标签组件的状态
			tagValue: '无标签', //标签名
			currentIdx:'',//单前操作的id
			preview:false,//预览的图片的组件状态
			rotate: 0, //旋转的角度
			page: 0,//当前预览图片的下标
			wpercent: 1,
			manageModal: false,//单笔流水核算弹窗
			carryoverModal: false,//单笔成本结转流水弹窗
			invioceModal: false,//单笔开具发票弹窗
			defineModal: false,//单笔发票认证弹窗
			jzsyModal:false,
			isSeleck: false,//是否勾选
			deleteHasFj: false,//删除的凭证中是否有附件
		}
	}

	onChangeActiveKey = () => this.setState({activeKey: this.state.activeKey.length > 0 ? [] : ['1']})

	render() {
        const {
			yllsVisible,
			dispatch,
			onClose,
			yllsState,
			editLrAccountPermission,
			panes,
			lsItemData,
			uuidList,
			showDrawer,
			refreshList,
			lryl,
			isClose,
			fromCxls,
			curItem,
			intelligentStatus,
			magenerType,
			contactsCardRange,
			categoryTypeObj,
			issuedate,
			inputValue,
			simplifyStatus,
			editPzPermission,
			reviewLrAccountPermission,
			projectList,
		} = this.props
		const {
			activeKey,
			tagValue,
			currentIdx,
			preview,
			tagModal,
			rotate,
			page,
			wpercent,
			manageModal,
			carryoverModal,
			invioceModal,
			defineModal,
			deleteModal,
			jzsyModal,
			isSeleck,
			deleteHasFj,
		} = this.state
		const modalTemp = this.props.modalTemp?this.props.modalTemp:fromJS({})
		const accountList = this.props.accountList?this.props.accountList:fromJS({})
		let deleteVcId = [], deleteYear, deleteMonth
		lsItemData && lsItemData.get('vcList') && lsItemData.get('vcList').map((u, i) => {
			deleteVcId.push(u.get('vcIndex'))
			deleteYear = u.get('year')
			deleteMonth = u.get('month')
		})
		const canCreateVc = simplifyStatus ? editPzPermission : reviewLrAccountPermission
		const getCarrayOver = (item) => {
			const waitReceiving = item.get('waitReceiving')
			const waitPaying = item.get('waitPaying')
			const makeOut = item.get('makeOut')
			const carryover = item.get('carryover')
			const certified = item.get('certified')
			const received = item.get('received')
			const receiving = item.get('receiving')
			const turnOut = item.get('turnOut')
			const payed = item.get('payed')
			const paying = item.get('paying')
			const shouldReturn = item.get('shouldReturn')
			const runningType = item.get('runningType')
			let elementList = []
			switch (paying) {
				case '1':
				case '3':
					elementList.push(
						<div key='z3' className='ylls-title-btn'>
							<Button
								type='ghost'
								className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
										manageModal:true
									})},'credit'))
								}}
								>付款
							</Button>
						</div>
					)
					break

			}

			switch (received) {
				case '1':
				case '3':
					elementList.push(
						<div key='c3' className='ylls-title-btn'>
							<Button
								type='ghost'
								className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
										manageModal:true
									})},'debit'))
								}}
								>退款
							</Button>
						</div>
					)
			}

			switch (payed) {
				case '1':
				case '3':
					elementList.push(
						<div key='d3' className='ylls-title-btn'>
							<Button
								type='ghost'
								className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
										manageModal:true
									})},'debit'))
								}}
								>退款
							</Button>
						</div>
					)

			}
			switch (receiving) {
				case '1':
				case '3':
					elementList.push(
						<div key='e3' className='ylls-title-btn'>
							<Button
								type='ghost'
								className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
										manageModal:true
									})},'debit'))
									// dispatch(cxlsActions.getBusinessPayment(item,'single'))
								}}
								>收款
							</Button>
						</div>
					)
			}
			switch (shouldReturn) {
				case '1':
				case '3':
					elementList.push(
						<div key='f3' className='ylls-title-btn'>
							<Button
								type='ghost'
								className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
										manageModal:true
									})},'credit'))
								}}
								>退
							</Button>
						</div>
					)
			}
			if(makeOut == 1) {
				elementList.push(
					<Button type='ghost' className='handle-btn' disabled={!editLrAccountPermission} onClick={() => {
					dispatch(cxlsActions.getBusinessInvioceModal(item,() => {this.setState({
						invioceModal:true
					})}))
				}}>开票</Button>)
			}
			if(
				carryover == 1
				&& runningType !== 'LX_ZZS_YKP'
				&& runningType !== 'LX_ZZS_WKP'
				&& runningType !== 'LX_ZZS_YRZ'
				&& runningType !== 'LX_ZZS_WRZ') {
				elementList.push(
					<div className='ylls-title-btn'>
						<Button
							type='ghost'
							className='handle-btn'
							disabled={!editLrAccountPermission}
							onClick={() => {
								if (categoryType === 'LB_CQZC') {
									dispatch(cxlsActions.getBusinessJzsyModal(item,() => {this.setState({
										jzsyModal:true
									})}))
								} else {
									dispatch(cxlsActions.getBusinessCarryoverModal(item,() => {this.setState({
										carryoverModal:true
									})}))
								}
							}}>结转
						</Button>
					</div>
				)
			} else if (carryover == 1 && categoryType === 'LB_CQZC' ){
				<div className='ylls-title-btn'>
					<Button
						type='ghost'
						className='handle-btn'
						disabled={!editLrAccountPermission}
						onClick={() => {
								dispatch(cxlsActions.getBusinessJzsyModal(item,() => {this.setState({
									jzsyModal:true
								})}))
						}}>结转
					</Button>
				</div>
			}
			if(certified == 1) {
				elementList.push(
					<Button type='ghost' className='handle-btn' disabled={!editLrAccountPermission} onClick={() => {
					dispatch(cxlsActions.getBusinessDefineModal(item,() => {this.setState({
						defineModal:true
					})}))
				}}>认证</Button>)
			}
			return (
				elementList
			)
		}
		const jumpCxToLr = (callBack) => beforejumpCxToLr(callBack, panes, Modal)

		const beBusiness = lsItemData.get('beBusiness')
		const runningState = lsItemData.get('runningState')
		const categoryType = lsItemData.get('categoryType')
		const parentItem = lsItemData
		const debitAmount = lsItemData.get('debitAmount')
		const creditAmount = lsItemData.get('creditAmount')
		const parentCategoryList = lsItemData.get('parentCategoryList')
		const categoryName = lsItemData.get('categoryName')?lsItemData.get('categoryName'):''
		const curCategoryTypeName = categoryTypeName[lsItemData.get('categoryType')]?categoryTypeName[lsItemData.get('categoryType')]:''
		const runningStateName = runningStateType[lsItemData.get('runningState')]?runningStateType[lsItemData.get('runningState')]:''
		const NegativeAllowed = lsItemData.get('categoryType') === 'LB_FYZC' || lsItemData.get('categoryType') === 'LB_GGFYFT'
		const uuid = lsItemData.get('parentUuid')?lsItemData.get('parentUuid'):lsItemData.get('uuid')
		const mainContain = ({
			'LB_YYSR': () => <Yysz lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_YYZC': () => <Yysz lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_FYZC': () => <Fyzc lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_XCZC': () => <Xczc lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_SFZC': () => <Sfzc lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_CQZC': () => <Cqzc lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_YYWSR': () => <Yywsz lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_YYWZC': () => <Yywsz lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_ZSKX': () => <Zszf lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_ZFKX': () => <Zszf lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_JK': () => <JkTzZb lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_TZ': () => <JkTzZb lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_ZB': () => <JkTzZb lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_ZZ': () => <Nbzz lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_ZJTX': () => <Zjtx lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_JZCB': () => <Jzcb lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_GGFYFT': () => <Xmft lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_ZCWJZZS': () => <Zcwjzzs lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_KJFP': () => <FpKr lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_FPRZ': () => <FpKr lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
			'LB_JZSY': () => <Jzsy lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />,
		}[categoryType] || (() => <Other lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />))()
		let totalCategoryName
		if (beBusiness) {
			const nameList = parentCategoryList.get(0) === '其他流水' && parentCategoryList.size >1?
				parentCategoryList.slice(1)
				:
				parentCategoryList.get(0) !== '其他流水'?
					parentCategoryList
					:[]
			if(categoryType === 'LB_ZJTX'){
				totalCategoryName = '长期资产折旧摊销'
			}else if (lsItemData.get('propertyCost') && categoryType !== 'LB_XCZC' && categoryType !== 'LB_FYZC' || lsItemData.get('assetType') && categoryType === 'LB_CQZC') {
				totalCategoryName = `${nameList.reduce((to,cur) => to+cur+'_','')}${categoryName}`
			} else if (categoryType === 'LB_JZSY') {
				totalCategoryName = '长期资产处置损益'
			} else {
				totalCategoryName = `${nameList.reduce((to,cur) => to+cur+'_','')}${categoryName}${runningStateName?'('+runningStateName+')':''}`
			}
		}  else {
			totalCategoryName = '收付管理'
		}
		const previewImgArr = lsItemData.get('enclosureList') ? lsItemData.get('enclosureList').filter(v => v.get('imageOrFile') === 'TRUE' || v.get('mimeType')=='application/pdf') : fromJS([])
		return (
			<div>
            <Drawer
				className="ylls-wrap"
                width={479}
                placement="right"
                closable={false}
                onClose={onClose}
                // visible={yllsVisible}
                visible={true}
				mask={false}
            >
				<div className="ylls-title">
					<span className="ylls-title-text">查看流水</span>
					<span onClick={onClose} className="ylls-title-icon"><Icon type="close" /></span>
				</div>
                <div className="ylls-opration-wrap">
					{
						fromCxls?
						<div key='z4' className='ylls-title-btn'>
						<Button
							type='ghost'
							className='handle-btn'
							disabled={!canCreateVc || isClose}
							onClick={() => {
								lsItemData.get('beCertificate')?
								dispatch(cxlsActions.deleteVcItemFetch(deleteYear, deleteMonth, deleteVcId, issuedate,inputValue,true,refreshList,curItem,showDrawer))
								:
								dispatch(cxlsActions.runningInsertVc(fromJS([{uuid:curItem.get('parentUuid')?curItem.get('parentUuid'):curItem.get('uuid'),flowNumber:curItem.get('flowNumber')}]), 'Business', issuedate,inputValue,true,refreshList,curItem,showDrawer))
							}}
							>{!lsItemData.get('beCertificate')?simplifyStatus?'生成凭证':'审核':simplifyStatus?'删除凭证':'反审核'}
						</Button>
					</div>:''
				}
					{
						fromCxls?
						getCarrayOver(lsItemData)
						:''
					}
					<span
						className={uuidList.some((v, i)=> (v.get('parentUuid')?v.get('parentUuid'):v.get('uuid')) === uuid && i === 0) ? 'ylls-opration-icon-disabled' : 'ylls-opration-icon'}
						onClick={() => {

							if (uuidList.some((v, i)=> (v.get('parentUuid')?v.get('parentUuid'):v.get('uuid')) === uuid && i === 0)) {
								return
							}

							const index = uuidList.findIndex(v => (v.get('parentUuid')?v.get('parentUuid'):v.get('uuid')) === uuid) -1
							dispatch(yllsActions.getYllsBusinessData(uuidList.get(index),showDrawer))
						}}
					>
						<Icon type="left-square" />
					</span>
					<span
						className={uuidList.some((v, i)=> (v.get('parentUuid')?v.get('parentUuid'):v.get('uuid')) === uuid && i === uuidList.size-1) ? 'ylls-opration-icon-disabled' : 'ylls-opration-icon'}
						onClick={() => {

							if (uuidList.some((v, i)=> (v.get('parentUuid')?v.get('parentUuid'):v.get('uuid')) === uuid && i === uuidList.size-1)) {
								return
							}

							const index = uuidList.findIndex(v => (v.get('parentUuid')?v.get('parentUuid'):v.get('uuid')) === uuid) +1
							dispatch(yllsActions.getYllsBusinessData(uuidList.get(index),showDrawer))
						}}
					>
						<Icon type="right-square" />
					</span>
					<span className={editLrAccountPermission?'ylls-opration-icon':'ylls-opration-icon-disabled'}
						onClick={() => {
						if (editLrAccountPermission) {

							onClose()

							if (!beBusiness && runningState !== 'STATE_ZZ') {
								dispatch(cxlsActions.getBusinessPayment(lsItemData, '', uuidList))
							} else {
								if (runningState === 'STATE_YYSR_JZCB') {
									jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(lsItemData, 'modify', 'LB_JZCB', uuidList)))
								} else if (runningState === 'STATE_FPRZ_CG' || runningState === 'STATE_FPRZ_TG') {
									jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(lsItemData, 'modify', 'LB_FPRZ', uuidList)))
								} else if (runningState === 'STATE_KJFP_XS' || runningState === 'STATE_KJFP_TS') {
									jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(lsItemData, 'modify', 'LB_KJFP', uuidList)))
								} else if (runningState === 'STATE_ZCWJZZS') {
									jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(lsItemData, 'modify', 'LB_ZCWJZZS', uuidList)))
								} else if (runningState === 'STATE_ZZ') {
									jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(lsItemData, 'modify', 'LB_ZZ', uuidList)))
								} else if (runningState === 'STATE_CQZC_ZJTX') {
									jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(lsItemData, 'modify', 'LB_ZJTX', uuidList)))
								} else if (runningState === 'STATE_GGFYFT') {
									jumpCxToLr(() => dispatch(cxlsActions.jumpCommonCharge(lsItemData, uuidList)))
								} else if (runningState === 'STATE_CQZC_JZSY') {
									jumpCxToLr(() => dispatch(cxlsActions.getInitLraccountJzsy(lsItemData, uuidList)))
								} else {
									dispatch(accountActions.getRunningBusinessDuty(lsItemData.get('flowNumber'), lsItemData.get('uuid'), uuidList))
								}
							}
						}
					}}>
						<XfnIcon type="sob-edit" disabled={!editLrAccountPermission} style={{fontSize:'22px',position:'relative',top:'1px'}} />
					</span>
					{
						!lryl?
						<span
							className={editLrAccountPermission && !isClose?'ylls-opration-icon':'ylls-opration-icon-disabled'}
							onClick={() => {
								if (!editLrAccountPermission || isClose)return;
								// 删除本条成功之后显示什么内容
								if (uuidList.some((v, i)=> (v.get('parentUuid')?v.get('parentUuid'):v.get('uuid')) === uuid && i === uuidList.size-1)) {
									// 最后一条关闭
									dispatch(cxlsActions.deleteSingleFlow(uuid, () =>{
										onClose()
										refreshList()
									}))
								} else {
									const index = uuidList.findIndex(v => (v.get('parentUuid')?v.get('parentUuid'):v.get('uuid')) === uuid) +1

									dispatch(cxlsActions.deleteSingleFlow(uuid, () => {
										dispatch(yllsActions.getYllsBusinessData(uuidList.get(index),() => {
											// showDrawer()
											refreshList()

										}))
									}))

								}
							}}
						>
							<XfnIcon type="sob-delete" />
						</span>:''
					}

				</div>
				<div className={'ylls-drawer-content'}>
				<ul className='ylls-item-detail'>
					<li><span>流水号：</span><span>{lsItemData.get('flowNumber')}</span></li>
					<li><span>日期：</span><span>{lsItemData.get('runningDate')}</span></li>
					<li>
					<span>类别：</span>
					<span>
						{totalCategoryName}
					</span>
					</li>
				</ul>
				{beBusiness?mainContain:<Sfgl lsItemData={lsItemData} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} />}


				<div style={{overflow:'hidden'}}>
					{(lsItemData.get('enclosureList')||[]).map((v,i) =>
						<div className='upload' key={i}>
							<div className='plus' onClick={()=>{
								if(v.get('imageOrFile')==='TRUE' || v.get('mimeType')=='application/pdf'){
									let idx=0;
									previewImgArr.forEach((w,j)=>{
										if(v.get('enclosurePath') === w.get('enclosurePath')){
											idx = j;
											return
										}
									})
									this.setState({'preview':true,rotate:0, page: idx});
								}else{
									message.warn('仅图片及PDF格式支持预览');
								}
							}}>
								<img src={showImg(v.get('imageOrFile'), v.get('fileName'))}/>
							</div>
							<div>
								<p>{v.get('fileName')}</p>
								<span>
									{v.get('size')>=1024 ? (v.get('size')/1024).toFixed(2)+'M' :v.get('size')+'kb'}
								</span>
								{/* <a href={v.get('enclosurePath')} download
									style={{display: editLrAccountPermission ? '' : 'none'}}>
									<Icon type="download" />
								</a> */}
								{/* 后端下载 */}
								{/* <a href={v.get('enclosurePath')} download
									style={{display: editLrAccountPermission ? '' : 'none'}}>
									<Icon type="download" />
								</a> */}
								<span style={{display: editLrAccountPermission ? '' : 'none'}} onClick={() => dispatch(cxlsActions.cxlsDownloadEnclosure(v.get('signedUrl'), v.get('fileName')))}>
									<Icon type="download" />
									{/* <div>下载</div> */}
								</span>
								{
									v.get('label')==='无标签'? '' :
									<span className='tag'>
										{v.get('label')}
									</span>
								}

							</div>
					</div>) }
				</div>
				<EnclosurePreview
					page={page}
					dispatch={dispatch}
					preview={preview}
					downloadPermission={editLrAccountPermission}
					previewImgArr={previewImgArr}
					downloadEnclosure={(enclosureUrl, fileName) => dispatch(allDownloadEnclosure(enclosureUrl, fileName))}
					closePreviewModal={() => this.setState({preview: false})}
					type={'ls'}
				/>
				{/* <div className='preview' style={{display: preview ? '' : 'none'}}>
					<div className='nav'>
						<button onClick={()=>this.setState({ page: this.state.page - 1,wpercent: 1,rotate:0 })}
							disabled={page === 0 ? true : false}>
							<Icon type="circle-o-left" />
							<div>上一张</div>
						</button>
						<button onClick={()=> {
							if(this.state.wpercent < 3){
								this.setState({'wpercent': (parseInt(this.state.wpercent * 100) + 20) / 100 })
							}

						}}
						disabled={this.state.wpercent === 3}>
							<Icon type="plus-circle" />
							<div>放大</div>
						</button>
						<button onClick={()=> this.setState({'rotate': this.state.rotate + 90 })}>
							<Icon type="reload" />
							<div>旋转</div>
						</button>
						<button>
							{
								!editLrAccountPermission ?
								<a>
									<Icon type="download" />
									<div>下载</div>
								</a> :
								<a href={previewImgArr.getIn([page, 'enclosurePath'])} download>
									<Icon type="download" />
									<div>下载</div>
								</a>
							}
						</button>
						<button onClick={()=> {
							if(this.state.wpercent > 0.6){
								this.setState({'wpercent': (parseInt(this.state.wpercent * 100) - 20)/100 })
							}
						}}
						disabled={this.state.wpercent === 0.6 }>
							<Icon type="minus-circle" />
							<div>缩小</div>
						</button>
						<button onClick={()=>this.setState({ page: this.state.page + 1,wpercent: 1,rotate:0 })}
							disabled={page === previewImgArr.size-1 ? true : false}>
							<Icon type="circle-o-right" />
							<div>下一张</div>
						</button>
					</div>
					<div className="img-box">
						<img src={previewImgArr.getIn([page, 'enclosurePath'])}
						style={{transform:`rotate(${rotate}deg)`,width:`${760 * wpercent}px`}}
						/>
					</div>
					<div onClick={()=>this.setState({preview:false})}><Icon type="close" /></div>
				</div> */}
			</div>
            </Drawer>
			<Modal
				visible={manageModal}
				onCancel={() => {
					this.setState({'manageModal':false})
					dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
				}}
				className='single-manager'
				title={`${magenerType === 'debit'?'收款':'付款'}核销`}
				okText='保存'
				onOk={() => {
					dispatch(cxlsActions.insertlrAccountManagerModal(()=>{
						this.setState({'manageModal':false})
						dispatch(yllsActions.getYllsBusinessData(lsItemData,showDrawer))
					},categoryTypeObj))
				}}
				>
					<div className='manager-content'>
					<div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
					<div className='manager-item'><label>日期：</label>
					<DatePicker
						allowClear={false}
						value={modalTemp.get('runningDate')?moment(modalTemp.get('runningDate')):''}
						onChange={value => {
						const date = value.format('YYYY-MM-DD')
							dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningDate'], date))
						}}
					/>
					</div>
					<div className='manager-item'>
						<label>摘要：</label>
						<Input
							value={modalTemp.get('runningAbstract')}
							onChange={(e) => {
								dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningAbstract'], e.target.value))
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>{`${magenerType === 'debit'?'收款':'付款'}金额：`}</label>
						<Input
							value={modalTemp.get('handlingAmount')}
							onChange={(e) => {
								numberTest(e,(value) => {
									dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'handlingAmount'], value))

								})
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>账户：</label>
						<Select
							// combobox
							value={modalTemp.get('accountName')}
							onChange={value => {
								const uuid = value.split(Limit.TREE_JOIN_STR)[0]
								const accountName = value.split(Limit.TREE_JOIN_STR)[1]
								dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'accountName'], value))
								dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'accountUuid'], uuid))
							}}
							>
							{accountList.getIn([0, 'childList'])?accountList.getIn([0, 'childList']).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>):[]}
						</Select>
					</div>
				</div>
			</Modal>
			<Modal
				visible={carryoverModal}
				onCancel={() => {
					this.setState({'carryoverModal':false})
					dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
				}}
				className='single-manager'
				title='成本结转'
				okText='保存'
				onOk={() => {
					dispatch(cxlsActions.insertlrAccountCarryoverModal(()=>{
						this.setState({'carryoverModal':false})
						dispatch(yllsActions.getYllsBusinessData(lsItemData,showDrawer))
					},categoryTypeObj))
				}}
			>
				<div className='manager-content'>
					<div className='manager-item'><label>日期：</label>
					<DatePicker
						allowClear={false}
						value={modalTemp.get('runningDate')?moment(modalTemp.get('runningDate')):''}
						onChange={value => {
						const date = value.format('YYYY-MM-DD')
							dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningDate'], date))
						}}
					/>
					</div>
					<div className='manager-item'>
						<label>摘要：</label>
						<Input
							value={modalTemp.get('runningAbstract')}
							onChange={(e) => {
								dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningAbstract'], e.target.value))
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>金额：</label>
						<Input
							value={modalTemp.get('carryoverAmount')}
							onChange={(e) => {
								numberTest(e,(value) => {
									dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'carryoverAmount'], value))

								})
							}}
						/>
					</div>
				</div>

			</Modal>
			<Modal
				visible={invioceModal}
				onCancel={() => {
					this.setState({'invioceModal':false})
					dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
				}}
				className='single-manager'
				title='开具发票'
				okText='保存'
				onOk={() => {
					dispatch(cxlsActions.insertlrAccountInvioceModal(()=>{
						this.setState({'invioceModal':false})
						dispatch(yllsActions.getYllsBusinessData(lsItemData,showDrawer))
					},categoryTypeObj))
				}}
			>
				<div className='manager-content'>
				<div className='manager-item'><label>日期：</label>
				<DatePicker
					allowClear={false}
					value={modalTemp.get('runningDate')?moment(modalTemp.get('runningDate')):''}
					onChange={value => {
					const date = value.format('YYYY-MM-DD')
						dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningDate'], date))
					}}
				/>
				</div>
				<div className='manager-item'>
					<label>摘要：</label>
					<Input
						value={modalTemp.get('runningAbstract')}
						onChange={(e) => {
							dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningAbstract'], e.target.value))
						}}
					/>
				</div>
			</div>
			</Modal>
			<Modal
				visible={defineModal}
				onCancel={() => {
					this.setState({'defineModal':false})
					dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
				}}
				className='single-manager'
				title='发票认证'
				okText='保存'
				onOk={() => {
					dispatch(cxlsActions.insertlrAccountInvioceDefineModal(()=>{
						this.setState({'defineModal':false})
						dispatch(yllsActions.getYllsBusinessData(lsItemData,showDrawer))
					},categoryTypeObj))
				}}
			>
				<div className='manager-content'>
				<div className='manager-item'><label>日期：</label>
				<DatePicker
					allowClear={false}
					value={modalTemp.get('runningDate')?moment(modalTemp.get('runningDate')):''}
					onChange={value => {
					const date = value.format('YYYY-MM-DD')
						dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningDate'], date))
					}}
				/>
				</div>
				<div className='manager-item'>
					<label>摘要：</label>
					<Input
						value={modalTemp.get('runningAbstract')}
						onChange={(e) => {
							dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningAbstract'], e.target.value))
						}}
					/>
				</div>
			</div>
			</Modal>
			<Modal
				visible={jzsyModal}
				onCancel={() => {
					this.setState({'jzsyModal':false})
					dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
				}}
				className='single-manager'
				title='结转损益'
				okText='保存'
				onOk={() => {
					dispatch(cxlsActions.insertlrAccountJzsyModal(()=>this.setState({'jzsyModal':false})))
				}}
			>
				<div className='manager-content'>
					<div className='manager-item'><label>日期：</label>
						<DatePicker
							allowClear={false}
							value={modalTemp.get('runningDate')?moment(modalTemp.get('runningDate')):''}
							onChange={value => {
							const date = value.format('YYYY-MM-DD')
								dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningDate'], date))
							}}
						/>
					{
						lsItemData && lsItemData.get('beProject')?
						<Switch
							className="use-unuse-style"
							style={{marginLeft:'.2rem'}}
							checked={modalTemp.get('usedProject')}
							checkedChildren={'项目'}
							onChange={() => {
								dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'usedProject'], !modalTemp.get('usedProject')))
							}}
						/>:''
					}

					</div>

					<div className='manager-item'>
						<label>摘要：</label>
						<Input
							value={modalTemp.get('runningAbstract')}
							onChange={(e) => {
								dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningAbstract'], e.target.value))
							}}
						/>
					</div>
					{
						modalTemp.get('usedProject')?
						<div className="manager-item" >
							<label>项目：</label>
							<Select
								combobox
								showSearch
								value={`${modalTemp.getIn(['projectCard','code'])?modalTemp.getIn(['projectCard','code']):''} ${modalTemp.getIn(['projectCard','name'])?modalTemp.getIn(['projectCard','name']):''}`}
								onChange={value => {
									const valueList = value.split(Limit.TREE_JOIN_STR)
									const uuid = valueList[0]
									const code = valueList[1]
									const name = valueList[2]
									dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'projectCard'], fromJS({uuid,code,name})))
								}}
								>
								{projectList && projectList.map((v, i) =>
									<Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>
										{`${v.get('code')} ${v.get('name')}`}
									</Option>
								)}
							</Select>
						</div>:''
					}


					<div className='manager-item'>
						<label>{modalTemp.get('netProfitAmount')>0?'净收益金额：':'净损失金额：'}</label>
						{modalTemp.get('netProfitAmount')>0?modalTemp.get('netProfitAmount'):modalTemp.get('lossAmount')}
					</div>
					<div className='manager-item'>
						<label>资产原值：</label>
						<Input
							value={modalTemp.getIn(['acAssets','originalAssetsAmount'])}
							onChange={(e) => {
								numberTest(e,(value) => {
									dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'acAssets','originalAssetsAmount'], value))
									dispatch(cxlsActions.calculateGainForJzsy())

								})
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>累计折旧摊销：</label>
						<Input
							value={modalTemp.getIn(['acAssets','depreciationAmount'])}
							onChange={(e) => {
								numberTest(e,(value) => {
									dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'acAssets','depreciationAmount'], value))
									dispatch(cxlsActions.calculateGainForJzsy())
								})
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>处置金额：</label>
						{curItem?formatMoney(curItem.get('amount')-curItem.get('tax')):''}
					</div>
				</div>

			</Modal>
		</div>
        )
    }
}
