import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { DateLib, formatNum }	from 'app/utils'
import { DatePicker, Input, Select, Checkbox, Button, Modal, message, Timeline, Tabs, Tree } from 'antd'
import { Icon } from 'app/components'
const TreeNode = Tree.TreeNode
const TabPane = Tabs.TabPane
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, TableAll, Amount, TableOver} from 'app/components'
import  QcModalForMulti  from './QcModalForMulti'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import * as accountConfActions from 'app/redux/Config/Account/account.action'
import { toJS, fromJS } from 'immutable'
import Ylls from 'app/containers/Search/Cxls/Ylls'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'
import moment from 'moment'

@immutableRenderDecorator
export default
class CommonCharge extends React.Component {
	constructor() {
		super()
		this.state = {
			showCommonChargeModal:false,
			yllsVisible:false
    }
	}
	componentWillReceiveProps(nextprops) {
		if ((this.props.homeState.get('homeActiveKey') !== nextprops.homeState.get('homeActiveKey') || this.props.homeState.get('pageActive') !== nextprops.homeState.get('pageActive')) && this.state.yllsVisible === true) {
			this.setState({yllsVisible: false})
		}
	}
	componentDidMount() {
		const paymentInsertOrModify = this.props.flags.get('paymentInsertOrModify')
		paymentInsertOrModify === 'insert' && this.props.dispatch(lrAccountActions.getProjectShareList())
	}
	render() {
		const {
			onCancel,
			dispatch,
			showRunningInfo,
			showRunningInfoModal,
			runningInfoModalType,
			modifyRunningModal,
			commonChargeTemp,
			disabledBeginDate,
			flags,
			accountList,
			hideCategoryList,
			configPermissionInfo,
			yllsState,
			panes
		} = this.props
		const { yllsVisible } = this.state
		const reg = /^-{0,1}\d*\.?\d{0,2}$/
		let paymentTypeList = {'LB_GGFYFT': '项目公共费用分摊'}
		const paymentType = flags.get('paymentType')
		const paymentInsertOrModify = flags.get('paymentInsertOrModify')
		const isQuery = flags.get('isQuery')
		const modify = flags.get('modify')
		const MemberList = flags.get('MemberList')
		const thingsList = flags.get('thingsList')
		const selectItem = flags.get('selectItem')
		const selectList = flags.get('selectList')
		const selectThingsList = flags.get('selectThingsList')
		const selectedKeys = flags.get('selectedKeys')
		const runningDate = commonChargeTemp.get('runningDate')
		const runningAbstract = commonChargeTemp.get('runningAbstract')
		const runningIndex = commonChargeTemp.get('runningIndex')
		const paymentList = commonChargeTemp.get('paymentList')
		const projectCard = commonChargeTemp.get('projectCard')
		const flowNumber = commonChargeTemp.get('flowNumber')
		const amount = commonChargeTemp.get('amount')?commonChargeTemp.get('amount'):0
		const disabledDate = function (current, modify, detailDate) {
			if (modify) {
				return current && (moment(disabledBeginDate) > current || current < moment(detailDate))
			}
			return current && (moment(disabledBeginDate) > current)
		}
		const lsItemData = yllsState.get('lsItemData')
		return (
			paymentType === 'LB_GGFYFT'?
				<div className="accountConf-modal-list accountConf-modal-list-hidden">
					{
						modify?
						<div className="accountConf-modal-list-item">
	                        <label>流水号：</label>
	                        <div>{flowNumber}</div>
	                    </div>:''
					}
					<div className="accountConf-modal-list-item">
						<label>日期：</label>
						<div>
							<DatePicker
								allowClear={false}
								disabledDate={(current) => {
									if (modify) {
										const detailDate = paymentList.getIn([0, 'runningDate'])
										return disabledDate(current, modify, detailDate)
									} else {
										return disabledDate(current)
									}


								}}
								value={moment(runningDate)}
								onChange={value => {
								const date = value.format('YYYY-MM-DD')
								dispatch(lrAccountActions.changeLrAccountCommonString('commonCharge','runningDate',date))
								!modify && dispatch(lrAccountActions.getProjectShareList(date))
							}}/>
						</div>
					</div>
						<div className="accountConf-modal-list-item">
							<label>流水类别：</label>
							<div>
								<Select
									disabled={modify}
									value={paymentTypeList[paymentType]}
									onChange={value => {
										dispatch(lrAccountActions.changeLrAccountCommonString('',['flags','paymentType'],value))
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

						</div>
						<div className="accountConf-modal-list-item">
							<label>摘要：</label>
							<div>
								<Input

									value={runningAbstract}
									onChange={(e) => {
										dispatch(lrAccountActions.changeLrAccountCommonString('commonCharge', 'runningAbstract', e.target.value))
									}}
								/>
							</div>
						</div>
						{
							projectCard.size?
							projectCard.map((v,i) =>
								<div>
									<div>{`${v.get('code')||''} ${v.get('name')||''}`}</div>
									<div className="accountConf-modal-list-item" >
										<label>分摊金额:</label>
										<div>
											<Input
												disabled={amount==0}
												value={v.get('amount')?v.get('amount'):''}
												onChange={(e) => {
													let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
													if (reg.test(value) || value === '') {
														if (Math.abs(value) > Math.abs(amount)) {
															message.info('金额不能大于待分摊金额')
														} else {
															const percent = (Number(value)/Number(amount)*100).toFixed(2)
															dispatch(lrAccountActions.changeLrAccountCommonString('commonCharge', ['projectCard',i,'amount'], e.target.value))
															dispatch(lrAccountActions.changeLrAccountCommonString('commonCharge', ['projectCard',i,'percent'], percent))
														}
													} else {
														message.info('金额只能输入带两位小数的数字')
													}
												}}
											/>

										</div>
										<span className='percent-content'>
											占比：
											<Input
												style={{width:'39px', padding:0}}
												value={v.get('percent')?v.get('percent'):''}
												onChange={(e) => {
													let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
													if (reg.test(value) || value === '') {
														const percent = Number(e.target.value)/100
														dispatch(lrAccountActions.changeLrAccountCommonString('commonCharge', ['projectCard',i,'percent'], value))
														dispatch(lrAccountActions.changeLrAccountCommonString('commonCharge', ['projectCard',i,'amount'], (Number(amount)*percent).toFixed(2)))
													} else {
														message.info('只能输入带两位小数的数字')
													}
												}}
											/>
											%
										</span>
										<Icon type="close" theme="outlined"
											style={{cursor:'pointer',lineHeight:'240%'}}
											onClick={() => {
												dispatch(lrAccountActions.changeLrAccountCommonString('commonCharge', 'projectCard', projectCard.splice(i,1)))
											}}
										/>
									</div>
								</div>
							):''
						}
						<div className="accountConf-modal-list-item" >
							<label></label>
							<div onClick={() => {
								this.setState({
									showCommonChargeModal:true
								})
								dispatch(lrAccountActions.getChargeProjectCard())
							}}
							style={{cursor:'pointer'}}
							>
								<Icon type="plus" theme="outlined" />
								<span>添加分摊项目</span>
							</div>

						</div>

						<div className='accountConf-separator'></div>
						<div className='lrAccount-detail-title'>
							<div className="lrAccount-detail-title-top">请勾选需要核账的流水：</div>
							<div className='lrAccount-detail-title-bottom'>
								<span>
									已勾选流水：{paymentList?paymentList.reduce((total,item) => item.get('beSelect')?total+1:total,0):''}条
								</span>
								<span>
									{`待分摊金额：`}<span>{amount?Number(amount).toFixed(2):''}</span>
								</span>
							</div>
						</div>
						<TableAll className="lrAccount-table">
							<TableTitle
								className="lrAccount-table-sfgl-width"
								titleList={['日期','流水号','流水类别','摘要', '类型','待处理金额']}
								selectAcAll={paymentList.every(v => v.get('beSelect'))}
								hasCheckbox={true}
								onClick={(e) => {
										e.stopPropagation()
										if (paymentList.every(v => v.get('beSelect'))) {
											const newPaymentList = paymentList.map(v => v.set('beSelect',false))
											dispatch(lrAccountActions.changeLrAccountCommonString('commonCharge', 'paymentList',newPaymentList))
											dispatch(lrAccountActions.changeLrAccountCommonString('commonCharge', 'amount',0))
										} else {
											const newPaymentList = paymentList.map(v => v.set('beSelect',true))
											dispatch(lrAccountActions.changeLrAccountCommonString('commonCharge', 'paymentList',newPaymentList))
											dispatch(lrAccountActions.changeLrAccountCommonString('commonCharge', 'amount',paymentList.reduce((total,item) => total + Number(item.get('amount')),0)))
										}
								}}
							/>
							<TableBody>
							{
								paymentList && paymentList.size ?
									paymentList.map((v,i) =>
										<TableItem className='lrAccount-table-sfgl-width common-charge-list' key={v.get('uuid')}>
											<li	>
												<Checkbox
													// disabled={Number(v.get('amount'))*amount<0}
													checked={v.get('beSelect')}
													onClick={(e) => {
														dispatch(lrAccountActions.changeLrAccountCommonString('commonCharge', ['paymentList',i,'beSelect'], e.target.checked))
														dispatch(lrAccountActions.calculateCommonChargeAmount(i,e.target.checked))
													}}
												/>
											</li>
											<li><span>{v.get('runningDate')}</span></li>
											<TableOver
												textAlign='left'
												className='account-flowNumber'
												onClick={() => {
													dispatch(yllsActions.getYllsBusinessData(v,() => this.setState({yllsVisible: true})))
												}}
											>
												<span>{v.get('flowNumber')}</span>
											</TableOver>
											<li><span>{v.get('categoryName')}</span></li>
											<li><span>{v.get('runningAbstract')}</span></li>
											<li>
												<span>
													{{
													LX_FYZC:'费用支出',
													LX_XCZC:'薪酬支出',
													LX_JK:'借款',
													LX_JTGZXJ:'计提工资薪金',
													LX_ZJTX:'折旧摊销'
													}[v.get('runningType')]}
												</span>
											</li>
											<TableOver textAlign='right'>
												<span style={{marginRight:'4px'}}>
													{formatNum(Number(v.get('amount')).toFixed(2))}
												</span>
											</TableOver>

										</TableItem>
									):''
							}
							<TableItem className='lrAccount-table-sfgl-width' key='total'>
								<li	></li>
								<li></li>
								<li></li>
								<li></li>
								<li>合计</li>
								<li>

								</li>
								<TableOver textAlign='right'>
									<span style={{marginRight:'4px'}}>
										{
											formatNum(paymentList.reduce((total,item) => total + Number(item.get('amount')),0).toFixed(2))
										}
									</span>
								</TableOver>
							</TableItem>
						</TableBody>

					</TableAll>
					{
						yllsVisible ?
						<Ylls
							yllsVisible={yllsVisible}
							dispatch={dispatch}
							yllsState={yllsState}
							onClose={() => this.setState({yllsVisible: false})}
							editLrAccountPermission={true}
							panes={panes}
							lsItemData={lsItemData}
							uuidList={paymentList.filter(v => v.get('runningAbstract') !== '期初余额' && v.get('uuid'))}
							showDrawer={() => this.setState({yllsVisible: true})}
							refreshList={() => dispatch(lrAccountActions.getBusinessList(runningDate, cardUuid))}
							// inputValue={inputValue}
						/>
						: ''
					}
					<QcModalForMulti
						showCommonChargeModal={this.state.showCommonChargeModal}
						MemberList={MemberList}
						thingsList={thingsList}
						selectThingsList={selectThingsList}
						dispatch={dispatch}
						runningDate={runningDate}
						// categoryTypeObj={categoryTypeObj}
						selectedKeys={selectedKeys}
						selectItem={selectItem}
						selectList={selectList}
						projectCard={projectCard}
						cancel={() => {
							this.setState({showCommonChargeModal:false})
						}}
					/>

				</div>
				:
				null
		)
	}
}
