import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { toJS, Map } from 'immutable'
import thirdParty from 'app/thirdParty'
import { TopMonthPicker } from 'app/containers/components'
import { ButtonGroup, Button, Container, Row, ScrollView , Select} from 'app/components'
import { Icon, Input } from 'app/components'
import * as currencyYebActions from 'app/redux/Yeb/CurrencyYeb/currencyYeb.action.js'
import * as allActions from 'app/redux/Home/All/other.action'
import Item from './Item.jsx'
import '../Kmyeb/kmyeb.less'
import './currencyyeb.less'

@connect(state => state)
export default
class CurrencyYeb extends React.Component {
    componentDidMount() {
        thirdParty.setTitle({title: '外币余额表'})
        thirdParty.setIcon({
            showIcon: false
        })
        // thirdParty.setRight({show: false})
        if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
            this.props.dispatch(currencyYebActions.getPeriodAndCurrencyListFetch())
		}
        // else {
        //     this.props.dispatch(currencyYebActions.getPeriodAndCurrencyListFetch(this.props.currencyYebState.get('issuedate')))
		// }
    }

    render() {
        const {
            dispatch,
            allState,
            currencyYebState,
            history
        } = this.props

        const issues = allState.get('issues')
        const issuedate = currencyYebState.get('issuedate')
        const currencyList = currencyYebState.get('currencyList')
        const childitemlist = currencyYebState.get('childitemlist')
        const endissuedate = currencyYebState.get('endissuedate')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)

        // export
        const end = endissuedate ? endissuedate : issuedate
		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('excelFcBa', {begin: `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`, end: `${end.substr(0,4)}${end.substr(5,2)}` }))

        const ddPDFCallback = () => dispatch => dispatch(allActions.allExportDo('pdfFcBa', {begin: `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`, end: `${end.substr(0,4)}${end.substr(5,2)}` }))

		dispatch(allActions.navigationSetMenu('lrb', ddPDFCallback, ddExcelCallback))

        const loop=(list,level)=>{
            return list.map((u,i) => {
				const hasSub= u.get('baFcWithAcList').size > 0
                const isExpanded=childitemlist.indexOf(u.get('fcNumber')) > -1 
                const backgroundColor = u.get('acid')==='' ? '#fff' : '#FEF3E3'
				if(hasSub){
					if (level===1) {
						return(
							<div>
								<Item
                                    key={i}
                                    idx={i}
                                    item={u}
                                    history={history}
                                    dispatch={dispatch}
                                    issuedate={issuedate}
                                    endissuedate={endissuedate}
                                    hasSub={hasSub}
									isExpanded={isExpanded}
                                    level={level}
                                    style={{backgroundColor}}
                                />
								{
									isExpanded && loop(u.get('baFcWithAcList'),level+1)
								}
								</div>
							)
					} else{
						const isExpanded=childitemlist.indexOf(u.get('acid')) > -1 
						return(
							<div>
								<Item
                                    key={i}
                                    idx={i}
                                    item={u}
                                    history={history}
                                    dispatch={dispatch}
                                    issuedate={issuedate}
                                    endissuedate={endissuedate}
                                    hasSub={hasSub}
									isExpanded={isExpanded}
                                    level={level}
                                    style={{backgroundColor}}
                                />
								{
									isExpanded && loop(u.get('baFcWithAcList'),level+1)
								}
								</div>
							)
					}
				}
				else {
					return(
						<Item
                            key={i}
                            idx={i}
                            item={u}
                            history={history}
                            dispatch={dispatch}
                            issuedate={issuedate}
                            endissuedate={endissuedate}
                            hasSub={hasSub}
							isExpanded={isExpanded}
                            level={level}
                            style={{backgroundColor}}
                        />
					)
				}
				
				})
        }

        return (
            <Container className="kmyeb currencyyeb">
                <TopMonthPicker
                    issuedate={issuedate}
                    source={issues}
                    callback={(value) => dispatch(currencyYebActions.getPeriodAndCurrencyListFetch(value, endissuedate))}
					onOk={(result) => dispatch(currencyYebActions.getPeriodAndCurrencyListFetch(result.value, endissuedate))}
                    showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
						//dispatch(currencyYebActions.changeCurYebBeginDate(result.value, false))
                        dispatch(currencyYebActions.getPeriodAndCurrencyListFetch(result.value, ''))
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						dispatch(currencyYebActions.getPeriodAndCurrencyListFetch(issuedate, result.value))
					}}
					changeEndToBegin={()=>dispatch(currencyYebActions.getPeriodAndCurrencyListFetch(issuedate, ''))}
                />
                <Row className='ba-title'>
					<div className='ba-title-item'>期初余额</div>
					<div className='ba-title-item'>本期借方</div>
					<div className='ba-title-item'>本期贷方</div>
					<div className='ba-title-item'>期末余额</div>
				</Row>
                <ScrollView flex="1" uniqueKey="currencyyeb-scroll" savePosition>
                    <div className='ba-list'>
                        {loop(currencyList,1)}
                    </div>
				</ScrollView>
            </Container>
        )
    }
}
