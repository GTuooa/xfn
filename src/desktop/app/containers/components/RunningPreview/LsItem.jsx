import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'
import { Collapse, Icon } from 'antd'
const Panel = Collapse.Panel
import { formatNum, formatMoney, formatFour } from 'app/utils'
import { categoryTypeAll, runningStateType, categoryTypeName, projectCodeTest } from 'app/containers/components/moduleConstants/common'
import Invoice from './Invoice'
import Calculation from './Calculation'

import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
const propertyCostName = {
    XZ_SALE:'销售费用',
    XZ_MANAGE:'管理费用',
    'XZ_FINANCE':'财务费用',
    'XZ_SCCB':'生产成本',
    'XZ_FZSCCB':'辅助生产成本',
    'XZ_ZZFY':'制造费用',
    'XZ_HTCB':'合同成本',
    'XZ_JJFY':'间接费用',
    'XZ_JXZY':'机械作业'
}
// 统一的项目显示方式
function Project({usedProject, projectCardList}) {
    if (usedProject && projectCardList && projectCardList.size) {
        const code = projectCardList.getIn([0,'code'])
        return projectCardList.size === 1?
        <li ><span>项目：</span><span>{`${projectCodeTest(code) ? projectCardList.getIn([0,'code']) + '_' : ''}${projectCardList.getIn([0,'name'])}`}</span></li>
        :
        <div >
            <li ><span>项目：</span><span>多项目</span></li>
            {
                projectCardList.map(v =>
                    <div key={v.get('uuid')}  className='multi-content'>
                        <li ><span><b>•</b>项目：</span><span>{`${v.get('code')}_${v.get('name')}`}</span></li>
                        <li key={v.get('uuid')}><span>金额：</span><span>{formatMoney(v.get('amount'),2,'')}</span></li>
                    </div>
                )
            }
        </div>
    } else {
        return null
    }
}

// 统一的账户显示方式
function Account({accounts}) {
    if (accounts.size) {
        return (
            <li>
                <span>账户：</span>
                <span>{accounts.getIn([0, 'accountName'])}</span>
            </li>
        )
    } else {
        return null
    }
}

// 统一的往来单位显示方式
function Relative({currentCardList}) {
    if (currentCardList.size) {
        return (
            <li>
                <span>往来单位：</span><span>
                {`${currentCardList.getIn([0, 'code'])}_${currentCardList.getIn([0, 'name'])}`}
                </span>
            </li>
        )
    } else {
        return null
    }
}


