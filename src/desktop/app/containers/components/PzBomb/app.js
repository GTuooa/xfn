import React from 'react'
import { connect } from 'react-redux'
import { fromJS }	from 'immutable'
import './bomb.less'

import { Modal, Button, Icon } from 'antd'
import { chineseAmount, draggable, judgePermission } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { debounce } from 'app/utils'
const voidAmount = ' '.repeat(12).split('')
import EnclosurePreview from 'app/containers/components/EnclosurePreview'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as printActions from 'app/redux/Edit/FilePrint/filePrint.actions.js'

@connect(state => state)
export default
class PzBomb extends React.Component {
	convertToStandardAmount(amount) {
		if (amount === '') {
			return voidAmount
		}
		const amountArray = parseFloat(amount).toFixed(2).replace('\.', '').replace('-', '').split('')
		while(amountArray.length < 12)
			amountArray.unshift('')
		return amountArray
	}
	componentDidMount() {//实现弹框在蒙层内的拖动
		// const pzBomb = document.getElementsByClassName('pzBomb')[0]
		// const preview = document.getElementsByClassName('preview')[0]
		// draggable(preview).init(pzBomb);
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.pzBombState !== nextprops.pzBombState|| this.props.filePrintState !== nextprops.filePrintState  || this.props.allState !== nextprops.allState || this.props.homeState !== nextprops.homeState || this.state !== nextstate
	}

