import React from 'react'
import { toJS, fromJS } from 'immutable'
import { Icon } from 'app/components'

import ChosenPicker from 'app/components/ChosenPicker'

export default
class AcSelect extends React.Component {

    render() {
        const {
            dispatch,
            aclist,
            value,
            onChange,
            visible,
            parentDisabled,
            onCancel,
        } = this.props

        const findParent = (acid, parent) => {
            //console.log(parent)
            const len = acid.length - 2
            while (len != parent.key.length) {
                parent = parent.childList.find(w => !acid.indexOf(w.key))
            }
            return parent
        }

        const cascadeData = (list, flag) => {
            if (typeof list !== 'object')
            return []
            const data = [{key: '资产', label: '资产', childList: []}, {key: '负债', label: '负债', childList: []},{key: '权益', label: '权益', childList: []}, {key: '成本', label: '成本', childList: []}, {key: '损益', label: '损益', childList: []}]

            list.forEach(v => {
                const acid = v.acid
                const category = v.category

                const key = {
                    '流动资产': '资产',
                    '非流动资产': '资产',
                    '流动负债': '负债',
                    '非流动负债': '负债',
                    '所有者权益': '权益',
                    '成本': '成本'
                }[category] || '损益'

                const item = {
                    key: acid,
                    label: acid + ' ' + v.acname,
                    item: v,
                    childList: []
                }
                if (acid.length == 4) {
                    // data.push(item)
                    data.forEach((v, i) => {
                        if (v.key === key) {
                            data[i]['childList'].push(item)
                        }
                    })
                } else {
                    let belongList
                    data.forEach((v, i) => {
                        if (v.key === key) {
                            belongList = data[i]['childList']
                        }
                    })
                    const parent = findParent(acid, belongList.find(w => !acid.indexOf(w.key)))
                    parent.childList.push(item)
                }
            })
            return data
        }

        const sourceList = cascadeData(aclist.toJS()).filter(v => v.childList.length !== 0)

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