// 营业收入/支出
@immutableRenderDecorator
export class Yysz extends React.Component {
    state = {
        activeKey:'1'
    }
    render() {

        const { jrOri, category, oriState, activeKey, onChangeActiveKey, isCurrentRunning, showRelatedRunning, dispatch, enableWarehouse } = this.props

        const currentCardList = jrOri.get('currentCardList')
        const stockCardList = jrOri.get('stockCardList')
        const accounts = jrOri.get('accounts')
        const usedProject = jrOri.get('usedProject')
        const projectCardList = jrOri.get('projectCardList')
        const amount = jrOri.get('amount')
        const currentAmount = jrOri.get('currentAmount')
        const propertyCarryover = category.get('propertyCarryover')
        const oriAbstract = jrOri.get('oriAbstract')

        // 核算详情
        const stockStrongList = jrOri.get('stockStrongList')
        const strongList = jrOri.get('strongList')
        let calculationList
        let carryoverList
        // if (oriState === 'STATE_YYSR_DJ' || oriState === 'STATE_YYZC_DJ') {
            calculationList = strongList
        // } else {
            // calculationList = pendingStrongList
            carryoverList = stockStrongList
        // }

        return (
            <div>
                <ul className="ylls-item-detail">

                    <Relative
                        currentCardList={currentCardList}
                    />
                    <Project
                        usedProject={usedProject}
                        projectCardList={projectCardList}
                    />
                    {
                        (propertyCarryover === 'SX_HW' || propertyCarryover === 'SX_HW_FW') && oriState !== 'STATE_YYSR_DJ' && oriState !== 'STATE_YYZC_DJ' && stockCardList && stockCardList.size ?
                            stockCardList.size === 1?
                            <div>
                                <li ><span>存货：</span><span>{`${stockCardList.getIn([0,'code'])}_${stockCardList.getIn([0,'name'])}`}</span></li>
                                {
                                    stockCardList.getIn([0,'assistList']) && stockCardList.getIn([0,'assistList']).size?
                                    <li ><span>属性：</span><span>{stockCardList.getIn([0,'assistList']).map(v => v.get('propertyName')).join(';')}</span></li>
                                    :''
                                }
                                {
                                    stockCardList.getIn([0,'batch'])?
                                    <li ><span>批次：</span><span>{`${stockCardList.getIn([0,'batch'])}${stockCardList.getIn([0,'financialInfo','openShelfLife']) && stockCardList.getIn([0,'expirationDate']) && stockCardList.getIn([0,'expirationDate']) !== 'undefined' ? `(${stockCardList.getIn([0,'expirationDate'])})` : ''}`}</span></li>
                                    :''
                                }
                                {
                                    enableWarehouse?
                                    <li ><span>仓库：</span><span>{`${stockCardList.getIn([0,'warehouseCardCode'])}_${stockCardList.getIn([0,'warehouseCardName'])}`}</span></li>:''
                                }
                                {
                                    stockCardList.getIn([0,'isOpenedQuantity'])?
                                    <li ><span>数量：</span><span>{formatFour(stockCardList.getIn([0,'quantity']))}&nbsp;{stockCardList.getIn([0,'unitName'])}</span></li>:''
                                }
                                {
                                    stockCardList.getIn([0,'isOpenedQuantity'])?
                                    <li ><span>单价：</span><span>{formatFour(stockCardList.getIn([0,'price']))}</span></li>:''
                                }
                            </div>
                            :
                            <div >
                                <li style={{marginBottom:'10px'}}><span>存货：</span><span>多存货</span></li>
                                {
                                    stockCardList.map(v =>
                                        <div key={v.get('uuid')}  className='multi-content'>
                                            <li ><span><b>•</b>存货：</span><span>{`${v.get('code')}_${v.get('name')}`}</span></li>
                                            {
                                                enableWarehouse?
                                                <li ><span>仓库：</span><span>{`${v.get('warehouseCardCode')}_${v.get('warehouseCardName')}`}</span></li>:''
                                            }
                                            {
                                                v.get('assistList') && v.get('assistList').size?
                                                <li ><span>属性：</span><span>{v.get('assistList').map(w => w.get('propertyName')).join(';')}</span></li>
                                                :''
                                            }
                                            {
                                                 v.get('batch')?
                                                <li ><span>批次：</span><span>{`${v.get('batch')}${v.getIn(['financialInfo','openShelfLife']) && v.get('expirationDate') && v.get('expirationDate') !== 'undefined' ? `(${v.get('expirationDate')})` : ''}`}</span></li>
                                                :''
                                            }
                                            {
                                                v.get('isOpenedQuantity')?
                                                <li ><span>数量：</span><span>{formatFour(v.get('quantity'))}&nbsp;{v.get('unitName')}</span></li>:''
                                            }
                                            {
                                                v.get('isOpenedQuantity')?
                                                <li ><span>单价：</span><span>{formatFour(v.get('price'))}</span></li>:''
                                            }
                                            <li key={v.get('uuid')}><span>金额：</span><span>{formatMoney(v.get('amount'),2,'')}</span></li>
                                        </div>
                                    )
                                }
                            </div>:''
                    }
                    <li>
                        <span>
                            {projectCardList && projectCardList.size>1 || stockCardList && stockCardList.size>1 ? '总' : ''}金额：
                        </span>
                        <span>{formatMoney(amount)}</span>
                    </li>
                    {
                        accounts.size && (currentCardList.size && Number(amount) === Number(currentAmount) || !currentCardList.size || oriState === 'STATE_YYSR_DJ'|| oriState === 'STATE_YYZC_DJ') ?
                            accounts.size > 1 ?
                            <div >
                                <li style={{marginBottom:'10px'}}><span>账户：</span><span>多账户</span></li>
                                {
                                    accounts.map(v =>
                                        <div key={v.get('uuid')}  className='multi-content'>
                                            <li ><span><b>•</b>账户：</span><span>{v.get('accountName')}</span></li>
                                            <li key={v.get('uuid')}><span>金额：</span><span>{formatMoney(v.get('amount'),2,'')}</span></li>
                                        </div>
                                    )
                                }
                            </div>
                            :
                            <li>
                                <span>账户：</span>
                                <span>{accounts.getIn([0, 'accountName'])}</span>
                            </li>
                            : ''
                    }
                    {
                        oriState !== 'STATE_YYSR_DJ' && oriState !== 'STATE_YYZC_DJ'?
                        <Invoice
                            itemData={jrOri.get('billList')}
                        /> : ''
                    }

                </ul>
                {
                    (oriState === 'STATE_YYSR_XS' || oriState === 'STATE_YYSR_TS') && carryoverList && carryoverList.size ?
                    <div className="ylls-item-child-list">
                        <Collapse bordered={false} activeKey={this.state.activeKey} >
                            <Panel
                                showArrow={false}
                                header={
                                    <div className={`ylls-item-child-title ${this.state.activeKey?'':'shadow-area'}`}
                                        style={this.state.activeKey === '1'?{background:'#f6f6f6'}:{marginBottom:'15px'}}>
                                        <span>结转情况</span>
                                        {
                                            this.state.activeKey === '1'?
                                            <span
                                                onClick={() => {
                                                    this.setState({activeKey:''})
                                                }}
                                                >收起</span>
                                            :
                                            <span
                                                onClick={() => {
                                                    this.setState({activeKey:'1'})
                                                }}
                                                >展开</span>
                                        }

                                    </div>
                                }
                                key="1"
                            >
                                <ul>
                                    {
                                        carryoverList.map((v,i) =>
                                        <li className="ylls-item-child-item" key={i}>
                                            <div>
                                                <span
                                                onClick={() => {
                                                    if (isCurrentRunning && jrOri.get('jrIndex')) {
                                                        dispatch(previewRunningActions.getPreviewRelatedRunningBusinessFetch(v.get('oriUuid'),carryoverList, () => showRelatedRunning()))
                                                    }
                                                }}
                                                >流水号：<span className={isCurrentRunning ? 'ylls-item-child-item-underline' : ''}>{v.get('jrIndex')}号</span></span>
                                                <span>{v.get('oriDate')}</span>
                                            </div>
                                            <div>
                                                <span>{v.get('stockCardCode')}_{v.get('stockCardName')}</span>
                                                <span>
                                                    {
                                                        formatMoney(v.get('handleAmount'))
                                                    }
                                                </span>
                                            </div>
                                        </li> )
                                    }
                                </ul>
                            </Panel>
                        </Collapse>
                    </div>
                    : ''
                }
                <Calculation
                    title={'核销情况'}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={calculationList}
                    isCurrentRunning={isCurrentRunning}
                    showRelatedRunning={showRelatedRunning}
                    dispatch={dispatch}
                />
            </div>
        )
    }
}

