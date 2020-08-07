import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { Map, toJS, fromJS } from 'immutable'
import thirdParty from 'app/thirdParty'
import { TopMonthPicker } from 'app/containers/components'
import { Container, Row, Column, Icon, ButtonGroup , Button, ScrollView, Single } from 'app/components'
import { formatMoney } from 'app/utils'
import './style.less'

import AmbLineChar from './AmbLineChar'
import AmbBarChar from './AmbBarChar'
import AmbPieChar from './AmbPieChar'
import * as ambsybActions from 'app/redux/Report/Ambsyb/ambsyb.action.js'
import * as allActions from 'app/redux/Home/All/other.action'

@connect(state => state)
export default
class Ambsyb extends React.Component {

	componentDidMount() {
        thirdParty.setTitle({title: '阿米巴损益表'})
		thirdParty.setIcon({
            showIcon: false
        })
		thirdParty.setRight({show: false})

		this.props.dispatch(ambsybActions.getAmbAssCategoryList())
		this.props.dispatch(ambsybActions.getPeriodAndAMBIncomeStatementFetch())
    }
	componentWillUnmount() {
		this.props.dispatch(ambsybActions.changeCharDidmount(false))
		this.props.dispatch(ambsybActions.switchCharStatus('损益'))
	}

	constructor() {
        super()
        this.state = {
			// isLineChar: true
			isCross: false//是否跨期
		}
    }


	render() {
        const {
            allState,
            dispatch,
            ambsybState
        } = this.props

		const { isCross } = this.state

        const issuedate = ambsybState.get('issuedate')
        const issues = allState.get('issues')
		const endissuedate = ambsybState.get('endissuedate')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const ambsybYear = issuedate.substr(0, 4)
		const ambsybMonth = issuedate.substr(5, 2)
		// const nextperiods = issues.slice(0, idx).filter(v => v.get('value').indexOf(ambsybYear) === 0).slice(-5)
		// const nextperiods = issues.slice(0, idx).filter(v => v.get('value').indexOf(ambsybYear) === 0).slice(-11)
		const periodStartMonth = allState.getIn(['period', 'periodStartMonth'])
		// const nextperiods = issues.slice(0, idx).filter(v => v.get('value').indexOf(ambsybYear) === 0 || (v.get('value').indexOf(-(-ambsybYear-1)) === 0 && Number(v.get('key').substr(6, 2)) < Number(periodStartMonth)))
		const nextperiods = issues.slice(0, idx).filter(v => Number(ambsybMonth) < Number(periodStartMonth) ? v.get('value').indexOf(ambsybYear) === 0 && Number(v.get('key').substr(6, 2)) < Number(periodStartMonth) :  (v.get('value').indexOf(ambsybYear) === 0 || (v.get('value').indexOf(ambsybYear-1+2) === 0 && Number(v.get('key').substr(6, 2)) < Number(periodStartMonth))) )

		const view = ambsybState.get('view')
		const status = view.get('status')
		const assId = view.get('assId')
		const didMount = view.get('didMount')
		// 当前的辅助类别
		const assCategory = view.get('assCategory')
		// 当前的辅助项目
		// const assList = assCategory ? ambsybState.get('assList').find(v => v.get('asscategory') === assCategory).get('asslist') : fromJS([])
		const assList = ambsybState.getIn(['assList', 0, 'asslist']) ? ambsybState.getIn(['assList', 0, 'asslist']) : fromJS([])

		// 饼图
		const gainAndLoss = ambsybState.get('gainAndLoss')

		// 折线图
		const trendMap = ambsybState.get('trendMap')
		// const lineData = ({
		// 	'收入': () => trendMap.get('incomeForMonth'),
		// 	'支出': () => trendMap.get('payForMonth'),
		// 	'损益': () => trendMap.get('ginAndLossForMonth')
		// }[status])()
		const lineData = ({
			'收入': () => trendMap.get('incomeForMonth').slice(-6),
			'支出': () => trendMap.get('payForMonth').slice(-6),
			'损益': () => trendMap.get('ginAndLossForMonth').slice(-6)
		}[status])()

		// 柱状图
		const detailDrawing = ambsybState.get('detailDrawing')
		const barData = ({
			'收入': () => detailDrawing.get('incomeForMonth'),
			'支出': () => detailDrawing.get('payForMonth'),
			'损益': () => detailDrawing.get('ginAndLossForMonth') ? detailDrawing.get('ginAndLossForMonth') : fromJS([])
		}[status])()

		// 辅助核算可选列表
		let assListJS = assList.toJS()
		assListJS.unshift({assid: '', assname: '全部'})

		const ambSourceList = ambsybState.get('ambSourceList')
		let asslistSource = fromJS(assListJS).map(v => {
			return {
				key: v.get('assid')+ ' ' + v.get('assname'),
				value: v.get('assid')
			}
		})

		// 类别可选列表
		const AsscategoryList = ambsybState.get('assList').map(v => {
			return {
				key: v.get('asscategory'),
				value: v.get('asscategory')
			}
		})

		// 支出、损益、收入	状态切换
		// const nextStatus = ({
		// 	'收入': () => '支出',
		// 	'支出': () => assId && !isLineChar ? '收入' : '损益',
		// 	'损益': () => '收入'
		// }[status])()
		const nextStatus = ({
			'收入': () => '支出',
			'支出': () => '损益',
			'损益': () => '收入'
		}[status])()

		const income = gainAndLoss.get('income')
		const pay = gainAndLoss.get('pay')
		const ginAndLoss = gainAndLoss.get('ginAndLoss')

		const incomeBigger = income >= pay
		//辅助核算被禁用的时间
		const disableTime = assId ? assList.find(v => v.get('assid') === assId).get('disableTime') : ''

		// export
		const begin = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
		const end = endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : begin

		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('excelAMBIncome', {begin: begin, end: end, assCategory: `${assCategory}` }))

