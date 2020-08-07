import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Icon, Checkbox, Button, message, Tooltip } from 'antd'
import { TableItem, ItemTriangle, TableOver,Amount } from 'app/components'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as incomeExpendYebActions from 'app/redux/Yeb/IncomeExpendYeb/incomeExpendYeb.action.js'
import * as incomeExpendMxbActions from 'app/redux/Mxb/IncomeExpendMxb/incomeExpendMxb.action.js'

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
            'debit' : '收入',
            'credit' : '支出',
            'debitAndCredit' : '收支'
        }

        const loop = (item, leve, key) => {
            if (item.get('childList') && item.get('childList').size) {

                const showChild = showChildList.indexOf(item.get('jrCategoryUuid')) > -1

                return (
                    <div>
                        <TableItem line={line} className={className} >
                            <ItemTriangle
                                textAlign="left"
                                isLink={true}
                                showTriangle={true}
                                showchilditem={showChild}
                                className={'incomeExpend-yeb-item-category'}
                                style={{paddingRight: `20px`}}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    dispatch(incomeExpendYebActions.changeIncomeExpendYebChildItemShow(showChild,item.get('jrCategoryUuid')))
                                }}
                            >
                                <span
                                style={{paddingLeft: `${leve*10}px`}}
                                className='incomeExpend-yeb-category'
                                onClick={() => {
                                    sessionStorage.setItem('previousPage', 'incomeExpendMx')
                                    dispatch(homeActions.addPageTabPane('MxbPanes', 'IncomeExpendMxb', 'IncomeExpendMxb', '收支明细表'))
                                    dispatch(homeActions.addHomeTabpane('Mxb', 'IncomeExpendMxb', '收支明细表'))

                                    dispatch(incomeExpendMxbActions.getIncomeExpendMxbListFromIncomeExpendYeb(issuedate, endissuedate, item.get('jrCategoryUuid')))
                                    dispatch(incomeExpendMxbActions.changeIncomeExpendMxbCommonState('views','categoryName',item.get('completeName')))
                                    dispatch(incomeExpendMxbActions.changeIncomeExpendMxbCommonState('views','oriName',item.get('name')))
                                    dispatch(incomeExpendMxbActions.changeIncomeExpendMxbChooseValue(chooseValue))
                                }}
                                >{`${item.get('name')}`}</span>
                            </ItemTriangle>
                            <li><span>{directionName[item.get('direction')]}</span></li>
                            <li>
                                <span><Amount>{item.get('openARBalance')}</Amount></span>
                                <span><Amount>{item.get('openAPBalance')}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{item.get('incomeAmount')}</Amount></span>
                                <span><Amount>{item.get('expenseAmount')}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{item.get('realIncomeAmount')}</Amount></span>
                                <span><Amount>{item.get('realExpenseAmount')}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{item.get('closeARBalance')}</Amount></span>
                                <span><Amount>{item.get('closeAPBalance')}</Amount></span>
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
                                sessionStorage.setItem('previousPage', 'IncomeExpendMx')
                                dispatch(homeActions.addPageTabPane('MxbPanes', 'IncomeExpendMxb', 'IncomeExpendMxb', '收支明细表'))
                                dispatch(homeActions.addHomeTabpane('Mxb', 'IncomeExpendMxb', '收支明细表'))

                                dispatch(incomeExpendMxbActions.getIncomeExpendMxbListFromIncomeExpendYeb(issuedate, endissuedate, item.get('jrCategoryUuid')))
                                dispatch(incomeExpendMxbActions.changeIncomeExpendMxbCommonState('views','categoryName',item.get('completeName')))
                                dispatch(incomeExpendMxbActions.changeIncomeExpendMxbCommonState('views','oriName',item.get('name')))
                                dispatch(incomeExpendMxbActions.changeIncomeExpendMxbChooseValue(chooseValue))
                            }}
                        >
                            <span style={{paddingLeft: `${leve*10}px`}}>{`${item.get('name')}`}</span>
                        </TableOver>
                        <li><span>{directionName[item.get('direction')]}</span></li>
                        <li>
                            <span><Amount>{item.get('openARBalance')}</Amount></span>
                            <span><Amount>{item.get('openAPBalance')}</Amount></span>
                        </li>
                        <li>
                            <span><Amount>{item.get('incomeAmount')}</Amount></span>
                            <span><Amount>{item.get('expenseAmount')}</Amount></span>
                        </li>
                        <li>
                            <span><Amount>{item.get('realIncomeAmount')}</Amount></span>
                            <span><Amount>{item.get('realExpenseAmount')}</Amount></span>
                        </li>
                        <li>
                            <span><Amount>{item.get('closeARBalance')}</Amount></span>
                            <span><Amount>{item.get('closeAPBalance')}</Amount></span>
                        </li>
                    </TableItem>
                )
            }
        }

        return loop(topItem, 0, `${index}`)
    }
}
