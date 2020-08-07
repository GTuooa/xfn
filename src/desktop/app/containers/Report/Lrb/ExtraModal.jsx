import React, { PropTypes } from 'react'
import { Map, List ,fromJS} from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import XfnIcon from 'app/components/Icon'
import LrItem from './LrItem.jsx'
import { TableWrap, TableBody, TableTitle, TableAll ,TitleKmye} from 'app/components'
import SelfLrbItem from "./SelfLrbItem"
import * as lrbActions from 'app/redux/Report/Lrb/lrb.action.js'
import { debounce } from 'app/utils'
import { Select, Modal, Button, Checkbox, Input, message, Radio, DatePicker, Icon } from 'antd'
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const { RangePicker } = DatePicker
import moment from 'moment'
import XfnInput from 'app/components/Input'

@immutableRenderDecorator
export default
class ExtraModal extends React.Component {
    state = {
        curMessage:this.props.extraMessage
    }
    testCount = (value,name) => {
        const { extraMessageList, dispatch } = this.props
        if(Number(value) < 10000000){
            const index = extraMessageList.findIndex(v => v.get('name') === '人均营收')
            const newList = extraMessageList.setIn([index,'denominatorValue'],value)
            dispatch(lrbActions.changeLrbString('extraMessageList',newList))
        }else{
            message.info("运算项分母不可超过1000万",1)
        }
    }
    checkItem = (checked) => {
        const { extraMessageList, dispatch } = this.props
    }
    saveCheck = (list) => {
        const checkd = list.map(v => {
                if (v.get('needConfirm') && list.size > 1) {
                    message.info("请确认新增明细")
                    return false
                } else if (!v.get('name')) {
                    message.info("名称不能为空")
                    return false
                }  else if (v.get('name') && v.get('name').length > 6) {
                    message.info("名称长度不能超过6位")
                    return false
                } else if (!v.get('denominatorValue') && (v.get('enable') || (v.get('needConfirm')))){
                    message.info("运算项分母不能为空")
                    return false
                } else if (!v.get('denominatorName')){
                    message.info("单位不能为空")
                    return false
                }  else if (v.get('denominatorName') && v.get('denominatorName').length >6){
                    message.info("单位长度不能超过6位")
                    return false
                } else if (v.get('denominatorValue') === 0){
                    message.info("运算项分母不能为0")
                    return false
                }
                return true
            })
            return checkd.every(v => v)

    }
    render() {
        const {
            extraModal,
            onCancel,
            extraMessageList,
            dispatch,
            refreshFunc
        } = this.props
        const {
            curMessage
        } = this.state
        const list = [
            {key:'营业收入',value:1},
            {key:'营业利润',value:5},
            {key:'营业净利润',value:9},
            {key:'营业成本',value:2},
        ]
        return(
            <Modal
				visible={extraModal}
				width={480}
				onCancel={onCancel}
				title='设置附加信息'
                okText='保存'
                onOk={() => {
                    this.saveCheck(extraMessageList) && dispatch(lrbActions.setExtraMessageList(extraMessageList.toJS(),() => {
                        refreshFunc()
                        onCancel()
                    }))
                }}
				>

					<div className='extra-content'>
                        <div>
							<span></span>
							<span>名称</span>
							<span>运算项分子</span>
							<span>运算项分母</span>
							<span>单位</span>
                            <span></span>
						</div>
                        {
                            extraMessageList.map((v,index)=>
                                <div key={index}>
                                    <span>
                                        {
                                            !v.get('needConfirm')?
                                            <Checkbox
                                                checked={v.get('enable')}
                                                onChange={(e) => {
                                                    dispatch(lrbActions.changeLrbString('extraMessageList',extraMessageList.setIn([index,'enable'],e.target.checked)))
                                                }}
                                            />:''
                                        }
                                        </span>
                                        <span>
                                            {
                                                index > 2 ?
                                                <Input
                                                    value={v.get('name')}
                                                    // disabled={!v.get('enable')}
                                                    placeholder='请数量名称'
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                        const newList = extraMessageList.setIn([index,'name'],value)
                                                        dispatch(lrbActions.changeLrbString('extraMessageList',newList))
                                                    }}
                                                />:v.get('name')
                                            }
                                        </span>
                                        <span>{
                                        index > 2 ?
                                        <Select
                                            // disabled={!v.get('enable')}
                                            value={(list.find(w => w.value === v.get('numerator')) || {}).key}
                                            onChange={(value) => {
                                                const newList = extraMessageList.setIn([index,'numerator'],value)
                                                dispatch(lrbActions.changeLrbString('extraMessageList',newList))
                                            }}
                                            >
                                            {
                                                list.map(v =>
                                                    <Option value={v.value}>{v.key}</Option>
                                                )
                                            }
                                        </Select>
                                        :(list.find(w => w.value === v.get('numerator')) || {}).key
                                    }</span>
                                    <span>
                                        <XfnInput
                                            // disabled={!v.get('enable')}
                                            value={v.get('denominatorValue')}
                                            placeholder={
                                                {
                                                    0:'请输入人数',
                                                    1:'请输入人数',
                                                    2:'请输入面积'
                                                }[index] || '请输入分母'
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value
                                                if(Number(value) < 10000000){
                                                    const newList = extraMessageList.setIn([index,'denominatorValue'],value)
                                                    dispatch(lrbActions.changeLrbString('extraMessageList',newList))
                                                } else {
                                                    message.info("运算项分母不可超过1000万")
                                                }
                                            }}
                                        />
                                    </span>
                                    <span>
                                        {
                                            index > 2 ?
                                            <Input
                                                // disabled={!v.get('enable')}
                                                placeholder='请输入单位'
                                                value={v.get('denominatorName')}
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                    const newList = extraMessageList.setIn([index,'denominatorName'],value)
                                                    dispatch(lrbActions.changeLrbString('extraMessageList',newList))
                                                }}
                                            />:v.get('denominatorName')
                                        }
                                    </span>
                                    {
                                        index > 2 ?
                                        <span>
                                            {
                                                v.get('needConfirm')?
                                                <XfnIcon
                                                    type='circle-confirm'
                                                    style={{color: '#1eb6f8'}}
                                                    onClick={() => {
                                                        if (this.saveCheck(fromJS([v]))) {
                                                            dispatch(lrbActions.changeLrbString('extraMessageList',extraMessageList.setIn([index,'needConfirm'],false)))
                                                        }
                                                    }}
                                                />
                                                :''
                                            }
                                            <XfnIcon
                                                type='circle-del'
                                                style={{color: '#f5222d'}}
                                                onClick={() => {
                                                    dispatch(lrbActions.deleteExtraMessage([v.get('id')],() => {
                                                        dispatch(lrbActions.changeLrbString('extraMessageList',extraMessageList.splice(index,1)))
                                                    }))
                                                }}
                                            />
                                        </span>
                                        :<span></span>
                                    }

                                </div>
                            )
                        }
						<div>
							<Button
                                onClick={() => {
                                    dispatch(lrbActions.changeLrbString('extraMessageList',extraMessageList.push(fromJS({needConfirm:true,numerator:1}))))
                                }}
                                ><XfnIcon type='big-plus'/>添加附加信息</Button>
						</div>
					</div>
			</Modal>
        )
    }
}