	pzBombPosition(){
		const pzBomb = document.getElementsByClassName('pzBomb')[0]
		pzBomb.style.left = '0'
		pzBomb.style.right = '0'
		pzBomb.style.margin = '0 auto'
	}
	constructor() {
		super()
		this.state = {
			preview: false,//预览的图片的组件状态
			// rotate: 0, //旋转的角度
			// page: 0//当前预览图片的下标
		}
	}
	render() {
		const { dispatch, pzBombState, allState, homeState } = this.props
		const { preview } = this.state
		//查询凭证权限
		const preDetailList = homeState.getIn(['data','userInfo','pageController','QUERY_VC','preDetailList'])
		//打印权限
		const PRINT = homeState.getIn(['data', 'userInfo','pageController','QUERY_VC','preDetailList','PRINT'])
		//复制走录入凭证中增删改权限
		const fzRudvcPermission = homeState.getIn(['data','userInfo','pageController','SAVE_VC','preDetailList','RUD_VC'])
		// const PzPermissionInfo = homeState.getIn(['permissionInfo', 'Pz'])
		const sobInfo = homeState.getIn(['data', 'userInfo','sobInfo'])
		const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 : false

		const showPzBomb = allState.get('showPzBomb')
		const pzBombFrom = allState.get('pzBombFrom')
		const pzBombCallback = allState.get('pzBombCallback')
		let jvList = pzBombState.get('jvList')

		// if(jvList.size < 5){
			// jvList = jvList.insert(4,fromJS({
			// 	jvdirection: '',
			// 	jvabstract: '',
			// 	acid: '',
			// 	acfullname: '',
			// 	jvamount: '',
			// 	asslist: [],
			// 	acunitOpen: '0',
			// 	jvcount: '',
			// 	price: '',
			// 	jvunit: '',
			// 	fcStatus: '0',  //外币
			// 	fcNumber: '',
			// 	exchange: '',
			// 	standardAmount:''
			// }))
		// }

		const receivedData = pzBombState.get('receivedData')
		const vcDate = pzBombState.get('vcDate')
		const vcIndex = pzBombState.get('vcIndex')
		const year = pzBombState.get('year')
		const month = pzBombState.get('month')
		const closedBy = pzBombState.get('closedBy')
		const reviewedBy = pzBombState.get('reviewedBy')
		const createdBy = pzBombState.get('createdBy')
		const modifiedTime = pzBombState.get('modifiedTime')
		const createdTime = pzBombState.get('createdTime')
		const enclosureCountUser = pzBombState.get('enclosureCountUser')
		const debitTotal = pzBombState.getIn(['flags', 'debitTotal'])
		const creditTotal = pzBombState.getIn(['flags', 'creditTotal'])
		const debitColor = {color: debitTotal.indexOf('-') == 0 ? 'red' : 'black'}
		const creditColor = {color: creditTotal.indexOf('-') == 0 ? 'red' : 'black'}
		const amountDisplay = jvList.some(v => v.get('acunitOpen') == '1')  //确定数量核算一栏是否显示
		const currencyDisplay = jvList.some(v => v.get('fcNumber'))  //确定外币核算一栏是否显示
		const openedYear = allState.getIn(['period', 'openedyear'])
		const openedMonth = allState.getIn(['period', 'openedmonth'])
		//有没有开启附件

		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_GL') > -1 ? true : false) : true

		const enclosureList = pzBombState.get('enclosureList'); // 附件信息
		const hasFj = enclosureList.size ? true : false //是否有附件
		// let modalWidth='863px'
		// let summaryStyle={flex:2.36}
		let modalWidth='880px'
		let summaryStyle={flex:2.42}
		if((amountDisplay && !currencyDisplay) || (!amountDisplay && currencyDisplay)){
			// modalWidth = '951px'
			// summaryStyle={flex:2.86, paddingLeft: '2px'}
			modalWidth = '968px'
			summaryStyle={flex:2.92, paddingLeft: '2px'}
		}else if(amountDisplay && currencyDisplay){
			// modalWidth = '1043px'
			// summaryStyle={flex:3.36, paddingLeft: '3px'}
			modalWidth = '1058px'
			summaryStyle={flex:3.42, paddingLeft: '3px'}
		}
		const voucherIndexList = pzBombState.getIn(['flags', 'voucherIndexList'])
		const voucherIdx = pzBombState.getIn(['flags', 'voucherIdx'])
		const nextVoucherIdx = voucherIdx + 1
		const lastVoucherIdx = voucherIdx - 1

		return (
			<Modal
				visible={showPzBomb}
				width={modalWidth}
				className='pzBomb'
				maskClosable={true}
				onCancel={()=> dispatch(allActions.showPzBomb(false))}
				footer={[
					<Button key="first" type="ghost" size="large"
						disabled={voucherIndexList.size && voucherIdx == 0 ? true : false}
						onClick={() => {
							dispatch(lrpzActions.getPzVcFetch(voucherIndexList.get(0).split('_')[0], voucherIndexList.get(0).split('_')[1], 0,voucherIndexList))
							this.pzBombPosition()
						}}
						>
						<Icon type="step-backward" />
					</Button>,
					<Button key="pre" type="ghost" size="large"
						disabled={voucherIndexList.size && lastVoucherIdx != -1 ? false : true}
						onClick={() => debounce(() => {
							dispatch(lrpzActions.getPzVcFetch(voucherIndexList.get(lastVoucherIdx).split('_')[0], voucherIndexList.get(lastVoucherIdx).split('_')[1], lastVoucherIdx,voucherIndexList))
							this.pzBombPosition()
						})()}
						>
						<Icon type="caret-left" />
					</Button>,
					// <Button disabled={judgePermission(preDetailList.get('MODIFY_VC')).disabled} key="modify" type="ghost" size="large" onClick={()=>{
						//没有修改权限 外层置灰色
					<Button disabled={isRunning ? true : ( judgePermission(preDetailList.get('MODIFY_VC')).disabled )} key="modify" type="ghost" size="large" onClick={()=>{

						if (receivedData) {
							sessionStorage.setItem('enterLrpz', pzBombFrom)
							sessionStorage.setItem('lrpzHandleMode', 'modify')
							const data = {
								receivedData: receivedData.toJS(),
								changedIdx: voucherIdx,
								vcIndexList: voucherIndexList
							}
							dispatch(lrpzActions.initLrpz('getVcFetch', data))
							const haveFCNmuber = jvList.some(v => v.get('fcNumber'))
							//判断凭证是否有外币
							if (haveFCNmuber) {
								dispatch(lrpzActions.getFCListDataFetch('modify'))
							}

							dispatch(homeActions.addPageTabPane('EditPanes', 'Lrpz', 'Lrpz', '录入凭证'))
							dispatch(homeActions.addHomeTabpane('Edit', 'Lrpz', '录入凭证'))
							dispatch(allActions.showPzBomb(false))
						}
					}}>
						修改
					</Button>,
					<Button key="delete" type="ghost" size="large"
						// disabled={!PzPermissionInfo.getIn(['edit', 'permission']) || !!closedBy || !!reviewedBy}
						disabled={ judgePermission(preDetailList.get('DELETE_VC')).disabled || !!closedBy || !!reviewedBy}
						onClick={()=>{
							let message = hasFj ? '凭证中含有附件附件也将被删除,确定删除凭证吗？' : '确定删除凭证吗？'
							thirdParty.Confirm({
								message: message,
								title: "提示",
								buttonLabels: ['取消', '确定'],
								onSuccess : (result) => {
									if (result.buttonIndex === 1) {
										dispatch(lrpzActions.deletePzBombVcFetch())
									}
								},
								onFail : (err) => console.log(err)
							})
						}}
					>
						删除
					</Button>,
					<Button key="submit" type="ghost" size="large" className="three-word-btn"
						// disabled={!PzPermissionInfo.getIn(['review', 'permission']) || !!closedBy}
						// disabled={judgePermission(preDetailList.getIn(['AUDIT'])).disabled || !!closedBy}
						disabled={ (reviewedBy ? (judgePermission(preDetailList.getIn(['CANCEL_AUDIT'])).disabled) : (judgePermission(preDetailList.getIn(['AUDIT'])).disabled)) || !!closedBy}
						onClick={() => debounce(() => {
							if(reviewedBy){//反审核
								dispatch(lrpzActions.cancelReviewedJvlist(year, month, vcIndex,'PzBomb', pzBombCallback))
								return
							}
							dispatch(lrpzActions.reviewedJvlist(year, month, vcIndex,'PzBomb', pzBombCallback))
						})()}
					>
						{reviewedBy ? '反审核' : '审核'}
					</Button>,
					<Button disabled={judgePermission(fzRudvcPermission).disabled} key="copy" type="ghost" size="large"
						onClick={() => {
							let vcDate = ''
							if (!openedYear) {
								vcDate = new Date()
							} else{
								const lastDate = new Date(openedYear, openedMonth, 0)
								const currentDate = new Date()
								const currentYear = new Date().getFullYear()
								const currentMonth = new Date().getMonth() + 1
								if (lastDate < currentDate ) { //本月之前
									vcDate = lastDate
								} else if (Number(openedYear) == Number(currentYear) && Number(openedMonth) == Number(currentMonth)) { //本月
									vcDate = currentDate
								} else { //本月之后
									vcDate = new Date(openedYear, Number(openedMonth)-1, 1)
								}
							}
							sessionStorage.setItem('lrpzHandleMode', 'insert')
							dispatch(lrpzActions.initAndGetLastVcIdFetch('getLastVcIdFetch', vcDate))
							dispatch(lrpzActions.afterCopyClick(jvList))
							const haveFCNmuber = jvList.some(v => v.get('fcNumber'))
							//判断凭证是否有外币
							if (haveFCNmuber) {
								dispatch(lrpzActions.getFCListDataFetch('modify'))
							}

							dispatch(homeActions.addPageTabPane('EditPanes', 'Lrpz', 'Lrpz', '录入凭证'))
							dispatch(homeActions.addHomeTabpane('Edit', 'Lrpz', '录入凭证'))
							dispatch(allActions.showPzBomb(false))
						}}
					>
						复制
					</Button>,
					<Button key="fj" type="ghost" size="large"
						style={{display: enCanUse ? '' : 'none'}}
						disabled={ !hasFj }
						onClick={() => {
							this.setState({preview:true})
						}}
					>
						附件
					</Button>,
					<Button key="print" type="ghost" size="large"
						disabled={judgePermission(PRINT).disabled}
						onClick={() => {
							sessionStorage.setItem('fromPos', 'modal')
							dispatch(printActions.setPrintVcIndexAndDate(year,month,[vcIndex]))
							dispatch(allActions.handlePrintModalVisible(true))
						}}
					>
						打印
					</Button>,
					<Button key="next" type="ghost" size="large"
						disabled={voucherIndexList.size && nextVoucherIdx != voucherIndexList.size ? false : true}
						onClick={()=> debounce(() => {
							dispatch(lrpzActions.getPzVcFetch(voucherIndexList.get(nextVoucherIdx).split('_')[0], voucherIndexList.get(nextVoucherIdx).split('_')[1], nextVoucherIdx,voucherIndexList))
							this.pzBombPosition()
						})()}
					>
						<Icon type="caret-right" />
					</Button>,
					<Button key="last" type="ghost" size="large"
						disabled={voucherIndexList.size && nextVoucherIdx != voucherIndexList.size ? false : true}
						onClick={() => {
							dispatch(lrpzActions.getPzVcFetch(voucherIndexList.get(voucherIndexList.size-1).split('_')[0], voucherIndexList.get(voucherIndexList.size-1).split('_')[1], voucherIndexList.size-1,voucherIndexList))
							this.pzBombPosition()
						}}
					>
						<Icon type="step-forward" />
					</Button>
				]}>
				<div>
					<div className="bombTitle">
						<p className="bombTitle-center">记账凭证</p>
						<div className="bombTitle-line">
							<div>
								<span>凭证字号：记</span>
								<span> {vcIndex} </span>
								<span> 号 </span>
							</div>
							<span>
								{`凭证日期： ${vcDate}`}
							</span>
							<div>

								<span>{`附件： ${enclosureCountUser && enclosureCountUser !== '' ? enclosureCountUser : '0'} 个`}</span>
							</div>
						</div>
						<div
							className="bombTitle-account"
							style={{display: closedBy ? 'block' : (reviewedBy ? 'block': 'none')}}
							>
							{closedBy ? '已结账' : '已审核'}
						</div>
					</div>
					<div className="bombBody">
						<i className="bombBody-shadow"></i>
						<i className="bombBody-shadow summary-shadow"></i>
						<ul className="bombBody-title">
							<li>摘要</li>
							<li className='bomb-text'>会计科目</li>
							{
								amountDisplay ? <li className='fjAndWb'>数量</li> : ''
							}
							{
								currencyDisplay ? <li className='fjAndWb'>外币</li> : ''
							}
							<li className="bombBody-title-amount">
								<span>借方金额</span>
								<ul>
									{['','亿', '千', '百', '十', '万', '千', '百', '十', '元', '角', '分'].map((v, i) => <li key={i}>{v}</li>)}
								</ul>
							</li>
							<li className="bombBody-title-amount">
								<span>贷方金额</span>
								<ul>
									{['','亿', '千', '百', '十', '万', '千', '百', '十', '元', '角', '分'].map((v, i) => <li key={i}>{v}</li>)}
								</ul>
							</li>
						</ul>
						<div className='bombBody-item-wrap'>
						{jvList.map((v, i) =>{
							const acId = v.get('acid')
							const acFullName = v.get('acfullname')
							const acValue = acId ? `${acId} ${acFullName}` : ''
							let allAssValueOne = ''   //拼接所选的辅助核算
							let allAssValueTwo = ''   //拼接所选的辅助核算
							v.get('asslist').map((w, j) => {
								if(j==0){
									allAssValueOne = w.get('asscategory') + '_' + w.get('assid') + '_' + w.get('assname')
								}else if(j==1){
									allAssValueTwo = w.get('asscategory') + '_' + w.get('assid') + '_' + w.get('assname')
								}
							})
							const creditAmount= v.get('jvdirection') === 'credit' ? this.convertToStandardAmount(v.get('jvamount')) : voidAmount
							const debitAmount=v.get('jvdirection') === 'debit' ? this.convertToStandardAmount(v.get('jvamount')) : voidAmount
							const debitAmountColor = {color: v.get('jvamount').toString().indexOf('-') == 0 && v.get('jvdirection') === 'debit' ? 'red' : 'black'}
							const creditAmountColor = {color: v.get('jvamount').toString().indexOf('-') == 0 && v.get('jvdirection') === 'credit' ? 'red' : 'black'}

							return (
								<ul className="bombBody-item" key={i}>
									<li>
										<span>{v.get('jvabstract')}</span>
									</li>
									<li className='bomb-text'>
										<span>
											<span>{acValue}</span>
										</span>
										{
											allAssValueOne ?
											(	<span className="bomb-text-fzhs">
													<span>{'辅:' + allAssValueOne}</span>
												</span>
											) : ''
										}
										{
											allAssValueTwo ?
											(	<span className="bomb-text-fzhs">
													<span>{'辅:' + allAssValueTwo}</span>
												</span>
											) : ''
										}
									</li>
									{
										amountDisplay ?
										(	<li className='bomb-text fjAndWb'>
											{ v.get('acunitOpen')=='1' ?
												<span>数量：{v.get('jvcount')} {v.get('jvunit')}
												</span> : ''
											}
											{ v.get('acunitOpen')=='1' ?
												<span>单价：{v.get('price')}</span>
												: ''
											}
											</li>
										) : ''
									}
									{
										currencyDisplay ?
										(	<li className='bomb-text fjAndWb' style={{width: '50px'}}>
											{ v.get('fcNumber') ?
												<span>原币：{v.get('standardAmount')}</span> : ''
											}
											{ v.get('fcNumber') ?
												<span>{v.get('fcNumber')}：{v.get('exchange')}</span> : ''
											}
											</li>
										) : ''
									}
									<li className="bombBody-title-amount">
										<ul>
											{debitAmount.map((v, i) => <li key={i} style={debitAmountColor}>{v}</li>)}
										</ul>
									</li>
									<li className="bombBody-title-amount">
										<ul>
											{creditAmount.map((v, i) => <li key={i} style={creditAmountColor}>{v}</li>)}
										</ul>
									</li>
								</ul>
							)
						})}
						</div>
						<ul className="bombBody-summary">
							<li style={summaryStyle}>合计：{ chineseAmount(debitTotal) }</li>
							<li className="bombBody-title-amount">
								<ul className='summary-amount'>
									{this.convertToStandardAmount(debitTotal).map((v, i) => <li key={i} style={debitColor}>{v}</li>)}
								</ul>
							</li>
							<li className="bombBody-title-amount">
								<ul className='summary-amount'>
									{this.convertToStandardAmount(creditTotal).map((v, i) => <li key={i} style={creditColor}>{v}</li>)}
								</ul>
							</li>
						</ul>
					</div>
					<div className='bombFooter'>
						<span>制单人： {createdBy}</span>
						<span>修改时间： {modifiedTime}</span>
						<span>录入时间： {createdTime}</span>
					</div>
				</div>
				<EnclosurePreview
					page={0}
					dispatch={dispatch}
					preview={preview}
					// downloadPermission={PzPermissionInfo.getIn(['edit', 'permission'])}
					downloadPermission={true}
					downloadEnclosure={(enclosureUrl, fileName) => dispatch(allActions.allDownloadEnclosure(enclosureUrl, fileName))}
					previewImgArr={enclosureList}
					closePreviewModal={() => this.setState({preview:false})}
				/>
				{/* <div className='preview' style={{display: preview ? '' : 'none'}}>
					<div className='nav'>
						<button onClick={()=>this.setState({ page: this.state.page - 1 })}
							disabled={page === 0 ? true : false}>
							<Icon type="circle-o-left" />
							<div>上一张</div>
						</button>
						<button onClick={()=> this.setState({'rotate': this.state.rotate + 90 })}>
							<Icon type="reload" />
							<div>旋转</div>
						</button>
						<button disabled={ !PzPermissionInfo.getIn(['edit', 'review']) } >
							{
								!PzPermissionInfo.getIn(['edit', 'review']) ?
								<a>
									<Icon type="download" />
									<div>下载</div>
								</a> :
								<a href={enclosureList.getIn([page, 'enclosurepath'])} download>
									<Icon type="download" />
									<div>下载</div>
								</a>
							}
						</button>
						<button onClick={()=>this.setState({ page: this.state.page + 1 })}
							disabled={page === enclosureList.size-1 ? true : false}>
							<Icon type="circle-o-right" />
							<div>下一张</div>
						</button>
					</div>
					{
						enclosureList.getIn([page,'imageOrFile'])==='TRUE' ?
						<img src={enclosureList.getIn([page, 'enclosurepath'])} style={{transform:`rotate(${rotate}deg)`}}/> :
						<div className='noSupport'>
							<Icon type="file" />
							<p>暂不支持预览此类型的文件</p>
						</div>
					}
					<div onClick={()=>this.setState({preview:false})}><Icon type="close" /></div>
				</div> */}
			</Modal>
		)
	}
}
