import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS }	from 'immutable'
import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as runningEnclosureActions from 'app/redux/Search/RunningEnclosure/runningEnclosure.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'

import { Checkbox, Icon, message, Button } from 'antd'
import { Amount } from 'app/components'
import jsonifyDate	from 'app/utils/jsonifyDate'
import * as allActions from 'app/redux/Home/All/all.action'

import { showImg } from 'app/utils'
import { TableOver, CxpzTableItem } from 'app/components'

@immutableRenderDecorator
export default
class TableItem extends React.Component {
    render(){
        const{className,data,line,index,dispatch,selectList,issuedate,endissuedate,searchCondition,searchContent,showTagListModal,dataList,refresh}=this.props

        return(
            <CxpzTableItem className={className} line={line}>
                <li>
                    {data.enclosureList.map((e,i)=>{
                        return(
                            <div key={i} className="table-item-line">
                                <Checkbox
                                    checked={selectList.includes(`${data.jrIndex}-${e.enclosureKey}`)}
                                    onChange={()=>{
                                        dispatch(runningEnclosureActions.changeRunningEnclosureSelectList(`${data.jrIndex}-${e.enclosureKey}`))
                                        dispatch(runningEnclosureActions.setEnclosureUuidList(e.uuid))
                                    }}
                                />
                            </div>
                        )
                    })}
                </li>
                <li>
                    {data.enclosureList.map((e,i)=>{
                        return(
                            <p key={i} className="table-item-line runningEnclosure-link fullWidth">
                                <span onClick={()=>{
                                    if(e.imageOrFile==='TRUE' || e.mimeType === 'application/pdf'){
										dispatch(runningEnclosureActions.previewImage(index,i))
									}else{
										message.warn('仅图片及PDF格式支持预览')
									}
                                }}>
                                    {e.fileName}
                                </span>
                            </p>
                        )
                    })}
                </li>
                <li>
                    {data.enclosureList.map((e,i)=>{
                        return(
                            <p key={i} style={{textAlign:"center"}} className="table-item-line fullWidth">
                                <span>{e.size>1024?`${(e.size/1024).toFixed(2)}mb`:`${e.size}kb`}</span>
                            </p>
                        )
                    })}
                </li>
                <li>
                    {data.enclosureList.map((e,i)=>{
                        return(
                            <p key={i} style={{textAlign:"center"}} className="table-item-line fullWidth">
                                <Button type="ghost" onClick={()=>{
                                    dispatch(runningEnclosureActions.getEnclosureTagList(e.enclosureKey,showTagListModal))

                                }}>{e.label}</Button>
                            </p>
                        )
                    })}
                </li>
                <TableOver
                    className="table-item-line runningEnclosure-link"
                    onClick={(e=>{
                        e.stopPropagation()
                        dispatch(previewRunningActions.getPreviewRunningBusinessFetch(fromJS(data), 'search_cxls', fromJS(dataList),()=>{  dispatch(runningEnclosureActions.getRunningEnclosureData(issuedate,endissuedate))}))
                    })}

                >{data.jrIndex}号
                </TableOver>
                <TableOver className="table-item-line">{data.createUserName}</TableOver>
                <TableOver className="table-item-line runningEnclosure-link">
                {data.beCertificate ?
                    <Button type="ghost" onClick={()=>{
                        dispatch(runningEnclosureActions.antiVerifyRunningEnclosure(data.jrIndex,issuedate,endissuedate,searchCondition,searchContent))
                    }}>反审核</Button>
                    :
                    <Button type="ghost" onClick={()=>{
                        dispatch(runningEnclosureActions.verifyRunningEnclosure(data.oriUuid,issuedate,endissuedate,searchCondition,searchContent))
                    }}>审核</Button>
                }
                </TableOver>
            </CxpzTableItem>
        )
    }

}
