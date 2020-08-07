import React from 'react'
import { connect } from 'react-redux'

import * as allActions from 'app/redux/Home/All/all.action'
import * as currencyYebActions from 'app/redux/Yeb/CurrencyYeb/currencyYeb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

import { Select, Button, Checkbox, message } from 'antd'
import { ROOT } from 'app/constants/fetch.constant.js'
import { judgePermission } from 'app/utils'
import { Export } from 'app/components'
import PageSwitch from 'app/containers/components/PageSwitch'
import Table from './Table.jsx'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import './style/index.less'

@connect(state => state)
export default
class CurrencyYeb extends React.Component {

    componentDidMount() {
        this.props.dispatch(currencyYebActions.getPeriodAndBalistFetch())
    }

    shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.currencyYebState != nextprops.currencyYebState || this.props.allState != nextprops.allState || this.props.homeState != nextprops.homeState
	}

    render() {
        const {
            allState,
            dispatch,
            currencyYebState,
            homeState
        } = this.props

        const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
        //外币余额表
		const detailList = homeState.getIn(['data','userInfo','pageController','BALANCE_DETAIL','preDetailList','FOREIGN_CURRENCY_BALANCE_STATEMENT','detailList'])
        const issues = allState.get('issues')
        const firstyear = allState.getIn(['period', 'firstyear'])
        const issuedate = currencyYebState.get('issuedate')
        const endissuedate = currencyYebState.get('endissuedate')
        const childitemlist = currencyYebState.get('childitemlist')
        const isShow = currencyYebState.get('isShow')
        const currencyList = currencyYebState.get('currencyList')
        const chooseperiods = currencyYebState.get('chooseperiods')
        const idx = issues.findIndex(v => v === issuedate)
        const nextperiods = issues.slice(0, idx)

        const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
        const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
        const isPlay = homeState.getIn(['views', 'isPlay'])

        return (
            <ContainerWrap type="yeb-two" className="currencyYeb">
                <FlexTitle>
                    <div className="flex-title-left">
                        {isSpread || pageList.getIn(['Yeb','pageList']).size <= 1 ? '' :
                            <PageSwitch
                                pageItem={pageList.get('Yeb')}
                                onClick={(page, name, key) => {
                                    dispatch(homeActions.addPageTabPane('YebPanes', key, key, name))
                                    dispatch(homeActions.addHomeTabpane(page, key, name))
                                }}
                            />
                        }
                        <Select
                            className="title-date"
                            value={issuedate}
                            onChange={(value) => dispatch(currencyYebActions.AllGetCurrencyYebListFetch(value, value))}
                            >
                            {issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                        </Select>
                        <span className="title-checkboxtext"
                            onClick={() => {
                                if (chooseperiods && endissuedate !== issuedate) {
                                    dispatch(currencyYebActions.AllGetCurrencyYebListFetch(issuedate, issuedate))

        						}
        						dispatch(currencyYebActions.changeFCYebChooseMorePeriods())
                            }}
                            >
                            <Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
                            <span>至</span>
                        </span>
                        <Select
                            disabled={!chooseperiods}
                            className="title-date"
                            value={endissuedate === issuedate ? '' : endissuedate}
                            onChange={(value) => dispatch(currencyYebActions.AllGetCurrencyYebListFetch(issuedate, value))}
                            >
                            {nextperiods.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                        </Select>
                    </div>
                    <div className="flex-title-right">
    					<span className="title-right title-dropdown">
                            <Export
                                isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
                                exportDisable={!issuedate || isPlay}

                                excelDownloadUrl={`${ROOT}/excel/export/fcBa?${URL_POSTFIX}&begin=${issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}` : ''}&end=${endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : ''}`}
    							// ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'excelFcBa', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`}))}
                                ddExcelCallback={(value) => {
									if(!judgePermission(detailList.get('EXPORT_BALANCE_EXCEL')).disabled){
										dispatch(allActions.allExportReceiverlist(value, 'excelFcBa', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`}))
									}else{
										message.info('当前角色无该请求权限')
									}
                                }}
                                
                                PDFDownloadUrl={`${ROOT}/pdf/export/fcBa?${URL_POSTFIX}&begin=${issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}` : ''}&end=${endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : ''}`}
                                // ddPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'pdfFcBa', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`}))}
                                ddPDFCallback={(value) => {
									if(!judgePermission(detailList.get('EXPORT_BALANCE_PDF')).disabled){
										dispatch(allActions.allExportReceiverlist(value, 'pdfFcBa', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`}))
									}else{
										message.info('当前角色无该请求权限')
									}
								}}
                                onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '外币余额表',
									}))
								}}
    							>
                            </Export>
    					</span>
                        <Button
                            className="title-right refresh-btn"
                            type="ghost"
                            onClick={() => {
                                dispatch(currencyYebActions.getPeriodAndBalistFetch(firstyear ? issuedate : 'NO_VALID_ISSUE_DATE', endissuedate))
                                dispatch(allActions.freshYebPage('外币余额表'))
                            }}
                            >
                            刷新
                        </Button>
                    </div>
                </FlexTitle>
                <Table
                    dispatch={dispatch}
                    isShow={isShow}
                    currencyList={currencyList}
                    issuedate={issuedate}
                    endissuedate={endissuedate}
                    childitemlist={childitemlist}
                    chooseperiods={chooseperiods}
                />
            </ContainerWrap>
        )
    }
}
