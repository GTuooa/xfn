import React, { Component } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import {Toast, Modal,PickerView} from 'antd-mobile'
@immutableRenderDecorator
export default class ReferModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            start:[],
            end:[],
            showDate:false
        }
    }
    render(){
        const {visible,issuedate,issues,endissuedate,referChooseValue,onChanged,onClose}=this.props
        const {start,end}=this.state
        let issuesData=[]
        if(issues.size>0){
            issues.map((item)=>{
                issuesData.push({
                    label:item.get("key"),
                    value:item.get("value")
                })
            })
        }
        let startDate=start.length?start[0]:issuedate
        const idx = issues.findIndex(v => v.get('value') === startDate)
        const year = startDate.substr(0, 4)
        // const nextissuesData = issues.slice(0, idx).filter(v => v.get('value').indexOf(year) === 0)
        //跨期不受限制、只有后面账期比前面账期大即可
        const nextissuesData = issues.slice(0, idx)
        let nextIssuesData=[]
        nextissuesData.map((item)=>{
            nextIssuesData.push({
                label:item.get("key"),
                value:item.get("value")
            })
        })
        return(
            <Modal
               transparent
               className='referModal'
               visible={visible}
               onClose={()=>{
                   onClose()
               }}
               footer={[
                   {text:'取消',onPress:()=>{onClose()}},
                   {text:'确定',onPress:()=>{
                       if(referChooseValue==='ISSUE'){
                           let referStart = start.length? start[0]:issuedate
                           onChanged(referStart,referStart)
                       }else if(referChooseValue==='ISSUE_RANGE'){
                           let referStart = start.length? start[0]:issuedate
                           let referEnd = end.length ? end[0]:endissuedate
                           onChanged(referStart,referEnd)
                       }
                       onClose()
                   }},
               ]}
           >
               {referChooseValue==='ISSUE'&&
                   <PickerView
                       onChange={(value)=>{
                           this.setState({start:value,})
                       }}
                       value={start.length ? start : [issuedate]}
                       data={issuesData}
                       cascade={false}
                   />
               }
               {referChooseValue==='ISSUE_RANGE'&&
                   <div className='double-picker'>
                        <div>
                            <PickerView
                                onChange={(value)=>{
                                    this.setState({start:value})
                                }}
                                value={start.length ? start : [issuedate]}
                                data={issuesData}
                                cascade={false}
                            />
                        </div>
                        <div>
                            <PickerView
                                onChange={(value)=>{
                                    this.setState({end:value})
                                }}
                                value={end.length ? end : [endissuedate]}
                                data={nextIssuesData}
                                cascade={false}
                            />
                        </div>
                   </div>
               }

           </Modal>
        )
    }
}
