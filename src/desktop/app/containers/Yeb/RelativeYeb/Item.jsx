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
                                    dispatch(relativeYebActions.changeRelativeYebChildItemShow(key, item.parentUuid ))
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
                                <span><Amount>{item.openDebit}</Amount></span>
                                <span><Amount>{item.openCredit}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{analysisType === '' ? item.currentDebit : item.receivableDebit}</Amount></span>
                                <span><Amount>{analysisType === '' ? item.currentCredit : item.receivableCredit}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{analysisType === '' ? item.currentRealDebit : item.receivableRealDebit}</Amount></span>
                                <span><Amount>{analysisType === '' ? item.currentRealCredit : item.receivableRealCredit}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{item.closeDebit}</Amount></span>
                                <span><Amount>{item.closeCredit}</Amount></span>
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
                            <span><Amount>{item.openDebit}</Amount></span>
                            <span><Amount>{item.openCredit}</Amount></span>
                        </li>
                        <li>
                            <span><Amount>{analysisType === '' ? item.currentDebit : item.receivableDebit}</Amount></span>
                            <span><Amount>{analysisType === '' ? item.currentCredit : item.receivableCredit}</Amount></span>
                        </li>
                        <li>
                            <span><Amount>{analysisType === '' ? item.currentRealDebit : item.receivableRealDebit}</Amount></span>
                            <span><Amount>{analysisType === '' ? item.currentRealCredit : item.receivableRealCredit}</Amount></span>
                        </li>
                        <li>
                            <span><Amount>{item.closeDebit}</Amount></span>
                            <span><Amount>{item.closeCredit}</Amount></span>
                        </li>
                    </TableItem>
                )
            }
        }

        return loop(topItem.toJS() || [], 0, `${index}`, [])
    }
}