//费用支出
export class Fyzc extends React.Component {
    render() {
        const { jrOri, category, oriState, activeKey, onChangeActiveKey, isCurrentRunning, showRelatedRunning, dispatch } = this.props

        const currentCardList = jrOri.get('currentCardList')
        const usedProject = jrOri.get('usedProject')
        const projectCardList = jrOri.get('projectCardList')
        const accounts = jrOri.get('accounts')
        const oriAbstract = jrOri.get('oriAbstract')
        const amount = jrOri.get('amount')
        const propertyCost = jrOri.get('propertyCost')
        const propertyCostList = category.get('propertyCostList')

        // 核算详情
        const strongList = jrOri.get('strongList')

        return(
            <div>
                <ul className="ylls-item-detail">
                    {
                        oriState !== 'STATE_FY_DJ' && propertyCostList.size > 1?
                        <li><span>费用性质：</span><span>{propertyCostName[propertyCost]}</span></li> : ''
                    }

                    <Relative
                        currentCardList={currentCardList}
                    />
                    <Project
                        usedProject={usedProject}
                        projectCardList={projectCardList}
                    />
                    <li>
                        <span>
                            {projectCardList && projectCardList.size > 1 ? '总' : ''}金额：
                        </span>
                        <span>{formatMoney(amount)}</span>
                    </li>
                    <Account
                        accounts={accounts}
                    />
                    <Invoice
                        itemData={jrOri.get('billList')}
                    />
                </ul>
                <Calculation
                    title={'核销情况'}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={strongList}
                    isCurrentRunning={isCurrentRunning}
                    showRelatedRunning={showRelatedRunning}
                    dispatch={dispatch}
                />
            </div>
        )
    }
}

