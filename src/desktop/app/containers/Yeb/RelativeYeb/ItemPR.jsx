import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Icon, Checkbox, Button, message, Tooltip } from 'antd'
import { TableItem, ItemTriangle, TableOver,Amount } from 'app/components'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as relativeYebActions from 'app/redux/Yeb/RelativeYeb/relativeYeb.action.js'
import * as relativeMxbActions from 'app/redux/Mxb/RelativeMxb/relativeMxb.action.js'

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
            currentRunningItem,
            currentRelativeItem,
            analysisType,
        } = this.props

        const loop = (item, leve, key, parentKey) => {
            if (item.childList && item.childList.length) {
                item.parentUuid = [key].concat(parentKey)
                const showChild = showChildList.indexOf(key) > -1

                return (
                    <div>
                        <TableItem line={line} className={className}>
                            <ItemTriangle
                                textAlign="left"
                                showTriangle={true}
                                showchilditem={showChild}
                                isLink={true}
                                onClick={() => {
                                    dispatch(relativeYebActions.changeRelativeYebChildItemShow(key, parentKey))
                                }}
                            >
                                <span
                                    style={{paddingLeft: `${leve*10}px`}}
                                    onClick={() =>{
                                        sessionStorage.setItem('previousPage', 'relativeMx')
                                        dispatch(homeActions.addPageTabPane('MxbPanes', 'RelativeMxb', 'RelativeMxb', '往来明细表'))
                                        dispatch(homeActions.addHomeTabpane('Mxb', 'RelativeMxb', '往来明细表'))
                                        const relativeCardItem = {
                                            uuid: '',
                                            code: '',
                                            name: '全部'
                                        }
                                        const curRelativeItem = {
                                            uuid: item.categoryUuid,
                                            name: item.name,
                                            top: false
                                        }
                                        const runningCategoryItem = {
                                            jrCategoryUuid: currentRunningItem.uuid,
                                            direction: currentRunningItem.direction,
                                            jrCategoryName: currentRunningItem.name
                                        }


                                        dispatch(relativeMxbActions.getRelativeMxbBalanceListFromRelativeYeb(issuedate, endissuedate, fromJS(relativeCardItem),fromJS(runningCategoryItem),fromJS(curRelativeItem)))
                                        dispatch(relativeMxbActions.changeRelativeMxbChooseValue(chooseValue))
                                        dispatch(relativeMxbActions.changeRelativeMxbAnalysisValue(analysisType))
                                    }}
                                >
                                    {`${item.name}`}
                                </span>
                            </ItemTriangle>
                            <li>
                                <span><Amount>{analysisType === 'HAPPEN' ? item.currentDebit : item.currentRealDebit}</Amount></span>
                                <span><Amount>{analysisType === 'HAPPEN' ? item.currentCredit : item.currentRealCredit}</Amount></span>
                                <span>
                                    <label>{analysisType === 'HAPPEN' ? (item.currentBalance > 0 ? '收入' : item.currentBalance < 0 ? '支出' : '') : (item.currentRealBalance > 0 ? '收款' : item.currentRealBalance < 0 ? '付款' : '')}</label>
                                    <Amount>{analysisType === 'HAPPEN' ? (item.currentBalance > 0 ? item.currentBalance : -item.currentBalance ) : (item.currentRealBalance > 0 ? item.currentRealBalance : -item.currentRealBalance)}</Amount>
                                </span>
                            </li>
                            <li>
                                <span><Amount>{item.yearDebit}</Amount></span>
                                <span><Amount>{item.yearCredit}</Amount></span>
                                <span><label>{item.yearBalance > 0 ? analysisType === 'HAPPEN' ? '收入' : '收款' : item.yearBalance < 0 ? analysisType === 'HAPPEN' ? '支出' : '付款' : ''}</label><Amount>{item.yearBalance > 0 ? item.yearBalance : -item.yearBalance}</Amount></span>
                            </li>
                        </TableItem>
                        {
                            showChild && item.childList.map((v, i) => loop(v, leve+1, `${key}_${i}`, item.parentUuid))
                        }
                    </div>
                )
            } else {
                parentKey = []
                return (
                    <TableItem line={line} className={className}>
                        <TableOver
                            textAlign="left"
                            isLink={true}
                            onClick={() => {
                                sessionStorage.setItem('previousPage', 'relativeMx')
                                dispatch(homeActions.addPageTabPane('MxbPanes', 'RelativeMxb', 'RelativeMxb', '往来明细表'))
                                dispatch(homeActions.addHomeTabpane('Mxb', 'RelativeMxb', '往来明细表'))

                                const relativeCardItem = {
                                    uuid: item.cardUuid,
                                    code: item.cardCode,
                                    name: item.name
                                }
                                const runningCategoryItem = {
                                    jrCategoryUuid: currentRunningItem.uuid,
                                    direction: currentRunningItem.direction,
                                    jrCategoryName: currentRunningItem.name
                                }


                                dispatch(relativeMxbActions.getRelativeMxbBalanceListFromRelativeYeb(issuedate, endissuedate, fromJS(relativeCardItem),fromJS(runningCategoryItem),currentRelativeItem))
                                dispatch(relativeMxbActions.changeRelativeMxbChooseValue(chooseValue))
                                dispatch(relativeMxbActions.changeRelativeMxbAnalysisValue(analysisType))
                            }}
                        >
                            <span style={{paddingLeft: `${leve*10}px`}}>{`${item.cardCode}_${item.name}`}</span>
                        </TableOver>
                        <li>
                            <span><Amount>{analysisType === 'HAPPEN' ? item.currentDebit : item.currentRealDebit}</Amount></span>
                            <span><Amount>{analysisType === 'HAPPEN' ? item.currentCredit : item.currentRealCredit}</Amount></span>
                            <span>
                                <label>{analysisType === 'HAPPEN' ? (item.currentBalance > 0 ? '收入' : item.currentBalance < 0 ? '支出' : '') : (item.currentRealBalance > 0 ? '收款' : item.currentRealBalance < 0 ? '付款' : '')}</label>
                                <Amount>{analysisType === 'HAPPEN' ? (item.currentBalance > 0 ? item.currentBalance : -item.currentBalance ) : (item.currentRealBalance > 0 ? item.currentRealBalance : -item.currentRealBalance)}</Amount>
                            </span>
                        </li>
                        <li>
                            <span><Amount>{item.yearDebit}</Amount></span>
                            <span><Amount>{item.yearCredit}</Amount></span>
                            <span><label>{item.yearBalance > 0 ? analysisType === 'HAPPEN' ? '收入' : '收款' : item.yearBalance < 0 ? analysisType === 'HAPPEN' ? '支出' : '付款' : ''}</label><Amount>{item.yearBalance > 0 ? item.yearBalance : -item.yearBalance}</Amount></span>
                        </li>
                    </TableItem>
                )
            }
        }

        return loop(topItem.toJS() || [], 0, `${index}`, [])
    }
}
