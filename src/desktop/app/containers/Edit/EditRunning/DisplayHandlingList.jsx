import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import { DatePicker, Input, Select, Checkbox, Button, message, Radio, Icon } from 'antd'
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, TableAll, Amount, TableOver } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney } from 'app/utils'
import { getCategorynameByType, numberTest, regNegative, reg } from './common/common'
import Project from './Project'
import AccountComp from './AccountComp'
import { refreshButtonAction } from './Title'

import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'

@immutableRenderDecorator
export default
class DisplayHandlingList extends React.Component {
    state = {
        show:false
    }
    render() {
        const {
            titleList,
            listTitle,
            strongList,
            dispatch,
            amount,
            oriState,
            notHandleAmount
        } = this.props
        let totalHandleAmount = strongList.reduce((total,cur) => total += Number(cur.get('handleAmount')),0)
        let state
        if (totalHandleAmount === 0) {
            state = '未核销'
        } else if ((oriState === 'STATE_XC_DK' || oriState === 'STATE_XC_DJ' || oriState === 'STATE_SF_JN') && notHandleAmount === 0) {
            state = '全部核销'
        } else if ((oriState === 'STATE_XC_DK' || oriState === 'STATE_XC_DJ' || oriState === 'STATE_SF_JN') && notHandleAmount > 0) {
            state = '部分核销'
        } else if (Math.abs(totalHandleAmount) < Math.abs(amount || 0)) {
            state = '部分核销'
        } else {
            state = '全部核销'
        }
    return(
        <div >
            <div className='payment-water'>
                <span>核销情况：{state}</span>
                {
                    state !== '未核销'?
                    <span className='detail'>
                        {
                            this.state.show ?
                                <span
                                    onClick={() => {
                                        this.setState({show:false})
                                    }}
                                    >收拢 <Icon type="up" /></span>
                                :
                                <span
                                    onClick={() => {
                                        this.setState({show:true})
                                    }}
                                    >查看详情 <Icon type="down" /></span>
                        }
                    </span>
                    :
                    null
                }
            </div>
            <TableAll className="editRunning-table-no-box" style={{display:this.state.show && strongList && strongList.size?'':'none'}}>
                <TableTitle
                    className="editRunning-table-no-box-width"
                    titleList={titleList}
                        hasCheckbox={false}
                />
                <TableBody>

                    {
                        strongList && strongList.map((item,index) => {
                            const handleAmount = item.get('handleAmount')
                            const notHandleAmount = item.get('notHandleAmount')
                            return <TableItem className='editRunning-table-no-box-width' key={item.get('uuid')}>
                                    <li	>{item.get('oriDate')}</li>
                                    <TableOver
                                        textAlign='left'
                                        className='account-flowNumber'
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            dispatch(previewRunningActions.getPreviewRunningBusinessFetch(item, 'lrls',strongList,() => {
                                                refreshButtonAction()
                                            }))
                                        }}
                                    >
                                        <span>{`${item.get('jrIndex')} 号`}</span>
                                    </TableOver>
                                    <li><span>{item.get('oriAbstract')}</span></li>
                                    <li><span>{item.get('jrJvTypeName')}</span></li>
                                    <li>
                                        <p>
                                            {formatMoney(handleAmount)}
                                        </p>
                                    </li>
                                </TableItem>
                        })

                    }
                    <TableItem className='editRunning-table-no-box-width' key='total'>
                        <li	></li>
                        <li></li>
                        <li></li>
                        <li><span>合计</span></li>
                        <li>
                            <p>
                                {formatMoney(strongList.reduce((total,cur) => total + Number(cur.get('handleAmount')),0))}
                            </p>
                        </li>
                        {/* <li><p>{totalAmount.toFixed(2)}</p></li> */}
                    </TableItem>
                </TableBody>
            </TableAll>
        </div>
    )
    }

}