//薪酬支出
export class Xczc extends React.Component {
    render() {
        const { jrOri, category, oriState, activeKey, onChangeActiveKey, isCurrentRunning, showRelatedRunning, dispatch } = this.props

        const usedProject = jrOri.get('usedProject')
        const projectCardList = jrOri.get('projectCardList')
        const accounts = jrOri.get('accounts')
        const propertyCost = jrOri.get('propertyCost')
        const propertyPay = category.get('propertyPay')
        const oriAbstract = jrOri.get('oriAbstract')
        const handleType = jrOri.get('handleType')
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

        // 核算详情
        const pendingStrongList = jrOri.get('pendingStrongList')
        const strongList = jrOri.get('strongList')
        const propertyCostList = category.get('propertyCostList')
        let calculationList
        if (oriState === 'STATE_XC_JT') {
            calculationList = strongList
        } else {
            calculationList = pendingStrongList
        }
        let totalNotHandleAmount = 0
        pendingStrongList && pendingStrongList.forEach(v => { if (v.get('beSelect')) {totalNotHandleAmount += Number(v.get('notHandleAmount')) + Number(v.get('handleAmount'))}
        })
        const amountAll = () => {
            if (oriState === 'STATE_XC_DK') {
                return (Number(personSocialSecurityAmount + personAccumulationAmount + incomeTaxAmount)).toFixed(2)
            }
        }

        return(
            <div>
                <ul className="ylls-item-detail">
                    {
                        (oriState === 'STATE_XC_JT' || ((oriState === 'STATE_XC_JN' || oriState === 'STATE_XC_FF') && (!beAccrued || beAccrued && !pendingStrongList.size))) && propertyCostList.size > 1 && propertyCost?
                        <li><span>费用性质：</span><span>{propertyCostName[propertyCost]}</span></li>
                        :''
                    }

                    <Project
                        usedProject={usedProject}
                        projectCardList={projectCardList}
                    />
                    {
                        oriState === 'STATE_XC_JT' || propertyPay === 'SX_QTXC' || propertyPay === 'SX_FLF' ?
                            <li><span>{projectCardList && projectCardList.size>1 ?'总':''}金额：</span><span>{formatMoney(amount, 2, '')}</span></li>
                        :''
                    }
                    {
                        oriState === 'STATE_XC_FF' && propertyPay === 'SX_GZXJ' ?
                        <li><span>工资薪金：</span><span>{formatMoney(amount, 2, '')}</span></li>:''
                    }
                    {
                        propertyPay === 'SX_SHBX' && oriState === 'STATE_XC_DJ' ? // 代缴
                        <li><span>代缴金额：</span><span>{formatMoney(personSocialSecurityAmount, 2, '')}</span></li>:''
                    }
                    {
                        propertyPay === 'SX_ZFGJJ' && oriState === 'STATE_XC_DJ' ? // 代缴
                        <li><span>代缴金额：</span><span>{formatMoney(personAccumulationAmount, 2, '')}</span></li>:''
                    }
                    {
                        oriState === 'STATE_XC_JN' ? // 缴纳
                        <li><span>{totalNotHandleAmount<0?'收款':'支付'}金额：</span><span>{formatMoney(amount)}</span></li>:''
                    }
                    {
                        oriState !== 'STATE_XC_JT' ?
                        <Account
                            accounts={accounts}
                        />
                        : ''
                    }
                    {
                        beAccrued && (oriState === 'STATE_XC_DK') ?
                        <div >
                            <li style={{marginBottom:'10px'}}><span>{oriState === 'STATE_XC_DK' ? '代扣款：' : '代缴款：'}</span><span>{amountAll()}</span></li>
                                {
                                    companySocialSecurityAmount ?
                                    <div  className='multi-content'>
                                    <li className='long-width'><span><b>•</b>代扣社会保险(公司部分)</span></li>
                                    <li><span>金额：</span><span>{formatMoney(companySocialSecurityAmount)}</span></li>
                                    </div>: ''
                                }
                                {
                                    companyAccumulationAmount ?
                                    <div  className='multi-content'>
                                        <li className='long-width'><span><b>•</b>代扣公积金(公司部分)</span></li>
                                        <li><span>金额：</span><span>{formatMoney(companyAccumulationAmount)}</span></li>
                                    </div>: ''
                                }
                                {
                                    personAccumulationAmount ?
                                    <div  className='multi-content'>
                                        <li className='long-width'><span><b>•</b>{oriState === 'STATE_XC_DK' ? '代扣' : '代缴'}公积金(个人部分)</span></li>
                                        <li><span>金额：</span><span>{formatMoney(personAccumulationAmount)}</span></li>
                                    </div> : ''
                                }
                                {
                                    personSocialSecurityAmount ?
                                    <div  className='multi-content'>
                                        <li className='long-width'><span><b>•</b>{oriState === 'STATE_XC_DK' ? '代扣' : '代缴'}社会保险(个人部分)</span></li>
                                        <li><span>金额：</span><span>{formatMoney(personSocialSecurityAmount)}</span></li>
                                    </div>: ''
                                }
                                {
                                    incomeTaxAmount ?
                                    <div  className='multi-content'>
                                        <li className='long-width'><span><b>•</b>{oriState === 'STATE_XC_DK' ? '代扣' : '代缴'}个人所得税</span></li>
                                        <li><span>金额：</span><span>{formatMoney(incomeTaxAmount)}</span></li>
                                    </div>: ''
                                }
                        </div>

                        : ''
                    }
                </ul>

                {/* <div className="ylls-item-child-list">
                    <Collapse bordered={false} activeKey='1' >
                        <Panel
                            showArrow={false}
                            header={
                                <div className={"ylls-item-child-title"}>
                                    <span>{`${oriState === 'STATE_XC_DK' ? '代扣款：' : '代缴款：'}${amountAll()}`}</span>
                                </div>
                            }
                            key="1"
                        >
                            <div className='ylls-item-content'>
                                {
                                    companySocialSecurityAmount ?
                                        <span>社会保险(公司部分)：{formatMoney(companySocialSecurityAmount, 2, '')}</span> : ''
                                }
                                {
                                    personSocialSecurityAmount ?
                                    <span>{oriState === 'STATE_XC_DK' ? '代扣' : '代缴'}社会保险(个人部分)：{formatMoney(personSocialSecurityAmount, 2, '')}</span> : ''
                                }
                                {
                                    companyAccumulationAmount ?
                                        <span>公积金(公司部分)：{formatMoney(companyAccumulationAmount, 2, '')}</span> : ''
                                }
                                {
                                    personAccumulationAmount ?
                                        <span>{oriState === 'STATE_XC_DK' ? '代扣' : '代缴'}公积金(个人部分)：{formatMoney(personAccumulationAmount, 2, '')}</span> : ''
                                }
                                {
                                    incomeTaxAmount ?
                                        <span>{oriState === 'STATE_XC_DK' ? '代扣' : '代缴'}个人所得税：{formatMoney(incomeTaxAmount, 2, '')}</span> : ''
                                }
                            </div>
                        </Panel>
                    </Collapse>
                </div> */}
                {/* {
                    beAccrued &&  (oriState === 'STATE_XC_JN' || oriState === 'STATE_XC_FF') && propertyPay !== 'SX_QTXC'?
                        <div className="ylls-item-child-list">
                            <Collapse bordered={false} activeKey='1' >
                                <Panel
                                    showArrow={false}
                                    header={
                                        <div className={"ylls-item-child-title"}>
                                            <span>{`实际支付金额：${oriState === 'STATE_XC_JN' ? formatMoney(amount, 2, '') : formatMoney(actualAmount, 2, '')}`}</span>
                                        </div>
                                    }
                                key="1">
                                    <div className='ylls-item-content'>
                                        {
                                            propertyPay === 'SX_SHBX' ?
                                                <span>社会保险(公司部分)：{formatMoney(companySocialSecurityAmount, 2, '')}</span> : ''
                                        }
                                        {
                                            propertyPay === 'SX_SHBX' || propertyPay === 'SX_GZXJ' ?
                                            <span>{propertyPay==='SX_SHBX'?'代缴':'代扣'}社会保险(个人部分)：{formatMoney(personSocialSecurityAmount, 2, '')}</span> : ''
                                        }
                                        {
                                            propertyPay === 'SX_ZFGJJ' ?
                                                <span>公积金(公司部分)：{formatMoney(companyAccumulationAmount, 2, '')}</span> : ''
                                        }
                                        {
                                            propertyPay === 'SX_ZFGJJ' || propertyPay === 'SX_GZXJ' ?
                                                <span>{propertyPay==='SX_ZFGJJ'?'代缴':'代扣'}公积金(个人部分)：{formatMoney(personAccumulationAmount, 2, '')}</span> : ''
                                        }
                                        {
                                            propertyPay === 'SX_GZXJ' ?
                                                <span>代扣个人所得税：{formatMoney(incomeTaxAmount, 2, '')}</span> : ''
                                        }
                                    </div>
                                </Panel>
                            </Collapse>
                        </div>:''

                    } */}
                    {/* {
                        propertyPay !== 'SX_QTXC'?
                        <Calculation
                            title={'核销情况'}
                            lsItemData={lsItemData}
                            activeKey={activeKey}
                            onChangeActiveKey={onChangeActiveKey}
                            itemList={lsItemData.get('detail')}
                        />:''
                    }

                    {
                        propertyPay === 'SX_QTXC' || runningState === 'STATE_XC_JT'?
                        <Calculation
                            title={'核销情况'}
                            lsItemData={lsItemData}
                            activeKey={activeKey}
                            onChangeActiveKey={onChangeActiveKey}
                            itemList={lsItemData.get('paymentList')}
                        />:''
                    } */}
                <Calculation
                    title={'核销情况'}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={calculationList}
                    isCurrentRunning={isCurrentRunning}
                    showRelatedRunning={showRelatedRunning}
                    dispatch={dispatch}
                />
            </div>
        )
    }
}

