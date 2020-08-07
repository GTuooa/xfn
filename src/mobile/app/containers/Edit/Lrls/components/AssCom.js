//辅助核算列表
import React, { Component } from 'react'
import { Row, SinglePicker, Icon, Switch, Amount, TextListInput } from 'app/components'
import * as Common from '../CommonData.js'
import * as Limit from 'app/constants/Limit.js'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import * as thirdParty from 'app/thirdParty'
import { toJS, fromJS } from 'immutable'
import { decimal } from 'app/utils'

export default function assCom (assCategoryList, allAssList, assList, onOk) {
    return (
        <div>
            {
                assCategoryList.map((v, i) => {
                    let district = []
                    allAssList.forEach(w => {
                        if (v == w.get('assCategory')) {
                            district = w.get('assList')
                        }
                    })
                    return (
                        <Row key={i} className='lrls-margin-top'>
                            <SinglePicker
                                district={district.toJS()}
                                value={assList.size ? `${assList.getIn([i, 'assId'])}` : ''}
                                onOk={value => {
                                    onOk(i, value)
                                }}
                            >
                                <Row className='lrls-row lrls-category'>
                                    {
                                        assList.get(i) ? <span>
                                            {`${assList.getIn([i, 'assId'])} ${assList.getIn([i, 'assName'])}`}
                                        </span> : <span className='lrls-placeholder'>
                                            {`点击选择${v}`}
                                        </span>
                                    }
                                    <Icon type="triangle"/>
                                </Row>
                            </SinglePicker>
                        </Row>
                    )
                })
            }
        </div>
    )
}

//核销组件
export function hxCom (paymentList, showList, onClick, runningType) {
    let totalAmount = 0
    let hxBody = <div style={{display: showList ? '' : 'none'}}>
        {
            paymentList.map((v,i) => {
                totalAmount += v.get('handleAmount')
                return (<div key={i} className='ylls-top-line'>
                    <div className='ylls-item ylls-padding'>
                        <div className='overElli'>{v.get('categoryName')}</div>
                        <div className='ylls-gray'>流水号：{v.get('flowNumber')}</div>
                    </div>
                    <div className='ylls-item'>
                        <div className='ylls-blue'>{runningType ? runningType : Common.runningType[v.get('runningType')]}</div>
                        <div><Amount className='ylls-bold'>{v.get('handleAmount')}</Amount></div>
                    </div>
                </div>)
            })
        }
    </div>

    return (
        <Row className='ylls-card'>
            <div className='ylls-item' onClick={() => onClick()}>
                <div>核销总计：<Amount showZero>{totalAmount}</Amount></div>
                <div>
                    {showList ? '收起' : '展开'}
                    <Icon style={showList ? {transform: 'rotate(180deg)', marginBottom: '.1rem'} : ''} type="arrow-down"/>
                </div>
            </div>
            {hxBody}
        </Row>
    )
}


//往来单位组件
export class ContancsCom extends Component {
    render () {
        const { cardList, cardObj, noBottom, onOk, history, dispatch, isPayUnit, contactsRange, noInsert, disabled } = this.props

        //isPayUnit 是否是付款单位 true-是
        //noInsert 不需要新增卡片  true-不需要（收付管理）
        const classNameString = noBottom == 'noBottom' ? 'lrls-more-card' : 'lrls-more-card lrls-bottom'
        let cardArr = cardList.toJS()
        if (!noInsert) {
            cardArr.unshift({key: '新增往来单位', value: `insert${Limit.TREE_JOIN_STR}${Limit.TREE_JOIN_STR}`})
        }

        return (
            <div className={classNameString}>
                <label>往来单位:</label>
                <SinglePicker
                    disabled={disabled}
                    district={cardArr}
                    value={cardObj ? `${cardObj.get('uuid')}${Limit.TREE_JOIN_STR}${cardObj.get('code')}${Limit.TREE_JOIN_STR}${cardObj.get('name')}` : ''}
                    onOk={value => {
                        if (value.value.split(Limit.TREE_JOIN_STR)[0]=='insert') {
                            history.push('/lrls-iuManage')
                            dispatch(homeAccountActions.getInitRelaCard(isPayUnit, contactsRange))

                            return
                        }
                        onOk(value)
                    }}
                >
                    <Row className='lrls-category lrls-padding'>
                        {
                            cardObj ? <span> {`${cardObj.get('code')} ${cardObj.get('name')}`} </span>
                            : <span className='lrls-placeholder'>点击选择往来单位</span>
                        }
                        <Icon type="triangle" style={{color: disabled ? '#ccc' : ''}}/>
                    </Row>
                </SinglePicker>
            </div>
        )
    }

}

