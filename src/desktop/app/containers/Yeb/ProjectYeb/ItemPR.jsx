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
class ItemPR extends React.Component {

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
            runningJrTypeItem,
            currentProjectItem,
            tableName,
            analysisValue,
        } = this.props

        const directionName = {
            'debit' : analysisValue === '1' ? '收入' : '收款',
            'credit' : analysisValue === '1' ? '支出' : '付款',
            '' : ''
        }

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
                                    onClick={() =>{
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
                                    {`${item.name}`}
                                </span>
                            </ItemTriangle>
                            <li>
                                <span><Amount>{analysisValue === '1' ? item['happenBalance']['currentDebitAmount'] : item['realBalance']['currentRealDebitAmount']}</Amount></span>
                                <span><Amount>{analysisValue === '1' ? item['happenBalance']['currentCreditAmount'] : item['realBalance']['currentRealCreditAmount']}</Amount></span>
                                <span><label>{directionName[analysisValue === '1' ? item['happenBalance']['currentDirection'] : item['realBalance']['currentDirection']]}</label><Amount>{analysisValue === '1' ? item['happenBalance']['currentRealAmount'] : item['realBalance']['currentRealAmount']}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{analysisValue === '1' ? item['happenBalance']['yearDebitAmount'] : item['realBalance']['yearRealDebitAmount']}</Amount></span>
                                <span><Amount>{analysisValue === '1' ? item['happenBalance']['yearCreditAmount'] : item['realBalance']['yearRealCreditAmount']}</Amount></span>
                                <span><label>{directionName[analysisValue === '1' ? item['happenBalance']['currentDirection'] : item['realBalance']['currentDirection']]}</label><Amount>{analysisValue === '1' ? item['happenBalance']['yearRealAmount'] : item['realBalance']['yearRealAmount']}</Amount></span>
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
                            <span style={{paddingLeft: `${leve*10}px`}}>{item.name}</span>
                        </TableOver>
                        <li>
                            <span><Amount>{analysisValue === '1' ? (item['happenBalance'] ? item['happenBalance']['currentDebitAmount'] : '' ): (item['realBalance'] ? item['realBalance']['currentRealDebitAmount'] : '')}</Amount></span>
                            <span><Amount>{analysisValue === '1' ? (item['happenBalance'] ? item['happenBalance']['currentCreditAmount']: '') : (item['realBalance'] ? item['realBalance']['currentRealCreditAmount'] : '')}</Amount></span>
                            <span><label>{directionName[analysisValue === '1' ? (item['happenBalance'] ? item['happenBalance']['currentDirection'] : '') : (item['realBalance'] ? item['realBalance']['currentDirection'] : '')]}</label><Amount>{analysisValue === '1' ? (item['happenBalance'] ? item['happenBalance']['currentRealAmount']: '') : (item['realBalance'] ? item['realBalance']['currentRealAmount']: '')}</Amount></span>
                        </li>
                        <li>
                            <span><Amount>{analysisValue === '1' ? (item['happenBalance'] ? item['happenBalance']['yearDebitAmount'] : '') : (item['realBalance'] ? item['realBalance']['yearRealDebitAmount'] : '')}</Amount></span>
                            <span><Amount>{analysisValue === '1' ? (item['happenBalance'] ? item['happenBalance']['yearCreditAmount'] : '') : (item['realBalance'] ? item['realBalance']['yearRealCreditAmount'] : '')}</Amount></span>
                            <span><label>{directionName[analysisValue === '1' ? (item['happenBalance'] ? item['happenBalance']['yearDirection'] : '') : (item['realBalance'] ? item['realBalance']['yearDirection'] : '')]}</label><Amount>{analysisValue === '1' ? (item['happenBalance'] ? item['happenBalance']['yearRealAmount']: '') : (item['realBalance'] ? item['realBalance']['yearRealAmount']: '')}</Amount></span>
                        </li>
                    </TableItem>
                )
            }
        }

        return loop(topItem.toJS() || [], 0, `${index}`, [])
    }
}