//税费支出
export class Sfzc extends React.Component {
    render() {
        const { jrOri, category, oriState, activeKey, onChangeActiveKey, isCurrentRunning, showRelatedRunning, dispatch } = this.props

        const offsetAmount = jrOri.get('offsetAmount')
        const amount = jrOri.get('amount')
        const usedProject = jrOri.get('usedProject')
        const projectCardList = jrOri.get('projectCardList')
        const accounts = jrOri.get('accounts')
        const oriAbstract = jrOri.get('oriAbstract')
        const propertyTax = category.get('propertyTax')

        // 核算详情
        const pendingStrongList = jrOri.get('pendingStrongList')
        const strongList = jrOri.get('strongList')
        let calculationList
        if (oriState === 'STATE_SF_JT') {
            calculationList = strongList
        } else {
            calculationList = pendingStrongList
        }

        return (
            <div>
                <ul className="ylls-item-detail">

                    <Project
                        usedProject={usedProject}
                        projectCardList={projectCardList}
                    />
                    {
                        // oriState !== 'STATE_SF_YJZZS' && oriState !== 'STATE_SF_JT' ?
                        propertyTax === 'SX_ZZS' && oriState === 'STATE_SF_JN' && offsetAmount > 0 ?
                            <li>
                                <span>预交抵扣：</span>
                                <span>{formatMoney(offsetAmount)}</span>
                            </li>
                            : ''
                    }
                    <li>
                        <span>
                            {projectCardList && projectCardList.size > 1 ? '总' : ''}金额：
                        </span>
                        <span>{formatMoney(amount, 2, '')}</span>
                    </li>
                    <Account
                        accounts={accounts}
                    />
                </ul>
                <Calculation
                    title={'核销情况'}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={calculationList}
                    isCurrentRunning={isCurrentRunning}
                    showRelatedRunning={showRelatedRunning}
                    dispatch={dispatch}
                />
            </div>
        )
    }
}

