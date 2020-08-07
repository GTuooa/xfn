import React, { Component } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { Icon, Single ,SinglePicker} from 'app/components'
import { DateLib } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { TopMonthPicker } from 'app/containers/components'
import XfnIcon from 'app/components/Icon'
import {Toast, Modal} from 'antd-mobile'
import ReferModal from './ReferModal'
@immutableRenderDecorator
export default class ReferenceAccount extends Component {
    constructor(props) {
		super(props)
		this.state = {
            choose:'',
            modalVisible:false,
            start:'',
            end:'',
            showDate:false,
            lastMonthString:''
		}
	}
    render(){
        const{choosenIssuedate,modalVisible,start,end,showDate,choose,lastMonthString}=this.state
        const {issuedate,issues,endissuedate,nextperiods,onSelected,referChooseValue,
            onChangeReferChooseValue,referBegin,referEnd
        }=this.props
        const dateSelectList = [
            {key: '本年累计', value:'YEAR_TOTAL'},
            {key: '上个月', value:'LAST_MONTH'},
            {key: '上年同期', value:'LAST_YEAR_MONTH'},
			{key: '按账期查询', value: 'ISSUE'},
			{key: '按账期区间查询', value: 'ISSUE_RANGE'},
		]
        return(
            <div style={{display:'flex'}}>
                <ReferModal
                    visible={modalVisible}
                    issuedate={issuedate}
                    issues={issues}
                    endissuedate={endissuedate}
                    referChooseValue={choose}
                    onChanged={(referStart,referEnd)=>{
                        if(choose==='ISSUE'){
                            this.setState({start:referStart,end:''})
                        }else{
                            this.setState({start:referStart,end:referEnd})
                        }
                        onChangeReferChooseValue(choose)
                        onSelected(`${referStart.split("-")[0]}${referStart.split("-")[1]}`,`${referEnd.split("-")[0]}${referEnd.split("-")[1]}`)
                    }}
                    onClose={()=>{
                        this.setState({modalVisible:false})
                    }}
                />
                <Single
                    district={dateSelectList}
                    value={referChooseValue}
                    canSearch={false}
                    title='请选择参考账期'
                    onOk={value => {

                        let year = issuedate.split('-')[0]
                        let month = issuedate.split('-')[1] // 01
                        let issueList = issues.toJS().reverse()

                        if(value.value==='YEAR_TOTAL'){
                            onChangeReferChooseValue(value.value)
                            onSelected('','')
                            this.setState({start:'',end:''})
                        }else if(value.value==='LAST_MONTH'){
                            let index = issueList.findIndex(v=>v.value===issuedate)
                            if(index===0){
                                Toast.info('不在有效账期区间内',1)
                            }else{
                                let lastMonth =issueList[index-1].value
                             
                                onSelected(`${lastMonth.substr(0,4)}${lastMonth.substr(5,6)}`,`${lastMonth.substr(0,4)}${lastMonth.substr(5,6)}`)
                                this.setState({start:'',end:'',lastMonthString:`${lastMonth.substr(0,4)}.${lastMonth.substr(5,6)}`})
                                onChangeReferChooseValue(value.value)
                            }
                        }else if(value.value==='LAST_YEAR_MONTH'){
                            let lastyear =`${Number(year)-1}-${month}`
                            let nextYear=false
                            for(let i in issueList){
                                if(issueList[i].value === lastyear){
                                    nextYear=true
                                }
                            }
                            if(nextYear){
                                onChangeReferChooseValue(value.value)
                                onSelected(`${lastyear}${month}`,`${lastyear}${month}`)
                                this.setState({start:'',end:''})
                            }else{
                                Toast.info('不在有效账期区间内',1)
                            }
                        }else if(value.value==='ISSUE'||value.value==='ISSUE_RANGE'){
                            //onChangeReferChooseValue(value.value)
                            this.setState({modalVisible:true,choose:value.value})
                        }

                    }}
                >
                    {/*<span style={{display: ['ISSUE', 'ISSUE_RANGE'].includes(referChooseValue) ? 'none' : ''}}>
                        {dateSelectList.find(v=>v.value===referChooseValue).key}
                    </span>*/}

                    {'YEAR_TOTAL'===referChooseValue&& '本年累计'}
                    {'LAST_YEAR_MONTH'===referChooseValue ? endissuedate?`${start ? start.replace(/\-/g, '.') : ''}${end ? '-'+end.split('-')[1]:''}`:'去年同期':''}
                    {'LAST_MONTH'===referChooseValue && `${lastMonthString}`}
                    {'ISSUE'===referChooseValue &&
                        `${start ? start.replace(/\-/g, '.') :''}`
                    }
                    {'ISSUE_RANGE'===referChooseValue &&
                        // `${start ? start.replace(/\-/g, '.') : ''}-${end ? end.split('-')[1]:''}`
                        //修改显示.替代-
                        `${start ? start.replace(/\-/g, '.') : ''}-${end ? end.replace(/-/,'.'):''}`
                    }
                    <XfnIcon type="calendar-simple" style={{ color:'rgb(94,129,209)',marginLeft :'5px'}}/>
                </Single>
            </div>
        )
    }
}
