import React from 'react'
import { connect } from 'react-redux'

import * as sobLogActions from 'app/redux/Config/SobLog/SobLog.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'

import logGetformatDate from 'app/containers/Config/Sob/logGetformatDate.js'
import Table from './Table.jsx'
import { Button, Checkbox, Input, Icon, DatePicker, TimePicker, message, Select } from 'antd'
const { RangePicker } = DatePicker
import { ROOT } from 'app/constants/fetch.constant.js'
import { ExportModal } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import moment from 'moment'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import './index.less'

@connect(state => state)
export default
    class Log extends React.Component {

    constructor() {
        super()
        // const date = logGetformatDate()
        this.state = {
            isSerch: true,
            serchFor: '',
            // isChecked: false,
            // beginDate: date.value,//显示用确定日期不可用时需要用 ''
            searchBegin: '',//有搜索时显示用
            // endDate:'',//显示用
            // begin: date.format,//传给后台用
            // end: ''//传给后台用
        }
    }

    shouldComponentUpdate(nextprops, nextstate) {
        return this.props.sobLogState !== nextprops.sobLogState || this.props.allState !== nextprops.allState || this.props.homeState !== nextprops.homeState || this.state !== nextstate
    }

    render() {

        const { dispatch, sobLogState, allState, homeState } = this.props
        const { isSerch, serchFor, searchBegin } = this.state

        const pageCount = sobLogState.getIn(['log', 'pageCount'])
        const currentPage = sobLogState.getIn(['log', 'currentPage'])
        const backSobId = sobLogState.getIn(['log', 'backSobId'])
        const logList = sobLogState.getIn(['log', 'logList'])

        const beginDate = sobLogState.get('beginData')
        const endDate = sobLogState.get('endData')
        const searchType = sobLogState.get('searchType')
        const searchContent = sobLogState.get('searchContent')
        const operationList = sobLogState.get('operationList')

        // const formatTime = "YYYY-MM-DD HH:mm:ss"
        const formatTime = "YYYY-MM-DD HH:mm:ss"
        const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])

        const searchTypeStr = [
            {
                value: 'SEARCH_TYPE_ALL',
                key: '综合搜索'
            },
            {
                value: 'SEARCH_TYPE_OPERATION',
                key: '操作类型'
            },
            {
                value: 'SEARCH_TYPE_OPERATOR',
                key: '操作人'
            }
        ]
        const searchNameStr = {
            'SEARCH_TYPE_ALL': '综合搜索',
            'SEARCH_TYPE_OPERATION': '操作类型',
            'SEARCH_TYPE_OPERATOR': '操作人',
        }

        return (
            // <div className="wrap-body kmyeb newConfigsob">
            <ContainerWrap type="config-one" className="log-config">
                <FlexTitle>
                    <div className="flex-title-left">
                        <span>
                            <RangePicker
                                style={{width: '280px'}}
                                className="log-config-data-range"
                                showTime={{ format: 'HH:mm' }}
                                allowClear={false}
                                format={formatTime}
                                disabledDate={(current) => {
                                    return current > moment().endOf('day')
                                }}
                                value={[beginDate ? moment(beginDate, formatTime) : '', endDate ? moment(endDate, formatTime) : '']}
                                placeholder={['开始时间', '结束时间']}
                                onChange={(value, dateStrings) => {
                                    const begin = `${dateStrings[0].substr(0, 4)}${dateStrings[0].substr(5, 2)}${dateStrings[0].substr(8, 2)}${dateStrings[0].substr(11, 2)}${dateStrings[0].substr(14, 2)}${dateStrings[0].substr(17, 2)}`
                                    const end = `${dateStrings[1].substr(0, 4)}${dateStrings[1].substr(5, 2)}${dateStrings[1].substr(8, 2)}${dateStrings[1].substr(11, 2)}${dateStrings[1].substr(14, 2)}${dateStrings[1].substr(17, 2)}`
                                    dispatch(sobLogActions.getLogListFetch({ begin, end, searchType, searchContent, backSobId, currentPage: 1 }))
                                }}
                            />  
                        </span>
                        <span className="log-config-serch">
                            <Select
                                style={{ width: 80 }}
                                className="log-config-serch-choose"
                                defaultValue="流水类别"
                                value={searchNameStr[searchType]}
                                onSelect={value => dispatch(sobLogActions.changeLogConfigCommonString('searchType', value))}
                            >
                                {searchTypeStr.map((v, i) => <Select.Option key={v.key} value={v.value}>{v.key}</Select.Option>)}
                            </Select>
                            {
                                searchType === 'SEARCH_TYPE_OPERATOR' ? null :
                                    <Input
                                        placeholder="搜索流水"
                                        className="log-config-serch-input"
                                        value={searchContent}
                                        onChange={e => dispatch(sobLogActions.changeLogConfigCommonString('searchContent', e.target.value))}
                                        onPressEnter={(e) => {
                                            dispatch(sobLogActions.changeLogConfigCommonString('searchContent', e.target.value))
                                            dispatch(sobLogActions.getLogListFetch({ begin: beginDate, end: endDate, searchType, searchContent: e.target.value, backSobId, currentPage: 1 }))
                                        }}
                                    />
                            }
                            {
                                searchType === 'SEARCH_TYPE_OPERATOR' ?
                                    <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        allowClear={false}
                                        mode="tags"
                                        optionFilterProp="children"
								        notFoundContent="无法找到相应操作人"
                                        className="log-config-serch-choose-switch"
                                        value={searchContent ? [searchContent] : []}
                                        onChange={value => {
                                            if (value.length == 0) {
                                                dispatch(sobLogActions.changeLogConfigCommonString('searchContent', ''))
                                                dispatch(sobLogActions.getLogListFetch({ begin: beginDate, end: endDate, searchType, searchContent: '', backSobId, currentPage: 1 }))
                                            } else if (value.length === 1) {
                                                dispatch(sobLogActions.changeLogConfigCommonString('searchContent', value[0]))
                                                dispatch(sobLogActions.getLogListFetch({ begin: beginDate, end: endDate, searchType, searchContent: value[0], backSobId, currentPage: 1 }))
                                            } else if (value.length > 1) {
                                                dispatch(sobLogActions.changeLogConfigCommonString('searchContent', value[1]))
                                                dispatch(sobLogActions.getLogListFetch({ begin: beginDate, end: endDate, searchType, searchContent: value[1], backSobId, currentPage: 1 }))
                                            }
                                        }}
                                    >
                                        {operationList.map((v, i) => <Select.Option key={i} value={v}>{v}</Select.Option>)}
                                    </Select>
                                    : null
                            }
                            {
                                searchType === 'SEARCH_TYPE_OPERATOR' ? null :
                                    (searchContent ?
                                        <Icon
                                            className="log-config-serch-icon-close"
                                            type="close-circle"
                                            theme='filled'
                                            onClick={() => {
                                                dispatch(sobLogActions.changeLogConfigCommonString('searchContent', ''))
                                                dispatch(sobLogActions.getLogListFetch({ begin: beginDate, end: endDate, searchType, searchContent: '', backSobId, currentPage: 1 }))
                                            }}
                                        />
                                        : null)
                            }                           
                            <span className="log-config-serch-icon-separation"></span>                   
                            <Icon
                                className="log-config-serch-icon-search"
                                type="search"
                                onClick={() => {
                                    dispatch(sobLogActions.changeLogConfigCommonString('searchContent', searchContent))
                                    dispatch(sobLogActions.getLogListFetch({ begin: beginDate, end: endDate, searchType, searchContent, backSobId, currentPage: 1 }))
                                }}
                            />             
                        </span>
                    </div>
                    <div className="flex-title-right">
                        <Button
                            className="title-right"
                            type="ghost"
                            onClick={() => {
                                dispatch(homeActions.addPageTabPane('ConfigPanes', 'Sob', 'Sob', '账套设置'))
                                dispatch(homeActions.addHomeTabpane('Config', 'Sob', '账套设置'))
                            }}
                        >
                            返回
                        </Button>
                        <Button
                            className="title-right"
                            type="ghost"
                            onClick={() => {
                                // dispatch(sobLogActions.getLogListFetch({ begin: beginDate, end: endDate, searchType, searchContent, backSobId, currentPage }))
                                const date = logGetformatDate()
								dispatch(sobLogActions.getLogListFetch({ begin: date.formatDayBegin, end: date.format, searchType: 'SEARCH_TYPE_ALL', searchContent: '', backSobId, currentPage: 1}, 'init'))
                            }}
                        >
                            刷新
                        </Button>

                        {/* <span className="title-right title-dropdown">
                            <ExportModal
    							hrefUrl={`${ROOT}/excel/export/userOperate?${URL_POSTFIX}&begin=${begin}&end=${end ? end : begin }&backSobId=${backSobId}`}
    							exportDisable={!begin}
    							ddCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'excelLog', {begin: begin, end: end ? end : begin, backSobId: backSobId}))}
    							>
    							导出
    						</ExportModal>
    					</span> */}
                    </div>
                </FlexTitle>
                <Table
                    dispatch={dispatch}
                    currentPage={currentPage}
                    pageCount={pageCount}
                    logList={logList}
                    paginationCallBack={(value) => {
                        dispatch(sobLogActions.getChangeLogListPaginationFetch({ begin: beginDate, end: endDate, searchType, searchContent, backSobId, currentPage:value }, pageCount))
                    }}
                />
            </ContainerWrap>
        )
    }
}
