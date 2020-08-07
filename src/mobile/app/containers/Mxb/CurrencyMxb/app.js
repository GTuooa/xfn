import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { toJS, Map, fromJS ,List,Update,filter} from 'immutable'
import thirdParty from 'app/thirdParty'
import { TopMonthPicker } from 'app/containers/components'
import { ButtonGroup, Button, Container, Row, ScrollView,SinglePicker } from 'app/components'
import { Icon, Input, Amount } from 'app/components'

import './kmyeb.less'
import '../AmountMxb/amountmxb.less'
import Item from './Item.jsx'
import * as Limit from 'app/constants/Limit.js'

import * as currencyMxbActions from 'app/redux/Mxb/CurrencyMxb/currencyMxb.action.js'
import * as allActions from 'app/redux/Home/All/other.action'
import * as acAllActions from 'app/redux/Home/All/aclist.actions'
@connect(state => state)
export default
class CurrencyMxb extends React.Component {
    scrollerHeight = 0//滚动容器的高度
    constructor(props) {
        super(props)
        this.state = {
            showAcInfo: `${props.currencyMxbState.get('acid')}:${props.currencyMxbState.get('acName')}`,
            showAc:'全部'
        }
    }

    componentDidMount() {
        thirdParty.setTitle({title: '外币明细表'})
        thirdParty.setIcon({
            showIcon: false
        })
        // thirdParty.setRight({show: false})
        if (sessionStorage.getItem('previousPage') === 'currencyYeb') {
            sessionStorage.removeItem('previousPage')
            // this.props.dispatch(acAllActions.getAcListandAsslistFetch())
        }
        if(sessionStorage.getItem('prevPage')==='cxpz'){
			sessionStorage.removeItem('prevPage')
            const {dispatch,currencyMxbState,history} = this.props
            dispatch(currencyMxbActions.getCurrencyDetailListFetch(currencyMxbState.get('issuedate'), currencyMxbState.get('endissuedate'), currencyMxbState.get('currentFcNumber')))
		}
        const scrollViewHtml = document.getElementsByClassName('scroll-view')[0]
        this.scrollerHeight = parseFloat(window.getComputedStyle(scrollViewHtml).height)
    }
    componentWillReceiveProps(nextprops) {
        if (nextprops.currencyMxbState.get('acid') !== this.props.currencyMxbState.get('acid')) {
            this.setState({
                showAcInfo: `${nextprops.currencyMxbState.get('acid')}:${nextprops.currencyMxbState.get('acName')}`
            })
        }
    }

    render() {
        const {
            dispatch,
            allState,
            currencyMxbState,
            history
        } = this.props
        const { showAcInfo , showAc} = this.state

        thirdParty.setTitle({title: '外币明细表'})
        const issues = allState.get('issues')
        const issuedate = currencyMxbState.get('issuedate')
        const endissuedate = currencyMxbState.get('endissuedate')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)
        const currencyDetailList = currencyMxbState.get('currencyDetailList')
        const jvList = currencyDetailList ? currencyDetailList.get('jvList') : fromJS([])
        const currencyAcList = currencyMxbState.get('currencyAcList')
        const currentFcNumber = currencyMxbState.get('currentFcNumber')
        const currentAcId = currencyMxbState.get('currentAcId')
        const fcNumberInfo = currencyAcList && currencyAcList.find(v => v.get('fcNumber') == currentFcNumber)
        const AcList = fcNumberInfo ? fcNumberInfo.get('acList') : fromJS([])
        // const showAc = showAcInfo ? showAcInfo : '全部'

        const currentPage = currencyMxbState.get('currentPage')

        const acid = currencyMxbState.get('acid')
        const acName = currencyMxbState.get('acName')
        const sourceAcList = AcList.map(u => ({
            key: `${u.get('acid')}${Limit.EMPTY_CONNECT}${u.get('acname')}`,
            value: `${u.get('acid')}${Limit.EMPTY_CONNECT}${u.get('acname')}`
        }))
        const sourceCurrencyList = currencyAcList.map(u => ({
            key: `${u.get('fcNumber')}${Limit.EMPTY_CONNECT}${u.get('name')}`,
            value: `${u.get('fcNumber')}${Limit.EMPTY_CONNECT}${u.get('name')}`
        }))

