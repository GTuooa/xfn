import React, { PropTypes } from 'react'
import { Map, List ,fromJS} from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { TableWrap, TableBody, TableAll } from 'app/components'
import {  Checkbox } from 'antd'
import TableItem from "./TableItem"
import * as runningEnclosureActions from 'app/redux/Search/RunningEnclosure/runningEnclosure.action'
@immutableRenderDecorator
export default
class Table extends React.Component {
    constructor(props){
        super(props)
        this.state={

        }
    }
    render(){
        const {dispatch,dataList,selectList,selectedAll,issuedate,endissuedate,searchCondition,searchContent,showTagListModal,refresh} =this.props
        return(
            <TableWrap notPosition={true}>
                <TableAll>
                    <div className="table-title-wrap">
                        <ul className={"runningEnclosure-table-width runningEnclosure-table-title-justify table-title"}>
                            <li>
                                <Checkbox
                                    checked={selectedAll}
                                    onChange={()=>{
                                        dispatch(runningEnclosureActions.selectAllRunningEncloseureList(!selectedAll))
                                    }}
                                />
                            </li>
                            <li>文件名</li>
                            <li>大小</li>
                            <li>标签</li>
                            <li>流水号</li>
                            <li>制单人</li>
                            <li>审核</li>
                        </ul>
                    </div>
                    <TableBody>
                        { dataList.map((item,index)=>{
                            return(
                                <TableItem
                                    index={index}
                                    key={index}
                                    dispatch={dispatch}
                                    endissuedate={endissuedate}
                                    data={item}
                                    selectList={selectList}
                                    className="runningEnclosure-table-width runningEnclosure-table-title-justify"
                                    issuedate={issuedate}
                                    searchCondition={searchCondition}
                                    searchContent={searchContent}
                                    showTagListModal={showTagListModal}
                                    dataList={dataList}
                                    refresh={refresh}
                                />
                            )
                        })}
                    </TableBody>
                </TableAll>
            </TableWrap>
        )
    }
}
