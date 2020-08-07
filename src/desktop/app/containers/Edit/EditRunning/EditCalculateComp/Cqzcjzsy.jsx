import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as Limit from 'app/constants/Limit.js'
import { formatMoney, formatDate }	from 'app/utils'
import { DatePicker, Input, Select, Checkbox, message, Switch } from 'antd'
const Option = Select.Option
import { TableBody, TableTitle, TableItem, TableAll, TableOver } from 'app/components'
import { toJS, fromJS } from 'immutable'
import moment from 'moment'

import StockSingleModal from './component/StockSingleModal'
import CategorySelect from './component/CategorySelect'
import NumberInput from './component/NumberInput'
import { getUuidList } from './component/CommonFun'
import ZjtxCategorySelect from './ZjtxCategorySelect'
import { numberTest } from '../common/common'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'

@immutableRenderDecorator
export default
class Cqzcjzsy extends React.Component {

	static displayName = 'Cqzcjzsy'

	constructor() {
		super()
		this.state = {
			showSingleModal: false,
            selectTreeUuid: 'all',
            selectTreeLevel: 0,
		}
	}
	componentDidMount() {
		if(this.props.insertOrModify === 'modify'){
			// this.props.dispatch(editCalculateActions.getJzsyProjectCardList(this.props.CqzcTemp.get('projectRange')))
		}
		// else{
		// 	this.props.dispatch(editCalculateActions.getAssetsList('LB_JZSY','CqzcTemp'))
		// }


	}
	render() {
		const {
			onCancel,
			dispatch,
			showRunningInfo,
			showRunningInfoModal,
			runningInfoModalType,
			modifyRunningModal,
			CqzcTemp,
			disabledBeginDate,
			flags,
			accountList,
			hideCategoryList,
			configPermission,
			panes,
            commonCardObj,
			// memberList,
			// thingsList,
			insertOrModify,
			paymentType,
			calculateViews
		} = this.props
		const { showSingleModal, selectTreeUuid, selectTreeLevel } = this.state
		const paymentTypeStr = calculateViews.get('paymentTypeStr')
		const modify = insertOrModify === 'modify' ? true : false
		const disabledDateFun = function (current, modify, detailDate) {
			if (modify) {
				return current && (moment(disabledBeginDate) > current || current < moment(detailDate))
			}
			return current && (moment(disabledBeginDate) > current)
		}

		const accountType = flags.get('accountType')
		const categoryName = CqzcTemp.get('categoryName')
		const beProject = CqzcTemp.get('beProject')
		const oriDate = this.props.oriDate
		const oriAbstract = CqzcTemp.get('oriAbstract')
		const usedProject = CqzcTemp.get('usedProject')
		const categoryUuid = CqzcTemp.get('categoryUuid')
		const businessList = CqzcTemp.get('businessList')
		const depreciationAmount = CqzcTemp.getIn(['assets','depreciationAmount'])
		const jrIndex = CqzcTemp.get('jrIndex')
		const originalAssetsAmount = CqzcTemp.getIn(['assets','originalAssetsAmount'])
		const netProfitAmount = CqzcTemp.get('netProfitAmount')
		const lossAmount = CqzcTemp.get('lossAmount')
		const projectCard = CqzcTemp.get('projectCard')?CqzcTemp.get('projectCard'):fromJS([])
		const projectRange = CqzcTemp.get('projectRange')
		const dealTypeList = CqzcTemp.get('dealTypeList')
		const projectList = CqzcTemp.get('projectList')
		const uuidList = CqzcTemp.get('uuidList')
		const diffAmount = CqzcTemp.get('diffAmount')
		const indexSize = businessList.size?businessList.reduce((total,cur) => cur.get('beSelect')?total+1:total,0):0
		const totalAmount = businessList.size?businessList.reduce((total,cur) =>cur.get('beSelect')?total+Number(cur.get('cleaningAmount') ? cur.get('cleaningAmount') : cur.get('amount')):total,0):0
		const reg = /^\d*\.?\d{0,2}$/
		const selectAll = businessList && businessList.size && businessList.every(v => v.get('beSelect'))

		const memberList = commonCardObj.get('memberList')
        const thingsList = commonCardObj.get('thingsList')
        const cardPageObj = commonCardObj.get('cardPageObj')
        const selectThingsList = commonCardObj.get('selectThingsList') || fromJS([])
        const selectedKeys = commonCardObj.get('selectedKeys')

		let detailElementList = []
		let detailDate = formatDate().slice(0,10)
		let curDateTime = 0

		const finalUuidList = getUuidList(businessList) // 上下条
		console.log(finalUuidList);

		businessList && businessList.size && businessList.map((v,i) => {
			const itemDate = new Date(v.get('oriDate')).getTime()
			// 不能早于前置流水最晚日期
			if(v.get('beSelect')){
				detailDate = curDateTime > itemDate ? detailDate : v.get('oriDate')
				curDateTime = new Date(detailDate).getTime()
			}
			detailElementList.push(
				<TableItem className='editRunning-table-jzsy-width' key={v.get('uuid')}>
					<li
						onClick={(e) => {
							e.stopPropagation()
							if(indexSize >= Limit.RUNNING_CHECKED_MAX_NUMBER){
								message.info(`底部列表勾选的核销流水不能超过${Limit.RUNNING_CHECKED_MAX_NUMBER}条`)
							}
							// dispatch(editCalculateActions.selectEditCalculateItem(v.get('oriUuid'), 'CqzcTemp'))
							dispatch(innerCalculateActions.changeEditCalculateCommonString('Cqzc', ['businessList',i,'beSelect'], !v.get('beSelect')))
							dispatch(editCalculateActions.calculateGainForJzsy())
						}}
					>
						<Checkbox checked={v.get('beSelect')} />
					</li>

					<li>1{v.get('oriDate')}</li>
					<TableOver
						textAlign='left'
						className='account-flowNumber'
						onClick={(e) => {
							e.stopPropagation()
							dispatch(previewRunningActions.getPreviewRunningBusinessFetch(v, 'lrls',fromJS(finalUuidList),()=>{
								if(categoryUuid) {
									dispatch(editCalculateActions.getUnprocessedList(oriDate, categoryUuid))
								}
							}))
						}}
					>
						<span>{`${v.get('jrIndex')}号`}</span>
					</TableOver>
					<li>{v.get('categoryName')}</li>
					<li>{v.get('oriAbstract')}</li>
					<li><span style={{textAlign:'right'}}>{formatMoney(Number(v.get('amount')),2,'')}</span></li>
				</TableItem>
			)
		})

		return (
			paymentType === 'LB_JZSY'?
				<div className="accountConf-modal-list accountConf-modal-list-hidden">
					{
					insertOrModify === 'modify'?
					<div className="edit-running-modal-list-item">
						<label>流水号：</label>
						<div>
							<NumberInput
								style={{width:'70px',marginRight:'5px'}}
								value={jrIndex}
								onChange={(e) => {
									if (/^\d{0,6}$/.test(e.target.value)) {
										dispatch(innerCalculateActions.changeEditCalculateCommonString('Cqzc','jrIndex', e.target.value))
									} else {
										message.info('流水号不能超过6位')
									}
								}}
								PointDisabled={true}
							/>
							号
						</div>
					</div>
					:
					null
				}
					<div className="edit-running-modal-list-item">
						<label>日期：</label>
						<div>
							<DatePicker
								allowClear={false}
								disabledDate={(current) => {
									if (modify) {
										return disabledDateFun(current, modify, detailDate)
									} else {
										return disabledDateFun(current)
									}


								}}
								value={moment(oriDate)}
								onChange={value => {
								const date = value.format('YYYY-MM-DD')
								if(insertOrModify === 'modify'){
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
								}else{
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
									if(categoryUuid) {
										dispatch(editCalculateActions.getUnprocessedList(date, categoryUuid))
									}
								}

							}}/>
						</div>
					</div>
					{/* <div className="edit-running-modal-list-item">
						<label>流水类别：</label>
						<div>
							<Select
								disabled={insertOrModify === 'modify' || accountType === 'single'}
								value={paymentTypeList[paymentType]}
								onChange={value => {
									dispatch(innerCalculateActions.changeEditCalculateCommonString('',['flags','paymentType'],value))
								}}
								>
									{
										hideCategoryList && hideCategoryList.size ? hideCategoryList.map(item => {
											return <Option key={item.get('uuid')} value={item.get('categoryType')}>
												{item.get('name')}
											</Option>
										})
										:
										null
								}

							</Select>
						</div>

					</div> */}
					<CategorySelect
						dispatch={dispatch}
						insertOrModify={insertOrModify}
						paymentTypeStr={paymentTypeStr}
						hideCategoryList={hideCategoryList}
					/>
					<div className="edit-running-modal-list-item">
						<label>处理类别：</label>
						<div className='chosen-right' style={{display:'flex'}}>

							<ZjtxCategorySelect
								disabled={insertOrModify === 'modify'}
								treeData={dealTypeList}
								value={categoryName}
								placeholder=""
								parentDisabled={true}
								onChange={(value,label,extra) => {
									const valueList = value.split(Limit.TREE_JOIN_STR)
									const beProject = valueList[4] == 'true' ? true : false
									dispatch(editCalculateActions.changeEditCalculateCommonState('CqzcTemp','categoryUuid', valueList[3]))
									dispatch(editCalculateActions.changeEditCalculateCommonState('CqzcTemp','categoryName', valueList[0]))
									dispatch(editCalculateActions.changeEditCalculateCommonState('CqzcTemp', 'beProject',beProject))
									dispatch(editCalculateActions.getUnprocessedList(oriDate, valueList[3]))
									let projectRange = fromJS([])
									const loopFind = (itemList,uuid) => {
										itemList.map(v => {
											if (v.get('uuid') === uuid && v.get('beProject')) {
												projectRange = v.get('projectRange')
												return
											} else {
												v.get('childList').size && loopFind(v.get('childList'),uuid)
											}

										})
									}
									loopFind(dealTypeList.getIn([0,'childList']),valueList[3])
									if (projectRange.size) {
										dispatch(editCalculateActions.getJzsyProjectCardList(projectRange))
									} else {
										dispatch(editCalculateActions.changeEditCalculateCommonState('CqzcTemp', 'beProject',false))
									}
								}}
							/>
							{
								beProject?
								<Switch
									className="use-unuse-style lrls-jzsy-box"
									style={{margin:'.1rem 0 0 .2rem'}}
									checked={usedProject}
									checkedChildren={'项目'}
									unCheckedChildren={'项目'}
									onChange={() => {
										if (!usedProject) {
											dispatch(editCalculateActions.changeEditCalculateCommonState('CqzcTemp','projectCard',fromJS([{uuid:'',code:'',name:''}])))
										}
										dispatch(editCalculateActions.changeEditCalculateCommonState('CqzcTemp','usedProject',!usedProject))
									}}
								/>:''
							}

						</div>
					</div>
						{
							usedProject && beProject ?
								projectCard.map((v,i) =>
									<div key={i} className='project-content-area' style={projectCard.size>1?{}:{border:'none',marginBottom:'0'}}>
										<div className="edit-running-modal-list-item" >
											<label>项目：</label>
											<div className='chosen-right'>
												<Select
													combobox
													showSearch
													value={`${v.get('code') !== 'COMNCRD' && v.get('code')?v.get('code'):''} ${v.get('name')?v.get('name'):''}`}
													onChange={(value,options) => {
														const valueList = value.split(Limit.TREE_JOIN_STR)
														const cardUuid = options.props.uuid
														const code = valueList[0]
														const name = valueList[1]
														dispatch(editCalculateActions.changeEditCalculateCommonState('CqzcTemp', 'projectCard', fromJS([{cardUuid,name,code}])))
													}}
													>
													{projectList && projectList.filter(v => v.get('code') !== 'COMNCRD' && v.get('projectProperty') !== 'XZ_PRODUCE' && v.get('projectProperty') !== 'XZ_CONSTRUCTION').map((v, i) =>
														<Option
															key={v.get('uuid')}
															value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
															uuid={v.get('uuid')}
														>
															{`${v.get('code') !== 'COMNCRD'?v.get('code'):''} ${v.get('name')}`}
														</Option>
													)}
												</Select>
												{
													<div className='chosen-word'
														onClick={() => {
															dispatch(editCalculateActions.getProjectAllCardList(projectRange,'showSingleModal',false,false,'XZ_LOSS',true,true,true,true,1))
															this.setState({
																index:i,
																showSingleModal:true
															})

													}}>选择</div>
												}
											</div>
										</div>
									</div>
								):null
						}
					<div className="edit-running-modal-list-item">
						<label>摘要：</label>
						<div>
							<Input className="focus-input"
								onFocus={(e) => {
									document.getElementsByClassName('focus-input')[0].select();
								}}
								value={oriAbstract}
								onChange={(e) => {
									dispatch(editCalculateActions.changeEditCalculateCommonState('CqzcTemp', 'oriAbstract', e.target.value))
								}}
							/>
						</div>
					</div>
					<div className="edit-running-modal-list-item">
						<label>{`净${diffAmount<0?'收益':'损失'}金额：`}</label>
						<div>
							{
								// netProfitAmount>=0?netProfitAmount:lossAmount
								formatMoney(Math.abs(diffAmount))
							}
						</div>
					</div>
					<div className="edit-running-modal-list-item">
						<label>资产原值：</label>
						<div>
							<NumberInput
								value={originalAssetsAmount}
								onChange={(e) =>{
									numberTest(e,(value) => {
										dispatch(innerCalculateActions.changeEditCalculateCommonString('Cqzc', ['assets','originalAssetsAmount'], value))
										dispatch(editCalculateActions.calculateGainForJzsy())
									})
								}}
							/>
						</div>
					</div>
					<div className="edit-running-modal-list-item">
						<label>累计折旧摊销：</label>
						<div>
							<NumberInput
								showZero={true}
								value={depreciationAmount}
								onChange={(e) =>{
									numberTest(e,(value) => {
										dispatch(innerCalculateActions.changeEditCalculateCommonString('Cqzc', ['assets','depreciationAmount'], value))
										dispatch(editCalculateActions.calculateGainForJzsy())
									})
								}}
							/>
						</div>
					</div>
					<div className='accountConf-separator'></div>
					<div className='editRunning-detail-title'>
						<div className="editRunning-detail-title-top">请勾选需要处理的流水：</div>
						<div className='editRunning-detail-title-bottom'>
							<span>
								已勾选流水：{indexSize}条
							</span>
							<span>
								{`处置金额合计：`}<span>{formatMoney(totalAmount,2,'')}</span>
							</span>
						</div>
					</div>
					<TableAll className="editRunning-table">
						<TableTitle
							className="editRunning-table-jzsy-width"
							titleList={['日期','流水号','流水类别','摘要','金额']}
							hasCheckbox={true}
							selectAcAll={selectAll}
							onClick={(e) => {
									e.stopPropagation()
									if(!selectAll && (Number(indexSize) + Number(detailElementList.length) >= Limit.RUNNING_CHECKED_MAX_NUMBER)){
										message.info(`底部列表勾选的核销流水不能超过${Limit.RUNNING_CHECKED_MAX_NUMBER}条`)
									}else{
										if (businessList.every(v => v.get('beSelect'))) {
											businessList.forEach((v,i) => dispatch(innerCalculateActions.changeEditCalculateCommonString('Cqzc', ['businessList',i,'beSelect'], false)))
										} else {
											businessList.forEach((v,i) => dispatch(innerCalculateActions.changeEditCalculateCommonString('Cqzc', ['businessList',i,'beSelect'], true)))
										}
										dispatch(editCalculateActions.calculateGainForJzsy())
									}


									// dispatch(editCalculateActions.selectEditCalculateItemAll(selectAll, 'CqzcTemp', 'businessList'))


							}}
						/>
						<TableBody>
							{detailElementList}

					</TableBody>
				</TableAll>
				{
					// <SingleModal
					// 	dispatch={dispatch}
					// 	showSingleModal={showSingleModal}
					// 	MemberList={memberList.filter(v => v.get('name') !== '生产项目' && v.get('name') !== '施工项目')}
					// 	thingsList={thingsList.filter(v => v.get('projectProperty') !== 'XZ_PRODUCE' && v.get('projectProperty') !== 'XZ_CONSTRUCTION' && v.get('code') !== 'COMNCRD')}
					// 	selectedKeys={selectedKeys}
					// 	title={'选择项目'}
					// 	selectFunc={(code,name,cardUuid) => {
					// 		dispatch(editCalculateActions.changeEditCalculateCommonState('CqzcTemp', 'projectCard', fromJS([{cardUuid,name,code}])))
					// 		dispatch(editRunningActions.changeLrAccountCommonString('',['flags','showSingleModal'], false))
					// 	}}
					// 	selectListFunc={(uuid,level) => {
					// 		if(uuid === 'all'){
					// 			dispatch(editRunningActions.getProjectAllCardList(projectRange,'showSingleModal'))
					// 		} else {
					// 			dispatch(editRunningActions.getProjectSomeCardList(uuid,level))
					// 		}
					// 	}}
					// />
				}
				<StockSingleModal
                    dispatch={dispatch}
                    showSingleModal={showSingleModal}
					MemberList={memberList.filter(v => v.get('name') !== '生产项目' && v.get('name') !== '施工项目')}
					thingsList={thingsList.filter(v => v.get('projectProperty') !== 'XZ_PRODUCE' && v.get('projectProperty') !== 'XZ_CONSTRUCTION' && v.get('code') !== 'COMNCRD')}
                    selectThingsList={selectThingsList}
                    selectedKeys={selectedKeys === '' ? [`all${Limit.TREE_JOIN_STR}1`] : selectedKeys}
                    stockCardList={fromJS([projectCard.toJS()])}
                    title={'选择项目'}
                    selectFunc={(item, cardUuid) => {
                        const code = item.code
                        const name = item.name
						dispatch(editCalculateActions.changeEditCalculateCommonState('CqzcTemp', 'projectCard', fromJS([{cardUuid,name,code}])))
						this.setState({
                            showSingleModal: false
                        })
                    }}

                    selectListFunc={(uuid, level) => {
						if(uuid === 'all'){
							dispatch(editCalculateActions.getProjectAllCardList(projectRange,'showSingleModal',false,false,'XZ_LOSS',true,true,true,true,1))
						} else {
							dispatch(editCalculateActions.getProjectSomeCardList(uuid,level,'',1))
						}
                        this.setState({
                            selectTreeUuid: uuid,
                            selectTreeLevel: level
                        })

                    }}
                    cancel={() => {
                        this.setState({
                            showSingleModal: false
                        })
                    }}
                    cardPageObj={cardPageObj}
                    paginationCallBack={(value)=>{
                        if(selectTreeUuid === 'all'){
                            dispatch(editCalculateActions.getProjectAllCardList(projectRange,'showSingleModal',false,false,'XZ_LOSS',true,true,true,true,value))
                        } else {
                            dispatch(editCalculateActions.getProjectSomeCardList(selectTreeUuid,selectTreeLevel,'',value))
                        }
                    }}
                />
			</div>
			:
			null
		)
	}
}