        // export
        const begin = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
		const end =  endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : begin

		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('excelFcSubOne', {begin: begin, end:end, number: currentFcNumber, acid: currentAcId ? currentAcId : '', assid: '', asscategory: ''}))
		const ddPDFCallback = () => dispatch => dispatch(allActions.allExportDo('pdfFcSub', {begin: begin, end: end, number: currentFcNumber, acid: currentAcId ? currentAcId : '', assid: '', asscategory: ''}))
        dispatch(allActions.navigationSetMenu('lrb', ddPDFCallback, ddExcelCallback))

        return (
            <Container className="kmyeb amountmxb currencymxb">
                <TopMonthPicker
                    issuedate={issuedate}
                    source={issues}
                    callback={(value) => dispatch(currencyMxbActions.getCurrencyDetailListFetch(value, endissuedate, currentFcNumber))}
					onOk={(result) => dispatch(currencyMxbActions.getCurrencyDetailListFetch(result.value, endissuedate, currentFcNumber))}
                    showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
						//dispatch(currencyMxbActions.changeCurMxbBeginDate(result.value, false))
                        dispatch(currencyMxbActions.getCurrencyDetailListFetch(result.value, '', currentFcNumber))
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						dispatch(currencyMxbActions.getCurrencyDetailListFetch(issuedate, result.value, currentFcNumber))
					}}
					changeEndToBegin={()=>{//跨期变为单期之后 使endissuedate为空 重新获取数据
						dispatch(currencyMxbActions.getCurrencyDetailListFetch(issuedate, '', currentFcNumber))
					}}

                />
                <Row className="amountmxb-title">
					<div className="amountmxb-title-acinfo">
						<span className="amountmxb-title-ac">{`${currencyDetailList.get('number')}_${currencyDetailList.get('name')}`}</span>
                        <div style={{'flex':1,textAlign:'right'}}>
							<SinglePicker district={sourceCurrencyList.toJS()} value="" onOk={(result) => {
                                const fcNumber = result.value.split(Limit.EMPTY_CONNECT)[0]
                                dispatch(currencyMxbActions.getCurrencyDetailListFetch(issuedate, endissuedate, fcNumber))
							}}>
                                <Icon type="triangle"/>
							</SinglePicker>
						</div>
					</div>
                    {
                        acName?
                        <SinglePicker district={sourceAcList.toJS()} value='' onOk={(result) => {
                            const acid = result.value.split(Limit.EMPTY_CONNECT)[0]
                            this.setState({
                                showAcInfo: result.value.replace(Limit.EMPTY_CONNECT, '：')
                            })
                            dispatch(currencyMxbActions.getCurrencyDetailListFetch(issuedate, endissuedate, currentFcNumber, acid))
                        }}>
                            <div className="amountmxb-title-assinfo">
                                <span>
                                    <span>{AcList.size ? showAcInfo : '无'}</span>
                                    {AcList.size ? <Icon type="arrow-down"/> : ''}
                                </span>
                            </div>
                        </SinglePicker>
                        :
                        <SinglePicker district={sourceAcList.toJS()} value='' onOk={(result) => {
                            const acid = result.value.split(Limit.EMPTY_CONNECT)[0]
                            this.setState({
                                showAc: result.value.replace(Limit.EMPTY_CONNECT, '：')
                            })
                            dispatch(currencyMxbActions.getCurrencyDetailListFetch(issuedate, endissuedate, currentFcNumber, acid))
                        }}>
                            <div className="amountmxb-title-assinfo">
                                <span>
                                    <span>{showAc}</span>
                                    {AcList.size ? <Icon type="arrow-down"/> : ''}
                                </span>
                            </div>
                        </SinglePicker>
                    }
                     {/* <SinglePicker district={sourceAcList.toJS()} value='' onOk={(result) => {
                        const acid = result.value.split(Limit.EMPTY_CONNECT)[0]
                        this.setState({
                            showAcInfo: result.value.replace(Limit.EMPTY_CONNECT, '：')
                        })
                        dispatch(currencyMxbActions.getCurrencyDetailListFetch(issuedate, endissuedate, currentFcNumber, acid))
                    }}>
                        <div className="amountmxb-title-assinfo">
                            <span>
                                <span>{AcList.size ? showAc : '无'}</span>
                                {AcList.size ? <Icon type="arrow-down"/> : ''}
                            </span>
                        </div>
                    </SinglePicker>  */}
				</Row>
				<Row className="amountmxb-main-top">
					<span className="amountmxb-main-amount-odd">期初<span className="amountmxb-main-amount-odd-direction">(借方)</span></span>
					<span className="amountmxb-main-amount">
						<Amount showZero={true}>{currencyDetailList.get('openingBalance')}</Amount>
						<Amount className="mxb-amount-color" showZero={true}>{currencyDetailList.get('fcOpeningBalance')}</Amount>
					</span>

				</Row>
                <ScrollView
                    flex="1"
                    uniqueKey="currencymxb-scroll"
                    savePosition
                    onScroll={(e)=>{
                        const scrollY = e.target.scrollTop
                        if (scrollY + this.scrollerHeight + 100 >= currentPage*Limit.MXB_LOAD_SIZE*78 && currentPage < jvList.size/Limit.MXB_LOAD_SIZE) {
                            dispatch(currencyMxbActions.changeCurrencyCurrentPage(currentPage+1))
                        }
                    }}
                >
                    <ul className="amountmxb-main-list">
                        {jvList.slice(0,currentPage*Limit.MXB_LOAD_SIZE).map((u,i) =>
                            <Item
                                key={i}
                                idx={i}
                                item={u}
                                dispatch={dispatch}
                                issuedate={issuedate}
                                history={history}
                                jvList={jvList}
                            />
                        )}
					</ul>
				</ScrollView>
                <Row className="amountmxb-main-top">
					<span className="amountmxb-main-amount-odd">期末<span className="amountmxb-main-amount-odd-direction">(借方)</span></span>
					<span className="amountmxb-main-amount">
						<Amount showZero={true}>{currencyDetailList.get('closingBalance')}</Amount>
						<Amount className="mxb-amount-color" showZero={true}>{currencyDetailList.get('fcClosingBalance')}</Amount>
					</span>
				</Row>
            </Container>
        )
    }
}
