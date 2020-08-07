import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as allActions from 'app/redux/Home/All/all.action' 
import { Tooltip } from 'antd'
import { TableItem, TableOver, Amount } from 'app/components'

@immutableRenderDecorator
export default
class MutilColumnItem extends React.Component {
    render(){
        const {
            data,
            item,
            dispatch,
            showMoreColumn,
            className,
            title,
            mutilColumnIndexList,
            maxColumnCount,

            acDirection,
            index,
            totalSize,
        } = this.props

        const amountList = item.get('amountList')

        return(
            <div>
                {showMoreColumn ?
                    <TableItem>
                        <Tooltip title={`本页行次：${index}/${totalSize}`}>
                            <li style={{minWidth: '76px',maxWidth: '76px',flex: '76'}}>
                                {item.get('vcDate')}
                            </li>
                        </Tooltip>
                        <li style={{minWidth: '80px',maxWidth: '80px',flex: '80',textDecoration:'underline'}} className='kmmxb-mutil-column-tableOver' onClick={() => {
                            dispatch(lrpzActions.getPzVcFetch(ditem.get('vcDate').substr(0, 7), item.get('vcindex'), mutilColumnIndexList.findIndex(v => v == [data.vcdate, data.vcindex].join('_')), mutilColumnIndexList)) // 改
                            dispatch(allActions.showPzBomb(true,'Mxb'))
                        }}>记 {item.get('vcindex')} 号</li>
                        <li style={{minWidth: `${782-70*title.length}px`,maxWidth:`${1422-110*title.length}px`,flex:`${1422-110*title.length}`}}>
                            <Tooltip title={item.get('jvAbstract')} placement="topLeft">
                                <span className='mutil-column-abstract'>{item.get('jvAbstract')}</span>
                            </Tooltip>
                        </li>
                        {amountList && amountList.map((v,i)=>{
                            return(
                                <li style={{minWidth: '70px',maxWidth: '110px',flex: '110'}} key={i}>
                                    <Amount className='mutil-column-amount'>{v}</Amount>
                                </li>
                            )
                        })}
                        <li style={{minWidth: '32px',maxWidth: '32px',flex: '32'}}>{acDirection}</li>
                        <li style={{minWidth: '110px',maxWidth: '110px',flex: '110'}}><Amount className='mutil-column-amount'>{item.get('balanceAmount')}</Amount></li>
                    </TableItem>
                    :
                    title.length > maxColumnCount ?
                        <TableItem>
                            <Tooltip title={`本页行次：${index}/${totalSize}`}><li style={{minWidth: '76px',maxWidth: '76px',flex: '76'}}>{item.get('vcDate')}</li></Tooltip>
                            <li style={{minWidth: '80px',maxWidth: '80px',flex: '80',textDecoration:'underline'}} className='kmmxb-mutil-column-tableOver' onClick={() => {
                                dispatch(lrpzActions.getPzVcFetch(ditem.get('vcDate').substr(0, 7), item.get('vcindex'), mutilColumnIndexList.findIndex(v => v == [data.vcdate, data.vcindex].join('_')), mutilColumnIndexList)) // 改
                                dispatch(allActions.showPzBomb(true,'Mxb'))
                            }}>记 {item.get('vcindex')} 号</li>
                            <li style={{minWidth: `${782-70*maxColumnCount}px`,maxWidth:`${1422-110*maxColumnCount}px`,flex:`${1422-110*maxColumnCount}`}}>
                                <Tooltip title={item.get('jvAbstract')} placement="topLeft"><span className='mutil-column-abstract'>{item.get('jvAbstract')}</span></Tooltip>
                            </li>
                            {amountList && amountList.slice(0,maxColumnCount-1).map((v,i)=>{
                                return(
                                    <li style={{minWidth: '70px',maxWidth: '110px',flex: '110'}} key={i}>
                                        <Amount className='mutil-column-amount'>{v}</Amount>
                                    </li>
                                )
                            })}
                            <li style={{minWidth: '70px',maxWidth: '110px',flex: '110'}}><Amount className='mutil-column-amount'>{item.get('otherAmount')}</Amount></li>
                            <li style={{minWidth: '32px',maxWidth: '32px',flex: '32'}}>{acDirection}</li>
                            <li style={{minWidth: '110px',maxWidth: '110px',flex: '110'}}><Amount className='mutil-column-amount'>{item.get('balanceAmount')}</Amount></li>
                        </TableItem>:
                        <TableItem
                        >
                            <Tooltip title={`本页行次：${index}/${totalSize}`}><li style={{minWidth: '76px',maxWidth: '76px',flex: '76'}}>{item.get('vcDate')}</li></Tooltip>
                            <li style={{minWidth: '80px',maxWidth: '80px',flex: '80',textDecoration:'underline'}} className='kmmxb-mutil-column-tableOver' onClick={() => {
                                dispatch(lrpzActions.getPzVcFetch(ditem.get('vcDate').substr(0, 7), item.get('vcindex'), mutilColumnIndexList.findIndex(v => v == [data.vcdate, data.vcindex].join('_')), mutilColumnIndexList)) // 改
                                dispatch(allActions.showPzBomb(true,'Mxb'))
                            }}>记 {item.get('vcindex')} 号</li>
                            <li style={{minWidth: `${782-70*title.length}px`,maxWidth:`${1422-110*title.length}px`,flex:`${1422-110*title.length}`}}>
                                <Tooltip title={item.get('jvAbstract')} placement="topLeft"><span className='mutil-column-abstract'>{item.get('jvAbstract')}</span></Tooltip>
                            </li>
                            {amountList && amountList.map((v,i)=>{
                                return(
                                    <li style={{minWidth: '70px',maxWidth: '110px',flex: '110'}} key={i}>
                                        <Amount className='mutil-column-amount'>{v}</Amount>
                                    </li>
                                )
                            })}
                            <li style={{minWidth: '32px',maxWidth: '32px',flex: '32'}}>{acDirection}</li>
                            <li style={{minWidth: '110px',maxWidth: '110px',flex: '110'}}><Amount className='mutil-column-amount'>{item.get('balanceAmount')}</Amount></li>
                        </TableItem>
                }
            </div>
        )
    }
}
