import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Button, Checkbox, Tooltip } from 'antd'
const CheckboxGroup = Checkbox.Group;

import * as Limit from 'app/constants/Limit.js'
import { toJS ,fromJS } from 'immutable'

import './index.less'


@immutableRenderDecorator
export default
class CheckBoxModule extends React.Component {
    state = {

    }

    render() {
        const {
            dispatch,
            item,
            newChooseObj,
            checkBoxClick,
            moduleIndex,
        } = this.props


        const index = newChooseObj.findIndex(y => y.get('assistClassificationUuid') === item.get('assistClassificationUuid'))
        const propertyListLength = index > -1 && newChooseObj.getIn([index,'propertyList']) ? newChooseObj.getIn([index,'propertyList']).size : 0
        const isAllChecked = propertyListLength && item.get('propertyList').size ?  propertyListLength === item.get('propertyList').size :  false

        return (
            <div className='mxb-checkbox-group'>
                <div className='checkbox-group-leader'>
                    <Checkbox
                        indeterminate={index > -1 && !isAllChecked}
                        onClick={(e)=>{
                            e.stopPropagation()
                            let curObj = newChooseObj, newList = fromJS([])
                            if(index === -1){
                                newList = curObj.push(fromJS({
                                    ...(item.toJS()),
                                    index: moduleIndex,
                                }))
                            }else{
                                newList = curObj.delete(index)
                                if(!isAllChecked){
                                    newList = newList.push(fromJS({
                                        ...(item.toJS()),
                                        index: moduleIndex,
                                    }))
                                }
                            }

                            checkBoxClick(newList)
                        }}
                        checked={isAllChecked}
                    >
                      {item.get('assistClassificationName')}
                    </Checkbox>
                </div>
                <div className="checkbox-group-items">
                    {
                        item.get('propertyList').map(w =>
                            <span>
                                <Tooltip title={newChooseObj.size >= 3  && newChooseObj.every(w => w.get('assistClassificationUuid') !== item.get('assistClassificationUuid')) ? '单个存货最多支持三个属性分类，不支持筛选超过三个属性分类' : ''}>
                                    <Checkbox
                                        disabled={newChooseObj.size >= 3 && newChooseObj.every(w => w.get('assistClassificationUuid') !== item.get('assistClassificationUuid'))}
                                        checked={newChooseObj.some(y => y.get('propertyList').find(z => z.get('assistPropertyUuid') === w.get('assistPropertyUuid')))}
                                        onClick={e => {
                                            e.stopPropagation()
                                            let curObj = newChooseObj, newList = fromJS([])
                                            if (e.target.checked) {
                                                if(index === -1){
                                                    curObj = newChooseObj.push(fromJS({
                                                        ...(item.set('propertyList',fromJS([])).toJS()),
                                                        index: moduleIndex,
                                                    }))
                                                }
                                                newList = curObj.updateIn([index,'propertyList'], v => v.push((w)))
                                            } else if (!e.target.checked && curObj.getIn([index,'propertyList']).size === 1) {
                                                newList = curObj.delete(index)
                                            } else {
                                                newList = curObj.updateIn([index,'propertyList'], v => v.splice((v.findIndex(z => z.get('assistPropertyUuid') === w.get('assistPropertyUuid'))),1))
                                            }
                                            checkBoxClick(newList)
                                        }}
                                        >
                                            {w.get('assistPropertyName')}
                                    </Checkbox>
                                </Tooltip>

                            </span>
                        )
                    }
                </div>

            </div>
        )
    }

}
