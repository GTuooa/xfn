import React from 'react'
import { connect } from 'react-redux'

import * as allActions from 'app/redux/Home/All/all.action'
import * as currencyMxbActions from 'app/redux/Mxb/CurrencyMxb/currencyMxb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

import PageSwitch from 'app/containers/components/PageSwitch'
import { Select, Button, Checkbox, message } from 'antd'
import { TableWrap, TableBody, TableItem, TableTitle, TableOver, TableAll, Export } from 'app/components'
import { ROOT } from 'app/constants/fetch.constant.js'
import { fromJS, toJS }	from 'immutable'
import { changeFCMxbTree, judgePermission } from 'app/utils'
import Table from './Table.jsx'
import TreeContain from './TreeContain.jsx'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import './style/index.less'

@connect(state => state)
export default
class CurrencyMxb extends React.Component {

    componentDidMount() {
		const { dispatch, allState } = this.props
		const previousPage = sessionStorage.getItem('previousPage')
		if (previousPage === 'home') {
            sessionStorage.setItem('previousPage', '')
			dispatch(currencyMxbActions.getPeriodAndFCMxbAclistFetch())
		}
	}

    shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.currencyMxbState != nextprops.currencyMxbState || this.props.homeState != nextprops.homeState
	}

    render() {
        const {
            allState,
            dispatch,
            currencyMxbState,
            homeState
        } = this.props
        //外币明细表
        const detailList = homeState.getIn(['data','userInfo','pageController','BALANCE_DETAIL','preDetailList','FOREIGN_CURRENCY_BALANCE_STATEMENT','detailList'])
        const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
        const issues = allState.get('issues')
        const firstyear = allState.getIn(['period', 'firstyear'])
        // const showPzBomb = allState.get('showPzBomb')
        const currencyAcList = currencyMxbState.get('currencyAcList')
        const currencyDetailList = currencyMxbState.get('currencyDetailList')
        const issuedate = currencyMxbState.get('issuedate')
        const endissuedate = currencyMxbState.get('endissuedate')
        const chooseperiods = currencyMxbState.get('chooseperiods')
        const currentNumber = currencyMxbState.get('currentNumber')
        const acid = currencyMxbState.get('currentAc')
        const assid = currencyMxbState.get('currentAssId')
        const asscategory = currencyMxbState.get('currentAsscategory')
        const pageCount = currencyMxbState.get('pageCount')
        const currentPage = currencyMxbState.get('currentPage')

        const selectedKeys = currencyMxbState.get('selectedKeys')

        const jvList = currencyDetailList.get('jvList')
        const idx = issues.findIndex(v => v === issuedate)
        const nextperiods = issues.slice(0, idx)
        const hash = {}
        // lrpz的上下张凭证数组vcindexList包含的是 ['2017-01_1'], 日期和凭证号的分隔符为 "_"
        const vcindexList = jvList && jvList.size ? (jvList.map(v => [v.get('vcdate'), v.get('vcindex')].join('_')).filter(w => hash[w] ? false : hash[w] = true)) : fromJS([])

        const begin = issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}` : ''
		const end =  endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : ''
        const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
        const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
        const isPlay = homeState.getIn(['views', 'isPlay'])

        return (
            <ContainerWrap type="mxb-two" className="currencyMxb">
                <FlexTitle>
    				<div className="flex-title-left">
                        {isSpread || pageList.getIn(['Mxb','pageList']).size <= 1 ? '' :
                            <PageSwitch
                                pageItem={pageList.get('Mxb')}
                                onClick={(page, name, key) => {
                                    if (pageList.getIn(['Mxb','pageList']).indexOf('外币明细表') === -1) {
    									sessionStorage.setItem('previousPage', 'home')
    								}
                                    dispatch(homeActions.addPageTabPane('MxbPanes', key, key, name))
                                    dispatch(homeActions.addHomeTabpane(page, key, name))
                                }}
                            />
                        }
                        <Select
                            className="title-date"
                            value={issuedate}
                            onChange={(value) => dispatch(currencyMxbActions.getFCMxbAclistFetch(value, value, currentNumber))}
                            >
                            {issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                        </Select>
                        <span className="title-checkboxtext"
                            onClick={() => {
        						if (chooseperiods && endissuedate !== issuedate) {
        							dispatch(currencyMxbActions.getFCMxbAclistFetch(issuedate, issuedate, currentNumber))
        						}
        						dispatch(currencyMxbActions.changeFCMxbChooseMorePeriods())
    						}}
                            >
                            <Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
                            <span>至</span>
                        </span>
                        <Select
                            disabled={!chooseperiods}
                            className="title-date"
                            value={issuedate === endissuedate ? '' : endissuedate}
                            onChange={(value) => dispatch(currencyMxbActions.getFCMxbAclistFetch(issuedate, value, currentNumber))}
                            >
                            {nextperiods.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                        </Select>
                    </div>
                    <div className="flex-title-right">
                        <span className="title-right title-dropdown">
    						<Export
    							isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
    							exportDisable={!issuedate || isPlay}

    							excelDownloadUrl={`${ROOT}/excel/export/fcSub?${URL_POSTFIX}&begin=${begin}&end=${end}&number=${currentNumber}&acid=${acid ? acid : ''}&assid=${assid ? assid : ''}&asscategory=${asscategory ? encodeURI(encodeURI(asscategory)) : encodeURI(encodeURI(''))}`}
    							// ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'excelFcSubOne', {begin:begin, end:end,number: currentNumber, acid: acid ? acid : '', assid:assid ? assid : '' , asscategory:asscategory ? asscategory : ''}))}
                                ddExcelCallback={(value) => {
									if(!judgePermission(detailList.get('EXPORT_STATEMENT_EXCEL')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'excelFcSubOne', {begin:begin, end:end,number: currentNumber, acid: acid ? acid : '', assid:assid ? assid : '' , asscategory:asscategory ? asscategory : ''}))
									}else{
										message.info('当前角色无该请求权限')
									}
                                }}

    							PDFDownloadUrl={`${ROOT}/pdf/export/FcSub?${URL_POSTFIX}&begin=${begin}&end=${end}&number=${currentNumber}&acid=${acid ? acid : ''}&assid=${assid ? assid : ''}&asscategory=${asscategory ? encodeURI(encodeURI(asscategory)) : encodeURI(encodeURI(''))}`}
    							// ddPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'pdfFcSub', {begin: begin, end: end, number: currentNumber, acid: `${acid ? acid : ''}`, assid: `${assid ? assid : ''}`, asscategory: `${asscategory ? asscategory : ''}`}))}
                                ddPDFCallback={(value) => {
									if(!judgePermission(detailList.get('EXPORT_STATEMENT_PDF')).disabled){
										dispatch(allActions.allExportReceiverlist(value, 'pdfFcSub', {begin: begin, end: end, number: currentNumber, acid: `${acid ? acid : ''}`, assid: `${assid ? assid : ''}`, asscategory: `${asscategory ? asscategory : ''}`}))
									}else{
										message.info('当前角色无该请求权限')
									}
                                }}
                                onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '外币明细表',
									}))
								}}
    						/>
    					</span>
                        <Button
                            className="title-right refresh-btn"
                            type="ghost"
                            onClick={() => {
                                dispatch(currencyMxbActions.getFCMxbAclistFetch(firstyear ? issuedate : 'NO_VALID_ISSUE_DATE', endissuedate, currentNumber))
                                dispatch(allActions.freshMxbPage('外币明细表'))
                            }}
                            >
                            刷新
                        </Button>
                    </div>
                </FlexTitle>
				<TableWrap className="table-flex-mxb table-tree-wrap" notPosition={true}>
					<Table
						dispatch={dispatch}
                        jvList={jvList}
                        currencyDetailList={currencyDetailList}
						vcindexList={vcindexList}
                        issuedate={issuedate}
                        currentPage={currentPage}
						pageCount={pageCount}
                        paginationCallBack={(value) =>{
                            dispatch(currencyMxbActions.getFCDetailListFetch(issuedate, endissuedate, currentNumber, acid, asscategory, assid,value))
						}}
					/>
					<TreeContain
						dispatch={dispatch}
						currencyAcList={currencyAcList}
						issuedate={issuedate}
                        endissuedate={endissuedate}
                        selectedKeys={selectedKeys}
                        cascadeAclist={changeFCMxbTree(currencyAcList.toJS())}
					/>
				</TableWrap>
                {/* { showPzBomb ? <PzBomb/> : '' } */}
			</ContainerWrap>
        )
    }
}
