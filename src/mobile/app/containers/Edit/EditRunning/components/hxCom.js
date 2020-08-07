import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import { Row, Icon, Amount } from 'app/components'
import { decimal } from 'app/utils'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'



//下方单据列表等
export default class HxCom extends Component  {
    state = {
        showList: true
    }
    render () {
        const { categoryType, oriState, pendingStrongList, jrAmount, beAccrued, propertyTax, propertyPay, strongList, dispatch, projectProperty, isCopy } = this.props
        const { showList } = this.state

        let isShow = false
        let titleName = '待支付金额'
        let jrJvTypeName = ''
        let showAmount = 'notHandleAmount'
        let showType = 'jrJvTypeName'
        let component = null
        const hasSelect = pendingStrongList.some(v => v.get('beSelect'))

        switch (categoryType) {
            case 'LB_ZSKX': {
                if (oriState === 'STATE_ZS_TH') {
                    isShow = true
                    jrJvTypeName = '其他应付'
                }
                break
            }
            case 'LB_ZFKX': {
                if (oriState === 'STATE_ZF_SH') {
                    isShow = true
                    jrJvTypeName = '其他应收'
                }
                break
            }
            case 'LB_JK': {
                if (beAccrued && oriState === 'STATE_JK_ZFLX') {
                    isShow = true
                }
                break
            }
            case 'LB_TZ': {
                if (beAccrued && (oriState === 'STATE_TZ_SRGL' || oriState === 'STATE_TZ_SRLX')) {
                    isShow = true
                    titleName = '待收入金额'
                }
                break
            }
            case 'LB_ZB': {
                if (beAccrued && oriState === 'STATE_ZB_ZFLR') {
                    isShow = true
                }
                break
            }
            case 'LB_SFZC': {
                ({
                    'SX_ZZS': () => {//增值税
                        if (oriState === 'STATE_SF_JN') {
                            isShow = true
                            titleName = '待处理税费'
                        }
                        if (oriState === 'STATE_SF_SFJM') {
                            isShow = true
                            titleName = '核销总计'
                        }
                    },
                    'SX_GRSF': () => {//个人税费
                        isShow = false
                    },
                    'SX_QTSF': () => {//其他税费
                        if (beAccrued && oriState === 'STATE_SF_JN') {
                            isShow = true
                            titleName = '待支付金额'
                        }
                        if (oriState === 'STATE_SF_SFJM') {
                            isShow = true
                            titleName = '核销总计'
                        }
                    },
                    'SX_QYSDS': () => {//企业所得税
                        if (beAccrued && oriState === 'STATE_SF_JN') {
                            isShow = true
                            titleName = '待支付金额'
                        }
                        if (oriState === 'STATE_SF_SFJM') {
                            isShow = true
                            titleName = '核销总计'
                        }
                    }
                }[propertyTax] || (() => null))()

                break

            }
            case 'LB_XCZC': {
                ({
                    'SX_GZXJ': () => {//工资薪金
                        if (beAccrued && (oriState === 'STATE_XC_FF' || oriState == 'STATE_XC_DK')) {
                            isShow = true
                            titleName = jrAmount >= 0 ? '待处理付款金额：' : '待处理收款金额：'
                        }
                    },
                    'SX_SHBX': () => {//社会保险
                        if (beAccrued && (oriState === 'STATE_XC_JN' || oriState == 'STATE_XC_DJ')) {
                            isShow = true
                            titleName = jrAmount >= 0 ? '待处理付款金额：' : '待处理收款金额：'
                        }
                    },
                    'SX_ZFGJJ': () => {//住房公积金
                        if (beAccrued && (oriState === 'STATE_XC_JN' || oriState == 'STATE_XC_DJ')) {
                            isShow = true
                            titleName = jrAmount >= 0 ? '待处理付款金额：' : '待处理收款金额：'
                        }
                    },
                    'SX_FLF': () => {//企业所得税
                        if (beAccrued && oriState === 'STATE_XC_FF') {
                            isShow = true
                            titleName = jrAmount >= 0 ? '待处理付款金额：' : '待处理收款金额：'
                        }
                    },
                    'SX_QTXC': () => {//其他薪酬
                        if (beAccrued && oriState === 'STATE_XC_FF') {
                            isShow = true
                            titleName = jrAmount >= 0 ? '待处理付款金额：' : '待处理收款金额：'
                        }
                    },
                }[propertyPay] || (() => null))()

                break

            }
            case 'LB_KJFP': {
                if (hasSelect) {
                    component = <Row className='jr-card lrls-bottom' key='component'>
                        <div className='hx-title lrls-type'>
                            <span>关联核销</span>
                            <span className='lrls-placeholder'
                                onClick={() => {
                                    dispatch(editRunningActions.changeLrlsData(['views', 'showJrPage'], true))
                                }}
                            >
                                待开发票税额：<Amount showZero>{jrAmount}</Amount> <Icon type="arrow-right"/>
                            </span>
                        </div>
                        {
                            pendingStrongList.map((v,i) => {
                                if (v.get('beSelect')) {
                                    const taxRate = v.get('taxRate') == -1 ? '**' : v.get('taxRate')
                                    return (
                                        <div key={i} className='hx-top-line'>
                                            <div className='jr-item'>
                                                <div className='overElli'>{v.get('categoryName')}</div>
                                                <div>{v.get('beOpened') ? '期初值' : `${v.get('jrIndex')}号`}</div>
                                            </div>
                                            <div className='jr-item'>
                                                <span>
                                                    {v.get('beOpened') ? '' : `税率：${taxRate}%`}
                                                </span>
                                                <div><Amount className='hx-bold' showZero>{Math.abs(v.get('notHandleAmount'))}</Amount></div>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </Row>
                }


                break
            }
            case 'LB_FPRZ': {
                if (hasSelect) {
                    component = <Row className='jr-card lrls-bottom' key='component'>
                        <div className='hx-title lrls-type'>
                            <span>关联核销</span>
                            <span className='lrls-placeholder'
                                onClick={() => {
                                    dispatch(editRunningActions.changeLrlsData(['views', 'showJrPage'], true))
                                }}
                            >
                                待认证税额：<Amount showZero>{jrAmount}</Amount> <Icon type="arrow-right"/>
                            </span>
                        </div>
                        {
                            pendingStrongList.map((v,i) => {
                                if (v.get('beSelect')) {
                                    return (
                                        <div key={i} className='hx-top-line'>
                                            <div className='jr-item'>
                                                <div className='overElli'>{v.get('categoryName')}</div>
                                                <div>{v.get('beOpened') ? '期初值' : `${v.get('jrIndex')}号`}</div>
                                            </div>
                                            <div className='jr-item'>
                                                <span></span>
                                                <div><Amount className='hx-bold' showZero>{Math.abs(v.get('notHandleAmount'))}</Amount></div>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </Row>
                }


                break
            }
            case 'LB_JZSY': {
                if (hasSelect) {
                    component = <Row className='jr-card lrls-bottom lrls-bottom' key='component'>
                        <div className='hx-title lrls-type'>
                            <span>关联核销</span>
                            <span className='lrls-placeholder'
                                onClick={() => {
                                    dispatch(editRunningActions.changeLrlsData(['views', 'showJrPage'], true))
                                }}
                            >
                                处置金额合计：<Amount showZero>{jrAmount}</Amount> <Icon type="arrow-right"/>
                            </span>
                        </div>
                        {
                            pendingStrongList.map((v,i) => {
                                if (v.get('beSelect')) {
                                    return (
                                        <div key={i} className='hx-top-line'>
                                            <div className='jr-item'>
                                                <div>{v.get('jrIndex')} 号</div>
                                                <div className='overElli'>{v.get('oriDate')}</div>
                                            </div>
                                            <div className='jr-item'>
                                                <div className='overElli'>{v.get('categoryName')}</div>
                                                <div><Amount className='hx-bold' showZero>{v.get('amount')}</Amount></div>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </Row>
                }


                break
            }
            case 'LB_SFGL': {
                if (hasSelect) {
                    component = <Row className='jr-card lrls-bottom' key='component'>
                        <div className='hx-title lrls-type'>
                            <span>关联核销</span>
                            <span className='lrls-placeholder'
                                onClick={() => {
                                    dispatch(editRunningActions.changeLrlsData(['views', 'showJrPage'], true))
                                }}
                            >
                                待核销{jrAmount >= 0 ? '收' : '付'}款金额：<Amount showZero>{Math.abs(Number(jrAmount))}</Amount> <Icon type="arrow-right"/>
                            </span>
                        </div>
                        {
                            pendingStrongList.map((v,i) => {
                                if (v.get('beSelect')) {
                                    return (
                                        <div key={i} className='hx-top-line'>
                                            <div className='jr-item'>
                                                <div className='overElli'>{v.get('categoryName')}</div>
                                                {
                                                    v.get('beOpened') ? <span>期初值</span> : <div>{v.get('jrIndex')}  号</div>
                                                }
                                            </div>
                                            <div className='jr-item'>
                                                <div>
                                                    {v.get('direction') == 'credit' ? '贷方发生' : '借方发生'}
                                                </div>
                                                <div><Amount showZero className='hx-bold'>{v.get('amount')}</Amount></div>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </Row>
                }
                break
            }
            case 'LB_JZCB': {
                if (hasSelect) {
                    component = <Row className='jr-card lrls-bottom' key='component'>
                        <div className='hx-title lrls-type'>
                            <span>关联核销</span>
                            <span className='lrls-placeholder'
                                onClick={() => {
                                    dispatch(editRunningActions.changeLrlsData(['views', 'showJrPage'], true))
                                }}
                            >
                                {oriState === 'STATE_YYSR_XS' ? '收入金额合计：' : '退销金额合计：'}<Amount showZero>{jrAmount}</Amount> <Icon type="arrow-right"/>
                            </span>
                        </div>
                        {
                            pendingStrongList.map((v,i) => {
                                if (v.get('beSelect')) {
                                    const isOpenedQuantity = v.get('isOpenedQuantity')
                                    const unitCardName = v.get('unitCardName') ? v.get('unitCardName') : ''
                                    const quantity = v.get('quantity') ? v.get('quantity') : 0
                                    return (
                                        <div key={i} className='hx-top-line'>
                                            <div className='jr-item'>
                                                <div className='overElli'>{v.get('categoryName')}</div>
                                                <div>{v.get('jrIndex')} 号</div>
                                            </div>
                                            <div className='jr-item'>
                                                <div className='overElli'>{v.get('stockCardCode')} {v.get('stockCardName')}{quantity ? `(数量:${quantity}${unitCardName})` : null}</div>
                                                <div><Amount className='hx-bold' showZero>{Math.abs(v.get('amount'))}</Amount></div>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </Row>
                }


                break
            }
            case 'LB_GGFYFT': {
                isShow = true
                titleName = '待分摊金额'
                showType = 'categoryName'
                break
            }
            case 'LB_XMJZ': {
                isShow = pendingStrongList.size > 0 ? true : false
                if (isShow && ['STATE_XMJZ_JZRK', 'STATE_XMJZ_QRSRCB'].includes(oriState)) {
                    let titleName = '待入库金额：'
                    if (oriState=='STATE_XMJZ_QRSRCB') {
                        titleName = '待确认合同毛利：'
                    }
                    component = <Row className='lrls-card lrls-type' key='component'>
                        <span>{jrAmount ? titleName : null}<Amount>{jrAmount}</Amount></span>
                        <span className='lrls-placeholder'
                            onClick={() => {
                                dispatch(editRunningActions.changeLrlsData(['views', 'showJrPage'], true))
                        }}>
                            查看详情 <Icon type="arrow-right"/>
                        </span>
                    </Row>
                }
                if (isShow && oriState=='STATE_XMJZ_XMJQ') {
                    let leftName = '发生金额:', rightName = '已入库金额:', titleName = '待入库金额：'
                    let allHappenAmount = 0, allStoreAmount = 0, showTotal = false
                    if (projectProperty=='XZ_CONSTRUCTION') {
                        leftName = '借方金额:'
                        rightName = '贷方金额:'
                        titleName = '待确认合同毛利：'
                        showTotal = true
                    }
                    component = <Row className='jr-card lrls-bottom' key='component'>
                        <div className='hx-title lrls-type'>
                            <span>关联核销</span>
                            <span className='lrls-placeholder'>
                                {jrAmount ? titleName : null}<Amount>{jrAmount}</Amount>
                            </span>
                        </div>
                        {
                            pendingStrongList.map((v,i) => {
                                const happenAmount = v.get('happenAmount')
                                const storeAmount = v.get('storeAmount')
                                const direction = v.get('direction')
                                if (projectProperty=='XZ_CONSTRUCTION') {
                                    leftName = v.get('direction') == 'debit' ? '待确认收入' : '已确认收入'
                                    rightName = v.get('direction') == 'debit' ? '待确认成本' : '已确认成本'
                                    if (direction == 'debit') {
                                        if (happenAmount) {
                                            allHappenAmount += Number(happenAmount)
                                        }
                                        if (storeAmount) {
                                            allStoreAmount += Number(storeAmount)
                                        }
                                    }
                                    if (direction == 'credit') {
                                        if (happenAmount) {
                                            allHappenAmount -= Number(happenAmount)
                                        }
                                        if (storeAmount) {
                                            allStoreAmount -= Number(storeAmount)
                                        }
                                    }
                                }
                                return (
                                    <div key={i} className='hx-top-line'>
                                        <div className='jr-item jr-line'>
                                            <span>{v.get('beOpened') ? '期初值' : `${v.get('jrIndex')}号`}</span>
                                            <span className='lrls-placeholder'>{v.get('oriDate')}</span>
                                        </div>
                                        <div className='jr-item'>
                                            <div className='overElli'>{v.get('categoryName')}</div>
                                        </div>
                                        <div className='jr-item'>
                                            <span className='overElli'>{v.get('oriAbstract')}</span>
                                        </div>
                                        <div className='jr-item'>
                                            <div>{happenAmount ? leftName : null} <Amount className='hx-bold'>{happenAmount}</Amount></div>
                                            <div>{storeAmount ? rightName : null} <Amount className='hx-bold'>{storeAmount}</Amount></div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        { showTotal ? <div className='hx-title lrls-type hx-top-line'>
                        <span>待确认收入净额 <Amount showZero>{decimal(allHappenAmount)}</Amount></span>
						<span>待确认成本净额 <Amount showZero>{decimal(allStoreAmount)}</Amount></span>
                        </div> : null}
                    </Row>
                }

                break
            }


            default: null
        }

        if (!component && isShow && hasSelect) {//非核算管理页面新增
            component = (
                <Row className='jr-card lrls-bottom' key='component'>
                    <div className='hx-title lrls-type'>
                        <span>关联核销</span>
                        <span className='lrls-placeholder'
                            onClick={() => {
                                dispatch(editRunningActions.changeLrlsData(['views', 'showJrPage'], true))
                            }}
                        >
                            {titleName}：<Amount showZero>{categoryType=='LB_XCZC' ? Math.abs(jrAmount) : jrAmount}</Amount> <Icon type="arrow-right"/>
                        </span>
                    </div>
                    {
                        pendingStrongList.map((v,i) => {
                            if (v.get('beSelect')) {
                                return (
                                    <div key={i} className='hx-top-line'>
                                        <div className='jr-item'>
                                            <div>{v.get('beOpened') ? '期初值' : `${v.get('jrIndex')}号`}</div>
                                            <div>{v.get('oriDate')}</div>
                                        </div>
                                        <div className='jr-item'>
                                            <div className='overElli'>{v.get(showType) ? v.get(showType) : jrJvTypeName}</div>
                                            <div><Amount showZero className='hx-bold'>{v.get(showAmount)}</Amount></div>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </Row>
            )
        }

        let strongComponent = null
        if (strongList.size && (!isCopy)) {//非核算管理页面的核销流水修改时显示 !component && strongList.size
            let totalAmount = 0
            let hxBody = <div style={{display: showList ? '' : 'none'}}>
                {
                    strongList.map((v,i) => {
                        totalAmount += v.get('handleAmount')
                        return (
                            <div key={i} className='hx-top-line'>
                                <div className='jr-item'>
                                    <div>{v.get('jrIndex')}号</div>
                                    <div>{v.get('oriDate')}</div>
                                </div>
                                <div className='jr-item'>
                                    <div>{v.get('jrJvTypeName')}</div>
                                    <div><Amount className='hx-bold'>{v.get('handleAmount')}</Amount></div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            strongComponent = (
                <Row className='jr-card lrls-bottom' key='strongComponent'>
                    <div className='jr-item' onClick={() => this.setState({'showList': !showList})}>
                        <div>核销总计：<Amount showZero>{totalAmount}</Amount></div>
                        <div>
                            {showList ? '收起' : '展开'}
                            <Icon style={showList ? {transform: 'rotate(180deg)'} : ''} type="arrow-down"/>
                        </div>
                    </div>
                    {hxBody}
                </Row>
            )
        }

        let componentArr = []
        componentArr.push(component)
        componentArr.push(strongComponent)

        return componentArr
    }
}
