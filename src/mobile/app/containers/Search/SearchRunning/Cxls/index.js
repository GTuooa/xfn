import React, { PropTypes } from 'react'
import { fromJS, toJS } from 'immutable'
import { connect }	from 'react-redux'

import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action.js'
import { runningPreviewActions } from 'app/redux/Edit/RunningPreview'
import * as thirdParty from 'app/thirdParty'
import { DateLib, debounce } from 'app/utils'

import { TopMonthPicker, ScrollLoad, TopDatePicker } from 'app/containers/components'
import { Checkbox, Amount, Button, ButtonGroup, Icon, Container, Row, ScrollView, Single, XfInput, SearchBar } from 'app/components'
import Item from './Item.jsx'
import './style.less'

@connect(state => state)
export default
class SearchRunning extends React.Component {
    debounceFn = debounce(this.searchFn.bind(this), 500)
	state = {
		isEdit: false,
		selectAll: true,
	}
	cardTypeObj = {
		'ALL': '全部',
		'ACCOUNT': '账户',
		'PROJECT': '项目',
		'STOCK': '存货',
		'CURRENT': '往来',
		'SEARCH_TYPE_ABSTRACT': '摘要',
		'SEARCH_TYPE_RUNNING_TYPE': '类型',
		'SEARCH_TYPE_AMOUNT': '金额',
		'SEARCH_TYPE_CREATE_NAME': '制单人',
		'SEARCH_TYPE_CATEGORY_TYPE': '流水类别',
	}
	componentDidMount() {
		thirdParty.setTitle({ title: '查询流水' })
		thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })


		if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(searchRunningActions.initCxls())
			this.props.dispatch(searchRunningActions.getPeriodAndBusinessList())
		} else {
			this.props.dispatch(searchRunningActions.getBusinessList(1, false))
		}
	}
	searchFn () {
		this.props.dispatch(searchRunningActions.getBusinessList(1, false))
	}

	render() {
		const { isEdit, selectAll } = this.state
		const { dispatch, searchRunningState, history, homeState, } = this.props

		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])
		//intelligentStatus  true为智能总账
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const intelligentStatus = moduleInfo ? (moduleInfo.indexOf('RUNNING_GL') > -1 ? true : false) : false

		const views = searchRunningState.get('views')
		const dataList = searchRunningState.get('dataList')

		const selectedIndex = views.get('selectedIndex')
		const issues = views.get('issues')//所有账期
		const start = views.get('start')//当前账期年份
		const end = views.get('end')//当前账期月份
		const currentPage = views.get('currentPage')
		const pageCount = views.get('pageCount')

		const dateSelectList = [
			{key: '按账期查询', value: 'ISSUE'},
			{key: '按日期查询', value: 'DATE'},
			{key: '按账期区间查询', value: 'ISSUE_RANGE'},
			{key: '按日期区间查询', value: 'DATE_RANGE'}
		]
		const dateSelectValue = views.get('dateSelectValue')
		let nextperiods = fromJS([])
		if (dateSelectValue=='ISSUE_RANGE') {
			const idx = issues.findIndex(v => v.get('value') == start)
			nextperiods = issues.slice(0, idx)
		}

		const dateCheck = (date) => {
			const issuesList = issues.toJS()
			let issuesEnd = issuesList.shift()['value']
			let issuesStart = issuesList.pop()
			issuesStart = issuesStart ? issuesStart['value'] : issuesEnd
			let issuesEndDay = new Date(issuesEnd.slice(0,4), issuesEnd.slice(5,7), 0)

			let returnValue = false
			if (Date.parse(date) < Date.parse(issuesStart) || Date.parse(date) > Date.parse(issuesEndDay)) {
				thirdParty.Alert('请选择账期内的日期', '好的')
				returnValue = true
			}
			return returnValue
		}

		const projectCardList = searchRunningState.get('projectCardList')
		const currentCardList = searchRunningState.get('currentCardList')
		const stockCardList = searchRunningState.get('stockCardList')
		const accounCardtList = searchRunningState.get('accounCardtList')
		const cardList = {
			'ALL': [],
			'ACCOUNT': accounCardtList.toJS(),
			'PROJECT': projectCardList.toJS(),
			'STOCK': stockCardList.toJS(),
			'CURRENT': currentCardList.toJS(),
			'SEARCH_TYPE_ABSTRACT': [],
			'SEARCH_TYPE_RUNNING_TYPE': [],
			'SEARCH_TYPE_AMOUNT': [],
			'SEARCH_TYPE_CREATE_NAME': [],
			'SEARCH_TYPE_CATEGORY_TYPE': [],
		}

		const cardObj = views.get('cardObj')
		const cardType = cardObj.get('cardType')
		const searchContent = cardObj.get('searchContent')
		const isSearch = cardObj.get('isSearch')
		const cardTypeList = [
			{key: '全部', value: 'ALL'},
			{key: '账户', value: 'ACCOUNT'},
			{key: '项目', value: 'PROJECT'},
			{key: '存货', value: 'STOCK'},
			{key: '往来', value: 'CURRENT'},
		]
		const searchTypeList = [
			{key: '摘要', value: 'SEARCH_TYPE_ABSTRACT'},
			{key: '类型', value: 'SEARCH_TYPE_RUNNING_TYPE'},
			{key: '金额', value: 'SEARCH_TYPE_AMOUNT'},
			{key: '制单人', value: 'SEARCH_TYPE_CREATE_NAME'},
			{key: '流水类别', value: 'SEARCH_TYPE_CATEGORY_TYPE'},
		]

		return (
			<Container className="search-running">
				<div className="search-running-date">
					<div style={{display: ['ISSUE', 'ISSUE_RANGE'].includes(dateSelectValue) ? '' : 'none'}}>
						<TopMonthPicker
							issuedate={start}
							source={issues}
							callback={(value) => {
								dispatch(searchRunningActions.changeCxlsData(['views', 'start'], value))
								dispatch(searchRunningActions.changeCxlsData(['views', 'end'], value))
								dispatch(searchRunningActions.getBusinessList(1, false))
								if (['ACCOUNT',  'PROJECT', 'STOCK',  'CURRENT'].includes(cardType)) {
									dispatch(searchRunningActions.getCardList())
								}
							}}
							onOk={(result) => {
								dispatch(searchRunningActions.changeCxlsData(['views', 'start'], result.value))
								dispatch(searchRunningActions.changeCxlsData(['views', 'end'], result.value))
								dispatch(searchRunningActions.getBusinessList(1, false))
								if (['ACCOUNT',  'PROJECT', 'STOCK',  'CURRENT'].includes(cardType)) {
									dispatch(searchRunningActions.getCardList())
								}
							}}

							showSwitch={dateSelectValue=='ISSUE_RANGE' ? true : false}//是否有跨期的按钮
							endissuedate={dateSelectValue=='ISSUE_RANGE' ? (end ? end : start) : ''}
							nextperiods={nextperiods}
							onBeginOk={(result) => {//跨期选择完开始时间后
								dispatch(searchRunningActions.changeCxlsData(['views', 'start'], result.value))
								dispatch(searchRunningActions.changeCxlsData(['views', 'end'], result.value))
								dispatch(searchRunningActions.getBusinessList(1, false))
								if (['ACCOUNT',  'PROJECT', 'STOCK',  'CURRENT'].includes(cardType)) {
									dispatch(searchRunningActions.getCardList())
								}
							}}
							onEndOk={(result) => {//跨期选择完结束时间后
								dispatch(searchRunningActions.changeCxlsData(['views', 'end'], result.value))
								dispatch(searchRunningActions.getBusinessList(1, false))
								if (['ACCOUNT',  'PROJECT', 'STOCK',  'CURRENT'].includes(cardType)) {
									dispatch(searchRunningActions.getCardList())
								}
							}}
						/>
					</div>
					<div style={{display: ['DATE', 'DATE_RANGE'].includes(dateSelectValue) ? '' : 'none'}}>
						<TopDatePicker
							value={start}
							endValue={end ? end : start}
							isRange={dateSelectValue=='DATE_RANGE' ? true : false}
							onChange={date => {
								const value = new DateLib(date).valueOf()
								if (dateCheck(value)) {
									return
								}
								dispatch(searchRunningActions.changeCxlsData(['views', 'start'], value))
								dispatch(searchRunningActions.changeCxlsData(['views', 'end'], value))
								dispatch(searchRunningActions.getBusinessList(1, false))
								if (['ACCOUNT',  'PROJECT', 'STOCK',  'CURRENT'].includes(cardType)) {
									dispatch(searchRunningActions.getCardList())
								}
							}}
							callback={(value) => {
								if (dateCheck(value)) {
									return
								}
								dispatch(searchRunningActions.changeCxlsData(['views', 'start'], value))
								dispatch(searchRunningActions.changeCxlsData(['views', 'end'], value))
								dispatch(searchRunningActions.getBusinessList(1, false))
								if (['ACCOUNT',  'PROJECT', 'STOCK',  'CURRENT'].includes(cardType)) {
									dispatch(searchRunningActions.getCardList())
								}
							}}
							onEndChange={(date)=>{
								const value = new DateLib(date).valueOf()
								if (Date.parse(value) < Date.parse(start)) {
									thirdParty.Alert('结束日期不可小于开始日期', '好的')
									return
								}
								if (dateCheck(value)) {
									return
								}

								dispatch(searchRunningActions.changeCxlsData(['views', 'end'], value))
								dispatch(searchRunningActions.getBusinessList(1, false))
								if (['ACCOUNT',  'PROJECT', 'STOCK',  'CURRENT'].includes(cardType)) {
									dispatch(searchRunningActions.getCardList())
								}
							}}
						/>
					</div>

					<Single
						district={dateSelectList}
						value={dateSelectValue}
						canSearch={false}
						onOk={value => {
							let date = start.slice(0,7)
							if (['DATE', 'DATE_RANGE'].includes(value.value)) {
								date = `${date}-01`
							}
							dispatch(searchRunningActions.changeCxlsData(['views', 'dateSelectValue'], value.value))
							dispatch(searchRunningActions.changeCxlsData(['views', 'start'], date))
							dispatch(searchRunningActions.changeCxlsData(['views', 'end'], date))
							dispatch(searchRunningActions.getBusinessList(1, false))
							if (['ACCOUNT',  'PROJECT', 'STOCK',  'CURRENT'].includes(cardType)) {
								dispatch(searchRunningActions.getCardList())
							}
						}}
					>
						<Icon type="date"/>
					</Single>
				</div>


				<div className='cxls-flex cxls-margin-bottom'>
					<Single
						className='left'
						district={isSearch ? searchTypeList : cardTypeList}
						value={cardType}
						canSearch={false}
						onOk={value => {
							dispatch(searchRunningActions.changeCxlsData(['views', 'cardObj'], fromJS({
								cardType: value.value,
								cardUuid: isSearch ? value.value : '',
								name: '全部',
								searchContent: '',
								isSearch,
							})))
							dispatch(searchRunningActions.getBusinessList(1, false))
							if (['ACCOUNT',  'PROJECT', 'STOCK',  'CURRENT'].includes(value.value)) {
								dispatch(searchRunningActions.getCardList(false))
							}
						}}
					>
						<div className='cxls-flex'>
							<div>{this.cardTypeObj[cardType]}</div>
							<Icon type="triangle"/>
						</div>
					</Single>
					{ ['ALL'].includes(cardType) ? 
					    <div className='search-logo' 
							onClick={() => {
								dispatch(searchRunningActions.changeCxlsData(['views', 'cardObj'], fromJS({
									cardType: 'SEARCH_TYPE_ABSTRACT',
									cardUuid: 'SEARCH_TYPE_ABSTRACT',
									name: '全部',
									searchContent: '',
									isSearch: true,
								})))}
							}>
								<Icon type='search'/>
						</div> : null
					}
					{
						isSearch ? 
							<div className='search-right'>
								<SearchBar
								    placeholder='搜索流水'
								    value={searchContent}
								    onChange={(value) => {
										dispatch(searchRunningActions.changeCxlsData(['views', 'cardObj', 'searchContent'], value))
									}}
									onSubmit={(value) => {
										dispatch(searchRunningActions.getBusinessList(1, false))
									}}
									onCancel={() => {
										dispatch(searchRunningActions.changeCxlsData(['views', 'cardObj'], fromJS({
											cardType: 'ALL',
											cardUuid: '',
											name: '全部',
											searchContent: '',
										})))
										dispatch(searchRunningActions.getBusinessList(1, false))
									}}
									onClear={() => {
										dispatch(searchRunningActions.changeCxlsData(['views', 'cardObj', 'searchContent'], ''))
										dispatch(searchRunningActions.getBusinessList(1, false))
									}} 
								/>
							</div> : null
					}

					{	['ACCOUNT', 'PROJECT', 'STOCK', 'CURRENT'].includes(cardType) ?
						    <Single
					    		className='right'
					    		district={cardList[cardType]}
					    		value={cardObj.get('cardUuid')}
					    		onOk={value => {
					    			dispatch(searchRunningActions.changeCxlsData(['views', 'cardObj', 'cardUuid'], value.value))
					    			dispatch(searchRunningActions.changeCxlsData(['views', 'cardObj', 'name'], value.key))
					    			dispatch(searchRunningActions.getBusinessList(1, false))
					    		}}
					    	>
					    		<div className='cxls-flex'>
					    			<div className='overElli'>{cardObj.get('name')}</div>
					    			<Icon type="triangle"/>
					    		</div>
					    	</Single> : null
					}
				</div>

				<ScrollView flex="1" uniqueKey="cxls-scroll" savePosition>
					<div className='flow-content' bubble={'true'}
						onClick={(e) => {
							let target = e.target
							let bubble = true
							if (target.getAttribute('bubble')) {
								bubble = false//点击到本节点
							}
							//没找到click_target属性的字段并且还没冒泡到本节点
							while (!target.getAttribute('click_target') && bubble) {
								if (target.parentNode.getAttribute('bubble')) {
									bubble = false//已冒泡到本节点
								}
								target = target.parentNode
							}

							if (bubble) {//找到了要事件委托的节点
								const idx = Number(target.getAttribute('idx'))
								const uuid = target.getAttribute('uuid')
								const item = dataList.get(idx)
								if (isEdit) {
									dispatch(searchRunningActions.selectLs(selectedIndex, idx))
								} else {
									dispatch(runningPreviewActions.getRunningPreviewBusinessFetch(uuid, item, dataList, 'search', history))
								}
							}

						}}
					>
						{dataList.map((v, i) => {
							return <Item
								idx={i}
								item={v}
								isEdit={isEdit}
								history={history}
								key={v.get('oriUuid')}
								dispatch={dispatch}
								// selectedIndex={selectedIndex}
								editPermission={editPermission}
								intelligentStatus={intelligentStatus}
								// uuidList={dataList}
							/>
						})}
					</div>
					<ScrollLoad
						diff={1}
						classContent='flow-content'
						callback={(_self) => {
							dispatch(searchRunningActions.getBusinessList(currentPage + 1, true,  _self))
						}}
						isGetAll={currentPage >= pageCount}
						itemSize={dataList.size}
					/>
				</ScrollView>

				<ButtonGroup style={{display: isEdit ? 'none' : ''}}>
					<Button disabled={!editPermission} onClick={() => {
						sessionStorage.setItem('prevPage', 'searchrunning')
						history.push('/editrunning/index')
					}}>
						<Icon type="add-plus"/><span>新增</span>
					</Button>
					<Button
						disabled={dataList.size === 0}
						onClick={() => this.setState({ isEdit: true })}
					>
						<Icon type="select" size='15'/><span>选择</span>
					</Button>
					{/* <Button
						onClick={() => {
							dispatch(searchRunningActions.changeCxlsData(['views', 'currentRouter'], 'CX_HSGL'))
						}}
					>
						<Icon type="increase"/><span style={{paddingLeft: '.05rem'}}>管理</span>
					</Button> */}
				</ButtonGroup>
				<ButtonGroup style={{display: isEdit ? '' : 'none'}}>
					<Button onClick={() => {
						dispatch(searchRunningActions.selectLsAll(selectedIndex, selectAll))
						this.setState({selectAll: !selectAll})
					}}>
						<Icon type="choose"/><span>全选</span>
					</Button>
					<Button onClick={() => {
						this.setState({ isEdit: false })
						dispatch(searchRunningActions.selectLsAll(selectedIndex, false))
					}}>
						<Icon type="cancel"/><span>取消</span>
					</Button>
					<Button disabled={!(dataList.some(v => v.get('selected'))) || !editPermission}
						onClick={() => dispatch(searchRunningActions.deleteLs(dataList, selectedIndex))}
					>
						<Icon type="delete"/><span>删除</span>
					</Button>
					<Button disabled={ !(dataList.some(v => v.get('selected') && !v.get('beCertificate'))) || !editPermission } 
					    onClick={() => {dispatch(searchRunningActions.insertRunningBusinessVc())}}
						>
						<Icon type='shenhe'/><span>审核</span>
					</Button>
					<Button disabled={ !(dataList.some(v => v.get('selected') && v.get('beCertificate'))) || !editPermission } 
					    onClick={() => {dispatch(searchRunningActions.deleteRunningBusinessVc())}}
					>
						<Icon type='chexiao'/><span>反审核</span>
					</Button>
				</ButtonGroup>
			</Container>
		)
	}
}