// 长期资产
export class Cqzc extends React.Component {
    render() {
        const { jrOri, category, oriState, activeKey, onChangeActiveKey, isCurrentRunning, showRelatedRunning, dispatch } = this.props

        const handleType = jrOri.get('handleType')
        const handleTypeJson = {
            'JR_HANDLE_GJ': '购进资产',
            'JR_HANDLE_CZ': '处置资产'
        }

        const currentCardList = jrOri.get('currentCardList')
        const usedProject = jrOri.get('usedProject')
        const projectCardList = jrOri.get('projectCardList')
        const accounts = jrOri.get('accounts')
        const oriAbstract = jrOri.get('oriAbstract')
        const runningStateName = runningStateType[oriState] ? runningStateType[oriState] : ''

        const carryoverStrongList = jrOri.get('carryoverStrongList')

        return (
            <div>
                <ul className="ylls-item-detail">
                    <li>
                        <span>处理类型：</span>
                        <span>
                            {handleTypeJson[handleType]}
                        </span>
                    </li>
                    <Relative
                        currentCardList={currentCardList}
                    />
                    <Project
                        usedProject={usedProject}
                        projectCardList={projectCardList}
                    />
                    <li>
                        <span>金额：</span>
                        <span>{formatMoney(jrOri.get('amount'), 2, '')}</span>
                    </li>
                    <Account
                        accounts={accounts}
                    />
                    <Invoice
                        itemData={jrOri.get('billList')}
                    />
                </ul>
                {
                    handleType === 'JR_HANDLE_CZ' && carryoverStrongList && carryoverStrongList.size ?
                    <div className="ylls-item-child-list">
                        <Collapse bordered={false} activeKey='1' >
                            <Panel
                                showArrow={false}
                                header={
                                    <div className={"ylls-item-child-title"}>
                                        <span>处置损益</span>
                                    </div>
                                }
                                key="1"
                            >
                                <ul>
                                    <li className="ylls-item-child-item" key={1}>
                                        <div>
                                            <span>{carryoverStrongList.getIn([0, 'categoryName'])}</span>
                                            <span
                                            className={isCurrentRunning ? 'ylls-item-child-item-underline' : ''}
                                            onClick={() => {
                                                if (isCurrentRunning) {
                                                    const oriUuid = carryoverStrongList.getIn([0, 'oriUuid'])
                                                    if (oriUuid) {
                                                        dispatch(previewRunningActions.getPreviewRelatedRunningBusinessFetch(oriUuid,carryoverStrongList, () => showRelatedRunning()))
                                                    }
                                                }
                                            }}
                                            >流水号：{carryoverStrongList.getIn([0, 'jrIndex'])}号</span>
                                        </div>
                                    </li>
                                </ul>
                            </Panel>
                        </Collapse>
                    </div>
                    : ''
                }
            </div>
        )
    }
}

