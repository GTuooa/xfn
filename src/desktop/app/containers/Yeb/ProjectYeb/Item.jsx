import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Icon, Checkbox, Button, message, Tooltip } from 'antd'
import { TableItem, ItemTriangle, TableOver,Amount } from 'app/components'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as projectYebActions from 'app/redux/Yeb/ProjectYeb/projectYeb.action.js'
import * as projectMxbActions from 'app/redux/Mxb/ProjectMxb/projectMxb.action.js'

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
            runningJrTypeItem,
            tableName,
            chooseValue,
            currentProjectItem,
            analysisValue,
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
                                    dispatch(projectYebActions.changeProjectYebChildItemShow(key, item.parentUuid))
                                }}
                            >
                                <span
                                    style={{paddingLeft: `${leve*10}px`}}
                                    className={`name-name name-click`}
                                    onClick={() => {
                                        sessionStorage.setItem('previousPage', 'projectMx')
                                        dispatch(projectMxbActions.changeProjectMxbTable(tableName))
                                        dispatch(projectMxbActions.changeProjectMxbChooseValue(chooseValue))
                                        dispatch(homeActions.addPageTabPane('MxbPanes', 'ProjectMxb', 'ProjectMxb', '项目明细表'))
                                        dispatch(homeActions.addHomeTabpane('Mxb', 'ProjectMxb', '项目明细表'))

                                        const projectCardItem = {
                                            uuid: '',
                                            code: '',
                                            name: '全部'
                                        }
                                        const currentCardItem = {
                                            uuid: item.cardCategory,
                                            code: '',
                                            name: item.name
                                        }
                                        if(tableName === 'Income'){
                                            dispatch(projectMxbActions.getProjectMxbBalanceListFromProjectYeb(issuedate, endissuedate, fromJS(projectCardItem),runningJrTypeItem,fromJS(currentCardItem),analysisValue))

                                        }else{
                                            dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromProjectYeb(issuedate, endissuedate, fromJS(projectCardItem),runningJrTypeItem,fromJS(currentCardItem)))
                                        }

                                    }}
                                >
                                    {`${item.name }`}
                                </span>
                            </ItemTriangle>
                            <li>
                                <span><Amount>{analysisValue === '0' ? item.openDebit : item['shouldBalance']['openDebitAmount']}</Amount></span>
                                <span><Amount>{analysisValue === '0' ? item.openCredit : item['shouldBalance']['openCreditAmount']}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{analysisValue === '0' ? item.currentDebit : item['shouldBalance']['debitAmount']}</Amount></span>
                                <span><Amount>{analysisValue === '0' ? item.currentCredit  : item['shouldBalance']['creditAmount']}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{analysisValue === '0' ? item.currentRealDebit  : item['shouldBalance']['debitWriteOffAmount']}</Amount></span>
                                <span><Amount>{analysisValue === '0' ? item.currentRealCredit  : item['shouldBalance']['creditWriteOffAmount']}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{analysisValue === '0' ? item.closeDebit  : item['shouldBalance']['closeDebitAmount']}</Amount></span>
                                <span><Amount>{analysisValue === '0' ? item.closeCredit  : item['shouldBalance']['closeCreditAmount']}</Amount></span>
                            </li>
                        </TableItem>
                        {
                            showChild && item.childList.map((v, i) => loop(v, leve+1, `${key}_${i}`, item.parentUuid))
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
                                sessionStorage.setItem('previousPage', 'projectMx')
                                dispatch(projectMxbActions.changeProjectMxbTable(tableName))
                                dispatch(projectMxbActions.changeProjectMxbChooseValue(chooseValue))
                                dispatch(homeActions.addPageTabPane('MxbPanes', 'ProjectMxb', 'ProjectMxb', '项目明细表'))
                                dispatch(homeActions.addHomeTabpane('Mxb', 'ProjectMxb', '项目明细表'))

                                const projectCardItem = {
                                    uuid: item.cardUuid,
                                    code: item.cardCode,
                                    name: item.name
                                }
                                if(tableName === 'Income'){
                                    dispatch(projectMxbActions.getProjectMxbBalanceListFromProjectYeb(issuedate, endissuedate, fromJS(projectCardItem),runningJrTypeItem,currentProjectItem,analysisValue))
                                }else{
                                    dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromProjectYeb(issuedate, endissuedate, fromJS(projectCardItem),runningJrTypeItem,currentProjectItem))
                                }

                            }}
                        >
                            <span style={{paddingLeft: `${leve*10}px`}}>{ item.name}</span>
                        </TableOver>
                        <li>
                            <span><Amount>{analysisValue === '0' ? item.openDebit : item['shouldBalance']['openDebitAmount']}</Amount></span>
                            <span><Amount>{analysisValue === '0' ? item.openCredit : item['shouldBalance']['openCreditAmount']}</Amount></span>
                        </li>
                        <li>
                            <span><Amount>{analysisValue === '0' ? item.currentDebit : item['shouldBalance']['debitAmount']}</Amount></span>
                            <span><Amount>{analysisValue === '0' ? item.currentCredit : item['shouldBalance']['creditAmount']}</Amount></span>
                        </li>
                        <li>
                            <span><Amount>{analysisValue === '0' ? item.currentRealDebit : item['shouldBalance']['debitWriteOffAmount']}</Amount></span>
                            <span><Amount>{analysisValue === '0' ? item.currentRealCredit : item['shouldBalance']['creditWriteOffAmount']}</Amount></span>
                        </li>
                        <li>
                            <span><Amount>{analysisValue === '0' ? item.closeDebit : item['shouldBalance']['closeDebitAmount']}</Amount></span>
                            <span><Amount>{analysisValue === '0' ? item.closeCredit : item['shouldBalance']['closeCreditAmount']}</Amount></span>
                        </li>
                    </TableItem>
                )
            }
        }

        return loop(topItem.toJS() || [], 0, `${index}`, [])
    }
}
