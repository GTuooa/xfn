import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'
import './style/index.less'

import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import { Icon, Select, Button, Input, Checkbox,Progress} from 'antd'
import * as exportRecordingActions from 'app/redux/Search/ExportRecording/exportRecording.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as runningEnclosureActions from 'app/redux/Search/RunningEnclosure/runningEnclosure.action'
import MutiPeriodMoreSelect from 'app/containers/components/MutiPeriodMoreSelect'
const InputGroup = Input.Group;
const { Option } = Select;
@immutableRenderDecorator
export default
class Title extends React.Component {
    constructor(props){
        super(props)
        this.state={

        }
    }
    render(){
        const {dispatch,issues,issuedate,totalSize,useSizeByCorp,useSizeBySob,selectList,dataList,searchCondition,searchContent,showModal,endissuedate,chooseValue}=this.props
        const corpPercent=((useSizeByCorp/(totalSize*1024))*100).toFixed(2);
		const sobPercent=((useSizeBySob/(totalSize*1024))*100).toFixed(2);
        return(
            <FlexTitle>
                <div className='flex-title-left'>
                    {/*<Select
                        className="title-date select-date"
                        value={issuedate}
                        onChange={(value) => {
                            this.props.dispatch(runningEnclosureActions.getRunningEnclosureData(value))
                        }}
                        >
                        {issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                    </Select>*/}
                    <div className="select-date">
                        <MutiPeriodMoreSelect
                            issuedate={issuedate}
                            endissuedate={endissuedate}
                            issues={issues}
                            chooseValue={chooseValue}
                            changeChooseperiodsStatu={(value) => {
                                dispatch(runningEnclosureActions.handleRunningEnclosureChooseStatus(value))
                            }}
                            changePeriodCallback={(value1, value2) => {
                                dispatch(runningEnclosureActions.getRunningEnclosureData(value1, value2))
                            }}
                        />
                    </div>

                    <InputGroup compact className="title-search-group">
                        <Select
                            value={searchCondition}
                            className="search-type"
                            onChange={(value)=>{
                                dispatch(runningEnclosureActions.changeRunningEnclosureSearchCodition(value))
                            }}
                        >
                            <Option value="SEARCH_TYPE_ENCLOSURE_NAME">名称</Option>
                            <Option value="SEARCH_TYPE_LABEL">标签</Option>
                            <Option value="SEARCH_TYPE_CREATE_NAME">制单人</Option>
                        </Select>
                        <Input
                            className="search-condition"
                            // style={{borderRight: '1px solid #d9d9d9'}}
                            value={searchContent}
                            // allowClear
                            onChange={(e)=>{
                                dispatch(runningEnclosureActions.changeRunningEnclosureContent(e.target.value))
                            }}
                            onPressEnter={()=>{
                                dispatch(runningEnclosureActions.getRunningEnclosureSearchData(issuedate,endissuedate,searchCondition,searchContent))
                            }}
                        />
                        {searchContent && <Icon type="close-circle" theme="filled" className='close-icon'
                            onClick={()=>{
                                dispatch(runningEnclosureActions.changeRunningEnclosureContent(''))
                                dispatch(runningEnclosureActions.getRunningEnclosureSearchData(issuedate,endissuedate,searchCondition,''))
                            }}
                        />}
                        <div className='line'></div>
                        <Icon type="search" className="search-icon" style={{ color: 'rgba(0,0,0,.45)' }} onClick={()=>{
                            dispatch(runningEnclosureActions.getRunningEnclosureSearchData(issuedate,endissuedate,searchCondition,searchContent))
                        }}/>
                    </InputGroup>
                    <span className="fj-progress">
						<div>剩余容量/总量：{(totalSize*1024-useSizeByCorp).toFixed(2)}Mb/{totalSize}G</div>
                        <div>本账套已使用：{(useSizeBySob).toFixed(2)}Mb</div>
						<Progress
                            style={{width:"180px"}}
                            percent={Number(corpPercent)}
                            showInfo={false}
                            status={corpPercent>90 ? 'exception' :'normal'}
                        />
					</span>
                </div>
                <div className='flex-title-right'>
                    <Button type="ghost" className="title-right-btn" onClick={()=>{
                        dispatch(homeActions.addPageTabPane('SearchPanes', 'SearchRunning', 'SearchRunning', '查询流水'))
                        dispatch(homeActions.addHomeTabpane('Search', 'SearchRunning', '查询流水'))
                    }}>查询流水</Button>
                    <Button type="ghost" className="title-right-btn" onClick={()=>{
                        dispatch(exportRecordingActions.getEnclosureExportRecordingList(issuedate))
                        dispatch(homeActions.addPageTabPane('SearchPanes', 'ExportRecording', 'ExportRecording', '导出记录'))
                        dispatch(homeActions.addHomeTabpane('Search', 'ExportRecording', '导出记录'))
                    }}>导出记录</Button>
                    <Button
                        type="ghost"
                        className="title-right-btn"
                        disabled={selectList.size?false:true}
                        onClick={()=>{
                            dispatch(runningEnclosureActions.exportEnclosureList(selectList,dataList,issuedate,showModal))
                        }}
                    >导出</Button>
                    <Button
                        type="ghost"
                        disabled={selectList.size?false:true}
                        className="title-right-btn"
                        onClick={()=>{
                            dispatch(runningEnclosureActions.deleteEnclosureList())
                        }}
                    >删除</Button>
                    <Button
                        type="ghost"
                        className="title-right-btn"
                        onClick={()=>{
                            this.props.refresh()
                        }
                }>刷新</Button>
                </div>
            </FlexTitle>
        )
    }
}
