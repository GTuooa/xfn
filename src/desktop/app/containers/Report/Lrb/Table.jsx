import React, { PropTypes } from 'react'
import { Map, List ,fromJS} from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import XfnIcon from 'app/components/Icon'
import LrItem from './LrItem.jsx'
import { TableWrap, TableBody, TableTitle, TableAll ,TitleKmye, TableItem, Amount, TableOver, Tab } from 'app/components'
import XfnInput from 'app/components/Input'
import SelfLrbItem from "./SelfLrbItem"
import * as lrbActions from 'app/redux/Report/Lrb/lrb.action.js'
import { debounce, formatMoney } from 'app/utils'
import XfIcon from 'app/components/Icon'
import { Select, Modal, Button, Checkbox, message, Radio, DatePicker, Icon, Input } from 'antd'
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const { RangePicker } = DatePicker
import moment from 'moment'
import DateModal from './DateModal'
import CalCulateItem from './CalCulateItem'

@immutableRenderDecorator
export default
class Table extends React.Component {
	constructor(props){
		super(props)
		this.state={
			showAll:false,
			dateModal:false,
			canDateConfirm:true,
			extraModal:true,
			calculShowAll:false
		}
	}
	render() {
		const {
			incomestatement,
			ifSelfMadeProfitList,
			selfMadeProfitList,
			showChildProfitList,
			dispatch,
			proportionDifference,
			lrbState,
			issues
		} = this.props
		const titleList = ['项目', '行次', '本年累计金额', '本期金额']
		const selfMadeProfitListTitleList =["项目","本年累计金额","本期金额"]
		let { showAll, dateModal, extraModal, calculShowAll } =this.state
		let label=''
		switch(proportionDifference){
			case 'shareDifference':
				label= '占比差值'
				break;
			case 'amountDifference'	:
				label= '金额差值'
				break;
			case 'increaseDecreasePercent':
				label= '涨跌幅'
				break;
		}
		const issuedate = lrbState.get('issuedate')
		const endissuedate = lrbState.get('endissuedate')
		const referChooseValue = lrbState.get('referChooseValue')
		const selfListData = lrbState.get('selfListData')
		const curReferValue = lrbState.get('curReferValue')
		const referBegin = lrbState.get('referBegin')
		const referEnd = lrbState.get('referEnd')
		const extraMessage = lrbState.get('extraMessage')
		const extraMessageList = lrbState.get('extraMessageList')
		const detailList = lrbState.get('detailList')
		const haveSwitchList = lrbState.get('haveSwitchList')
		const cannotTestList = lrbState.get('cannotTestList')
		const cannotChecked = lrbState.get('cannotChecked')
		const amountInput = lrbState.get('amountInput')
		const calculatePage = lrbState.get('calculatePage')
		const calculType = lrbState.get('calculType')
		const incomeTotal = lrbState.get('incomeTotal')
		const profit = lrbState.get('profit') || {}
		const issueList = issues.toJS().reverse()
		let year = issuedate.substr(0,4)
		let month = issuedate.substr(6,2)
		const startMonth= issueList.reduce((pre,cur) => {
			return cur.substr(0,4) === year && cur.substr(6,2) < pre ? cur.substr(6,2) : pre
		},'12')
		const finalMonth= issueList.reduce((pre,cur) => {
			return cur.substr(0,4) === year && cur.substr(6,2) > pre ? cur.substr(6,2) : pre
		},'01')
		const word = referBegin === referEnd ?
            `${referBegin.substr(0,4)}-${referBegin.substr(4,2)}`
            :
            `${referBegin.substr(0,4)}-${referBegin.substr(4,2)}~${referEnd.substr(0,4)}-${referEnd.substr(4,2)}`
		const titleName = {
			'本年累计':'本年累计数据',
			'按账期选择':`${referBegin.substr(0,4)}年第${referBegin.substr(4,2)}期`,
			// '按账期区间选择':`${referBegin.substr(0,4)}-${referBegin.substr(4,2)}~${referEnd.substr(0,4)}-${referEnd.substr(4,2)}数据`

		}[curReferValue] || word + '数据'

		return (
			calculatePage?
			<div className='calcul-page'>
				<div className='calcul-title'>
					<div className='calcul-type'>
						<Tab
							radius
							tabList={[{key:'利润',value:'测利润'},{key:'盈亏',value:'测盈亏'}]}
							activeKey={calculType}
							tabFunc={(item) => {
								if (item.key === '利润') {
									dispatch(lrbActions.changeLrbString('calculType','利润'))
									dispatch(lrbActions.changeLrbString('amountInput',Math.abs(amountInput)))
								} else {
									dispatch(lrbActions.changeLrbString('calculType','盈亏'))
								}
							}}
						/>
					</div>
					{/* <div className='calcul-type'>
						<span style={{backgroundColor:calculType !== '利润'?'#fff':'#f3f3f3'}} onClick={() => {
							dispatch(lrbActions.changeLrbString('calculType','利润'))
							dispatch(lrbActions.changeLrbString('amountInput',Math.abs(amountInput)))
						}}>测利润</span>
						<span style={{backgroundColor:calculType === '利润'?'#fff':'#f3f3f3'}} onClick={() =>  dispatch(lrbActions.changeLrbString('calculType','盈亏'))}>测盈亏</span>
					</div> */}
					<div>
						<span>若营业{calculType === '利润'?'收入':'利润'}为：</span>
						<XfnInput value={amountInput} onChange={(e) => {
							const value = e.target.value
							if(/^(\-|\+)?\d*\.?\d{0,2}$/g.test(value)){
								if (calculType === '利润') {
									if (value === '-') {
										message.info('“营业收入”不可输入为负数')
									} else if (value > 10000000) {
										message.info('金额不可超过千万位')
									} else {
										dispatch(lrbActions.changeLrbString('amountInput',value))
									}
								} else {
									if (Math.abs(value) > 10000000) {
										message.info('金额不可超过千万位')
									} else {
										dispatch(lrbActions.changeLrbString('amountInput',value))
									}
								}
							}
						}}/>
					</div>
					<div>
						<span>则营业{calculType !== '利润'?'收入':'利润'}为：</span>
						<Input disabled value='待测算'/>
					</div>
					<Button type='primary' onClick={ () => {
                        if (calculType==='利润') {
                            if (Number(amountInput)<0) {
                                message.info('请输入有效的营业收入金额')
                            } else {
                                dispatch(lrbActions.startMeasure(calculType))
                                dispatch(lrbActions.showMeasureResult(true))
                            }
                        } else {
                            if (Number(amountInput)>0) {
                                let precentList = detailList.filter(v => v.get('testAmount'))
                                let precent = 0
                                precentList.map((e)=>{
                                    precent = precent + Number(e.get('testShareOfMonth'))
                                })
                                if (precent>100) {
                                    message.info('支出占收入比大于1，与营业利润金额矛盾，请重新设置')
                                } else {
                                    dispatch(lrbActions.startMeasure(calculType))
                                    dispatch(lrbActions.showMeasureResult(true))
                                }
                            } else {
                                dispatch(lrbActions.startMeasure(calculType))
                                dispatch(lrbActions.showMeasureResult(true))
                            }
                        }

                    }}>测算</Button>
				</div>
				<TableWrap notPosition={true}>
					<TableAll>
						<div className="table-title-wrap">
							<ul className='table-title lrb-calcul-table calcul-table-width'>
								<li></li>
								<li>
									项目
									<XfnIcon
										size="14"
										type={calculShowAll?"tableGather":"tableExpand"}
										style={{margin:"auto 5px",color:"#B9B9B9"}}
										onClick={()=>{
											this.setState({calculShowAll:!calculShowAll},()=>{
												dispatch(lrbActions.handleItemShowAll(detailList,!calculShowAll))
											})
										}}
									/>
								</li>
								<li>
									<div><span>本期数据</span></div>
									<div>
										<span>本期金额</span>
										<span>营收占比</span>
									</div>
								</li>
								<li>金额/占比</li>
								<li>预设数据</li>
							</ul>
							<TableBody>
								<TableItem  className="calcul-table-width" line={1}>
									<li></li>
									<TableOver
										textAlign="left"
										isLink={false}
									>
										营业收入
									</TableOver>
									<li>
										<div className='lrb-item'>
											<Amount className={`align-right`}>{incomeTotal.get('monthaccumulation')}</Amount>
											<span className={`align-right`}>{`${formatMoney(incomeTotal.get('shareOfMonth')*100)}%`}</span>
										</div>
									</li>
									<li></li>
									<li></li>
								</TableItem>
								{
									(detailList || []).map((v, i) =>
										<CalCulateItem
											lrItem={v}
											className="calcul-table-width"
											key={i}
											idx={i}
											showChildProfitList={showChildProfitList}
											dispatch={dispatch}
											proportionDifference={proportionDifference}
											haveSwitchList={haveSwitchList}
											cannotTestList={cannotTestList}
											cannotChecked={cannotChecked}
										/>
									)
								}
								<TableItem  className="calcul-table-width" line={detailList.size}>
									<li></li>
									<TableOver
										textAlign="left"
										isLink={false}
									>
										营业利润
									</TableOver>
									<li>
										<div className='lrb-item'>
											<Amount className={`align-right`}>{profit.monthaccumulation}</Amount>
											<span className={`align-right`}>{`${formatMoney(profit.shareOfMonth*100)}%`}</span>
										</div>
									</li>
									<li></li>
									<li></li>
								</TableItem>
							</TableBody>
						</div>
					</TableAll>
				</TableWrap>
			</div>
			:
			<TableWrap notPosition={true}>
			{ifSelfMadeProfitList?
				<TableAll>
					{/*<TableTitle
						className="self-lrb-table"
						titleList={selfMadeProfitListTitleList}
					/>*/}
					<div className="table-title-wrap">
						<ul className={"table-title self-lrb-table lrb-table-width"}>
							<li>
								<span>项目</span>
								<XfnIcon
									size="14"
									type={showAll?"tableGather":"tableExpand"}
									style={{margin:"auto 5px",color:"#B9B9B9"}}
									onClick={()=>{
										this.setState({showAll:!showAll},()=>{
											dispatch(lrbActions.expandTable(this.state.showAll))
										})
									}}
								/>
								<Button
									type='primary'
									onClick={() => {
										dispatch(lrbActions.getMeasureInitData(issuedate,endissuedate))
									}}
									>测算一下</Button>
							</li>
							<li>
								<div>
									<span>
										{titleName}
										<XfnIcon
											type='dateTwo'
											style={{lineHeight:'24px',color:'#5e81d1'}}
											onClick={() => {
												this.setState({dateModal:true})
												dispatch(lrbActions.changeLrbString('referChooseValue',curReferValue))
											}}
										/>
									</span>
								</div>
								<div>
									<span>参考金额</span>
									<span>营收占比</span>
								</div>
							</li>
							<li>
								<div><span>本期数据</span></div>
								<div>
									<span>本期金额</span>
									<span>营收占比</span>
								</div>
							</li>
							<li><span>
									{label}
									<XfnIcon
										type='switch'
										style={{color:'#b9b9b9'}}
										onClick={() => {
											let differenceType=''
											if(proportionDifference==='shareDifference'){
												differenceType = 'amountDifference'
											}else if(proportionDifference==='amountDifference'){
												differenceType = 'increaseDecreasePercent'
											} else if(proportionDifference ==='increaseDecreasePercent'){
												differenceType = 'shareDifference'
											}
											dispatch(lrbActions.changeDifferType(differenceType))
										}}
									/>
							</span></li>
						</ul>
					</div>
					<TableBody>
						{
							(selfMadeProfitList || []).map((v, i) =>
								<SelfLrbItem
									lrItem={v}
									className="lrb-table-width"
									key={i}
									idx={i}
									showChildProfitList={showChildProfitList}
									dispatch={dispatch}
									selfListData={selfListData}
									proportionDifference={proportionDifference}
								/>
							)
						}
						<TableItem line={selfMadeProfitList.size+1}>

							{
								extraMessage.map(v =>
									<span style={{margin:'0 10px 0 5px'}}>{`${v.get('extraName')}：${formatMoney(v.get('extraValue'))} ${v.get('unit')}`}</span>
								)
							}
						</TableItem>
					</TableBody>
				</TableAll>
			:
			<TableAll>
				<TableTitle
					className="bb-table-width self-bb-table"
					titleList={titleList}
				/>
				<TableBody>
					{
						(incomestatement || []).map((v, i) =>
							<LrItem
								lrItem={v}
								className="bb-table-width"
								key={i}
								idx={i}
							/>
						)
					}
				</TableBody>
			</TableAll>}
			{
				dateModal?
				<DateModal
					dateModal={dateModal}
					dispatch={dispatch}
					issuedate={issuedate}
					endissuedate={endissuedate}
					startMonth={startMonth}
					finalMonth={finalMonth}
					year={year}
					referChooseValue={referChooseValue}
					issues={issues}
					referBegin={referBegin}
					referEnd={referEnd}
					onCancel={() => this.setState({dateModal:false})}
				/>:''
			}
			</TableWrap>
		)
	}
}