//薪酬支出显示界面的核销
export function xczcCom (title, jtAmount, paymentList, runningType) {
    return (<Row className='ylls-card'>
        <div className='hx-title'>
            {title}：<Amount showZero>{jtAmount}</Amount>
        </div>
        {
            paymentList.map((v,i) => {
                if (v.get('beSelect')) {
                    return (<div key={i} className='ylls-top-line'>
                                <div className='ylls-item ylls-padding'>
                                    <div>流水号：{v.get('flowNumber')}</div>
                                    <div className='ylls-gray'>{v.get('runningDate')}</div>
                                </div>
                                <div className='ylls-item'>
                                    <div className='overElli'>{runningType}</div>
                                    <div><Amount showZero className='ylls-bold'>{v.get('notHandleAmount')}</Amount></div>
                                </div>
                            </div>)
                }
            })
        }
    </Row>)
}

//项目卡片
export class ProjectCom extends Component  {
    render () {
        const { project, dispatch, changeAmount, showCommon, noMore, noAmount, isFyzc } = this.props
        //noMore 是否支持多项目 true 不支持
        // showCommon 是否显示项目公共费用 true 显示
        // noAmount 长期资产结转损益时无金额
        //isFyzc 是费用支出允许金额为负数

        let projectCardList = project.get('projectCardList')
        if (!showCommon) {
            projectCardList = project.get('projectCardList').filter(v => v.get('value').includes('COMNCRD')==false)
        }

        const projectCard = project.get('projectCard')
        const usedProject = project.get('usedProject')
        const isOne = projectCard.size == 1 ? true : false

        let totalAmount = 0
        projectCard.forEach(v => totalAmount += Number(v.get('amount')))

        return usedProject ? (
            <Row className='lrls-card'>
                {
                    projectCard.map((v, i) => {
                        let showName = `${v.get('code')} ${v.get('name')}`
                        if (v.get('name') == '项目公共费用') {
                            showName = '项目公共费用'
                        }
                        return (
                            <div key={i} style={{paddingBottom: isOne ? '0' : '10px'}}>
                                <div className='lrls-more-card lrls-placeholder lrls-bottom' style={{display: noMore ? 'none' : ''}}>
                                    <span>项目({i+1})</span>
                                    <span
                                        className='lrls-blue'
                                        style={{display: isOne ? 'none' : ''}}
                                        onClick={() => {
                                            if (projectCard.size == 1) {//只有一个不允许删除
                                                return
                                            }
                                            dispatch(homeAccountActions.changeProjectCard('delete', '', i))
                                            changeAmount(totalAmount - Number(v.get('amount')))

                                        }}
                                    >
                                            删除
                                    </span>
                                </div>
                                <div className='lrls-more-card lrls-bottom' style={{marginBottom: noMore ? '0' : ''}}>
                                    <label>项目:</label>
                                    <SinglePicker
                                        district={projectCardList.toJS()}
                                        value={v.get('uuid') ? `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}` : ''}
                                        onOk={value => { dispatch(homeAccountActions.changeProjectCard('card', value.value, i)) }}
                                    >
                                       <Row className='lrls-category lrls-padding'>
                                           {
                                               v.get('uuid') ? <span> {showName} </span>
                                               : <span className='lrls-placeholder'>点击选择项目卡片</span>
                                           }
                                           <Icon type="triangle" />
                                       </Row>
                                    </SinglePicker>
                                </div>

                                {
                                    noAmount ? null : <Row className='lrls-more-card lrls-bottom'>
                                        <label>金额:</label>
                                        <TextListInput
                                            placeholder='填写金额'
                                            value={v.get('amount')}
                                            onChange={(value) => {

                                                let testValue = ''

                                                if (isFyzc) {
                                                    testValue = /^[-\d]\d*\.?\d{0,2}$/g.test(value) || value == ''
                                                } else {
                                                    testValue = /^\d*\.?\d{0,2}$/g.test(value)
                                                }
                                                if (testValue) {
                                                    dispatch(homeAccountActions.changeProjectCard('amount', value, i))
                                                    const amount = totalAmount - Number(v.get('amount')) + Number(value)
                                                    changeAmount(decimal(amount))
                                                }
                                            }}
                                        />
                                    </Row>
                                }

                            </div>
                        )
                    })
                }
                <div className='lrls-more-card' style={{display: noMore ? 'none' : '', fontWeight: 'bold'}}>
                    {
                        projectCard.size > 1 ? <div>
                            总金额：<Amount showZero>{totalAmount}</Amount>
                        </div> : <div></div>
                    }

                    <div className='lrls-blue'
                        onClick={() => {
                            if (noMore) {
                                return
                            }
                            dispatch(homeAccountActions.changeProjectCard('add', '', projectCard.size))
                        }}
                    >
                        +添加项目
                    </div>
                </div>
            </Row>
        ) : null
    }
}

