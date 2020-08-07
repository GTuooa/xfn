import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS, Map }	from 'immutable'
import * as assetsYebActions from 'app/redux/Yeb/AssetsYeb/assetsYeb.action.js'
import { Container, Row, ScrollView, Icon, Amount, SinglePicker } from 'app/components'
import thirdParty from 'app/thirdParty'
import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'
import { TopMonthPicker } from 'app/containers/components'
import * as Limit from 'app/constants/Limit.js'
import './detailassets.less'
import '../Kmmxb/mxb.less'
import * as allActions from 'app/redux/Home/All/other.action'

@connect(state => state)
export default
class AssetsMxb extends React.Component {
	scrollerHeight = 0//滚动容器的高度

	componentDidMount() {
		thirdParty.setTitle({title: '资产明细表'})
		thirdParty.setIcon({
            showIcon: false
		})
		
		const scrollViewHtml = document.getElementsByClassName('scroll-view')[0]
        this.scrollerHeight = parseFloat(window.getComputedStyle(scrollViewHtml).height)
	}
	render() {
		const {
			dispatch,
            allState,
            assetsYebState,
			history
		} = this.props

		const issues = allState.get('issues')
		const issuedate = assetsYebState.get('issuedate')
		const endissuedate = assetsYebState.get('endissuedate')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)
		const detailMx = assetsYebState.get('detailMx')
		const detailMxList = detailMx.get('cardList') ? detailMx.get('cardList') : fromJS([])
		const detailassetslist = assetsYebState.get('detailassetslist')
		const receivedetailMx = detailassetslist ? detailassetslist.toJS() : []
		// 获取到资产和辅助类别
		const assetsClass = assetsYebState.get('assetsClass')
		const classification = assetsYebState.get('classification')

		const serialNumber = assetsClass.get('serialNumber')
		const serialName = assetsClass.get('serialName')

		const assetsClassInfo = serialNumber + '_' + serialName
		const classSerialNumber = classification.get('serialNumber')

		const currentPage = assetsYebState.get('currentPage')

		// 可选的固定资产类别
		const assetsSelectList = detailassetslist.filter(v => v.get('serialNumber').length === 1)
											.map(v => {return { value : v.get('serialNumber') + '_' + v.get('serialName'), key: v.get('serialNumber') + '_' + v.get('serialName')}})


		// 可选的辅助类别
		const classSelectList = detailassetslist.filter(v => v.get('serialNumber').indexOf(serialNumber.substr(0, 1)) === 0 && v.get('serialNumber').length === 3)
											.map(v => {return { value : v.get('serialNumber') + '_' + v.get('serialName'), key: v.get('serialNumber') + '_' + v.get('serialName')}})
											.push({value : '全部' + '_' + '', key: '全部'})

