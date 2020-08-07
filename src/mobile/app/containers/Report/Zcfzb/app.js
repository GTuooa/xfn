import React, { PropTypes } from 'react'
import { fromJS, toJS, Map } from 'immutable'
import { connect }	from 'react-redux'
import * as zcfzbActions from 'app/redux/Report/Zcfzb/zcfzb.action.js'
import thirdParty from 'app/thirdParty'

import { Icon, Container, ScrollView, Row }	from 'app/components'
import { TopMonthPicker } from 'app/containers/components'
import BalanceLine from './BalanceLine'
import { createArray } from 'app/utils'
import '../sheet.less'

import * as allActions from 'app/redux/Home/All/other.action'

const blockList = {
	1: createArray(1, 15),
	2: createArray(16, 14),
	3: createArray(31, 10),
	4: createArray(42, 5),
	5: createArray(48, 5)
}

@connect(state => state)
export default
class Zcfzb extends React.Component {

    componentDidMount() {
        thirdParty.setTitle({title: '资产负债表'})
		thirdParty.setIcon({
            showIcon: false
        })
		// thirdparty.setRight({show: false})
        this.props.dispatch(zcfzbActions.getPeriodAndBalanceSheetFetch())
	//	this.props.dispatch(zcfzbActions.getBalanceSheetFetch('2015-12'))
    }
    render() {
        const {
            zcfzbState,
            dispatch,
            allState,
            homeState
        } = this.props
        const userInfo = homeState.getIn(['data', 'userInfo'])
		const sobInfo = userInfo.get('sobInfo')
		const newJr = homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
		const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr: false
		const issues = isRunning ? zcfzbState.get('issues') : allState.get('issues')
		// const firstDate = issues.getIn([0,'value'])
        // const lastDate = issues.getIn([issues.size-1,'value'])
        const issuedate = zcfzbState.get('issuedate')
        const showedBalanceLineBlockIdxList = zcfzbState.get('showedBalanceLineBlockIdxList') //示例:[1,2,3,4,5]

		const balancesheet = zcfzbState.get('balancesheet')

		//初始化数组
		let showedBalanceLineIdxList = [15, 29, 30, 41, 46, 47, 52, 53]
		//将打开的行块所包含的行数添加至数组
		showedBalanceLineBlockIdxList.forEach((v) => {
			showedBalanceLineIdxList = showedBalanceLineIdxList.concat(blockList[v])
		})
		//过滤数据源中行数在数组内且金额为0的行
		let handleBalanceSheet = balancesheet.map(v =>
			v.set('visible', showedBalanceLineIdxList.indexOf(v.get('lineindex')) > -1 || v.get('closingbalance') || v.get('yearopeningbalance'))
		)
		const begin = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
		const end = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
		const glBegin = issuedate?`${issuedate.substr(0,4)}-${issuedate.substr(5,2)}`:''
		const glEnd = glBegin
		// export
		const ddExcelCallback = () => dispatch => {
			isRunning?
			dispatch(allActions.allExportDo('excelJrsend', {begin: glBegin, end:glEnd}))
			:
			dispatch(allActions.allExportDo('excelsend', {year: issuedate.substr(0,4), month: issuedate.substr(5,2), exportModel: 'balancesheet', action: 'REPORT-BALANCE_SHEET-EXPORT_EXCEL'}))

		}
		const ddPDFCallback = () => dispatch => {
			isRunning?
			dispatch(allActions.allExportDo('pdfJrzcfzexport', {begin: glBegin, end:glEnd}))
			:
			dispatch(allActions.allExportDo('pdfzcfzexport', {year: issuedate.substr(0,4), month: issuedate.substr(5,2)}))

		}

		dispatch(allActions.navigationSetMenu('lrb', ddPDFCallback, ddExcelCallback))


		handleBalanceSheet = handleBalanceSheet
			.insert(0, fromJS({
				linename: '流动资产:',
				lineindex: '',
				closingbalance: '',
				yearopeningbalance: '',
				title: true,
				visible: true,
				blockIdx: 1
			}))
			.insert(16, fromJS({
				linename: '非流动资产:',
				lineindex: '',
				closingbalance: '',
				yearopeningbalance:	'',
				title: true,
				visible: true,
				blockIdx: 2
			}))
			.insert(32, fromJS({
				linename: '流动负债:',
				lineindex: '',
				closingbalance: '',
				yearopeningbalance: '',
				title: true,
				visible: true,
				blockIdx: 3
			}))
			.insert(44, fromJS({
				linename: '非流动负债:',
				lineindex: '',
				closingbalance: '',
				yearopeningbalance: '',
				title: true,
				visible: true,
				blockIdx: 4
			}))
			.insert(51, fromJS({
				linename: '所有者权益:',
				lineindex: '',
				closingbalance: '',
				yearopeningbalance: '',
				title: true,
				visible: true,
				blockIdx: 5
			}))

		// const line30 = balancesheet.find(v => v.get('lineindex') === 30)
		// const line53 = balancesheet.find(v => v.get('lineindex') === 53)

        return (
            <Container>
				<TopMonthPicker
					issuedate={issuedate}
					source={issues} //默认显示日期
					callback={(value) => dispatch(zcfzbActions.getBalanceSheetFetch(value))}
					onOk={(result) => dispatch(zcfzbActions.getBalanceSheetFetch(result.value))}
				/>
				<Row className="sheet-line title" onClick={() => dispatch(zcfzbActions.toggleBalanceLineDisplay())}>
					<span className="linename">项目</span>
					<span className="lineindex">行次</span>
					<span className="amount">期末余额</span>
					<span className="amount-right">年初余额</span>
				</Row>
                <ScrollView flex="1">
                    <dl className="sheet-line-list">
						{handleBalanceSheet.map((v, i) =>
							<BalanceLine
								zc={v}
								key={i}
								showedBalanceLineBlockIdxList={showedBalanceLineBlockIdxList}
								style={{display: v.get('visible') ? '' : 'none'}}
								dispatch={dispatch}
							/>
						)}
                    </dl>
                </ScrollView>
            </Container>
        )
    }
}
