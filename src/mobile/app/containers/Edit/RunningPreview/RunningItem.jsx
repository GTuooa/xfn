import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import { formatMoney } from 'app/utils'
import { Amount, Icon } from 'app/components'
import { runningStateType } from 'app/constants/editRunning.js'

import Invoice from './Invoice'
import Calculation from './Calculation'
import ProjectCom from './ProjectCom'

import { runningPreviewActions } from 'app/redux/Edit/RunningPreview'

const propertyCostObj = {'XZ_SALE': '销售费用', 'XZ_MANAGE': '管理费用', 'XZ_FINANCE': '财务费用', 'XZ_SCCB': '生产成本', 'XZ_FZSCCB': '辅助生产成本', 'XZ_ZZFY': '制造费用', 'XZ_HTCB': '合同成本', 'XZ_JJFY': '间接费用', 'XZ_JXZY': '机械作业'}

// 统一的账户显示方式
function Account({accounts}) {
    if (accounts.size==1) {
        return (
            <div className='running-preview-item'>
                <div className='running-preview-item-title'>账户：</div>
                <div className='running-preview-item-content overElli'>{accounts.getIn([0, 'accountName'])}</div>
            </div>
        )
    } else {
        return null
    }
}

// 统一的往来单位显示方式
function Relative({currentCardList}) {
    if (currentCardList.size) {
        return (
            <div className='running-preview-item'>
                <div className='running-preview-item-title'>往来单位：</div>
                <div className='running-preview-item-content overElli'>
                    {`${currentCardList.getIn([0, 'code'])}_${currentCardList.getIn([0, 'name'])}`}
                </div>
            </div>
        )
    } else {
        return null
    }
}


// 营业收入/支出
@immutableRenderDecorator
export class Yysz extends React.Component {

    render() {

        const { jrOri, category, oriState, dispatch, isEnable } = this.props

        console.log('Yysz');

        const currentCardList = jrOri.get('currentCardList')
        const stockCardList = jrOri.get('stockCardList') ? jrOri.get('stockCardList') : fromJS([])
        const accounts = jrOri.get('accounts')
        const usedProject = jrOri.get('usedProject')
        const projectCardList = jrOri.get('projectCardList')
        const amount = jrOri.get('amount')
        const currentAmount = jrOri.get('currentAmount')
        const propertyCarryover = category.get('propertyCarryover')
        const billList = jrOri.get('billList')
        const categoryType = category.get('categoryType')

        // 核算详情
        const stockStrongList = jrOri.get('stockStrongList')
        const strongList = jrOri.get('strongList')

        const onlyOneStock = stockCardList.get(0) ? stockCardList.get(0) : fromJS({})
        const assistList = onlyOneStock.get('assistList') ? onlyOneStock.get('assistList') : fromJS([])//选择的属性
        const assistName = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, '')
        const batch = onlyOneStock.get('batch') ? onlyOneStock.get('batch') : ''
        const batchUuid = onlyOneStock.get('batchUuid') ? onlyOneStock.get('batchUuid') : ''
        const expirationDate = onlyOneStock.get('expirationDate') ? onlyOneStock.get('expirationDate') : ''
        const batchName = expirationDate ? `${batch}(${expirationDate})` : batch

