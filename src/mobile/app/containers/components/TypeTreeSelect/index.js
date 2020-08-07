import React from 'react'
import { toJS, fromJS } from 'immutable'
import { Icon } from 'app/components'
// import SwapPosition from './SwapPosition'
// import { Popover } from 'antd-mobile'
// const Item = Popover.Item
// import { TreeSelect } from 'app/components'
import ChosenPicker from 'app/components/ChosenPicker'

export default
class TypeTreeSelect extends React.Component {  // 往来，存货，项目设置专用
    state = {
        // showList: [],
        // sortModal: false//上下移蒙层的显示
    }

    render() {
        const {
            dispatch,
            typeList,
            value,
            onChange,
            visible,
            isSelectEnd,
            parentDisabled,
            onCancel,
        } = this.props

        const loop = (item) => item.map((v, i) => {
            if (v.childList && v.childList.length) {
                return {
                    key: v.uuid,
                    label: v.name,
                    childList: loop(v.childList)
                }
            } else {
                return {
                    key: v.uuid,
                    label: v.name,
                    childList: [],
                }
            }
        })

        let sourceList = []
        if (typeList.size) {
            if (typeList.getIn([0, 'childList']).size) {
                if (isSelectEnd !== true) { // isSelectEnd 表示只能选末端，不能把“全部”放上去
                    sourceList = loop( typeList.getIn([0, 'childList']).toJS() )
                    sourceList.unshift({
                        key: typeList.getIn([0, 'uuid']),
                        label: typeList.getIn([0, 'name']),
                        childList: [],
                    })
                } else {
                    sourceList = loop( typeList.getIn([0, 'childList']).toJS() )
                }
            } else {
                sourceList.unshift({
                    key: typeList.getIn([0, 'uuid']),
                    label: typeList.getIn([0, 'name']),
                    childList: [],
                })
            }
        } else {
            sourceList = [{
                key: '',
                label: '全部',
                childList: [],
            }]
        }

        return(
            <ChosenPicker
                visible={visible}
                district={sourceList}
                value={value}
                parentDisabled={parentDisabled}
                onChange={onChange}
                onCancel={onCancel}
            >
                {this.props.children}
            </ChosenPicker>
        )
    }
}
