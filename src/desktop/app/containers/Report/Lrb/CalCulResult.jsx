import React, { PropTypes, Fragment } from 'react'
import { fromJS, toJS } from 'immutable'
import { connect } from 'react-redux'
import ReactEcharts from 'echarts-for-react'

import * as lrbActions from 'app/redux/Report/Lrb/lrb.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'

import PageSwitch from 'app/containers/components/PageSwitch'
import { Export } from 'app/components'
import { formatMoney } from 'app/utils'
import { TableWrap, TableBody, TableTitle, TableAll, TableItem } from 'app/components'
import { Select, Modal, Button, Checkbox } from 'antd'
import { ROOT } from 'app/constants/fetch.constant.js'
import Table from './Table.jsx'
import Rulers from './Rulers'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import './style/index.less'
import XfnIcon from 'app/components/Icon'
import CalCulateChar from './CalculateChar'
import CalculateResultTable from './CalculateResultTable'

@connect(state => state)
export default
class CalCulResult extends React.Component {
	shouldComponentUpdate(nextprops,nextstate) {
		return this.props.allState != nextprops.allState || this.props.lrbState != nextprops.lrbState || this.props.homeState != nextprops.homeState || this.state !== nextstate
	}
	getColor = (linename,value) => {
        if(linename.substr(-4,4)==='营业收入'){
            return 'rgb(255,131,72)'
        }else if(linename.substr(-4,4)==='营业成本'){
            return 'rgb(92,167,242)'
        }else if(linename.substr(-4,4)==='营业税金'){
            return 'rgb(2,129,255)'
        }else if(linename==='营业费用'){
            return 'rgb(2,93,255)'
        }else if(linename==='营业利润'){
            if(value>0){
                return 'rgb(255,181,73)'
            }else if(value===0){
                return '#FFF'
            }else if(value<0){
                return 'rgb(17,195,224)'
            }
        }
    }

	render() {

		const { lrbState, dispatch, allState, homeState } = this.props
		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])

		const incomestatement = lrbState.get('incomestatement')
		const issuedate = lrbState.get('issuedate')
		const lrbRuleModal = lrbState.get('lrbRuleModal')
        const issues = allState.get('issues')
		const firstyear = allState.getIn(['period', 'firstyear'])
		const firstmonth = allState.getIn(['period', 'firstmonth'])

		const selectAssId = lrbState.get('selectAssId')
		const assSelectableList = lrbState.get('assSelectableList')
		const assid = assSelectableList.size ? assSelectableList.getIn([selectAssId, 'assid']) : ''

		const endissuedate = lrbState.get('endissuedate')
		const chooseperiods = lrbState.get('chooseperiods')
		const idx = issues.findIndex(v => v === issuedate)
		const lrbYear = issuedate.substr(0, 4)
		const nextperiods = issues.slice(0, idx).filter(v => v.indexOf(lrbYear) === 0)

		const begin = `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`
		const end =  `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`
		const isSelectFirstYear = firstyear != issuedate.substr(0,4) ? true : false //判断当前账期的年是否是firstyear
		const showInitLrb = lrbState.get('showInitLrb')

		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])
		const selfMadeProfitList = lrbState.get('selfMadeProfitList')
		const ifSelfMadeProfitList = lrbState.get('ifSelfMadeProfitList')
		const showChildProfitList = lrbState.get("showChildProfitList")
		const proportionDifference = lrbState.get('proportionDifference')
		const ifSelfTypeList = lrbState.get('ifSelfTypeList')
		const referBegin = lrbState.get('referBegin')
		const referEnd = lrbState.get('referEnd')
		const extraMessageList = lrbState.get('extraMessageList')
		const calculatePage = lrbState.get('calculatePage')
		const measureIssuedate = lrbState.get('measureIssuedate')
		const profitResult = lrbState.get('profitResult')
		const ProfitAndLossResult = lrbState.get('ProfitAndLossResult')
		const incomeTotal = lrbState.get('incomeTotal').toJS()
		const resultList = lrbState.get('resultList')
		const calculType = lrbState.get('calculType')
		const resultListShowChildList = lrbState.get('resultListShowChildList')
		const profit = lrbState.get('profit') || fromJS({})

		incomeTotal.monthaccumulation=ProfitAndLossResult
        resultList.forEach((item)=>{
            if(item.childProfit&&item.childProfit.length>0){
                item.childProfit=item.childProfit.filter(v=>v.checked===true)
            }
        })
		let profitObj={
            linename:'营业利润',
            testShareOfMonth: profitResult===0?0:profitResult/ProfitAndLossResult*100,
            testMonthaccumulation:profitResult
        }
		let profitImg = '',incomeImg;
		if(profitResult>0) {
			profitImg='profitP'
			incomeImg = 'income'
		} else if(profitResult<0) {
			profitImg='profitD'
			incomeImg = 'income'
		} else {
			profitImg='profit0'
			incomeImg = 'income0'
		}
		return (
			<ContainerWrap type="report-lrb" className="calcul-result">
				<FlexTitle>
						<div className="flex-title-left">
							{isSpread || pageList.getIn(['Report','pageList']).size <= 1 ? '' :
								<PageSwitch
									pageItem={pageList.get('Report')}
									onClick={(page, name, key) => {
										dispatch(homeActions.addPageTabPane('ReportPanes', key, key, name))
										dispatch(homeActions.addHomeTabpane(page, key, name))
									}}
								/>
							}
							<span style={{lineHeight:'28px'}}>
								测算结果
							</span>
						</div>
						<div className="flex-title-right">
							<Button onClick={() => {
								dispatch(lrbActions.changeLrbString('showResult',false))
							}}>修改</Button>
							{/* <Button>导出</Button> */}
							{/* <Button>取消</Button> */}
						</div>
				</FlexTitle>
				<div className='calculate-pic'>
					<div  className={`${profitResult=== 0 ?'income0':'income'}`}>
						<div>若营业收入为</div>
						<div>¥ {formatMoney(ProfitAndLossResult)}</div>
					</div>
					<div  className={profitImg}>
						<div>则营业利润为</div>
						<div>¥ {formatMoney(profitResult)}</div>
					</div>
					<div>
						<div className='char-title'>
							测算损益图
						</div>
						<CalCulateChar
							resultList={resultList}
							profitResult={profitResult}
							ProfitAndLossResult={ProfitAndLossResult}
							incomeTotal={incomeTotal}
							profit={profit}
						/>
					</div>

				</div>
				<TableWrap notPosition={true}>
					<TableAll>
						<CalculateResultTable
							resultList={resultList}
							calculType={calculType}
							profitResult={profitResult}
							ProfitAndLossResult={ProfitAndLossResult}
							incomeTotal={incomeTotal}
							profit={profit}
							dispatch={dispatch}
							resultListShowChildList={resultListShowChildList}
						/>
				</TableAll>
				</TableWrap>
			</ContainerWrap>
		)
	}
}
