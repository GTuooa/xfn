import React, { PropTypes } from 'react'
import { Map, toJS } from 'immutable'
import { connect }	from 'react-redux'

import * as allActions from 'app/redux/Home/All/soblist.action'
import * as sobConfigActions from 'app/redux/Config/Sob/sobConfig.action'
import { Checkbox, Icon, Container, ScrollView, ButtonGroup, Button, TextInput } from 'app/components'

@connect(state => state)
export default
class FunSelect extends React.Component {

    constructor(props) {
		super(props)
		this.state = { identifyingCode: '' }
	}
	
	render() {
		const {
			sobConfigState,
            dispatch,
            history
        } = this.props
		const { identifyingCode } = this.state

        const currentCopySobId = sobConfigState.get('currentCopySobId')
        const isIdentifyingCode = sobConfigState.get('isIdentifyingCode')
        const copyModuleMapItem = sobConfigState.get('copyModuleMapItem')
        const identifyingCodeList = sobConfigState.get('identifyingCodeList')
        const selectedSob = sobConfigState.get('tempSob')
        let moduleInfo = selectedSob.get('moduleInfo')
        const customizeList = selectedSob.get('customizeList')//选中的智能版流水账套模版
        const jrModelList = selectedSob.get('jrModelList')//智能版流水账套模版
        const copyModuleIsNewJr = sobConfigState.get('copyModuleIsNewJr')
        
        const copyModuleList = [ 'COPY_BASIS_SETTING', 'COPY_PRODUCTION_SETTING', 'COPY_CONSTRUCTION_SETTING', 'COPY_DEPOT_SETTING', 'COPY_QUANTITY_SETTING', , 'COPY_ASSIST_SETTING', 'COPY_SERIAL_SETTING', 'COPY_BATCH_SETTING', 'COPY_BALANCE_SETTING']
        const otherCopyModuleList = ['COPY_PROCESS_SETTING']
    
		return (
			<Container className="sob-option">
                <ScrollView flex="1">
                    {
                        isIdentifyingCode ? 
                        <div className="sob-option-copy-input">
                            <TextInput
                                placeholder="请输入识别码"
                                value={identifyingCode}
                                onChange={value => {
                                    this.setState({identifyingCode: value})
                                    const identifyingItem = identifyingCodeList.find(v => v.get('copyCode') === value)
                                    if (identifyingItem) {
                                        dispatch(sobConfigActions.setSobChangeCopyModuleItem(identifyingItem, '', true))
                                    }
                                }}
                            />
                        </div>
                        : null
                    }
                    
                    {

                        isIdentifyingCode ? (identifyingCode ? 
                            <div className="sob-option-choosen-right-or-not">
                                {
                                    identifyingCodeList.find(v => v.get('copyCode') === identifyingCode) ?
                                        <span style={{ color: 'green' }} >识别码正确，请选择需复制的内容</span>
                                        :
                                        <span style={{ color: 'red' }} >识别码错误，请核对后再输入</span>
                                }
                            </div> 
                            : '')
                        : ''
                    }

                    <div className="sob-option-choosen-tip" style={{display: isIdentifyingCode ? (identifyingCode ? (identifyingCodeList.find(v => v.get('copyCode') === identifyingCode) ? '' : 'none')  : 'none') : ''}}>
                        选择需要复制的内容
                    </div>
                    <ul className="sob-option-choosen-copy-list" style={{display: isIdentifyingCode ? (identifyingCode ? (identifyingCodeList.find(v => v.get('copyCode') === identifyingCode) ? '' : 'none')  : 'none') : ''}}>
                        {
                            copyModuleList.map((v, i) => {
                                if (copyModuleMapItem.get(v)) {

                                    const canModify = v === 'COPY_BALANCE_SETTING' ? (copyModuleMapItem.getIn([v, 'canModify']) && copyModuleList.every((w => copyModuleMapItem.get(w) && w !== 'COPY_BALANCE_SETTING' ? copyModuleMapItem.getIn([w, 'beOpen']) : true))) : copyModuleMapItem.getIn([v, 'canModify'])

                                    let preLimite = false
                                    if ((v === 'COPY_ASSIST_SETTING' || v === 'COPY_SERIAL_SETTING' || v === 'COPY_BATCH_SETTING') && !copyModuleMapItem.getIn(['COPY_QUANTITY_SETTING', 'beOpen'])) {
                                        preLimite = true
                                    }

                                    return (
                                        <li
                                            key={i}
                                            className="sob-option-choosen-copy-item"
                                            onClick={() => {
                                                if (copyModuleIsNewJr && canModify && !preLimite) {
                                                    dispatch(sobConfigActions.sobChangeCopyModuleItem(copyModuleMapItem.getIn([v, 'moduleCode']), !copyModuleMapItem.getIn([v, 'beOpen'])))
                                                    if (!copyModuleMapItem.getIn([v, 'beOpen']) === false && v !== 'COPY_BALANCE_SETTING') { // 期初值只能其他模块全钩选时才可以勾选
                                                        dispatch(sobConfigActions.sobChangeCopyModuleItem(copyModuleMapItem.getIn(['COPY_BALANCE_SETTING', 'moduleCode']), false))
                                                    }
                                                    // 辅助属性的东西需要数量开启才能复制
                                                    if (v === 'COPY_QUANTITY_SETTING' && !copyModuleMapItem.getIn([v, 'beOpen']) === false) {
                                                        // 关闭数量核算要同时关闭关联的三个辅助属性
                                                        if (copyModuleMapItem.get('COPY_ASSIST_SETTING')) {
                                                            dispatch(sobConfigActions.sobChangeCopyModuleItem(copyModuleMapItem.getIn(['COPY_ASSIST_SETTING', 'moduleCode']), false))
                                                        }
                                                        if (copyModuleMapItem.get('COPY_SERIAL_SETTING')) {
                                                            dispatch(sobConfigActions.sobChangeCopyModuleItem(copyModuleMapItem.getIn(['COPY_SERIAL_SETTING', 'moduleCode']), false))
                                                        }
                                                        if (copyModuleMapItem.get('COPY_BATCH_SETTING')) {
                                                            dispatch(sobConfigActions.sobChangeCopyModuleItem(copyModuleMapItem.getIn(['COPY_BATCH_SETTING', 'moduleCode']), false))
                                                        }
                                                    }
                                                }
                                            }}
                                        >
                                            <span className="sob-option-choosen-copy-item-text">{copyModuleMapItem.getIn([v, 'moduleName'])}</span>
                                            <Checkbox
                                                disabled={!copyModuleIsNewJr || !canModify || preLimite}
                                                checked={copyModuleMapItem.getIn([v, 'beOpen'])}
                                            ></Checkbox>
                                        </li>
                                    )
                                } else {
                                    return null
                                }
                            })
                        }
                        {
                            otherCopyModuleList.map((v, i) => {
                                if (copyModuleMapItem.get(v)) {

                                    const canModify = copyModuleMapItem.getIn([v, 'canModify'])

                                    return (
                                        <li
                                            key={i}
                                            className="sob-option-choosen-copy-item"
                                            onClick={() => {
                                                if (copyModuleIsNewJr && canModify) {
                                                    dispatch(sobConfigActions.sobChangeCopyModuleItem(copyModuleMapItem.getIn([v, 'moduleCode']), !copyModuleMapItem.getIn([v, 'beOpen'])))
                                                }
                                            }}
                                        >
                                            <span className="sob-option-choosen-copy-item-text">{copyModuleMapItem.getIn([v, 'moduleName'])}</span>
                                            <Checkbox
                                                disabled={!copyModuleIsNewJr || !canModify}
                                                checked={copyModuleMapItem.getIn([v, 'beOpen'])}
                                            ></Checkbox>
                                        </li>
                                    )
                                } else {
                                    return null
                                }
                            })
                        }
                    </ul>
                </ScrollView>
                <ButtonGroup type="ghost" height={50}>
                    <Button
                        onClick={() => {
                            history.goBack()
                        }}>
                        <Icon type='cancel'/>
                        <span>取消</span>
                    </Button>
                    <Button
                        onClick={() => {

                            let jrLodalItem
                            if (isIdentifyingCode) {
                                const customizeItem = identifyingCodeList.find(v => v.get('copyCode') === identifyingCode)
                                jrLodalItem = customizeItem.set('modelId', customizeItem.get('sobId')).set('copyModuleMap', copyModuleMapItem)	
                            } else {
                                const customizeItem = customizeList.find(v => v.get('sobId') === currentCopySobId)
                                jrLodalItem = jrModelList.find(v => v.get('customize') === true) // 复制账套的那个
                                jrLodalItem = jrLodalItem.merge(customizeItem).set('modelId', customizeItem.get('sobId')).set('copyModuleMap', copyModuleMapItem)	
                            }

                            dispatch(sobConfigActions.changeZNSobModel(jrLodalItem))
                            if (jrLodalItem.get('newJr') === true) {
                                let moduleMap = jrLodalItem.get('moduleMap')
                                if (jrLodalItem.getIn(['moduleMap', 'PROCESS']) && !moduleInfo.getIn(['PROCESS', 'beOverdue'])) {
                                    moduleInfo = moduleInfo.set('PROCESS', jrLodalItem.getIn(['moduleMap', 'PROCESS']))
                                    moduleMap = moduleMap.setIn(['PROCESS', 'beOpen'], jrLodalItem.getIn(['copyModuleMap', 'COPY_PROCESS_SETTING', 'beOpen']))
                                }
                                if (jrLodalItem.getIn(['moduleMap', 'INVENTORY'])) {
                                    moduleInfo = moduleInfo.set('INVENTORY', jrLodalItem.getIn(['moduleMap', 'INVENTORY']))
                                }
                                if (jrLodalItem.getIn(['moduleMap', 'PROJECT'])) {
                                    moduleInfo = moduleInfo.set('PROJECT', jrLodalItem.getIn(['moduleMap', 'PROJECT']))
                                }
                                if (jrLodalItem.getIn(['moduleMap', 'QUANTITY']) && !moduleInfo.getIn(['QUANTITY', 'beOverdue'])) {
                                    moduleInfo = moduleInfo.set('QUANTITY', jrLodalItem.getIn(['moduleMap', 'QUANTITY']))
                                    moduleMap = moduleMap.setIn(['QUANTITY', 'beOpen'], jrLodalItem.getIn(['copyModuleMap', 'COPY_QUANTITY_SETTING', 'beOpen']))
                                }
                                if (jrLodalItem.getIn(['moduleMap', 'ASSIST']) && !moduleInfo.getIn(['ASSIST', 'beOverdue'])) {
                                    moduleInfo = moduleInfo.setIn(['ASSIST', 'beOpen'], jrLodalItem.getIn(['moduleMap', 'ASSIST', 'beOpen']))
                                    moduleMap = moduleMap.setIn(['ASSIST', 'beOpen'], jrLodalItem.getIn(['copyModuleMap', 'COPY_ASSIST_SETTING', 'beOpen']))
                                }
                                if (jrLodalItem.getIn(['moduleMap', 'SERIAL']) && !moduleInfo.getIn(['SERIAL', 'beOverdue'])) {
                                    moduleInfo = moduleInfo.setIn(['SERIAL', 'beOpen'], jrLodalItem.getIn(['moduleMap', 'SERIAL', 'beOpen']))
                                    moduleMap = moduleMap.setIn(['SERIAL', 'beOpen'], jrLodalItem.getIn(['copyModuleMap', 'COPY_SERIAL_SETTING', 'beOpen']))
                                }
                                if (jrLodalItem.getIn(['moduleMap', 'BATCH']) && !moduleInfo.getIn(['BATCH', 'beOverdue'])) {
                                    moduleInfo = moduleInfo.setIn(['BATCH', 'beOpen'], jrLodalItem.getIn(['moduleMap', 'BATCH', 'beOpen']))
                                    moduleMap = moduleMap.setIn(['BATCH', 'beOpen'], jrLodalItem.getIn(['copyModuleMap', 'COPY_BATCH_SETTING', 'beOpen']))
                                }
                                if (jrLodalItem.getIn(['moduleMap', 'WAREHOUSE']) && !moduleInfo.getIn(['WAREHOUSE', 'beOverdue'])) {
                                    moduleInfo = moduleInfo.set('WAREHOUSE', jrLodalItem.getIn(['moduleMap', 'WAREHOUSE']))
                                    moduleMap = moduleMap.setIn(['WAREHOUSE', 'beOpen'], jrLodalItem.getIn(['copyModuleMap', 'COPY_DEPOT_SETTING', 'beOpen']))
                                }
                                if (jrLodalItem.getIn(['moduleMap', 'SCXM']) && !moduleInfo.getIn(['SCXM', 'beOverdue'])) {
                                    moduleInfo = moduleInfo.set('SCXM', jrLodalItem.getIn(['moduleMap', 'SCXM']))
                                    moduleMap = moduleMap.setIn(['SCXM', 'beOpen'], jrLodalItem.getIn(['copyModuleMap', 'COPY_PRODUCTION_SETTING', 'beOpen']))
                                }
                                if (jrLodalItem.getIn(['moduleMap', 'SGXM']) && !moduleInfo.getIn(['SGXM', 'beOverdue'])) {
                                    moduleInfo = moduleInfo.set('SGXM', jrLodalItem.getIn(['moduleMap', 'SGXM']))
                                    moduleMap = moduleMap.setIn(['SGXM', 'beOpen'], jrLodalItem.getIn(['copyModuleMap', 'COPY_CONSTRUCTION_SETTING', 'beOpen']))
                                }
                                dispatch(sobConfigActions.sobOptionChangeContent('moduleInfo', moduleInfo))
                                dispatch(sobConfigActions.sobOptionChangeContent('moduleMap', moduleMap))
                            } else {
                                const newItem = moduleInfo.setIn(['INVENTORY', 'beOpen'], true).setIn(['PROJECT', 'beOpen'], true)
                                dispatch(sobConfigActions.sobOptionChangeContent('moduleInfo', newItem))
                                dispatch(sobConfigActions.sobOptionChangeContent('moduleMap', newItem))
                            }
                            history.goBack()
                        }}>
                        <Icon type='choose'/>
                        <span>确定</span>
                    </Button>
				</ButtonGroup>
			</Container>
		)
	}
}