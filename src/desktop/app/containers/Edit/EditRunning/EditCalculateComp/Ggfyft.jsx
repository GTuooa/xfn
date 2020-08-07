import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { formatNum, formatMoney, numberCalculate }	from 'app/utils'
import { DatePicker, Input, Select, Checkbox, message, Icon, Button,Radio } from 'antd'
const RadioGroup = Radio.Group
import NumberInput from 'app/components/Input'
import XfIcon from 'app/components/Icon'
import { XfInput } from 'app/components'
const Option = Select.Option
import { toJS, fromJS } from 'immutable'
import moment from 'moment'

import * as Limit from 'app/constants/Limit.js'
import { TableBody, TableTitle, TableItem, TableAll, TableOver, Tab, TableBottomPage} from 'app/components'
import  MultipleModal  from './component/MultipleModal'
import CategorySelect from './component/CategorySelect'
import StockSingleModal from './component/StockSingleModal'
import { numberTest } from '../common/common'
import { getUuidList } from './component/CommonFun'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'

@immutableRenderDecorator
export default
class Ggfyft extends React.Component {

    static displayName = 'Ggfyft'

	constructor() {
		super()
		this.state = {
			showCommonChargeModal:false,
            showSingleModal: false,
            selectTreeUuid: 'all',
            selectTreeLevel: 0,
        }
	}
	componentDidMount() {
		// const CommonChargeTemp = this.props.CommonChargeTemp
        // const oriState = CommonChargeTemp.get('oriState')
		// this.props.dispatch(editCalculateActions.getChargeProjectCard(oriState))
	}
	render() {
		const {
			dispatch,
			CommonChargeTemp,
			disabledBeginDate,
			hideCategoryList,
			panes,
			insertOrModify,
			commonCardObj,
            paymentType,
            calculateViews
		} = this.props
        const { showSingleModal, selectTreeUuid, selectTreeLevel } = this.state
		const reg = /^-{0,1}\d*\.?\d{0,2}$/
		// let paymentTypeList = {'LB_GGFYFT': '项目公共费用分摊'}
        const paymentTypeStr = calculateViews.get('paymentTypeStr')

		const modify = insertOrModify === 'modify' ? true : false
        const selectItem = commonCardObj.get('selectItem')
        const selectI = commonCardObj.get('selectI')
        const selectList = commonCardObj.get('selectList')
        const selectedKeys = commonCardObj.get('selectedKeys')
        // const oriDate = insertOrModify === 'insert'?this.props.oriDate:CommonChargeTemp.get('oriDate')
        const oriDate = this.props.oriDate
		const oriAbstract = CommonChargeTemp.get('oriAbstract')
		const runningIndex = CommonChargeTemp.get('runningIndex')

        const pageSize = CommonChargeTemp.get('pageSize')
		const totalNumber = CommonChargeTemp.get('totalNumber')
        const cardPages = CommonChargeTemp.get('cardPages')
        const currentCardPage = CommonChargeTemp.get('currentPage')
        const modifycurrentPage = CommonChargeTemp.get('modifycurrentPage')
		const start = (modifycurrentPage - 1) * pageSize
		const end = modifycurrentPage * pageSize

		const paymentList = insertOrModify === 'insert' ? CommonChargeTemp.get('paymentList') : CommonChargeTemp.get('paymentList').slice(start,end)
		const shareTypeList = CommonChargeTemp.get('shareTypeList')
		const projectCardList = CommonChargeTemp.get('projectCardList')
		const jrIndex = CommonChargeTemp.get('jrIndex')
		const oriState = CommonChargeTemp.get('oriState')
		const projectList = CommonChargeTemp.get('projectList')
		const propertyCost = CommonChargeTemp.get('propertyCost')

        const tabName = CommonChargeTemp.get('tabName')
        // const tabList = insertOrModify === 'insert' ?  : (tabName === '0' ? [{key:'0',value:'分摊支出'}] : [{key:'1',value:'分摊收入'}])
        const paySelectList = calculateViews.get('selectList')
        const paySelectItem = calculateViews.get('selectItem')
        const curPage = insertOrModify === 'insert' ? currentCardPage : modifycurrentPage

        let selectAcAll = true
		paymentList && paymentList.size && paymentList.map( item => {
			if(paySelectList.indexOf(item.get('jrJvUuid')) === -1){
				selectAcAll = false
			}
		})

		// const amount = CommonChargeTemp.get('amount')?CommonChargeTemp.get('amount'):0
        let amount = paySelectItem ? paySelectItem.reduce((pre,cur) => pre += Number(cur.get('notHandleAmount') || 0),0) : 0
        const memberList = commonCardObj.get('memberList')
        const thingsList = commonCardObj.get('thingsList')
        const cardPageObj = commonCardObj.get('cardPageObj')
		const disabledDate = function (current, modify, detailDate) {
			if (modify) {
				return current && (moment(disabledBeginDate) > current || current < moment(detailDate))
			}
			return current && (moment(disabledBeginDate) > current)
		}
        let totalAmount = 0

		const finalUuidList = getUuidList(paymentList) // 上下条
		return (
			paymentType === 'LB_GGFYFT'?
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
                                        dispatch(editCalculateActions.changeEditCalculateCommonState('CommonChargeTemp','jrIndex', e.target.value))
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
										const detailDate = paymentList.getIn([0, 'oriDate'])
										return disabledDate(current, modify, detailDate)
									} else {
										return disabledDate(current)
									}


								}}
								value={moment(oriDate)}
								onChange={value => {
								const date = value.format('YYYY-MM-DD')
                                // if (insertOrModify === 'insert') {
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
                                // } else {
                                //     dispatch(editCalculateActions.changeEditCalculateCommonState('CommonCharge', 'oriDate', date))
                                // }
								!modify && dispatch(editCalculateActions.getProjectShareList(date,oriState,tabName))
							}}/>
						</div>
					</div>
                        <CategorySelect
                            dispatch={dispatch}
                            insertOrModify={insertOrModify}
                            paymentTypeStr={paymentTypeStr}
                            hideCategoryList={hideCategoryList}
                        />
                        {
                            shareTypeList ?
                            <div className="edit-running-modal-list-item">
                                <label></label>
                                <div>
                                    <RadioGroup
                                        value={oriState}
                                        disabled={insertOrModify === 'modify'}
                                        onChange={e => {
                                            dispatch(editCalculateActions.changeEditCalculateCommonString('CommonCharge', 'oriState', e.target.value))
                                            dispatch(editCalculateActions.getProjectShareList(oriDate,e.target.value,0))
                                            dispatch(editCalculateActions.changeEditCalculateCommonString('CommonCharge', 'projectCardList', fromJS([])))
                                        }}>
                                        {
                                            shareTypeList.map((item,i) => {
                                                return <Radio key="i" value={item.get('oriState')}>{item.get('typeName')}</Radio>
                                            })
                                        }
                                    </RadioGroup>
                                </div>
                            </div> : null
                        }
                        <div className='accountConf-separator'></div>

						<div className="edit-running-modal-list-item">
							<label>摘要：</label>
							<div>
								<Input className="focus-input"
                                    onFocus={(e) => {
                                        document.getElementsByClassName('focus-input')[0].select();
                                    }}
									value={oriAbstract}
									onChange={(e) => {
										dispatch(innerCalculateActions.changeEditCalculateCommonString('CommonCharge', 'oriAbstract', e.target.value))
									}}
								/>
							</div>
						</div>
                        <div className='accountConf-separator'></div>
						{
							projectCardList.size?
							projectCardList.map((v,i) =>{
                                const propertyCostName = {
                                    'XZ_SALE':'销售费用',
                                    'XZ_MANAGE':'管理费用',
                                    'XZ_FINANCE':'财务费用',
                                    '': ''
                                }[v.get('propertyCost') || '']
                                totalAmount = numberCalculate(totalAmount,v.get('amount'))
                                return <div>
                                    <div className="edit-running-modal-list-item">
                                        <label>项目({i+1})：</label>
                                        <div className='chosen-right'>
                                            {
                                                <Select
                                                    combobox
                                                    showSearch
                                                    value={`${v.get('code') !== 'COMNCRD' && v.get('code') !== 'ASSIST' && v.get('code') !== 'INDIRECT' && v.get('code') ? v.get('code') : ''} ${v.get('name')||''}`}
                                                    onChange={(value,options) => {
                                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                                        const cardUuid = options.props.uuid
                                                        const code = valueList[0]
                                                        const name = valueList[1]
                                                        const amount = v.get('amount')
                                                        const percent = v.get('percent')
                                                        dispatch(editCalculateActions.changeEditCalculateCommonString('CommonCharge', ['projectCardList',i], fromJS({cardUuid,name,code,amount,percent})))
                                                    }}
                                                >
                                                    {projectList.map((v, i) =>
                                                        <Option
                                                            key={v.get('uuid')}
                                                            value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                                            uuid={v.get('uuid')}
                                                        >
                                                            {`${v.get('code') !== 'COMNCRD' && v.get('code') !== 'ASSIST' && v.get('code') !== 'INDIRECT' ? v.get('code'):''} ${v.get('name')}`}
                                                        </Option>
                                                    )}
                                                </Select>

                                            }
                                            <div className='chosen-word'
                                                onClick={() => {
                                                    dispatch(editCalculateActions.getChargeProjectCard(oriState,'CommonChargeTemp',1))
                                                    dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectI', i))
                                                    this.setState({
                                                        showSingleModal:true
                                                    })
                                            }}>选择</div>
                                        </div>
                                        <span className='icon-content'>
                                            <span>
                                                <XfIcon
                                                    type="sob-delete"
                                                    theme="outlined"
                                                    onClick={() => {
                                                        dispatch(editCalculateActions.changeEditCalculateCommonString('CommonCharge', 'projectCardList', projectCardList.splice(i,1)))

                                                    }}
                                                />
                                            </span>
                                        </span>
                                    </div>
                                    {
                                        v.get('code') === 'COMNCRD' ?
                                        <div className="edit-running-modal-list-item">
                                            <label>费用性质：</label>
                                            <div>
                                                <Select
                                                    value={propertyCostName}
                                                    onChange={value => {
                                                        dispatch(editCalculateActions.changeEditCalculateCommonString('CommonCharge', ['projectCardList',i,'propertyCost'], value))
                                                    }}
                                                >
                                                    <Option key={'a'} value={'XZ_SALE'}> 销售费用 </Option>
                                                    <Option key={'b'} value={'XZ_MANAGE'}> 管理费用 </Option>
                                                    <Option key={'c'} value={'XZ_FINANCE'}> 财务费用 </Option>

                                                </Select>
                                            </div>
                                        </div> : null
                                    }
									<div className="edit-running-modal-list-item" >
										<label>分摊金额:</label>
										<div style={{marginRight:'10px'}}>
											<XfInput
                                                mode="amount"
                                                negativeAllowed={true}
												disabled={amount==0}
												value={v.get('amount')?v.get('amount'):''}
                                                onChange={(e) =>{
                                                    let value = e.target.value
                                                    if (Math.abs(value) > Math.abs(amount)) {
                                                        message.info('金额不能大于待分摊金额')
                                                    } else {
                                                        const percent = (Number(value)/Number(amount)*100).toFixed(2)
                                                        dispatch(innerCalculateActions.changeEditCalculateCommonString('CommonCharge', ['projectCardList',i,'amount'], value))
                                                        dispatch(innerCalculateActions.changeEditCalculateCommonString('CommonCharge', ['projectCardList',i,'percent'], percent))
                                                    }
                                                }}
                                                onKeyDown={(e)=>{
                                                    if(e.keyCode === Limit.EQUAL_KEY_CODE){
                                                        const allAmount = numberCalculate(totalAmount,v.get('amount'),2,'subtract')
                                                        const value = numberCalculate(amount,allAmount,2,'subtract')
                                                        if(value >= 0 && amount >= 0 || value <= 0 && amount <= 0){
                                                            if (Math.abs(value) > Math.abs(amount)) {
                                                                message.info('金额不能大于待分摊金额')
                                                            } else {
                                                                const percent = (Number(value)/Number(amount)*100).toFixed(2)
                                                                dispatch(innerCalculateActions.changeEditCalculateCommonString('CommonCharge', ['projectCardList',i,'amount'], value))
                                                                dispatch(innerCalculateActions.changeEditCalculateCommonString('CommonCharge', ['projectCardList',i,'percent'], percent))
                                                            }
                                                        }
                                                    }
                                                }}
											/>

										</div>
										<span className='percent-content'>
											占比：
                                            <XfInput
                                                mode="amount"
												disabled={amount==0}
												style={{width:'39px', padding:0, marginRight: '19px'}}
												value={v.get('percent')?v.get('percent'):''}
												onChange={(e) => {
													let value = e.target.value
                                                    const percent = Number(e.target.value)/100
                                                    dispatch(innerCalculateActions.changeEditCalculateCommonString('CommonCharge', ['projectCardList',i,'percent'], value))
                                                    dispatch(innerCalculateActions.changeEditCalculateCommonString('CommonCharge', ['projectCardList',i,'amount'], (Number(amount)*percent).toFixed(2)))
												}}
											/>
											%
										</span>
									</div>
                                    {
                                        i+1 === projectCardList.size ? null : <div className='accountConf-separator'></div>
                                    }

								</div>
                            }

							):''
						}
						<div className="edit-running-modal-list-item" >
							<label></label>
							<div className='calculate-inventory-button'>
                            <Button
                                onClick={() => {
                                    this.setState({
                                        showCommonChargeModal:true
                                    })
                                    dispatch(editCalculateActions.getChargeProjectCard(oriState,'CommonChargeTemp',1))
                                }}
                            >
                                <XfIcon type='big-plus' /> &nbsp;{'添加分摊项目'}
                            </Button>
							</div>

						</div>
                        {
                            projectCardList.size ?
                            <div className="edit-running-modal-list-item" >
                                <label>合计金额：</label>
                                <div>{formatMoney(totalAmount)}</div>
                            </div> : null
                        }


						<div className='accountConf-separator'></div>
						<div className={`editRunning-detail-title-no-select ${oriState === 'STATE_GGFYFT' ? 'editRunning-detail-title-tabs' : ''}`}>
                        {
                            oriState === 'STATE_GGFYFT' ?
                            <div className='editRunning-detail-title-bottom'>
								<span>
                                    <Radio.Group
                                        buttonStyle="solid"
                                        onChange={(e) => {
                                            if(insertOrModify === 'insert'){
                                                dispatch(innerCalculateActions.changeEditCalculateCommonString('CommonCharge', 'tabName',e.target.value))
                                                dispatch(editCalculateActions.getProjectShareList(oriDate,oriState,e.target.value))
                                                dispatch(editCalculateActions.manageCheckboxCheckAll(true, paymentList,'jrJvUuid'))
                                            }
                                        }}
                                        value={tabName}
                                    >
                                        <Radio.Button value="0" disabled={insertOrModify !== 'insert' && Number(tabName) === 1}>分摊支出</Radio.Button>
                                        <Radio.Button value="1" disabled={insertOrModify !== 'insert' && Number(tabName) === 0}>分摊收入</Radio.Button>
                                     </Radio.Group>

                                    <span className='detail-title-bottom-message'>
                                    {
                                        paySelectItem && paySelectItem.size ?
                                        `已勾选流水：${paySelectItem?paySelectItem.size:''}条` :
                                        '请勾选需要核账的流水：'
                                    }

                                    </span>

								</span>
								<span>
									{`待分摊金额：`}<span>{amount?Number(amount).toFixed(2):''}</span>
								</span>
							</div>
                            :
                            <div className="editRunning-detail-title-top">
                                {
                                    paySelectItem && paySelectItem.size ?
                                        `已勾选流水：${paySelectItem?paySelectItem.size:''}条` :
                                        '请勾选需要核账的流水：'
                                }
                            </div>
                        }


						</div>
						<TableAll className="editRunning-table">
							<TableTitle
								className="editRunning-table-ggfy-width"
								titleList={['日期','流水号','流水类别','摘要', '类型','待处理金额']}
								selectAcAll={selectAcAll}
								hasCheckbox={true}
								onClick={(e) => {
									e.stopPropagation()
									if (selectAcAll) {
										// const newPaymentList = paymentList.map(v => v.set('beSelect',false))
										// dispatch(innerCalculateActions.changeEditCalculateCommonString('CommonCharge', 'paymentList',newPaymentList))
										dispatch(innerCalculateActions.changeEditCalculateCommonString('CommonCharge', 'amount',0))
									} else {
										// dispatch(innerCalculateActions.changeEditCalculateCommonString('CommonCharge', 'paymentList',newPaymentList))
										dispatch(innerCalculateActions.changeEditCalculateCommonString('CommonCharge', 'amount',paymentList.reduce((total,item) => total + Number(item.get('notHandleAmount')),0)))
									}

                                    dispatch(editCalculateActions.manageCheckboxCheckAll(selectAcAll, paymentList,'jrJvUuid'))
								}}
							/>
							<TableBody>
							{
								paymentList && paymentList.size ?
									paymentList.map((v,i) => {
                                        const checked = paySelectList.indexOf(v.get('jrJvUuid')) > -1
                                        return <TableItem className='editRunning-table-ggfy-width common-charge-list' key={v.get('uuid')}>
											<li	>
												<Checkbox
													// disabled={Number(v.get('amount'))*amount<0}
													checked={checked}
													onClick={(e) => {
														// dispatch(innerCalculateActions.changeEditCalculateCommonString('CommonCharge', ['paymentList',i,'beSelect'], e.target.checked))
                                                        dispatch(editCalculateActions.accountItemCheckboxCheck(checked, v, i,'jrJvUuid'))
														// dispatch(editCalculateActions.calculateCommonChargeAmount(i,e.target.checked))
													}}
												/>
											</li>
											<li><span>{v.get('oriDate')}</span></li>
											<TableOver
												textAlign='left'
												className='account-flowNumber'
												onClick={(e) => {
                                                    e.stopPropagation()
                                                    dispatch(previewRunningActions.getPreviewRunningBusinessFetch(v, 'lrls',fromJS(finalUuidList),()=>{
                                                        !modify && dispatch(editCalculateActions.getProjectShareList(oriDate,oriState,tabName))
                                                    }))
												}}
											>
												<span>{v.get('jrIndex') ? `${v.get('jrIndex')}号` : ''}</span>
											</TableOver>
											<li><span>{v.get('categoryName')}</span></li>
											<li><span>{v.get('oriAbstract')}</span></li>
											<li>
												<span>
													{v.get('jrJvTypeName')}
												</span>
											</li>
											<TableOver textAlign='right'>
												<span style={{marginRight:'4px'}}>
													{formatMoney(v.get('notHandleAmount'))}
												</span>
											</TableOver>

										</TableItem>
                                    }

									):''
							}
							<TableItem className='editRunning-table-ggfy-width' key='total'>
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
											formatMoney(paymentList.reduce((total,item) => total + Number(item.get('notHandleAmount')),0))
										}
									</span>
								</TableOver>
							</TableItem>
						</TableBody>
                        {
                            <TableBottomPage
								total={totalNumber === 0 ? 1 : totalNumber}
								current={curPage}
								onChange={(page) => {
									insertOrModify === 'insert' ?
									dispatch(editCalculateActions.getProjectShareList(oriDate,oriState,tabName,page)) :
									dispatch(editCalculateActions.changeEditCalculateCommonState('CommonChargeTemp', 'modifycurrentPage', page))
								}}
								totalPages={cardPages}
								pageSize={pageSize}
								showSizeChanger={true}
								hideOnSinglePage={false}
								onShowSizeChange={(curPageSize) => {
									dispatch(editCalculateActions.changeEditCalculateCommonState('CommonChargeTemp', 'pageSize', curPageSize))
									if(insertOrModify === 'insert'){
										dispatch(editCalculateActions.getProjectShareList(oriDate,oriState,tabName,1,curPageSize))
									}else{
										dispatch(editCalculateActions.changeEditCalculateCommonState('CommonChargeTemp', 'modifycurrentPage', 1))
										dispatch(editCalculateActions.changeEditCalculateCommonState('CommonChargeTemp', 'cardPages', Math.ceil(totalNumber/curPageSize)))
									}

								}}
								className={'payment-table-select' }
							/>
                        }

					</TableAll>

					<MultipleModal
						showCommonChargeModal={this.state.showCommonChargeModal}
						MemberList={memberList}
						thingsList={thingsList}
						dispatch={dispatch}
						oriDate={oriDate}
						// categoryTypeObj={categoryTypeObj}
						selectedKeys={selectedKeys}
						selectItem={selectItem}
						selectList={selectList}
						projectCard={projectCardList}
                        oriState={oriState}
                        used={true}//是否启用存货
                        showSelectAll={true}
						cancel={() => {
							this.setState({showCommonChargeModal:false})
						}}
                        cardPageObj={cardPageObj}
					/>
                    <StockSingleModal
                        dispatch={dispatch}
                        showSingleModal={showSingleModal}
                        MemberList={memberList}
                        thingsList={thingsList}
                        selectedKeys={selectedKeys === '' ? [`all${Limit.TREE_JOIN_STR}1`] : selectedKeys}
                        // stockCardList={stockCardList}
                        title={'选择项目'}
                        selectFunc={(item, cardUuid) => {
                            const code = item.code
                            const name = item.name
                            const isOpenedQuantity = item.isOpenedQuantity
                            const isUniformPrice = item.isUniformPrice
                            const allUnit = item.unit ? item.unit : ''
                            dispatch(editCalculateActions.changeEditCalculateCommonString('CommonCharge', ['projectCardList',selectI], fromJS({ cardUuid, name, code, isOpenedQuantity, isUniformPrice, allUnit })))
                            this.setState({
                                showSingleModal: false
                            })
                        }}
                        cancel={() => {
                            this.setState({
                                showSingleModal:false
                            })
                        }}

                        selectListFunc={(uuid, level) => {
                            if (uuid === 'all') {
                                dispatch(editCalculateActions.getChargeProjectCard(oriState,'CommonChargeTemp',1))
                            } else {
                                dispatch(editCalculateActions.getProjectSomeCardList(uuid, level,oriState,1))
                            }
                            this.setState({
                                selectTreeUuid: uuid,
                                selectTreeLevel: level
                            })

                        }}
                        cardPageObj={cardPageObj}
                        paginationCallBack={(value)=>{
                            if (selectTreeUuid === 'all') {
                                dispatch(editCalculateActions.getChargeProjectCard(oriState,'CommonChargeTemp',value))
                            } else {
                                dispatch(editCalculateActions.getProjectSomeCardList(selectTreeUuid, selectTreeLevel,oriState,value))
                            }
                        }}
                    />
				</div> : null
		)
	}
}
