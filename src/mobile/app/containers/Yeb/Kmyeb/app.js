import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { toJS, Map } from 'immutable'
import thirdParty from 'app/thirdParty'

import { Container, Row, ScrollView } from 'app/components'
import { MutiPeriodMoreSelect } from 'app/containers/components'

import './kmyeb.less'
import Ba from './Ba'

import * as allActions from 'app/redux/Home/All/other.action'
import * as kmyebActions from 'app/redux/Yeb/Kmyeb/kmyeb.action.js'

@connect(state => state)
export default
class Kmyeb extends React.Component {

    componentDidMount() {
        thirdParty.setTitle({title: '科目余额表'})
        thirdParty.setIcon({showIcon: false})
        if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(kmyebActions.getPeriodAndBalistFetch())
		}
    }

    render() {
        const {
            history,
            dispatch,
            allState,
            kmyebState
        } = this.props

        const issuedate = kmyebState.get('issuedate')
        const issues = allState.get('issues')
		const chooseValue = kmyebState.getIn(['views','chooseValue'])
        const endissuedate = kmyebState.get('endissuedate')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)
		const end = endissuedate ? endissuedate : issuedate

		const balist = kmyebState.get('balist')
		const detailList = balist.get('detailList')
		const showedLowerAcIdList = kmyebState.get('showedLowerAcIdList')
		
		const loop = (data) => data.map((item, index) => {

			const acId = item.get('acId')
			const backgroundColor = acId.length > 4 ? '#FEF3E3' : '#fff'
			const isExpanded = showedLowerAcIdList.some(w => acId === w)

			if (item.get('childList') && item.get('childList').size) {
				return (
					<div key={index}>
						<Ba
							key={acId}
							className={acId.length > 4 ? 'upacid' : ''}
							style={{backgroundColor}}
							ba={item}
							hasSub={true}
							isExpanded={isExpanded}
							dispatch={dispatch}
							issuedate={issuedate}
							endissuedate={endissuedate}
							history={history}
							chooseValue={chooseValue}
						/>
						{showedLowerAcIdList.indexOf(acId) > -1 ? loop(item.get('childList')) : null}
					</div>
				)
			} else {
				return (
		            <Ba
						key={acId}
						className={acId.length > 4 ? 'upacid' : ''}
						style={{backgroundColor}}
						ba={item}
						hasSub={false}
						dispatch={dispatch}
						issuedate={issuedate}
						endissuedate={endissuedate}
						history={history}
						chooseValue={chooseValue}
					/>
		        )
			}
		})

        // export
		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('kmyebexcelsend', {begin: issuedate ? issuedate : '', end: endissuedate ? endissuedate : ''}))
		const ddPDFCallback = () => dispatch => dispatch(allActions.allExportDo('pdfkmyeexport', {begin: issuedate ? issuedate : '', end: endissuedate ? endissuedate : ''}))
        const allddPDFCallback = () => dispatch => dispatch(allActions.allExportDo('pdfVcAll', {begin: issuedate ? issuedate : '', end: endissuedate ? endissuedate : ''}))
		// dispatch(allActions.navigationSetMenu('lrb', ddPDFCallback, ddExcelCallback))
        dispatch(allActions.navigationSetMenu('kmyeb', ddPDFCallback, ddExcelCallback, allddPDFCallback))

        return (
            <Container className="kmyeb">
				<MutiPeriodMoreSelect
					start={issuedate}
					end={endissuedate}
					issues={issues} //默认显示日期
					nextperiods={nextperiods}
					chooseValue={chooseValue}
					onBeginOk={(value) => {//跨期选择完开始时间后
						dispatch(kmyebActions.getBaListFetch(value, value))
					}}
					onEndOk={(value1,value2) => {//跨期选择完结束时间后
						dispatch(kmyebActions.getBaListFetch(value1, value2))

					}}
					changeChooseValue={(value)=>
						dispatch(kmyebActions.changeAcYebChooseValue(value))
					}
				/>
				<Row className='ba-title'>
					<div className='ba-title-item'>期初余额</div>
					<div className='ba-title-item'>本期借方</div>
					<div className='ba-title-item'>本期贷方</div>
					<div className='ba-title-item'>期末余额</div>
				</Row>
				<ScrollView flex="1" uniqueKey="kmyeb-scroll" savePosition>
					<div className='ba-list'>
						{loop(detailList)}
					</div>
				</ScrollView>
            </Container>
        )
    }
}