        return (
            <div>
                <div className='running-preview-bottom-card'>
                    <Relative currentCardList={currentCardList}/>
                    <ProjectCom projectCardList={projectCardList}/>
                    <div style={{display: stockCardList.size==1 ? '' : 'none'}}>
                        <div className='running-preview-item'>
                            <div className='running-preview-item-title'>存货：</div>
                            <div className='running-preview-item-content'>
                                {`${onlyOneStock.get('code')} ${onlyOneStock.get('name')}`}
                            </div>
                        </div>
                        <div className='running-preview-item' style={{display: assistName ? '' : 'none'}}>
                            <div className='running-preview-item-title'>属性：</div>
                            <div className='running-preview-item-content'>{assistName}</div>
                        </div>
                        <div className='running-preview-item' style={{display: batchName ? '' : 'none'}}>
                            <div className='running-preview-item-title'>批次：</div>
                            <div className='running-preview-item-content'>{batchName}</div>
                        </div>
                        <div className='running-preview-item' style={{display: onlyOneStock.get('warehouseCardName') ? '' : 'none'}}>
                            <div className='running-preview-item-title'>仓库：</div>
                            <div className='running-preview-item-content'>
                                {onlyOneStock.get('warehouseCardCode')} {onlyOneStock.get('warehouseCardName')}
                            </div>
                        </div>
                        <div style={{display: onlyOneStock.get('isOpenedQuantity') ? '' : 'none'}}>
                            <div className='running-preview-item'>
                                <div className='running-preview-item-title'>数量：</div>
                                <div className='running-preview-item-content'>
                                    {`${formatMoney(onlyOneStock.get('quantity'), 4, '', false)} ${onlyOneStock.get('unitName') ? onlyOneStock.get('unitName') : ''}`}
                                </div>
                            </div>
                            <div className='running-preview-item'>
                                <div className='running-preview-item-title'>单价：</div>
                                <div className='running-preview-item-content'>
                                    {`${formatMoney(onlyOneStock.get('price'), 4, '', false)}`}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className='running-preview-item' style={{display: stockCardList.size > 1 ? '' : 'none'}}>
                        <div className='running-preview-item-title'>存货：</div>
                        <div className='running-preview-item-content'>多存货</div>
                    </div>
                    <div className='running-preview-bgColor' style={{display: stockCardList.size > 1 ? '' : 'none'}}>
                        {
                            stockCardList.map((v, i) => {
                                const assistList = v.get('assistList') ? v.get('assistList') : fromJS([])//选择的属性
                                const assistName = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, '')
                                const batch = v.get('batch') ? v.get('batch') : ''
                                const batchUuid = v.get('batchUuid') ? v.get('batchUuid') : ''
                                const expirationDate = v.get('expirationDate') ? v.get('expirationDate') : ''
                                const batchName = expirationDate ? `${batch}(${expirationDate})` : batch
                                return (
                                    <div key={i}>
                                        <div className='running-preview-item'>
                                            <div className='running-preview-item-title'><span className='spot'>• </span>存货：</div>
                                            <div className='running-preview-item-content'>{`${v.get('code')} ${v.get('name')}`}</div>
                                        </div>
                                        <div className='running-preview-item' style={{display: assistName ? '' : 'none'}}>
                                            <div className='running-preview-item-title'>属性：</div>
                                            <div className='running-preview-item-content'>{assistName}</div>
                                        </div>
                                        <div className='running-preview-item' style={{display: batchName ? '' : 'none'}}>
                                            <div className='running-preview-item-title'>批次：</div>
                                            <div className='running-preview-item-content'>{batchName}</div>
                                        </div>
                                        <div className='running-preview-item' style={{display: v.get('warehouseCardName') ? '' : 'none'}}>
                                            <div className='running-preview-item-title'>仓库：</div>
                                            <div className='running-preview-item-content'>
                                                {v.get('warehouseCardCode')} {v.get('warehouseCardName')}
                                            </div>
                                        </div>
                                        <div style={{display: v.get('isOpenedQuantity') ? '' : 'none'}}>
                                            <div className='running-preview-item'>
                                                <div className='running-preview-item-title'>数量：</div>
                                                <div className='running-preview-item-content'>
                                                    {`${formatMoney(v.get('quantity'), 4, '', false)} ${v.get('unitName') ? v.get('unitName') : ''}`}
                                                </div>
                                            </div>
                                            <div className='running-preview-item'>
                                                <div className='running-preview-item-title'>单价：</div>
                                                <div className='running-preview-item-content'>
                                                    {`${formatMoney(v.get('price'), 4, '', false)}`}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='running-preview-item'>
                                            <div className='running-preview-item-title'>金额：</div>
                                            <div className='running-preview-item-content'>{formatMoney(v.get('amount'), 2, '')}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="running-preview-item">
                        <div className='running-preview-item-title'>{stockCardList.size > 1 ? '总金额：': '金额：'}</div>
                        <div className='running-preview-item-content'>{formatMoney(amount, 2, '')}</div>
                    </div>
                    <Account accounts={accounts}/>
                    <div className='running-preview-item' style={{display: accounts.size > 1 ? '' : 'none'}}>
                        <div className='running-preview-item-title'>账户：</div>
                        <div className='running-preview-item-content'>多账户</div>
                    </div>
                    <div className='running-preview-bgColor' style={{display: accounts.size > 1 ? '' : 'none'}}>
                        {
                            accounts.map((v, i) => {
                                return (
                                    <div key={i}>
                                        <div className='running-preview-item'>
                                            <div className='running-preview-item-title'><span className='spot'>• </span>账户：</div>
                                            <div className='running-preview-item-content'>{v.get('accountName')}</div>
                                        </div>
                                        <div className='running-preview-item'>
                                            <div className='running-preview-item-title'>金额：</div>
                                            <div className='running-preview-item-content'>{formatMoney(v.get('amount'), 2, '')}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <Invoice
                        isEnable={isEnable}
                        categoryType={categoryType}
                        billList={jrOri.get('billList')}
                        billStrongList={jrOri.get('billStrongList')}
                    />
                </div>

                {
                    stockStrongList && stockStrongList.size ?
                    <div>
                        <div className='running-preview-fj-title'>结转情况</div>
                        <div className='running-preview-bottom-card'>
                            <div className='running-preview-child running-preview-padding'>
                                <span>
                                    流水号：{stockStrongList.getIn([0, 'jrIndex'])} 号
                                </span>
                                <span className='running-preview-light-gray'>{stockStrongList.getIn([0, 'oriDate'])}</span>
                            </div>
                            <div className='running-preview-child running-preview-padding'>
                                <span className='overElli running-preview-light-gray'>{stockStrongList.getIn([0, 'oriAbstract'])}</span>
                                <span className='running-preview-bold running-preview-middle'>
                                    <Amount>{stockStrongList.getIn([0, 'amount'])}</Amount>
                                </span>
                            </div>
                        </div>
                    </div>
                    : null
                }
            </div>
        )
    }
}

//费用支出
export class Fyzc extends React.Component {
    render() {
        const { jrOri, category, oriState, dispatch, isEnable } = this.props

        console.log('Fyzc');

        const currentCardList = jrOri.get('currentCardList')
        const projectCardList = jrOri.get('projectCardList')
        const accounts = jrOri.get('accounts')
        const amount = jrOri.get('amount')
        const propertyCost = jrOri.get('propertyCost')
        const propertyCostList = category.get('propertyCostList')
        const categoryType = category.get('categoryType')

        return(
            <div className='running-preview-bottom-card'>
                {
                    oriState !== 'STATE_FY_DJ' && propertyCostList.size > 1 ?
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>费用性质：</div>
                        <div className='running-preview-item-content overElli'>{propertyCostObj[propertyCost]}</div>
                    </div>
                    : null
                }

                <Relative currentCardList={currentCardList}/>
                <ProjectCom projectCardList={projectCardList}/>
                <div className='running-preview-item'>
                    <div className='running-preview-item-title'>金额：</div>
                    <div className='running-preview-item-content'>{formatMoney(amount, 2, '')}</div>
                </div>
                <Account accounts={accounts}/>
                <div className='running-preview-item' style={{display: accounts.size > 1 ? '' : 'none'}}>
                    <div className='running-preview-item-title'>账户：</div>
                    <div className='running-preview-item-content'>多账户</div>
                </div>
                <div className='running-preview-bgColor' style={{display: accounts.size > 1 ? '' : 'none'}}>
                    {
                        accounts.map((v, i) => {
                            return (
                                <div key={i}>
                                    <div className='running-preview-item'>
                                        <div className='running-preview-item-title'><span className='spot'>• </span>账户：</div>
                                        <div className='running-preview-item-content'>{v.get('accountName')}</div>
                                    </div>
                                    <div className='running-preview-item'>
                                        <div className='running-preview-item-title'>金额：</div>
                                        <div className='running-preview-item-content'>{formatMoney(v.get('amount'), 2, '')}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>                
                <Invoice billList={jrOri.get('billList')} isEnable={isEnable} categoryType={categoryType}/>
            </div>
        )
    }
}

//薪酬支出
export class Xczc extends React.Component {

    render() {
        const { jrOri, category, oriState, dispatch } = this.props

        console.log('Xczc');

        const projectCardList = jrOri.get('projectCardList')
        const accounts = jrOri.get('accounts')
        const propertyCost = jrOri.get('propertyCost')
        const propertyCostList = category.get('propertyCostList')
        const propertyPay = category.get('propertyPay')
        const acPayment = category.get('acPayment')
        const amount = jrOri.get('amount')
        const payment = jrOri.get('payment') ? jrOri.get('payment') : fromJS({})
        const beAccrued = acPayment.get('beAccrued')
        const personAccumulationAmount = payment.get('personAccumulationAmount')
        const personSocialSecurityAmount = payment.get('personSocialSecurityAmount')
        const incomeTaxAmount = payment.get('incomeTaxAmount')
        const companySocialSecurityAmount = payment.get('companySocialSecurityAmount')
        const companyAccumulationAmount = payment.get('companyAccumulationAmount')
        const actualAmount = payment.get('actualAmount')
        const amountAll = Number(personSocialSecurityAmount + personAccumulationAmount + incomeTaxAmount).toFixed(2)

        let totalAmount = 0
        jrOri.get('pendingStrongList').forEach(v => {
            let notHandleAmount = Number(v.get('notHandleAmount')) + Number(v.get('handleAmount'))
            totalAmount += notHandleAmount
        })

        return(
            <div>
                <div className='running-preview-bottom-card'>
                    {
                        propertyCostList.size > 1 && (oriState === 'STATE_XC_JT' || ((oriState === 'STATE_XC_JN' || oriState === 'STATE_XC_FF') && !beAccrued)) && propertyCost ?
                        <div className='running-preview-item'>
                            <div className='running-preview-item-title'>费用性质：</div>
                            <div className='running-preview-item-content overElli'>{propertyCostObj[propertyCost]}</div>
                        </div>
                        : null
                    }
                    <ProjectCom projectCardList={projectCardList}/>
                    {
                        oriState === 'STATE_XC_JT' || propertyPay === 'SX_QTXC' || propertyPay === 'SX_FLF' ?
                        <div className='running-preview-item'>
                            <div className='running-preview-item-title'>金额：</div>
                            <div className='running-preview-item-content'>{formatMoney(amount, 2, '')}</div>
                        </div> : ''
                    }
                    {
                        oriState === 'STATE_XC_FF' && propertyPay === 'SX_GZXJ' ?
                        <div className='running-preview-item'>
                            <div className='running-preview-item-title'>{totalAmount >= 0 ? '付款金额：' : '收款金额：'}</div>
                            <div className='running-preview-item-content'>{formatMoney(amount, 2, '')}</div>
                        </div> : ''
                    }
                    {
                        propertyPay === 'SX_SHBX' && oriState === 'STATE_XC_DJ' ? // 代缴
                        <div className='running-preview-item'>
                            <div className='running-preview-item-title'>支付金额：</div>
                            <div className='running-preview-item-content'>{formatMoney(personSocialSecurityAmount, 2, '')}</div>
                        </div> : ''
                    }
                    {
                        propertyPay === 'SX_ZFGJJ' && oriState === 'STATE_XC_DJ' ? // 代缴
                        <div className='running-preview-item'>
                            <div className='running-preview-item-title'>支付金额：</div>
                            <div className='running-preview-item-content'>{formatMoney(personAccumulationAmount, 2, '')}</div>
                        </div> : ''
                    }
                    {
                        oriState === 'STATE_XC_JN' ? // 缴纳
                        <div className='running-preview-item'>
                            <div className='running-preview-item-title'>{totalAmount >= 0 ? '付款金额：' : '收款金额：'}</div>
                            <div className='running-preview-item-content'>{formatMoney(amount, 2, '')}</div>
                        </div> : ''
                    }
                    {
                        oriState !== 'STATE_XC_JT' ? <Account accounts={accounts}/> : ''
                    }
                    {
                        oriState === 'STATE_XC_DK' ?
                        <div>
                            <div className='running-preview-item'>
                                <div>{`${oriState === 'STATE_XC_DK' ? '代扣款：' : '代缴款：'}`}<Amount showZero>{amountAll}</Amount></div>
                            </div>
                            <div className='running-preview-top-line'>
                                {
                                    personSocialSecurityAmount ?
                                        <div className="running-preview-padding">
                                            {oriState === 'STATE_XC_DK' ? '代扣' : '代缴'}社会保险(个人部分)：{formatMoney(personSocialSecurityAmount, 2, '')}
                                        </div> : ''
                                }
                                {
                                    personAccumulationAmount ?
                                        <div className="running-preview-padding">
                                            {oriState === 'STATE_XC_DK' ? '代扣' : '代缴'}公积金(个人部分)：{formatMoney(personAccumulationAmount, 2, '')}
                                        </div> : ''
                                }
                                {
                                    incomeTaxAmount ?
                                        <div className="running-preview-padding">
                                            代扣个人所得税：{formatMoney(incomeTaxAmount, 2, '')}
                                        </div> : ''
                                }
                            </div>
                        </div> : null
                    }
                </div>
            </div>
        )
    }
}

//税费支出
export class Sfzc extends React.Component {
    render() {
        const { jrOri, category, oriState, dispatch } = this.props

        console.log('Sfzc');

        const offsetAmount = jrOri.get('offsetAmount')
        const amount = jrOri.get('amount')
        const projectCardList = jrOri.get('projectCardList')
        const accounts = jrOri.get('accounts')

        return (
            <div className='running-preview-bottom-card'>
                {
                    oriState == 'STATE_SF_JN' && offsetAmount > 0 ?
                        <div className='running-preview-item'>
                            <div className='running-preview-item-title'>预交抵扣：</div>
                            <div className='running-preview-item-content'>{formatMoney(offsetAmount, 2, '')}</div>
                        </div>
                        : ''
                }
                <ProjectCom projectCardList={projectCardList}/>

                <div className='running-preview-item'>
                    <div className='running-preview-item-title'>金额：</div>
                    <div className='running-preview-item-content'>{formatMoney(amount, 2, '')}</div>
                </div>
                <Account accounts={accounts}/>
            </div>
        )
    }
}

// 长期资产
export class Cqzc extends React.Component {
    render() {
        const { jrOri, category, oriState, dispatch, isEnable } = this.props

        console.log('Cqzc');

        const handleType = jrOri.get('handleType')
        const handleTypeJson = {
            'JR_HANDLE_GJ': '购进资产',
            'JR_HANDLE_CZ': '处置资产'
        }

        const currentCardList = jrOri.get('currentCardList')
        const projectCardList = jrOri.get('projectCardList')
        const accounts = jrOri.get('accounts')

        const carryoverStrongList = jrOri.get('carryoverStrongList')

        return (
            <div>
                <div className='running-preview-bottom-card'>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>处理类型：</div>
                        <div className='running-preview-item-content'>{handleTypeJson[handleType]}</div>
                    </div>
                    <Relative currentCardList={currentCardList}/>
                    <ProjectCom projectCardList={projectCardList}/>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>金额：</div>
                        <div className='running-preview-item-content'>{formatMoney(jrOri.get('amount'), 2, '')}</div>
                    </div>
                    <Account accounts={accounts}/>
                    <Invoice
                        billList={jrOri.get('billList')}
                        billStrongList={jrOri.get('billStrongList')}
                        isEnable={isEnable}
                        oriState={oriState}
                    />
                </div>
                {/* {
                    handleType === 'JR_HANDLE_CZ' && carryoverStrongList && carryoverStrongList.size ?
                    <div className='running-preview-card-item'>
                        <div className='running-preview-item'>
                            <div>处置损益：</div>
                        </div>
                        <div className='running-preview-top-line'>
                            <div className='running-preview-item running-preview-padding'>
                                <div className='running-preview-gray'>{carryoverStrongList.getIn([0, 'categoryName'])}</div>
                                <div className='overElli'>流水号：{carryoverStrongList.getIn([0, 'jrIndex'])}</div>
                            </div>
                        </div>
                    </div>
                    : null
                } */}
            </div>
        )
    }
}

// 营业外收支
export class Yywsz extends React.Component {
    render() {
        const { jrOri, category, oriState, dispatch, isEnable } = this.props

        console.log('Yywsz');

        const currentCardList = jrOri.get('currentCardList')
        const projectCardList = jrOri.get('projectCardList')
        const accounts = jrOri.get('accounts')
        const amount = jrOri.get('amount')
        const categoryType = category.get('categoryType')

        return (
            <div className='running-preview-bottom-card'>
                <Relative currentCardList={currentCardList}/>
                <ProjectCom projectCardList={projectCardList}/>
                <div className='running-preview-item'>
                    <div className='running-preview-item-title'>金额：</div>
                    <div className='running-preview-item-content'>{formatMoney(amount, 2, '')}</div>
                </div>
                <Account accounts={accounts}/>
                <Invoice
                    billList={jrOri.get('billList')}
                    billStrongList={jrOri.get('billStrongList')}
                    isEnable={isEnable}
                    categoryType={categoryType}
                />
            </div>
        )
    }
}

// 暂收暂付
export class Zszf extends React.Component {

    render() {

        const { jrOri, category, oriState, dispatch } = this.props

        console.log('Zszf');

        const currentCardList = jrOri.get('currentCardList')
        const projectCardList = jrOri.get('projectCardList')
        const accounts = jrOri.get('accounts')
        const amount = jrOri.get('amount')

        return (
            <div>
                <div className='running-preview-bottom-card'>
                    <Relative currentCardList={currentCardList}/>
                    <ProjectCom projectCardList={projectCardList}/>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>金额：</div>
                        <div className='running-preview-item-content'>{formatMoney(amount, 2, '')}</div>
                    </div>
                    <Account accounts={accounts}/>
                </div>

            </div>
        )
    }
}

// 借款/投资/资本
export class JkTzZb extends React.Component {

    render() {

        const { jrOri, category, oriState, dispatch } = this.props

        console.log('JkTzZb');

        const projectCardList = jrOri.get('projectCardList')
        const accounts = jrOri.get('accounts')
        const amount = jrOri.get('amount')
        const runningStateName = runningStateType[oriState] ? runningStateType[oriState] : ''
        const currentCardList = jrOri.get('currentCardList')

        const handleType = jrOri.get('handleType')
        const handleTypeName = {
            JR_HANDLE_QDJK: '取得借款',
            JR_HANDLE_CHLX: '偿还利息',
            JR_HANDLE_CHBJ: '偿还本金',
            JR_HANDLE_DWTZ: '对外投资',
            JR_HANDLE_QDSY: '取得收益',
            JR_HANDLE_SHTZ: '收回投资',
            JR_HANDLE_ZZ: '实收资本',
            JR_HANDLE_LRFP: '利润分配',
            JR_HANDLE_JZ: '减资',
            JR_HANDLE_ZBYJ: '资本溢价',
        }

        return (
            <div>
                <div className='running-preview-bottom-card'>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>处理类型：</div>
                        <div className='running-preview-item-content'>
                            {handleTypeName[handleType]}
                            {/* {runningStateName ? `(${runningStateName})` : ''} */}
                        </div>
                    </div>
                    <Relative currentCardList={currentCardList}/>
                    <ProjectCom projectCardList={projectCardList}/>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>金额：</div>
                        <div className='running-preview-item-content'>{formatMoney(amount, 2, '')}</div>
                    </div>
                    <Account accounts={accounts}/>
                </div>
            </div>
        )
    }
}

//货物结转成本
export class Jzcb extends React.Component {
    render() {
        const { jrOri, category, oriState, dispatch } = this.props

        const categoryTypeObj = {STATE_YYSR_JZCB:'acBusinessIncome',STATE_YYZC_JZCB:'acBusinessExpense'}[oriState]
        const stockCardList = jrOri.get('stockCardList')
        const oriAbstract = jrOri.get('oriAbstract')
        const stockWeakList = jrOri.get('stockWeakList')
        const projectCardList = jrOri.get('projectCardList')

        const relationCategoryName  = jrOri.get('relationCategoryName')
        const isJz = oriState=='STATE_YYSR_ZJ'

        return (
            <div>
                <div className='running-preview-bottom-card'>
                    <div className='running-preview-item' style={{display: oriState=='STATE_YYSR_ZJ' ? '' : 'none'}}>
                        <div className='running-preview-item-title'>处理类别：</div>
                        <div className='running-preview-item-content'>{relationCategoryName}</div>
                    </div>
                    <ProjectCom projectCardList={projectCardList}/>
                    <div className='running-preview-item'
                        style={{display: stockCardList.size > 1 ? '' : 'none'}}
                    >
                        <div className='running-preview-item-title'>存货：</div>
                        <div className='running-preview-item-content'>多存货</div>
                    </div>
                    <div className={stockCardList.size > 1 ? 'running-preview-bgColor': '' }>
                    {
                        stockCardList && stockCardList.size ?
                         stockCardList.map((v, i) => {
                            const assistList = v.get('assistList') ? v.get('assistList') : fromJS([])//选择的属性
                            const assistName = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, '')
                            const batch = v.get('batch') ? v.get('batch') : ''
                            const batchUuid = v.get('batchUuid') ? v.get('batchUuid') : ''
                            const expirationDate = v.get('expirationDate') ? v.get('expirationDate') : ''
                            const batchName = expirationDate ? `${batch}(${expirationDate})` : batch

                            return (
                                <div key={i}>
                                <div className='running-preview-item'>
                                    <div className='running-preview-item-title'>
                                        <span className='spot' style={{display: stockCardList.size > 1 ? '' : 'none'}}>• </span>存货：
                                    </div>
                                    <div className='running-preview-item-content'>{`${v.get('code')}_${v.get('name')}`}</div>
                                </div>
                                <div className='running-preview-item' style={{display: assistName ? '' : 'none'}}>
                                    <div className='running-preview-item-title'>属性：</div>
                                    <div className='running-preview-item-content'>{assistName}</div>
                                </div>
                                <div className='running-preview-item' style={{display: batchName ? '' : 'none'}}>
                                    <div className='running-preview-item-title'>批次：</div>
                                    <div className='running-preview-item-content'>{batchName}</div>
                                </div>
                                <div className='running-preview-item'
                                    style={{display: v.get('warehouseCardName') ? '' : 'none'}}
                                >
                                    <div className='running-preview-item-title'>仓库：</div>
                                    <div className='running-preview-item-content'>
                                        {v.get('warehouseCardCode')} {v.get('warehouseCardName')}
                                    </div>
                                </div>
                                <div style={{display: v.get('isOpenedQuantity') ? '' : 'none'}}>
                                    <div className='running-preview-item'>
                                        <div className='running-preview-item-title'>数量：</div>
                                        <div className='running-preview-item-content'>
                                            {`${formatMoney(v.get('quantity'), 4, '', false)} ${v.get('unitName')?v.get('unitName'):''}`}
                                        </div>
                                    </div>
                                    <div className='running-preview-item'>
                                        <div className='running-preview-item-title'>单价：</div>
                                        <div className='running-preview-item-content'>
                                            {`${formatMoney(v.get('price'), 4, '', false)}`}
                                        </div>
                                    </div>
                                </div>
                                <div className='running-preview-item'>
                                    <div className='running-preview-item-title'>成本金额：</div>
                                    <div className='running-preview-item-content'>{formatMoney(v.get('amount'),2,'')}</div>
                                </div>
                            </div>
                            )


                         }) : ''
                    }
                    </div>
                    <div className="running-preview-item" style={{display: stockCardList.size > 1 ? '' : 'none'}}>
                        <div className='running-preview-item-title'>总金额：</div>
                        <div className='running-preview-item-content'>{formatMoney(jrOri.get('amount'), 2, '')}</div>
                    </div>
                </div>
            </div>
        )
    }
}

// 结账的结转损益
export class Syjz extends React.Component {

    render() {

        const { jrOri, category, oriState, dispatch } = this.props

        console.log('Zszf');
        const amount = jrOri.get('amount')
        const name = {
            STATE_SYJZ_JZBNLR: '本年利润',
            STATE_SYJZ_JZCBFY: '成本费用',
            STATE_SYJZ_JZSR: '收入',
        }[oriState]

        return (
            <div>
                <div className='running-preview-bottom-card'>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>{name}：</div>
                        <div className='running-preview-item-content'>{formatMoney(amount, 2, '')}</div>
                    </div>
                </div>
            </div>
        )
    }
}


export class Other extends React.Component {

    render() {

        return (
            <div>
                没写
                {/* <ul className="ylls-item-detail">
                    <li><span>金额：</span><span>{}</span></li>
                    <li><span>账户：</span><span>{}</span></li>
                    </ul>
                    <Calculation
                    title={'核销情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                /> */}
            </div>
        )
    }
}