		// export
		const end = endissuedate ? endissuedate : issuedate
		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('excelAssertSub', {begin: `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`, end: `${end.substr(0,4)}${end.substr(5,2)}`}))

		const ddPDFCallback = () => dispatch => dispatch(allActions.allExportDo('pdfAssertSub', {begin: `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`, end: `${end.substr(0,4)}${end.substr(5,2)}`}))


		dispatch(allActions.navigationSetMenu('lrb', ddPDFCallback, ddExcelCallback))

		return (
			<Container className="mxb">
				<TopMonthPicker
					issuedate={issuedate}
					source={issues} //默认显示日期
					callback={(value) => {
						if(classification.get('serialNumber')){
							dispatch(assetsYebActions.getDetailListSingle(classification.get('serialNumber'),classification.get('serialName'),'',value, endissuedate))
						}else{
							dispatch(assetsYebActions.getDetailListSingle(serialNumber,serialName,'',value, endissuedate))
						}
					}}
                    onOk={(result) => {
						if(classification.get('serialNumber')){
							dispatch(assetsYebActions.getDetailListSingle(classification.get('serialNumber'),classification.get('serialName'),'',result.value,endissuedate))
						}else{
							dispatch(assetsYebActions.getDetailListSingle(serialNumber,serialName,'',result.value,endissuedate))
						}
					}}
					showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
						if(classification.get('serialNumber')){
							dispatch(assetsYebActions.getDetailListSingle(classification.get('serialNumber'),classification.get('serialName'),'',result.value,endissuedate))
						}else{
							dispatch(assetsYebActions.getDetailListSingle(serialNumber,serialName,'',result.value,endissuedate))
						}
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						if(classification.get('serialNumber')){
							dispatch(assetsYebActions.getDetailListSingle(classification.get('serialNumber'),classification.get('serialName'),'',issuedate,result.value))
						}else{
							dispatch(assetsYebActions.getDetailListSingle(serialNumber,serialName,'',issuedate,result.value))
						}
					}}
					changeEndToBegin={()=>{
						if(classification.get('serialNumber')){
							dispatch(assetsYebActions.getDetailListSingle(classification.get('serialNumber'),classification.get('serialName'),'',issuedate, ''))
						}else{
							dispatch(assetsYebActions.getDetailListSingle(serialNumber,serialName,'',issuedate, ''))
						}
					}}
				/>
				<Row className="mxb-title">
					<SinglePicker
						district={assetsSelectList}
						value={assetsClassInfo}
						onOk={(result) => {
							const num = result.value.split('_')[0]
							const name =  result.value.split('_')[1]
							dispatch(assetsYebActions.getDetailListSingle(num,name,'',issuedate,endissuedate))
						}}
					>
						<div className="mxb-title-acinfo">
							<span className="mxb-title-ac">{assetsClassInfo}</span>
							<Icon
								className="mxb-title-icon"
								type="triangle"
							/>
						</div>
					</SinglePicker>
					<div className="mxb-title-assinfo">
						<SinglePicker
							className="info-select assets-info-select"
							district={classSelectList.toJS()}
							value={classification.get('serialNumber') ?  classification.get('serialNumber') + '_' : '全部_'}
							onOk={(result) => {
								let num = result.value.split('_')[0]
								let name =  result.value.split('_')[1]
								if(num === '全部'){
									num = serialNumber
									name = serialName
								}
								dispatch(assetsYebActions.getDetailListSingle(num,name,'',issuedate,endissuedate))
							}}
						>
							<span>
								{classification.get('serialNumber') ? classification.get('serialNumber') + '_' + classification.get('serialName') : '全部'}
							</span>
						</SinglePicker>
					</div>
				</Row>
				<Row className='assetsmx-title assetsmx-title-self'>
					<div className='assetsmx-title-item'>资产原值</div>
					<div className='assetsmx-title-item'>已用/总期</div>
					<div className='assetsmx-title-item'>本期(折/摊)</div>
					<div className='assetsmx-title-item'>期末净值</div>
				</Row>
				<ScrollView flex="1" uniqueKey="mxb-scroll" savePosition
					onScroll={(e)=>{
						const scrollY = e.target.scrollTop
						if (scrollY + this.scrollerHeight + 100 >= currentPage*Limit.MXB_LOAD_SIZE*55 && currentPage < detailMxList.size/Limit.MXB_LOAD_SIZE) {							
							dispatch(assetsYebActions.changeAssetsMxbCurrentPage(currentPage+1))
						}
					}}
				>
					<ul className="mxb-main-list assets-main-list">
						{detailMxList.slice(0,currentPage*Limit.MXB_LOAD_SIZE).map((v, i) =>
							<div
								className="mxb-jv"
								key={i}
								onClick={() => {
									dispatch(assetsActions.getAssetsCardFetch(v.get('cardNumber'),v.get('serialNumber'), history))
									dispatch(assetsActions.changeCardDetailList(receivedetailMx))
								}}
								>
								<div className="mxb-jv-title">
									<span className="mxb-jv-abstract mxb-amont-underline">{`${v.get('serialNumber')}${v.get('cardNumber')}_${v.get('cardName')}`}</span>
								</div>
								<div className="mxb-jv-content assetsmx-jv-content">
									<Amount className="mxb-amont">{v.get('cardValue')}</Amount>
									<span className="mxb-amont">{`${v.get('alreadyTime')}/${v.get('totalMonth')}`}</span>
									<Amount className="mxb-amont" showZero={true}>{v.get('currentDepreciation')}</Amount>
									<Amount className="mxb-amont" showZero={true}>{v.get('endNetWorth')}</Amount>
								</div>
							</div>
						)}
						{detailMxList.size ? '' : <div className="mxb-no-vc">暂无凭证</div>}
					</ul>
				</ScrollView>
				<Row className='assetsmx-title assetsmx-botton assetsmx-title-self'>
					<div className='assetsmx-title-item'><Amount>{detailMx.get('cardValue')}</Amount></div>
					<div className='assetsmx-title-item'>--</div>
					<div className='assetsmx-title-item'><Amount>{detailMx.get('currentDepreciation')}</Amount></div>
					<div className='assetsmx-title-item'><Amount>{detailMx.get('endNetWorth')}</Amount></div>
				</Row>
			</Container>
		)
	}
}
