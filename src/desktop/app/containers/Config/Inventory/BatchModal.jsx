import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../components/common.less'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'

import { jxcConfigCheck, numberFourTest, DateLib } from 'app/utils'
import moment from 'moment'
import placeholderText from 'app/containers/Config/placehoderText'
import { UpperClassSelect, SelectAc, NumberInput, TableAll, TableBody, TableItem, Tab, TablePagination, XfnSelect } from 'app/components'
import { Modal, message, Radio, Icon, Tree, Input, Button, Checkbox, Select, DatePicker } from 'antd'
const { TreeNode } = Tree
const { confirm } = Modal
const { Option, OptGroup } = Select
import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'
import { batchReg, batchMessage } from './common'

export default
class BatchModal extends React.Component {
    state={
        modifyBatch:'',
        modifyBatchDate:'',
        modifyBatchUuid:'',
        modifyExpirationDate:''
    }
    emptyState = () => {
        this.setState({
            modifyBatchUuid:'',
            batch:'',
            modifyBatch:'',
            modifyBatchDate:'',
            modifyExpirationDate:''
        })
    }
    calculLife = (date,day) => {
		const sDate = Date.parse(date)
		const newDate = new Date(sDate + day*24*3600*1000)
		return new DateLib(newDate).toString()
	}
    getCurShelfLife = (startDate,endDate) => {
		const sDate1 = Date.parse(startDate)
		const sDate2 = Date.parse(endDate)
		return sDate2 > sDate1 ? Math.floor((sDate2 - sDate1) / (24 * 3600 * 1000)):null
	}
    componentDidMount() {
        if (this.props.modifyBatchUuid) {
            const { modifyBatchUuid, batch, modifyBatchDate } = this.props
            this.setState({
                modifyBatchUuid,
                batch,
                modifyBatch:batch,
                modifyBatchDate
            })
        }

    }
    render() {
        const {
            visible,
            onClose,
            onOk,
            onOkAndNew,
            batchList,
            openShelfLife,
            insertOrModify='modify',
            saveAndNewForbidden,
            className,
            shelfLife
        } = this.props
        const {
            modifyBatch,
            modifyBatchUuid,
        } = this.state
        const modifyBatchDate = this.state.modifyBatchDate && this.state.modifyBatchDate !== 'undefined' ? this.state.modifyBatchDate : new DateLib().toString()
        const modifyExpirationDate = this.state.modifyExpirationDate && this.state.modifyExpirationDate !== 'undefined' ? this.state.modifyExpirationDate : ''
        return(
            <Modal
                className={className}
                visible={visible}
                okText='保存'
                footer={[
                    <Button
                        onClick={onClose}
                        >取消</Button>,
                    <Button
                        type='primary'
                        onClick={() => {
                            onOk(modifyBatch,modifyBatchUuid,modifyBatchDate,modifyExpirationDate)
                            this.emptyState()
                        }}
                        >保存</Button>,
                        !saveAndNewForbidden?
                        <Button
                            type='primary'
                            onClick={() => {
                                onOkAndNew(modifyBatch,modifyBatchUuid,modifyBatchDate,modifyExpirationDate)
                                this.emptyState()

                            }}
                            >保存并继续</Button>:''

                ]}
                title={'修改批次信息'}
                onCancel={onClose}
                // onOk={() => {
                // 	dispatch(editInventoryCardActions.modifyBatch(modifyBatch,modifyBatchUuid,modifyBatchDate,uuid,() => {
                // 		dispatch(editInventoryCardActions.changeInventoryCardViews('batchModal',false))
                // 	}))
                // }}
            >
                <div className='batch-modal'>
                    <div>
                        <span>原批次：</span>
                        <div>
                            <XfnSelect
                            dropdownClassName={`inventory-are-for-dom`}
                            className={`batch-select`}
                            showSearch
                            placeholder='请选择批次号'
                            value={this.state.batch}
                            onChange={value => {
                                const valueList = value.split(Limit.TREE_JOIN_STR)
                                const batch = valueList[0]
                                const uuid  = valueList[1]
                                const productionDate = valueList[2]
                                const expirationDate = valueList[3]
                                this.setState({
                                    modifyBatchUuid:uuid,
                                    batch:batch,
                                    modifyBatch:batch,
                                    modifyBatchDate:productionDate,
                                    modifyExpirationDate:expirationDate
                                })
                            }}
                            >
                                {
                                    batchList.map(w =>
                                        <Option
                                            key={insertOrModify==='insert'?w.get('batch'):`${w.get('batchUuid')}`}
                                            value={`${w.get('batch')}${Limit.TREE_JOIN_STR}${w.get('batchUuid')}${Limit.TREE_JOIN_STR}${w.get('productionDate')}${Limit.TREE_JOIN_STR}${w.get('expirationDate')}`}
                                            >
                                                {`${w.get('batch')}`}
                                        </Option>
                                    )
                                }
                            </XfnSelect>
                        </div>
                    </div>
                    <div className="jxc-config-title" style={{marginBottom: 0,paddingBottom: '10px'}}>
                        修改后信息
                    </div>
                    <div>
                        <span>批次号：</span>
                        <div><Input
                            value={modifyBatch}
                            placeholder='请输入批次号'
                            onChange={(e) => {
                                e.preventDefault()
                                if (batchReg.test(e.target.value)) {
                                    this.setState({modifyBatch:e.target.value})

                                } else {
                                    message.info(batchMessage)
                                }
                            }}
                        /></div>
                    </div>
                    {
                        openShelfLife?
                        <div>
                            <span>生产日期：</span>
                            <div><DatePicker
                                allowClear={false}
                                dropdownClassName={`inventory-are-for-dom`}
                                value={modifyBatchDate?moment(modifyBatchDate):''}
                                onChange={value => {
                                    const date = value.format('YYYY-MM-DD')
                                    this.setState({modifyBatchDate:date})
                                    if (!modifyExpirationDate && shelfLife) {
                                        this.setState({modifyExpirationDate:this.calculLife(date,shelfLife)})

                                    }
                                    // dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
                                }}/></div>
                        </div>:''
                    }
                    {
                        openShelfLife?
                        <div>
                            <span><span style={{color:'red'}}>*</span>截止日期</span>
                            <div><DatePicker
                                allowClear={false}
                                dropdownClassName={`inventory-are-for-dom`}
                                value={modifyExpirationDate?moment(modifyExpirationDate):''}
                                onChange={value => {
                                    const date = value.format('YYYY-MM-DD')
                                    this.setState({modifyExpirationDate:date})
                                    // dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
                                }}/></div>
                        </div>:''
                    }
                    {
                        openShelfLife && (shelfLife || modifyBatchDate && modifyExpirationDate)?
                        <div>
                            <span></span>
                            <div>{`(${shelfLife?`默认保质期：${shelfLife}天 `:''}${this.getCurShelfLife(modifyBatchDate,modifyExpirationDate)?`实际保质期：${this.getCurShelfLife(modifyBatchDate,modifyExpirationDate)}天`:''})`}</div>
                        </div>:''
                    }
                </div>
            </Modal>
        )
    }
}