// 营业外收支 有改动不知道对不对
export class Yywsz extends React.Component {
    render() {
        const { jrOri, category, oriState, activeKey, onChangeActiveKey, isCurrentRunning, showRelatedRunning, dispatch } = this.props

        const currentCardList = jrOri.get('currentCardList')
        const usedProject = jrOri.get('usedProject')
        const projectCardList = jrOri.get('projectCardList')
        const accounts = jrOri.get('accounts')
        const oriAbstract = jrOri.get('oriAbstract')
        const strongList = jrOri.get('strongList')
        const amount = jrOri.get('amount')

        return (
            <div>
                <ul className="ylls-item-detail">

                    <Relative
                        currentCardList={currentCardList}
                    />
                    <Project
                        usedProject={usedProject}
                        projectCardList={projectCardList}
                    />
                    <li>
                        <span>
                            {projectCardList && projectCardList.size > 1 ? '总' : ''}金额：
                        </span>
                        <span>{formatMoney(amount, 2, '')}</span>
                    </li>
                    <Account
                        accounts={accounts}
                    />
                    <Invoice
                        itemData={jrOri.get('billList')}
                    />
                </ul>
                <Calculation
                    title={'核销情况'}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={strongList}
                    isCurrentRunning={isCurrentRunning}
                    showRelatedRunning={showRelatedRunning}
                    dispatch={dispatch}
                />
            </div>
        )
    }
}

