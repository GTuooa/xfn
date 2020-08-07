import React, { Component } from 'react'

import CategorySelect from './CategorySelect'
import CardSelect from './CardSelect'

export default class ChosenPicker extends Component {

    render() {
        const { type, district, cardList, value, onChange, disabled, className, parentDisabled, multiSelect, visible, onCancel, onOk, cardValue, title, icon } = this.props
        // type             category||card     => 类别选择器||卡片选择器    默认为 category
        //district          [{key: '唯一的值', label: '显示的字符', disabled: '', childList:[]}]
        // multiSelect      true||false        => 是否多选                默认false              多选(与parentDisabled不兼容)
        // parentDisabled   true||false        => 父级是否禁用             默认true(只能选择末级)
        // value            str  || []         => 选中的类别的key值        是类别多选时 [{key:'唯一的值',label: '显示的字符'},{key:'',label: ''}]
        //visible           若一个页面共用这个组件则通过visible控制该组件的显示
        //onOk              多选时点击确定的回调

        //卡片选择
        // cardList         [{uuid:'', name:'', disabled: false, ..}]   => 卡片数据
        //onChange          card 选定类别时的回调
        //onOk              card 选定卡片时的回调
        //cardValue        [uuid, uuid]       =>选中的卡片的uuid        默认[]
        //icon             {type: '', onClick: function}              默认 null

        if (type !== 'card') {
            let parentDisabledTrue = typeof parentDisabled !== 'boolean' ? true : parentDisabled
            if (multiSelect) {//开启多选 禁用父级
                parentDisabledTrue = true
            }
            return (
                <CategorySelect
                    className={className}
                    district={district}
                    onChange={onChange}
                    onCancel={onCancel}
                    title={title}
                    onOk={onOk}
                    value={value ? value : []}
                    disabled={typeof disabled !== 'boolean' ? false : disabled}
                    parentDisabled={parentDisabledTrue}
                    multiSelect={typeof multiSelect !== 'boolean' ? false : multiSelect}
                    visible={typeof visible !== 'boolean' ? false : visible}
                >
                    {this.props.children}
                </CategorySelect>
            )
        } else {//类别-卡片选择
            return (
                <CardSelect
                    className={className}
                    district={district}
                    cardList={cardList}
                    onChange={onChange}
                    onCancel={onCancel}
                    onOk={onOk}
                    value={value ? value : []}
                    cardValue={cardValue ? cardValue : []}
                    disabled={typeof disabled !== 'boolean' ? false : disabled}
                    multiSelect={typeof multiSelect !== 'boolean' ? false : multiSelect}
                    visible={typeof visible !== 'boolean' ? false : visible}
                    title={title}
                    icon={icon ? icon : null}
                >
                    {this.props.children}
                </CardSelect>
            )
        }
    }
}