//多存货卡片
export class StockCom extends Component  {
    render () {
        const { dispatch, changeAmount, stockCardList, stockCardRange, onOk, cardDisabled, stockRange, history } = this.props

        let totalAmount = 0
        const isOne = stockCardRange.size == 1 ? true : false
        stockCardRange.forEach(v => totalAmount += Number(v.get('amount')))

        let stockCardListArr = stockCardList.toJS()
        stockCardListArr.unshift({key: '新增存货卡片', value: `insert${Limit.TREE_JOIN_STR}${Limit.TREE_JOIN_STR}`})

        return (
                <div className='lrls-card'>
                    {
                        stockCardRange.map((v, i) => {
                            return (
                                <div key={i} style={{paddingBottom: isOne ? '0' : '10px'}}>
                                    <div className='lrls-more-card lrls-placeholder lrls-bottom'>
                                        <span>存货明细({i+1})</span>
                                        <span
                                            className={cardDisabled ? 'lrls-placeholder' : 'lrls-blue'}
                                            style={{display: isOne ? 'none' : ''}}
                                            onClick={() => {
                                                if (cardDisabled) {
                                                    return
                                                }
                                                onOk('delete', '', i)
                                                changeAmount(totalAmount - Number(v.get('amount')))
                                            }}
                                        >
                                                删除
                                        </span>
                                    </div>

                                    <div className='lrls-more-card lrls-bottom'>
                                        <label>存货:</label>
                                        <SinglePicker
                                            disabled={cardDisabled}
                                            district={stockCardListArr}
                                            value={v.get('uuid') ? `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}` : ''}
                                            onOk={value => {
                                                if (value.value.split(Limit.TREE_JOIN_STR)[0]=='insert') {
                                                    history.push('/lrls-inventory')
                                                    this.props.dispatch(homeAccountActions.initLrlsData('inventory'))
                                                    dispatch(homeAccountActions.getInitStockCard(stockRange, onOk, i))
                                                    return
                                                }
                                                onOk('card', value.value, i)
                                            }}
                                        >
                                           <Row className='lrls-category lrls-padding'>
                                               {
                                                   v.get('uuid') ? <span> {`${v.get('code')} ${v.get('name')}`} </span>
                                                   : <span className='lrls-placeholder'>点击选择存货卡片</span>
                                               }
                                               <Icon type="triangle" color={cardDisabled ? '#999' : ''}/>
                                           </Row>
                                        </SinglePicker>
                                    </div>

                                    <div className='lrls-more-card lrls-bottom'>
                                        <label>金额:</label>
                                        <TextListInput
                                            disabled={cardDisabled || (v.get('uuid') ? false : true)}
                                            placeholder='填写金额'
                                            value={v.get('amount')}
                                            onChange={(value) => {
                                                if (/^\d*\.?\d{0,2}$/g.test(value)) {
                                                    onOk('amount', value, i)
                                                    const amount = totalAmount - Number(v.get('amount')) + Number(value)
                                                    changeAmount(decimal(amount))
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })
                    }

                    <div className='lrls-more-card' style={{fontWeight: 'bold'}}>
                        {
                            stockCardRange.size > 1 ? <div>
                                总金额：<Amount showZero>{totalAmount}</Amount>
                            </div> : <div></div>
                        }

                        <div className={cardDisabled ? 'lrls-placeholder' : 'lrls-blue'}
                            onClick={() => {
                                if (cardDisabled) {
                                    return
                                }
                                onOk('add', '', stockCardRange.size)
                            }}
                        >
                            +添加存货明细
                        </div>
                    </div>
                </div>
        )
    }
}

//预览项目
export function ylProject (cardList, showList, onClick, showAmount=true) {
    let totalAmount = 0
    let hxBody = <div style={{display: showList ? '' : 'none'}}>
        {
            cardList.map((v,i) => {
                let showName = `${v.get('code')} ${v.get('name')}`
                if (v.get('name') == '项目公共费用') {
                    showName = '项目公共费用'
                }
                totalAmount += v.get('amount')
                return (<div key={i} className='ylls-top-line'>
                    <div className='ylls-item ylls-padding'>
                        <div className='overElli'>{showName}</div>
                        {
                            showAmount ? <div>
                                <Amount className='ylls-bold'>{v.get('amount')}</Amount>
                            </div> : null
                        }
                    </div>
                </div>)
            })
        }
    </div>

    return (
        <Row className='ylls-card'>
            <div className='ylls-item' onClick={() => onClick()}>
                <div>项目管理：{showAmount ? <Amount showZero>{totalAmount}</Amount> : null}</div>
                <div>
                    {showList ? '收起' : '展开'}
                    <Icon style={showList ? {transform: 'rotate(180deg)', marginBottom: '.1rem'} : ''} type="arrow-down"/>
                </div>
            </div>
            {hxBody}
        </Row>
    )
}