// 暂收暂付
export class Zszf extends React.Component {

    render() {

        const { jrOri, category, oriState, activeKey, onChangeActiveKey, isCurrentRunning, showRelatedRunning, dispatch } = this.props

        const usedProject = jrOri.get('usedProject')
        const projectCardList = jrOri.get('projectCardList')
        const accounts = jrOri.get('accounts')
        const oriAbstract = jrOri.get('oriAbstract')
        const amount = jrOri.get('amount')
        const currentCardList = jrOri.get('currentCardList')

        // 核算详情
        const pendingStrongList = jrOri.get('pendingStrongList')
        const strongList = jrOri.get('strongList')
        let calculationList
        if (oriState === 'STATE_ZS_SQ' || oriState === 'STATE_ZF_FC') {
            calculationList = strongList
        } else {
            calculationList = pendingStrongList
        }

        return (
            <div>
                <ul className="ylls-item-detail">

                    <Project
                        usedProject={usedProject}
                        projectCardList={projectCardList}
                    />
                    <Relative
                        currentCardList={currentCardList}
                    />
                    <li>
                        <span>
                            {projectCardList && projectCardList.size > 1 ? '总' : ''}金额：
                        </span>
                        <span>{formatMoney(amount, 2, '')}</span>
                    </li>
                    <Account
                        accounts={accounts}
                    />
                </ul>
                <Calculation
                    title={'核销情况'}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={calculationList}
                    isCurrentRunning={isCurrentRunning}
                    showRelatedRunning={showRelatedRunning}
                    dispatch={dispatch}
                />
            </div>
        )
    }
}

// 借款/投资/资本
export class JkTzZb extends React.Component {

    render() {

        const { jrOri, category, oriState, activeKey, onChangeActiveKey, isCurrentRunning, showRelatedRunning, dispatch } = this.props

        const usedProject = jrOri.get('usedProject')
        const projectCardList = jrOri.get('projectCardList')
        const accounts = jrOri.get('accounts')
        const oriAbstract = jrOri.get('oriAbstract')
        const amount = jrOri.get('amount')
        const currentCardList = jrOri.get('currentCardList')
        const runningStateName = runningStateType[oriState] ? runningStateType[oriState] : ''

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
            JR_HANDLE_ZBYJ:'资本溢价'
        }

        // 核算详情
        const pendingStrongList = jrOri.get('pendingStrongList')
        const strongList = jrOri.get('strongList')
        let calculationList
        if (handleType === 'JR_HANDLE_CHLX' || handleType === 'JR_HANDLE_LRFP' || handleType === 'JR_HANDLE_QDSY') {
            if (oriState === 'STATE_ZB_LRFP' || oriState === 'STATE_JK_JTLX' || oriState === 'STATE_TZ_JTGL' || oriState === 'STATE_TZ_JTLX') {
                calculationList = strongList
            } else {
                calculationList = pendingStrongList
            }
        } else {
            calculationList = fromJS([])
        }

        return (
            <div>
                <ul className="ylls-item-detail">
                    <li><span>处理类型：</span>
                        <span>
                            {handleTypeName[handleType]}
                        </span>
                    </li>
                    <Relative
                        currentCardList={currentCardList}
                    />
                    <Project
                        usedProject={usedProject}
                        projectCardList={projectCardList}
                    />
                    <li>
                        <span>
                            {projectCardList && projectCardList.size > 1 ? '总' : ''}金额：
                        </span>
                        <span>{formatMoney(amount, 2, '')}</span>
                    </li>
                    <Account
                        accounts={accounts}
                    />
                </ul>
                <Calculation
                    title={'核销情况'}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={calculationList}
                    isCurrentRunning={isCurrentRunning}
                    showRelatedRunning={showRelatedRunning}
                    dispatch={dispatch}
                />
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
