import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Checkbox, Button, ButtonGroup, Icon, Container, Row, ScrollView } from 'app/components'

import * as thirdParty from 'app/thirdParty'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@connect(state => state)
export default
class TaxRate extends React.Component {
    state = {
        isSelect: false,
        selectList: [],
        rateOptionList: [],
    }
    componentDidMount() {
        thirdParty.setTitle({title: '税率选项'})
        thirdParty.setIcon({ showIcon: false })
        thirdParty.setRight({ show: false })

        const rateOptionList = this.props.allState.getIn(['taxRate', 'rateOptionList']).toJS()
        this.setState({rateOptionList: rateOptionList})
    }

    render() {
        const { dispatch, homeState, allState, } = this.props
        const { isSelect, selectList, rateOptionList } = this.state

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
        const editPermission = configPermissionInfo.getIn(['edit', 'permission'])
        
        const taxRateTemp = allState.get('taxRate')
        const scale = taxRateTemp.get('scale')
        const payableRate = taxRateTemp.get('payableRate')//默认应交增值税率
        const outputRate = taxRateTemp.get('outputRate')//默认销项税率

        const showPrompt = (insert, value, idx) => {
            thirdParty.Prompt({
                title: insert ? '新增税率' : `修改税率(${value}%)`,
                message: '请输入税率:',
                buttonLabels: ['取消', '确认'],
                onSuccess: (result) => {
                    if (result.buttonIndex === 1) {
                        if (/^[1-9]\d?$/g.test(result.value)) {
                            const inputValue = Number(result.value)
                            if (rateOptionList.includes(inputValue)) { return thirdParty.toast.info('该税率已存在') }
                            if (insert) {
                                rateOptionList.push(inputValue)
                            } else {//修改
                                rateOptionList[idx] = inputValue
                            }
                            this.setState({rateOptionList: rateOptionList})
                        } else {
                            thirdParty.toast.info('请输入范围1~99的正整数')
                        }
                    }
                }
            })
        }


        return(
            <Container>
                <ScrollView flex="1" uniqueKey="ac-config-scroll" savePosition className="tax-config">
                    <div>
                        {
                            rateOptionList.map((item,index) => {
                                let disabled = (scale=='small' && item==payableRate) || (scale=='general' && item==outputRate)
                                return (
                                    <div
                                        key={item} className='tax-config-item'
                                        onClick={() => {
                                            if (disabled) { 
                                                return thirdParty.toast.info('默认税率不允许修改和删除') 
                                            } 
                                            if (isSelect) {//选择
                                                if (selectList.includes(item)) {
                                                    selectList.splice(selectList.findIndex(v=> v==item),1)
                                                } else {
                                                    selectList.push(item)
                                                }
                                                this.setState({rateOptionList: rateOptionList})
                                            } else {
                                                showPrompt(false, item, index)
                                            }
                                        }}
                                    >
                                        <span>
                                            <Checkbox
                                                style={{display: isSelect ? '' : 'none', marginRight: '.05rem'}}
                                                checked={selectList.includes(item)}
                                                disabled={disabled}
                                            />
                                            <span>{item}%</span>
                                        </span>
                                        <Icon type="arrow-right"/>
                                    </div>
                                )
                            })
                        }
                    </div>
                </ScrollView>
                <ButtonGroup>
                    <Button
                        disabled={!editPermission}
                        style={{display: isSelect ? 'none' : ''}}
                        onClick={() => {showPrompt(true)}}
                    >
                        <Icon type="add-plus"/><span>新增</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        style={{display: isSelect ? 'none' : ''}}
                        onClick={() => {this.setState({isSelect: true})}}
                    >
                        <Icon type="select" size='15'/><span>选择</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        style={{display: isSelect ? 'none' : ''}}
                        onClick={() => {
                            dispatch(allRunningActions.saveRateOptionList(rateOptionList))
                        }}
                    >
                        <Icon type='save' size='15'/>
                        <span>保存</span>
                    </Button>

                    <Button
                        style={{display: isSelect ? '' : 'none'}}
                        onClick={() => {this.setState({isSelect: false, selectList: []})}}
                    >
                        <Icon type="cancel"/><span>取消</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        style={{display: isSelect ? '' : 'none'}}
                        onClick={() => {
                            selectList.forEach((v) => {
                                if (rateOptionList.includes(v)) {
                                    rateOptionList.splice(rateOptionList.findIndex(item => item==v),1)
                                }
                            })
                            this.setState({rateOptionList: rateOptionList})
                            thirdParty.toast.info('操作成功')
                        }}
                    >
                       <Icon type="delete"/><span>删除</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}
