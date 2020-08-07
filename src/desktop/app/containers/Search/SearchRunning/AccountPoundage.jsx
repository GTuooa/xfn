import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import { Select, Icon, Divider, Switch, Checkbox } from 'antd'
import Input from 'app/components/Input'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import XfnSelect from 'app/components/XfnSelect'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney, numberTest } from 'app/utils'
import AccountModifyModal from 'app/containers/Config/AccountConfig/AccountModifyModal'
import { projectCodeTest } from 'app/containers/components/moduleConstants/common'
import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action'

@immutableRenderDecorator
export default
class AccountPandge extends React.Component {
    componentDidMount() {
        const uuid = this.props.accountPoundage.get('categoryUuid')
        const canUsed = this.props.accountPoundage.get('canUsed')
            if (uuid && canUsed) {
                this.props.dispatch(searchRunningActions.getAccountRunningCate(uuid))
            }
    }
    render() {
        const {
            dispatch,
            accountPoundage,
            flags,
            projectList,
            modalTemp
        } = this.props
        const poundageCurrentCardList = modalTemp.get('poundageCurrentCardList') || fromJS([])
        const poundageProjectCardList = modalTemp.get('poundageProjectCardList') || fromJS([])
        const needUsedPoundage = modalTemp.get('needUsedPoundage')
        const accountProjectRange = flags.get('accountProjectRange')
		const accountContactsRange = flags.get('accountContactsRange')
		const accountContactsRangeList = flags.get('accountContactsRangeList')
		const accountProjectList = flags.get('accountProjectList')
        const accountName = modalTemp.getIn(['accounts',0,'accountName'])
        const poundageAmount = modalTemp.getIn(['accounts',0,'poundageAmount'])
        const accountUuid = modalTemp.getIn(['accounts',0,'accountUuid'])
        const poundage = modalTemp.getIn(['accounts',0,'poundage']) || fromJS({})
        const needPoundage = poundage.get('needPoundage')
        const canUsed = accountPoundage.get('canUsed')
        
        return(
            <div style={{display:needPoundage && accountUuid && canUsed?'':'none'}}>
                <div style={{marginBottom:'10px'}}>
                    <span>
                        <Checkbox
                            style={{width:'auto',fontSize:'12px'}}
                            checked={needUsedPoundage}
                            onChange={(e) => {
                                dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'needUsedPoundage'], !needUsedPoundage))
                            }}
                        >
                            账户手续费
                        </Checkbox>
                    </span>
                    {
                        accountPoundage.get('poundageNeedCurrent') && needUsedPoundage?
                        <Switch
                            className="use-unuse-style edit-running-switch"
                            checked={poundageCurrentCardList.size}
                            checkedChildren={'往来'}
                            unCheckedChildren={'往来'}
                            onChange={() => {
                                if (poundageCurrentCardList.size) {
                                    dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'poundageCurrentCardList'], fromJS([])))
                                } else {
                                    dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'poundageCurrentCardList'], fromJS([{}])))
                                }
                            }}
                        />:''
                    }
                    {
                        accountPoundage.get('poundageNeedProject') && needUsedPoundage?
                        <Switch
                            className="use-unuse-style edit-running-switch"
                            checked={poundageProjectCardList.size}
                            checkedChildren={'项目'}
                            unCheckedChildren={'项目'}
                            style={{marginLeft:'10px'}}
                            onChange={() => {
                                if (poundageProjectCardList.size) {
                                    dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'poundageProjectCardList'], fromJS([])))
                                } else {
                                    dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'poundageProjectCardList'], fromJS([{}])))
                                }
                            }}
                        />:''
                    }
                </div>
                {
                    poundageCurrentCardList.size && needUsedPoundage?
                    <div className="manager-item">
                        <label>往来单位：</label>
                        <XfnSelect
                            combobox
                            showSearch
                            onDropdownVisibleChange={(open) => {
                                open && dispatch(searchRunningActions.getAccountContactsCardList(accountContactsRange))
                            }}
                            value={`${poundageCurrentCardList && poundageCurrentCardList.getIn([0,'code'])?poundageCurrentCardList.getIn([0,'code']):''} ${poundageCurrentCardList && poundageCurrentCardList.getIn([0,'name'])?poundageCurrentCardList.getIn([0,'name']):''}`}
                            onChange={value => {
                                const valueList = value.split(Limit.TREE_JOIN_STR)
                                const cardUuid = valueList[0]
                                const code = valueList[1]
                                const name = valueList[2]
                                dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'poundageCurrentCardList',0], fromJS({cardUuid,name,code})))
                            }}
                        >
                            {
                                accountContactsRangeList.map((v, i) => <Option   key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{`${v.get('code')} ${v.get('name')}`}</Option>)
                            }
                        </XfnSelect>
                    </div>:''
                }
                {
                    poundageProjectCardList.size && needUsedPoundage?
                    <div className="manager-item" >
                        <label>项目：</label>
                            <XfnSelect
                                combobox
                                showSearch
                                value={`${poundageProjectCardList && projectCodeTest(poundageProjectCardList.getIn([0,'code']))} ${poundageProjectCardList && poundageProjectCardList.getIn([0,'name'])?poundageProjectCardList.getIn([0,'name']):''}`}
                                onDropdownVisibleChange={(open) => {
                                    open && dispatch(searchRunningActions.getAccountProjectCardList(accountProjectRange))
                                }}
                                onChange={value => {
                                   const valueList = value.split(Limit.TREE_JOIN_STR)
                                   const uuid = valueList[0]
                                   const code = valueList[1]
                                   const name = valueList[2]
                                   dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'poundageProjectCardList',0], fromJS({cardUuid:uuid,name,code})))
                               }}
                               >
                                {
                                    accountProjectList.map((v, i) =>
                                        <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>
                                            {`${projectCodeTest(v.get('code'))} ${v.get('name')}`}
                                        </Option>
                                )}
                            </XfnSelect>
                        </div>:''
                }
                {
                    needUsedPoundage?
                    <div style={{display:'flex'}} className='manager-item'>
                        <label>支出金额：</label>
                            <Input
                                placeholder=""
                                value={poundageAmount}
                                onChange={(e) => {
                                    numberTest(e,(value) => {
                                        dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp','accounts',0,'poundageAmount'], value))
                                    })
                                }}
                            />
                            {/* {formatMoney(sxAmount)}<span style={{color:'#ccc'}}>(账户：{accountName},收款净额：{formatMoney(Math.abs(amount) - Math.abs(sxAmount))})</span> */}
                    </div>:''
                }
            </div>
        )
    }
}
