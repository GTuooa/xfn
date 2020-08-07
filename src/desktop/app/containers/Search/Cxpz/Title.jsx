import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as cxpzActions from 'app/redux/Search/Cxpz/cxpz.action.js'
import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

import { ROOT } from 'app/constants/fetch.constant.js'
import { ImportModal, ExportModal } from 'app/components'
import { Button, Menu, Dropdown, Icon, Select, Input, Modal, Checkbox, Tooltip } from 'antd'
import {message as msg} from 'antd'
import { fromJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'
import { debounce, judgePermission } from 'app/utils'
import PageSwitch from 'app/containers/components/PageSwitch'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import * as printActions from 'app/redux/Edit/FilePrint/filePrint.actions.js'

@immutableRenderDecorator
export default
class Title extends React.Component {
	constructor() {
		super()
		this.state = {
			deleteModal: false, //标签组件的状态
			isSeleck:false,//是否勾选
			deleteHasFj: false,//删除的凭证中是否有附件
			trasnferDraftModal:false
		}
	}

	render() {

		const { deleteModal, isSeleck, deleteHasFj,trasnferDraftModal } = this.state

		const {
			issuedate,
			allState,
			onChange,
			onMaskClick,
			issues,
			dispatch,
			vclist,
			cxpzState,
			closeby,
			year,
			month,
			firstyear,
			havVc,
			vclistExist,
			PzPermissionInfo,
			SAVE_VC,
			preDetailList,
			sortByTime,
			sortByIndex,
			sortByReviewed,
			receiveAble,
			cancelReceiveAble,
			inputValue,
			changeInputValue,
			changeSearchValue,
			vcindexSort,
			vcdateSort,
			enCanUse,
			currentPage,
			pageSize,
			sortTime,
			sortIndex,
			isSpread,
			pageList,
			URL_POSTFIX,
			isPlay,
			searchType,
			changeSearchStr,
			clearInputValue,
			intelligentStatus,
			refreshCxpzCallBack,
			PRINT,
			clearSearchInput
		} = this.props

		const showMessageMask = cxpzState.getIn(['flags','showMessageMask'])
		const iframeload = cxpzState.getIn(['flags','iframeload'])
		const importresponlist = cxpzState.get('importresponlist')
		const failJsonList = importresponlist.get('failJsonList')
		const successJsonList = importresponlist.get('successJsonList')
		const mediaId = importresponlist.get('mediaId')
		const message = cxpzState.get('message')
		const havFj=vclist.some(v => v.get('enclosurecount'))
		const importProgressInfo = cxpzState.get('importProgressInfo')
		// //录入权限列表 增删改权限
		const RUD_VC = SAVE_VC ? SAVE_VC.getIn(['preDetailList', 'RUD_VC']) : ''
		// const sortPermission = PzPermissionInfo.getIn(['arrange', 'permission']) && !closeby && vclist.size !== 0
		const sortPermission = !judgePermission(preDetailList.get('FULL_FINISHING')).disabled && !closeby && vclist.size !== 0
		// console.log(preDetailList.getIn(['MODIFY_VC', 'detailList', 'BATCH_TRANSFER_DRAFT','display']))
		
		const arrange = (
			<Menu>
				<Menu.Item key='1' disabled={!sortPermission}>
					<span className="setting-common-ant-dropdown-menu-item" onClick={() => {
						if (sortPermission) {
							sessionStorage.setItem('sort', '1')
							dispatch(cxpzActions.getSortVcFetch(issuedate))
							clearInputValue()
						}
					}}>按凭证号顺次前移补齐断号</span>
				</Menu.Item>
				<Menu.Item key='2' disabled={!sortPermission}>
					<span className="setting-common-ant-dropdown-menu-item" onClick={() => {
						if (sortPermission) {
							sessionStorage.setItem('sort', '2')
							dispatch(cxpzActions.getSortVcFetch(issuedate))
							clearInputValue()
						}
					}}>按凭证日期重新顺次编号</span>
				</Menu.Item>
			</Menu>
		)

		const tip = (
			<div>
				<div>查询凭证 > Excel导入</div>
				<div>1.下载模版 > 2.导入Excel > 3.导入完毕</div>
				<div className="import-mask-tip">温馨提示</div>
				<div>请下载统一的模版，并按相应的格式在Excel软件中填写您的业务数据，然后再导入到系统中(系统将自动读取Excel中的第一个sheet作为导入数据)；</div>
				<div>单次导入最大分录数限定为3500条，不足时按最后一张完整凭证划分。</div>
				{/* <div className="onload"><a href={`${ROOT}/excel/export/model?network=wifi&source=desktop&exportmodel=vcmodel`}>1.下载模版</a></div> */}
				<div className="onload"><a href={`${ROOT}/excel/export/model?${URL_POSTFIX}&exportmodel=vcmodel`}>1.下载模版</a></div>
			</div>
		)

		const jvyear = issuedate.substr(0, 4)
		const jvmonth = issuedate.substr(6, 2)
		const selectVc = vclist.filter(v => v.get('checkboxDisplay'))
		const vcIndexList = selectVc.map(v => v.get('vcindex'))
		// const vcIndexurl = vcIndexList.reduce((v, pre) => pre + '&vcIndex=' + v)
		const vcIndexurl = vcIndexList.size>0?vcIndexList.reduce((v, pre) => pre + '&vcIndex=' + v):''
		// console.log(!judgePermission(preDetailList.getIn(['MODIFY_VC', 'detailList', 'BATCH_TRANSFER_DRAFT'])).disabled)

		const searchTypeStr = [
			{
				value: 'PROPERTY_ZONGHE',
				key: '综合'
			},
			{
				value: 'PROPERTY_ABSTRACT',
				key: '摘要'
			},
			{
				value: 'PROPERTY_AC',
				key: '科目'
			},
			{
				value: 'PROPERTY_AMOUNT',
				key: '金额'
			},
			{
				value: 'PROPERTY_MAKER',
				key: '制单人'
			}
		]

		const searchStr = ({
			'PROPERTY_ZONGHE': () => '综合',
			'PROPERTY_ABSTRACT': () => '摘要',
			'PROPERTY_AC': () => '科目',
			'PROPERTY_AMOUNT': () => '金额',
			'PROPERTY_MAKER': () => '制单人'
		}[searchType])()
		// console.log(judgePermission(preDetailList.getIn(['MODIFY_VC', 'detailList', 'BATCH_TRANSFER_DRAFT'])).disabled);
		

		return (
			<FlexTitle>
				<div className="flex-title-left">
					{isSpread || pageList.getIn(['Search','pageList']).size <= 1 ? '' :
						<PageSwitch
							pageItem={pageList.get('Search')}
							onClick={(page, name, key) => {
								dispatch(homeActions.addPageTabPane('SearchPanes', key, key, name))
								dispatch(homeActions.addHomeTabpane(page, key, name))
							}}
						/>
					}
					<Select
						className="title-date"
						value={issuedate}
						onChange={onChange}
						disabled={havVc ? false : true}
						>
						{issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
					</Select>
					<span className="cxpz-filter">
						<Select
							style={{width: 74}}
							className="cxpz-filter-type-choose"
							// combobox
							defaultValue="综合"
							value={searchStr}
							onChange={value =>{
								changeSearchStr(value)
							}}
							onSelect={value => {
								changeSearchStr(value)
							}}
						>
							{searchTypeStr.map((v, i) => <Option key={v.key} value={v.value}>{v.key}</Option>)}
						</Select>
						{
							inputValue ?
							<Icon
								className="normal-search-delete" type="close-circle" theme='filled'
								onClick={() => {
									changeSearchValue('')
									changeInputValue('')
									dispatch(cxpzActions.notSelectVcAll())
								}}
							/> : null
						}
						<Icon className="cxpz-filter-icon" type="search"
							onClick={() => debounce(() => {
								changeSearchValue(inputValue)
								dispatch(cxpzActions.notSelectVcAll())
							})()}
						/>
						<Input placeholder="搜索凭证"
							className="cxpz-filter-input"
							value={inputValue}
							onChange={e => changeInputValue(e.target.value)}
							onKeyDown={(e) => {
								if (e.keyCode == Limit.ENTER_KEY_CODE){
									changeSearchValue(inputValue)
									dispatch(cxpzActions.notSelectVcAll())
								}
							}}
						/>
					</span>
				</div>
				<div className="flex-title-right title-margin">
					<Button
						className="title-right four-word-btn"
						type="ghost"
						// disabled={ havFj ? false : true }
						disabled={judgePermission(preDetailList.get('ATTACHMENT_MANAGER')).disabled}
						style={{display: enCanUse ? '' : 'none'}}
						onClick={() => {
								dispatch(homeActions.addPageTabPane('SearchPanes', 'Fjgl', 'Fjgl', '附件管理'))
								dispatch(homeActions.addHomeTabpane('Search', 'Fjgl', '附件管理'))
								dispatch(cxpzActions.setFjglData())
						}}
					>
						凭证附件
					</Button>
					<Button
						className="title-right"
						type="ghost"
						// disabled={!PzPermissionInfo.getIn(['review', 'permission']) || !vclist.some(v => v.get('checkboxDisplay')) || !!closeby || receiveAble}
						disabled={ judgePermission(preDetailList.getIn(['AUDIT','detailList','BATCH_AUDIT'])).disabled || !vclist.some(v => v.get('checkboxDisplay')) || !!closeby || receiveAble}
						style={{display: intelligentStatus ? 'none' : ''}} // 智能版不显示
						onClick={() => {
							if ( !judgePermission(preDetailList.getIn(['AUDIT','detailList','BATCH_AUDIT'])).disabled) {
								dispatch(cxpzActions.batchVcReviewed(issuedate,{ currentPage:currentPage, pageSize, sortTime, sortIndex, sortReviewed:sortByReviewed, condition:{condition: inputValue, conditionType: searchType}}))
							}else{
								msg.info('当前角色无该请求权限')
							}
						}}
						>
						审核
					</Button>
					<Tooltip title={ (!judgePermission(PRINT.getIn(['detailList', 'BATCH_PRINT_AND_EXPORT_PDF'])).disabled) && !vclist.some(v => v.get('checkboxDisplay')) ?'需选择凭证':''}>
						<Button
							className="title-right"
							type="ghost"
							onClick={() => {
								const vcindexlist = vclist.filter(v => v.get('checkboxDisplay')).map(v => v.get('vcindex'))
								sessionStorage.setItem('fromPos', 'cxpz')
								dispatch(allActions.handlePrintModalVisible(true))
								dispatch(printActions.setPrintVcIndexAndDate(issuedate.substr(0,4),issuedate.substr(6,2),vcindexlist))
							}}
							disabled={ judgePermission(PRINT.getIn(['detailList', 'BATCH_PRINT_AND_EXPORT_PDF'])).disabled || !vclist.some(v => v.get('checkboxDisplay')) }
						>
							打印
						</Button>
					</Tooltip>
					<Button
						className="title-right"
						type="ghost"
						style={{display: intelligentStatus ? 'none' : ''}} // 智能版不显示
						// disabled={!PzPermissionInfo.getIn(['edit', 'permission'])}
						//新增凭证 走 录入流水 数据权限中的增删改权限
						disabled={judgePermission(RUD_VC).disabled}
						onClick={() => {
							sessionStorage.setItem("lrpzHandleMode", "insert")

							let vcdate = ''
							const now = new Date()
							const nowYear = now.getFullYear()
							const nowMonth = now.getMonth() + 1

							const issyear = issuedate.substr(0, 4)
							const issmonth = issuedate.substr(6, 2)

							if (!year) { // openedyear为空，按道理已经没有这种情况
								vcdate = new Date()
							} else if (closeby) { // 本期已结账的取未结账第一期的第一天或最后一天或今天
								// vcdate = new Date(year, month, 0)
								const lastDate = new Date(year, month, 0)
								if (lastDate < now) {   //本月之前
									vcdate = lastDate
								} else if (Number(year) == Number(nowYear) && Number(month) == Number(nowMonth)) {  //本月
									vcdate = now
								} else {   //本月之后
									vcdate = new Date(year, Number(month)-1, 1)
								}
							} else { // 本月未结账 取本月的第一天或最后一天或今天
								vcdate = new Date(issyear, issmonth, 0)

								const lastDate = new Date(issyear, issmonth, 0)
								if (lastDate < now) {   //本月之前
									vcdate = lastDate
								} else if (Number(issyear) == Number(nowYear) && Number(issmonth) == Number(nowMonth)) {  //本月
									vcdate = now
								} else {   //本月之后
									vcdate = new Date(issyear, Number(issmonth)-1, 1)
								}
							}
							dispatch(lrpzActions.initAndGetLastVcIdFetch('initAndGetLastVcIdFetch',vcdate))
							dispatch(homeActions.addPageTabPane('EditPanes', 'Lrpz', 'Lrpz', '录入凭证'))
							dispatch(homeActions.addHomeTabpane('Edit', 'Lrpz', '录入凭证'))
							// dispatch(homeActions.addTabpane('Lrpz'))
						}}>
						新增
					</Button>
					<Button
						className="title-right"
						type="ghost"
						style={{display: intelligentStatus ? 'none' : ''}} // 智能版不显示
						onClick={()=>{
							const has = vclist.filter(v => v.get('checkboxDisplay')).some(v => v.get('enclosurecount'))
							this.setState({'deleteModal':true, deleteHasFj: has})
						}}
						//disabled={!PzPermissionInfo.getIn(['edit', 'permission']) || !vclist.some(v => v.get('checkboxDisplay')) || vclist.every(v => v.get('checkboxDisplay') ? v.get('reviewedby') : true) || closeby}
						disabled={(judgePermission(preDetailList.getIn(['DELETE_VC','detailList','BATCH_DELETE'])).disabled) || !vclist.some(v => v.get('checkboxDisplay')) || vclist.every(v => v.get('checkboxDisplay') ? v.get('reviewedby') : true) || closeby}
						>
						删除
					</Button>
					<span className="title-right title-dropdown" style={{display: intelligentStatus ? 'none' : ''}}>
						<Dropdown overlay={arrange} disabled={!sortPermission}>
							<span style={{color: sortPermission ? '#222' : '#ccc'}}>整理 <Icon className="title-dropdown-icon" type="down"/></span>
						</Dropdown>
					</span>
					<ImportModal
						tip={tip}
						message={message}
						dispatch={dispatch}
						exportDisable={!PzPermissionInfo.getIn(['edit', 'permission']) || isPlay}
						iframeload={iframeload}
						// iframeName='vciframe'
						alertStr="请选择要导入的凭证文件"
						failJsonList={failJsonList}
						showMessageMask={showMessageMask}
						successJsonList={successJsonList}
						actionPath={`${ROOT}/excel/import/vc?${URL_POSTFIX}`}
						beforCallback={() => dispatch(cxpzActions.beforeVcImport())}
						closeCallback={() => dispatch(cxpzActions.closeVcImportContent())}
						// afterCallback={(value) => dispatch(cxpzActions.afterVcImport(value))}
						onSubmitCallBack={(from,openModal) => dispatch(cxpzActions.getFileUploadFetch(from,openModal, () => clearSearchInput()))}
						mediaId={mediaId}
						ddImportCallBack={value => dispatch(allActions.allExportReceiverlist(value, 'pzsendFailExcel', {mediaId: mediaId}))}
						importHaveProgress = {true}
						importProgressInfo = {importProgressInfo}
						clearProgress = {() => {
							dispatch(cxpzActions.changeMessageMask())
						}}
						errorSize = {importProgressInfo.get('failList').size > 0 ? true : false}
						errorUrl = {`${ROOT}/excel/import/vc/error?accessToken=${importProgressInfo.get('accessToken')}`}

						>
						<Menu.Item key='2' disabled={!vclistExist || judgePermission(preDetailList.get('BATCH_EXPORT_EXCEL')).disabled || isPlay}>
							<ExportModal
								title="导出为Excel"
								// hrefUrl={`${ROOT}/excel/export?network=wifi&source=desktop&export=vc&year=${issuedate ? issuedate.substr(0,4) : ''}&month=${issuedate ? issuedate.substr(6,2) : ''}`}
								hrefUrl={`${ROOT}/excel/export?${URL_POSTFIX}&export=vc&year=${issuedate ? issuedate.substr(0,4) : ''}&month=${issuedate ? issuedate.substr(6,2) : ''}&action=QUERY_VC-BATCH_EXPORT_EXCEL`}
								//无权限置灰色
								exportDisable={!vclistExist || judgePermission(preDetailList.get('BATCH_EXPORT_EXCEL')).disabled || isPlay}
								ddCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'excelsend', {year: jvyear, month: jvmonth, 'exportModel':'vc', action: 'QUERY_VC-BATCH_EXPORT_EXCEL'}))}
								showHelpCenter={true}
								intelligentStatus={intelligentStatus}
								>
								导出为Excel
							</ExportModal>
						</Menu.Item>
						{/* <Menu.Item key='3' disabled={!vclist.some(v => v.get('checkboxDisplay')) || isPlay}> */}
						<Menu.Item key='3' disabled={judgePermission(preDetailList.getIn(['PRINT','detailList','BATCH_PRINT_AND_EXPORT_PDF'])).disabled || isPlay}>
							<ExportModal
								title="导出为PDF"
								type="cxpzPDF"
								// hrefUrl={`${ROOT}/pdf/export?network=wifi&source=desktop&year=${jvyear}&month=${jvmonth}&vcIndex=${vcIndexurl}`}
								// hrefUrl={`${ROOT}/pdf/export?${URL_POSTFIX}&year=${jvyear}&month=${jvmonth}&vcIndex=${vcIndexurl}`}
								// exportDisable={!PzPermissionInfo.getIn(['edit', 'permission']) || !vclist.some(v => v.get('checkboxDisplay'))}
								// exportDisable={!vclist.some(v => v.get('checkboxDisplay')) || isPlay}
								hrefUrl={`${ROOT}/pdf/export?${URL_POSTFIX}&year=${jvyear}&month=${jvmonth}${vcIndexurl?'&vcIndex='+vcIndexurl:''}`}
								exportDisable={judgePermission(preDetailList.getIn(['PRINT','detailList','BATCH_PRINT_AND_EXPORT_PDF'])).disabled || isPlay}
								// ddCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'cxpzpdfexport', {year: jvyear, month: jvmonth, vcIndexList}))}
								ddCallback={(value) => {
									if( !judgePermission(preDetailList.getIn(['PRINT','detailList','BATCH_PRINT_AND_EXPORT_PDF'])).disabled ){
										dispatch(allActions.allExportReceiverlist(value, 'cxpzpdfexport', {year: jvyear, month: jvmonth, vcIndexList}))
									}else{
										message.info('当前角色无该请求权限')
									}
								}}
								cxpzPDFddCallback={
									intelligentStatus?
									(resultlist, needA4, needCreatedby, needReviewedBy,reviewedBy) => {
										dispatch(allActions.allExportReceiverlist(resultlist, 'cxpzpdfexport', {year: jvyear, month: jvmonth, vcIndexList:[], needA4, needCreatedby, needReviewedBy,reviewedBy}))
									}
									:
									(resultlist, needA4, needCreatedby, needAss) => dispatch(allActions.allExportReceiverlist(resultlist, 'cxpzpdfexport', {year: jvyear, month: jvmonth, vcIndexList:[], needA4, needCreatedby, needAss}))
								}
								// cxpzPDFddCallback={}
								showHelpCenter={true}
								intelligentStatus={intelligentStatus}
								>
								导出为PDF
							</ExportModal>
						</Menu.Item>
						<Menu.Item
							key='4'
							style={{display: intelligentStatus ? 'none' : ''}} // 智能版不显示
							// disabled={!PzPermissionInfo.getIn(['review', 'permission']) || !vclist.some(v => v.get('checkboxDisplay')) || !!closeby || !cancelReceiveAble}
							disabled={judgePermission(preDetailList.getIn(['CANCEL_AUDIT','detailList','BATCH_CANCEL_AUDIT'])).disabled || !vclist.some(v => v.get('checkboxDisplay')) || !!closeby || !cancelReceiveAble}
						>
							<span
								className="export-button-text setting-common-ant-dropdown-menu-item"
								style={{color: (!judgePermission(preDetailList.getIn(['CANCEL_AUDIT','detailList','BATCH_CANCEL_AUDIT'])).disabled) && vclist.some(v => v.get('checkboxDisplay')) && !closeby && cancelReceiveAble ? '#222' : '#ccc'}}
								onClick={() => {
									// if ( (!judgePermission(preDetailList.getIn(['CANCEL_AUDIT','detailList','BATCH_CANCEL_AUDIT'])).disabled) && !closeby && cancelReceiveAble) {
									if (  !closeby && cancelReceiveAble) {
										dispatch(cxpzActions.cancelBatchVcReviewed(issuedate, {currentPage, pageSize, sortTime, sortIndex, sortReviewed:sortByReviewed, condition:{condition: inputValue, conditionType: searchType}}))
									}
								}}
							>反审核</span>
						</Menu.Item>
						<Menu.Item
							key='5'
							style={{display: intelligentStatus ? 'none' : ''}} // 智能版不显示
							// disabled={!vclist.some(v => v.get('checkboxDisplay')) }
							disabled={ judgePermission(preDetailList.getIn(['MODIFY_VC', 'detailList', 'BATCH_TRANSFER_DRAFT'])).disabled || !vclist.some(v => v.get('checkboxDisplay'))}
						>
							<span
								className="export-button-text setting-common-ant-dropdown-menu-item"
								style={{ color: (!judgePermission(preDetailList.getIn(['MODIFY_VC', 'detailList', 'BATCH_TRANSFER_DRAFT'])).disabled) && vclist.some(v => v.get('checkboxDisplay')) ? '#222' : '#ccc' }}
								onClick={() => {
									if ((!judgePermission(preDetailList.getIn(['MODIFY_VC', 'detailList', 'BATCH_TRANSFER_DRAFT'])).disabled) && vclist.some(v => v.get('checkboxDisplay'))) {
										this.setState({ trasnferDraftModal: true })
									} 
								}}
							>一键转入草稿</span>
						</Menu.Item>
					</ImportModal>
					<Button
						className="title-right"
						type="ghost"
						onClick={() => debounce(() => {
							dispatch(allActions.freshSearchPage('查询凭证'))
							// dispatch(cxpzActions.getPeriodAndVcListFetch(issuedate, {currentPage:'1', pageSize, sortTime:sortByTime, sortIndex:sortByIndex, sortReviewed:sortByReviewed, condition:{condition: inputValue, conditionType: searchType}}))
							dispatch(cxpzActions.getPeriodAndVcListFetch(issuedate, {currentPage:'1', pageSize, sortTime:sortByTime, sortIndex:sortByIndex, sortReviewed:sortByReviewed, condition:{condition: inputValue, conditionType: searchType}, getPeriod:'true'}))
						})()}
						>
						刷新
					</Button>
					<div
						className="pcxpz-account"
						style={{display: closeby ? 'block' : 'none'}}
						>
						已结账
					</div>
				</div>
				<Modal ref="modal"
					visible={deleteModal}
					title="提示"
					onCancel={()=>this.setState({'deleteModal':false})}
					footer={[
						<Button key="back" type="ghost" size="large" onClick={()=>this.setState({'deleteModal':false})}>
							取消
						</Button>,
						<Button key="submit" type="primary" size="large" disabled={deleteHasFj ? !isSeleck : false}
							onClick={()=>{
								this.setState({'deleteModal':false,'isSeleck':false});
								dispatch(cxpzActions.deleteVcItemFetch(cxpzState, refreshCxpzCallBack))
							}}>
							确定
						</Button>
					]}>
					<Checkbox checked={isSeleck}
						style={{display: deleteHasFj ? '' : 'none'}}
						onChange={()=>this.setState({'isSeleck':!isSeleck})}/>
						<span style={{'marginRight': '10px',display: deleteHasFj ? '' : 'none'}}>
							凭证中含有附件附件也将被删除
						</span>
						<p style={{display: deleteHasFj ? 'none' : ''}}>确定删除凭证吗？</p>
				</Modal>
				<Modal
					visible={trasnferDraftModal}
					title='一键转入草稿'
					onCancel={()=>this.setState({trasnferDraftModal:false})}
					footer={[
						<div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between'}}>
							<div>
								<a style={{textDecoration: 'underline'}} target="_blank" href='https://www.xfannix.com/support/desktop/app/index.html?id=8.5#/sysc'>
									帮助中心
								</a>
							</div>
							<div>
								<Button key="back" type="ghost" size="large" onClick={()=>this.setState({trasnferDraftModal:false})}>
									取消
								</Button>
								<Button key="submit" type="primary" size="large" disabled={deleteHasFj ? !isSeleck : false}
									onClick={()=>{
										this.setState({ trasnferDraftModal: false })
										dispatch(cxpzActions.transferDraftPz(vclist.filter(v => v.get('checkboxDisplay')),SAVE_VC))
									}}>
									确定转入
								</Button>
							</div>
						</div>
					]}
				>
					<p>用于修改辅助核算：剥离原辅助核算项目；</p>
					<p>用于修改科目架构：科目所有数据转入后可修改。</p>
					<br/>
					<p style={{color:'red'}}>点击确认后，凭证将失去辅助核算信息！</p>
				</Modal>
			</FlexTitle>
		)
	}
}
