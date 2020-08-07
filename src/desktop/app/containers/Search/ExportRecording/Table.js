import React, { PropTypes } from 'react'
import { Map, List ,fromJS} from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { TableWrap, TableBody, TableAll } from 'app/components'
import {  Checkbox } from 'antd'
import TableItem from "./TableItem"
import * as exportRecordingActions from 'app/redux/Search/ExportRecording/exportRecording.action'

@immutableRenderDecorator
export default
class Table extends React.Component {
    constructor(props){
        super(props)
        this.state={
            waitingList:[],
        }
    }

    componentWillReceiveProps(nextprops){
        const dataList=nextprops.dataList
        let waitingList=[]
        for(let i in dataList){
            if(dataList[i].message=="等待中"||dataList[i].message=="下载中"){
                waitingList.push(dataList[i].zipUuid)
            }
        }
        this.setState({waitingList:waitingList})
    }

    render(){
        const {dataList,dispatch,uuidList,selectedAll,issuedate,intelligentStatus} =this.props
        const {waitingList} = this.state

        return(
            <TableWrap notPosition={true}>
                <TableAll>
                <div className="table-title-wrap">
                    <ul className={"export-recording-table-width table-title"}>
                        <li>
                            <Checkbox
                                disabled={waitingList.length}
                                checked={selectedAll}
                                onClick={()=>{
                                    this.setState({waitingList:[]})
                                    dispatch(exportRecordingActions.selectAllUuidList(!selectedAll))
                                }}
                            />
                        </li>
                        <li>文件名</li>
                        <li>大小</li>
                        <li>导出时间</li>
                        <li>操作人</li>
                        <li>操作</li>
                    </ul>
                </div>
                <TableBody>
                    { dataList.map((item,index)=>{
                        return(
                            <TableItem
                                uuidList={uuidList}
                                index={index}
                                issuedate={issuedate}
                                key={index}
                                data={item}
                                className="export-recording-table-width"
                                dispatch={dispatch}
                                waitingList={waitingList}
                                onloading={item.zipUuid===waitingList[0]}
                                handleWaitingList={()=>{
                                    waitingList.splice(0,1)
                                    this.setState({waitingList:waitingList})

                                }}
                                clearWaitingList={()=>{
                                    this.setState({waitingList:[]})
                                }}
                                intelligentStatus={intelligentStatus}
                            />
                        )
                    })}
                </TableBody>
                </TableAll>
            </TableWrap>
        )
    }
}