		dispatch(allActions.navigationSetMenu('config', '', ddExcelCallback))

		return (
			<Container className="jz ass-config">
				<TopMonthPicker
					issuedate={issuedate}
					source={issues} //默认显示日期
					callback={(value) => {//左右icon的作用
						dispatch(ambsybActions.getAMBIncomeStatementFetch(value, endissuedate, assId, assCategory))
						// this.setState({isLineChar: !isLineChar})
						this.props.dispatch(ambsybActions.switchCharStatus('损益'))
					}}
					onOk={(result) => {//单期选择完起始时间后
						dispatch(ambsybActions.getAMBIncomeStatementFetch(result.value, endissuedate, assId, assCategory))
						// this.setState({isLineChar: !isLineChar})
						this.props.dispatch(ambsybActions.switchCharStatus('损益'))
					}}
					showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
						//dispatch(ambsybActions.changeAmbBeginDate(result.value, false))
						dispatch(ambsybActions.getAMBIncomeStatementFetch(result.value, '', assId, assCategory))
						this.props.dispatch(ambsybActions.switchCharStatus('损益'))
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						dispatch(ambsybActions.getAMBIncomeStatementFetch(issuedate, result.value, assId, assCategory))
						this.props.dispatch(ambsybActions.switchCharStatus('损益'))
					}}
					changeEndToBegin={()=>{//跨期变为单期之后 使endissuedate为空 重新获取数据
						dispatch(ambsybActions.getAMBIncomeStatementFetch(issuedate, '', assId, assCategory))
					}}
				/>
				<Row className="amb-select-wrap">
					<Single
						className="amb-select-category-select"
						district={ambSourceList.toJS()}
						value={assCategory}
						onOk={value => {
							// materialList[i]['unitUuid'] = value['value']
							// materialList[i]['unitName'] = value['key']
							// this.setState({materialList: materialList})
							dispatch(ambsybActions.getAMBIncomeStatementFetch(issuedate, endissuedate, '', value['value']))
						}}
					>
						<span className={"amb-select-name"}>{assCategory}</span>
						<Icon className="amb-select-icon" type="triangle" size="11"></Icon>
					</Single>
					<span className="amb-select-ass-select-middle"></span>
					<Single
						className="amb-select-ass-select"
						district={asslistSource.toJS()}
						onOk={(result) => {
							// this.setState({isLineChar: !isLineChar})
							this.props.dispatch(ambsybActions.switchCharStatus('损益'))
							dispatch(ambsybActions.getAMBIncomeStatementFetch(issuedate, endissuedate, result.value, assCategory))
						}}
					>
						<span className={["amb-select-name", disableTime ? 'amb-select-name-disable' : ''].join(' ')}>{assId === '' ? '全部' : assList.find(v => v.get('assid') === assId).get('assname')}</span>
						<Icon className="amb-select-icon" type="triangle" size="11"></Icon>
					</Single>
				</Row>
				
				<ScrollView className="content" flex='1'>
					<div className="ambysb-charts-wrap">
						<div className="ambysb-title">
							<span className="ambysb-title-text">收支损益关系图<span className="amb-piechar-wrap-unit">(单位：万元)</span></span>
						</div>
						{didMount ?
							<div className="amb-piechar-wrap">

								<AmbPieChar
									gainAndLoss={gainAndLoss}
								/>
							</div> : ''
						}
						<div className="amb-piechar-legend">
							<span className="amb-piechar-amount-left">
								<span className="amb-piechar-name-income">{`${income === '' ? '0.00' : formatMoney(income/10000, 2, '')} 收入`}</span>
								<span className="amb-piechar-income"></span>
							</span>
							<span className="amb-piechar-amount-right">
								<span className="amb-piechar-pay"></span>
								<span className="amb-piechar-name-pay">{`支出 ${pay === '' ? '0.00' : formatMoney(pay/10000, 2, '')}`}</span>
							</span>

							{/* <span className="amb-piechar-pay"></span>
							<span className="amb-piechar-name">支出</span>
							<span className="amb-piechar-amount">{pay}</span> */}
						</div>
					</div>


					{/* <div className={isLineChar ? "ambysb-charts-wrap amb-char-display-none" : "ambysb-charts-wrap"}> */}
					<div className={"ambysb-charts-wrap"}>

						<div
							className="ambysb-title"
							onClick={() => dispatch(ambsybActions.switchCharStatus(nextStatus))}
							>
							<span className="ambysb-title-text">{`${status}走势图`}<span className="amb-piechar-wrap-unit">(单位：万元)</span></span>

							{/* <span className="ambysb-title-char-switch" onClick={() => this.setState({isLineChar: !isLineChar})}><span style={{display: barData.size ? '' : 'none'}}><Icon type="select"/>图形切换</span></span> */}
							<span className="ambysb-title-switch"><Icon type="cutover"/>切换类型</span>
						</div>

						{didMount ?
							// (
							// 	isLineChar ?
							// 	<AmbLineChar
							// 		status={status}
							// 		lineData={lineData}
							// 	/> :
							// 	<AmbBarChar
							// 		status={status}
							// 		dispatch={dispatch}
							// 		status={status}
							// 		assId={assId}
							// 		barData={barData}
							// 	/>
							// )
							<AmbLineChar
								incomeBigger={incomeBigger}
								status={status}
								lineData={lineData}
							/>
							: ''
						}
					</div>
					<div className="ambysb-charts-wrap">
						<div
							className="ambysb-title"
							onClick={() => dispatch(ambsybActions.switchCharStatus(nextStatus))}
							>
							{/* <span style={{display: barData.size ? '' : 'none'}} className="ambysb-title-char-switch" onClick={() => this.setState({isLineChar: !isLineChar})}><Icon type="select"/>图形切换</span> */}
							<span className="ambysb-title-text">{`${status}比较图`}<span className="amb-piechar-wrap-unit">(单位：万元)</span></span>
							<span className="ambysb-title-switch"><Icon type="cutover"/>切换类型</span>
						</div>

						{didMount ?
							(status === '损益' && assId !== '' ?
								<div className="ambysb-ambbarchar-tip">
									<div className="ambysb-ambbarchar-tip-img">
										<img src="data:image/png;base64,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"/>
									</div>
									<div className="ambysb-ambbarchar-tip-content">损益由收入与支出作差得出，无明细科目构成哦</div>
								</div>
								:
								<AmbBarChar
									incomeBigger={incomeBigger}
									status={status}
									dispatch={dispatch}
									status={status}
									assId={assId}
									barData={barData}
								/>
							) : ''
						}
					</div>
				</ScrollView>
			</Container>
		)
	}
}
