import React from 'react'
import { connect } from 'react-redux'
import './style/index.less'
import { Radio,Icon,Input} from 'antd'
import * as runningEnclosureActions from 'app/redux/Search/RunningEnclosure/runningEnclosure.action'

@connect(state => state)
export default
class RunningEnclosure extends React.Component{
    constructor(props){
        super(props)
        this.state={
            tagName:this.props.label
        }
    }
    render(){
        const {id,label,check,edit,setEditTag,getLabelValue,dispatch,clearTagValue,clearSelfTagValue}=this.props
        const {tagName} =this.state
        if(check){

            dispatch(runningEnclosureActions.setEnclosureLabelValue(tagName,id))
        }
        let array = ["无标签","发票","其他票据"]
        return(
            <div style={{width:"50%",height:"40px",lineHeight:"40px"}}>
                <Radio value={id} ckecked={check}>
                    <span style={{width:"140px",display:"inline-block"}}>
                        {edit && check ?
                            <Input defaultValue={tagName} onChange={(e)=>{
                                this.setState({tagName:e.target.value})
                            }}/>
                            :
                            label}
                    </span>
                </Radio>
                { !array.includes(label) && //发票  其票据
                    <Icon type="edit" onClick={()=>{
                        setEditTag(id)
                    }}/>
                }
                {!array.includes(label) &&
                <Icon
                    type="close"
                    style={{color:"red",marginLeft:"10px"}}
                    onClick={()=>{
                        if(check){
                            clearTagValue()
                        }
                        dispatch(runningEnclosureActions.deleteEnclosureLabel(id))

                    }}
                />
            }
            </div>
        )
    }
}
