import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Icon, Checkbox, Button, message, Tooltip } from 'antd'
import { TableItem, ItemTriangle, TableOver,Amount } from 'app/components'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as runningTypeYebActions from 'app/redux/Yeb/RunningTypeYeb/runningTypeYeb.action.js'
import * as runningTypeMxbActions from 'app/redux/Mxb/RunningTypeMxb/runningTypeMxb.action.js'

@immutableRenderDecorator
export default
class Item extends React.Component {

    render() {
        const {
            index,
            topItem,
            dispatch,
            line,
            className,
            issuedate,
            endissuedate,
            showChildList,
            chooseValue,
        } = this.props

        const directionName = {
            'debit' : '借',
            'credit' : '贷',
            '' : ''
        }

        const loop = (item, leve, key) => {
            if (item.get('childList') && item.get('childList').size) {

                const showChild = showChildList.indexOf(item.get('acId')) > -1

                return (
                    <div>
                        <TableItem line={line} className={className} >
                            <ItemTriangle
                                textAlign="left"
                                isLink={true}
                                showTriangle={true}
                                showchilditem={showChild}
                                className={'runningType-yeb-item-category'}
                                style={{paddingRight: `20px`}}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    dispatch(runningTypeYebActions.changeRunningTypeYebChildItemShow(showChild,item.get('acId')))
                                }}
                            >
                                <span
                                    style={{paddingLeft: `${leve*10}px`}}
                                    className='runningType-yeb-category'
                                    onClick={() => {
                                        sessionStorage.setItem('previousPage', 'runningTypeMx')
                                        dispatch(runningTypeMxbActions.changeRunningTypeMxbCommonState('views','acName',item.get('mergeName')))
                                        dispatch(runningTypeMxbActions.changeRunningTypeMxbCommonState('views','oriName',item.get('acName')))
                                        dispatch(runningTypeMxbActions.changeRunningTypeMxbCommonState('views','chooseValue',chooseValue))

                                        dispatch(homeActions.addPageTabPane('MxbPanes', 'RunningTypeMxb', 'RunningTypeMxb', '类型明细表'))
                                        dispatch(homeActions.addHomeTabpane('Mxb', 'RunningTypeMxb', '类型明细表'))

                                        dispatch(runningTypeMxbActions.getRunningTypeMxbListFromRunningTypeYeb(issuedate, endissuedate, item.get('acId')))
                                    }}
                                >{`${item.get('acName')}`}</span>
                            </ItemTriangle>
                            <li><span>{directionName[item.get('direction')]}</span></li>
                            <li>
                                <span><Amount>{item.get('beginDebitAmount')}</Amount></span>
                                <span><Amount>{item.get('beginCreditAmount')}</Amount></span>
                                <span><Amount>{item.get('monthDebitAmount')}</Amount></span>
                                <span><Amount>{item.get('monthCreditAmount')}</Amount></span>
                                <span><Amount>{item.get('yearDebitAmount')}</Amount></span>
                                <span><Amount>{item.get('yearCreditAmount')}</Amount></span>
                                <span><Amount>{item.get('endDebitAmount')}</Amount></span>
                                <span><Amount>{item.get('endCreditAmount')}</Amount></span>
                            </li>
                        </TableItem>
                        {
                            showChild && item.get('childList').map((v, i) => loop(v, leve+1, `${key}_${i}`))
                        }
                    </div>
                )
            } else {
                return (
                    <TableItem line={line} className={className}>
                        <TableOver
                            textAlign="left"
                            isLink={true}
                            onClick={() => {
                                sessionStorage.setItem('previousPage', 'RunningTypeMx')
                                dispatch(runningTypeMxbActions.changeRunningTypeMxbCommonState('views','acName',item.get('mergeName')))
                                dispatch(runningTypeMxbActions.changeRunningTypeMxbCommonState('views','oriName',item.get('acName')))
                                dispatch(runningTypeMxbActions.changeRunningTypeMxbCommonState('views','chooseValue',chooseValue))
                                dispatch(homeActions.addPageTabPane('MxbPanes', 'RunningTypeMxb', 'RunningTypeMxb', '类型明细表'))
                                dispatch(homeActions.addHomeTabpane('Mxb', 'RunningTypeMxb', '类型明细表'))

                                dispatch(runningTypeMxbActions.getRunningTypeMxbListFromRunningTypeYeb(issuedate, endissuedate, item.get('acId')))
                            }}
                        >
                            <span style={{paddingLeft: `${leve*10}px`}}>{`${item.get('acName')}`}</span>
                        </TableOver>
                        <li><span>{directionName[item.get('direction')]}</span></li>
                        <li>
                            <span><Amount>{item.get('beginDebitAmount')}</Amount></span>
                            <span><Amount>{item.get('beginCreditAmount')}</Amount></span>
                            <span><Amount>{item.get('monthDebitAmount')}</Amount></span>
                            <span><Amount>{item.get('monthCreditAmount')}</Amount></span>
                            <span><Amount>{item.get('yearDebitAmount')}</Amount></span>
                            <span><Amount>{item.get('yearCreditAmount')}</Amount></span>
                            <span><Amount>{item.get('endDebitAmount')}</Amount></span>
                            <span><Amount>{item.get('endCreditAmount')}</Amount></span>
                        </li>
                    </TableItem>
                )
            }
        }

        return loop(topItem, 0, `${index}`)
    }
}
