import React from 'react'
import { connect } from 'react-redux'
import './style/index.less'

import { Button,message } from 'antd'
import { Export } from 'app/components'
import PageSwitch from 'app/containers/components/PageSwitch'
import { ROOT } from 'app/constants/fetch.constant.js'
import Table from './Table.jsx'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import MutiPeriodMoreSelect from 'app/containers/components/MutiPeriodMoreSelect'
import { judgePermission } from 'app/utils'

import * as kmyebActions from 'app/redux/Yeb/Kmyeb/kmyeb.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'

@connect(state => state)

export default
class Kmyeb extends React.Component {

    componentDidMount() {
        this.props.dispatch(kmyebActions.getPeriodAndBalistFetch())
    }

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.kmyebState != nextprops.kmyebState || this.props.homeState != nextprops.homeState
	}

    render() {
        const {
            allState,
            kmyebState,
            dispatch,
            homeState
        } = this.props
        const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
        //科目余额表
        const detailList = homeState.getIn(['data', 'userInfo', 'pageController', 'BALANCE_DETAIL', 'preDetailList', 'AC_BALANCE_STATEMENT', 'detailList'])

		const issues = allState.get('issues')
        const issuedate = kmyebState.get('issuedate')
        const endissuedate = kmyebState.get('endissuedate')
        const chooseperiods = kmyebState.get('chooseperiods')
        const chooseValue = kmyebState.getIn(['views', 'chooseValue'])
        const showchildList = kmyebState.getIn(['views', 'showchildList'])
        const balanceaclist = kmyebState.get('balanceaclist')

        const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
        const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
        const isPlay = homeState.getIn(['views', 'isPlay'])

        return (
            <ContainerWrap type="yeb-one" className="kmyeb">
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
                        <MutiPeriodMoreSelect
							issuedate={issuedate}
							endissuedate={endissuedate}
							issues={issues}
							chooseValue={chooseValue}
							changeChooseperiodsStatu={(value) => dispatch(kmyebActions.changeAcYebChooseValue(value))}
							changePeriodCallback={(value1, value2) => {
                                console.log('value1', value1, value2);
                                dispatch(kmyebActions.getBaListFetch(value1, value2))
                            }}
						/>
                    </div>
                    <div className="flex-title-right">    
                        <span className="title-right title-dropdown">
                            <Export
                                type={'second'}
                                isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
                                exportDisable={!issuedate || isPlay}

                                excelDownloadUrl={`${ROOT}/sob/report/ac/balance/excel/export?${URL_POSTFIX}&begin=${issuedate ? issuedate : ''}&end=${endissuedate ? endissuedate : ''}`}
                                // ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'kmyebexcelsend', {begin: issuedate ? issuedate : '', end: endissuedate ? endissuedate : ''}))}
                                ddExcelCallback={(value) => {
                                    // console.log(!judgePermission(detailList.get("EXPORT_BALANCE_EXCEL")).disabled)
                                    //判断是否具有导出excel科目余额表权限，无权限弹出提示，有权限发送工作通知
                                    if(!judgePermission(detailList.get('EXPORT_BALANCE_EXCEL')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'kmyebexcelsend', {begin: issuedate ? issuedate : '', end: endissuedate ? endissuedate : ''}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }}
                                }

                                PDFDownloadUrl={`${ROOT}/sob/report/ac/balance/pdf/export?${URL_POSTFIX}&begin=${issuedate ? issuedate : ''}&end=${endissuedate ? endissuedate : ''}`}
                                // ddPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'pdfkmyeexport', {begin: issuedate ? issuedate : '', end: endissuedate ? endissuedate : ''}))}
                                ddPDFCallback={(value) => {
                                    //判断是否具有导出pdf科目余额表权限，无权限弹出提示，有权限发送工作通知
                                    if(!judgePermission(detailList.get('EXPORT_BALANCE_PDF')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'pdfkmyeexport', {begin: issuedate ? issuedate : '', end: endissuedate ? endissuedate : ''}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }}
                                }

                                allKmyebPDFDownloadUrl={`${ROOT}/sob/report/ac/balance/vc/pdf/export?${URL_POSTFIX}&begin=${issuedate ? issuedate : ''}&end=${endissuedate ? endissuedate : ''}`}
                                // allKmyebDdPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'pdfVcAll', {begin: issuedate ? issuedate : '', end: endissuedate ? endissuedate : ''}))}
                                allKmyebDdPDFCallback={(value) => {
                                    //导出凭证汇总表
                                    if(!judgePermission(detailList.get('EXPORT_BALANCE_PDF')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'pdfVcAll', {begin: issuedate ? issuedate : '', end: endissuedate ? endissuedate : ''}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }}
                                }
                                onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '科目余额表',
									}))
								}}
                            />
    					</span>
                        <Button
                            className="title-right refresh-btn"
                            type="ghost"
                            onClick={() => {
                                dispatch(kmyebActions.getPeriodAndBalistFetch(issuedate, endissuedate))
                                dispatch(allActions.freshYebPage('科目余额表'))
                            }}
                            >
                            刷新
                        </Button>
                    </div>
                </FlexTitle>
                <Table
                    issuedate={issuedate}
                    dispatch={dispatch}
                    issues={issues}
                    chooseValue={chooseValue}
                    balanceaclist={balanceaclist}
                    endissuedate={endissuedate}
                    showchildList={showchildList}
                />
            </ContainerWrap>
        )
    }
}
