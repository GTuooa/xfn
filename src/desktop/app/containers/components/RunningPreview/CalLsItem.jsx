import React, { Fragment } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Collapse, Icon } from 'antd'
const Panel = Collapse.Panel
import { formatNum, formatMoney, numberCalculate,formatFour } from 'app/utils'
import { categoryTypeAll, oriStateType, categoryTypeName, projectCodeTest } from 'app/containers/components/moduleConstants/common'
import Invoice from './Invoice'
import Calculation from './Calculation'

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
        <li ><span>项目：</span><span>{`${projectCodeTest(code)}${projectCardList.getIn([0,'name'])}`}</span></li>
        :
        <div >
            <li ><span>项目：</span><span>多项目</span></li>
            {
                projectCardList.map(v =>
                    <div key={v.get('uuid')}  className='multi-content'>
                        <li ><span><b>•</b>项目：</span><span>{projectCodeTest(v.get('code'))? `${v.get('code')}_${v.get('name')}` : v.get('name')}</span></li>
                        {
                            v.get('propertyCost') ? <li ><span>费用性质：</span><span>{propertyCostName[v.get('propertyCost')]}</span></li> : null
                        }
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
        if(accounts.size > 1){
            return (
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
            )
        }else{
            return (
                <li>
                    <span>账户：</span>
                    <span>{accounts.getIn([0, 'accountName'])}</span>
                </li>
            )
        }

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


//内部转账
export class Nbzz extends React.Component {

    render() {
        const { jrOri, category, oriState, activeKey, onChangeActiveKey } = this.props

        const oriAbstract = jrOri.get('oriAbstract')
        const amount = jrOri.get('amount')
        const accounts = jrOri.get('accounts')
        const fromAcount = accounts.find(v => v.get('accountStatus') === 'ACCOUNT_STATUS_FROM')
        const toAcount = accounts.find(v => v.get('accountStatus') === 'ACCOUNT_STATUS_TO')

        return (
            <div>
                <ul className="ylls-item-detail">
                    <li><span>金额：</span><span>{formatMoney(amount, 2, '')}</span></li>
                    <li>
                        <span>转出账户：</span><span>
                            {
                                fromAcount && fromAcount.get('accountName')
                            }
                        </span>
                    </li>
                    <li>
                        <span>转入账户：</span>
                        <span>
                            {
                                toAcount && toAcount.get('accountName')
                            }
                        </span>
                    </li>
                </ul>
            </div>
        )
    }
}
//折旧摊销
export class Zjtx extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        const projectCardList = lsItemData.get('projectCardList')
        const usedProject = lsItemData.get('usedProject')
        const propertyCostList = lsItemData.get('propertyCostList')
        const propertyCost = lsItemData.get('propertyCost')
        return (
            <div>
                <ul className="ylls-item-detail">
                    <li><span>处理类别：</span><span>{lsItemData.get('name')}</span></li>
                    {
                        propertyCostList.size > 1?
                        <li><span>费用性质：</span><span>{propertyCostName[propertyCost]}</span></li> : ''
                    }
                    {Project({usedProject, projectCardList})}
                    <li><span>金额：</span><span>{formatMoney(lsItemData.get('amount'))}</span></li>
                </ul>
            </div>
        )
    }
}
//收付管理
export class Sfgl extends React.Component {

    render() {

        const { jrOri, category, oriState, activeKey, onChangeActiveKey, isCurrentRunning, showRelatedRunning, dispatch } = this.props

        const oriAbstract = jrOri.get('oriAbstract')
        const currentCardList = jrOri.get('currentCardList')
        const amount = jrOri.get('amount')
        const accounts = jrOri.get('accounts')
        const moedAmount = jrOri.get('moedAmount')
        const jrFlowList = jrOri.get('jrFlowList')
        const direction = jrFlowList.getIn([0,'debitAmount']) > 0 ? 'debit' : 'credit'
        const relationCategoryName = jrOri.get('relationCategoryName')
        const pendingManageList = jrOri.getIn(['pendingManageDto','pendingManageList']) || []
        // const categoryTypeObj = categoryTypeAll[lsItemData.get('categoryType')]
        // const accountName = lsItemData.get('accountName')
        // const moedAmount = lsItemData.get('moedAmount')
        const dirction = pendingManageList.reduce((total,cur)=>{return total+=(cur.get('direction') === 'debit'?cur.get('amount'):-cur.get('amount'))},0)>0?'debit':'credit'
        return (
            <div>
                <ul className="ylls-item-detail">
                    {
                        currentCardList.size?
                        <li>
                            <span>往来单位：</span><span>
                            {`${currentCardList.getIn([0, 'code']) ? currentCardList.getIn([0, 'code']) + '_' : ''}${currentCardList.getIn([0, 'name'])}`}
                            </span>
                        </li>:''
                    }

                    <li>
                        <span>
                            {`${oriState === 'STATE_SFGL_ML'?
                                direction === 'debit' ? '收款抹零':'付款抹零'
                                :
                                direction === 'debit' ? '收款金额':'付款金额'}：`}
                        </span>
                        <span>{formatMoney(Math.abs(amount))}</span>
                    </li>
                    {

                    }
                    <Account
                        accounts={accounts}
                    />
                </ul>
                <Calculation
                    title={'核销情况'}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={pendingManageList}
                    isCurrentRunning={isCurrentRunning}
                    showRelatedRunning={showRelatedRunning}
                    dispatch={dispatch}
                    amountStr='handleAmount'
                />
            </div>
        )
    }
}

//货物结转成本
export class Jzcb extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey, isCurrentRunning, dispatch, showRelatedRunning, enableWarehouse, jrOri } = this.props
        const oriState = lsItemData.get('oriState')
        const categoryTypeObj = {STATE_YYSR_JZCB:'acBusinessIncome',STATE_YYZC_JZCB:'acBusinessExpense'}[oriState]
        const stockCardList = lsItemData.get('stockCardList')
        const relationCategoryName = lsItemData.get('relationCategoryName')
        const usedProject = lsItemData.get('usedProject')
        const projectCardList = lsItemData.get('projectCardList')
        const propertyCostList = jrOri.get('propertyCostList')
        const propertyCost = jrOri.get('propertyCost')
        // const amount = jrOri.get('amount')
        let amount = 0
        return (
            <div>
                <ul className="ylls-item-detail">
                    {
                        oriState === 'STATE_YYSR_ZJ' ?
                        <li><span>处理类别：</span><span>{relationCategoryName}</span></li> : null
                    }
                    {
                        propertyCostList ? propertyCostList.size > 1 && propertyCost ?
                        <li><span>费用性质：</span><span>{propertyCostName[propertyCost]}</span></li> : '' : ''
                    }

                    {Project({usedProject, projectCardList})}
                    {
                        stockCardList && stockCardList.size?
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
                                enableWarehouse && oriState === 'STATE_YYSR_ZJ'?
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
                            <li><span>成本金额：</span><span>{formatMoney(stockCardList.getIn([0,'amount']))}</span></li>
                        </div> :
                        <Fragment>
                            <li style={{marginBottom:'10px'}}><span>存货：</span><span>多存货</span></li>
                            <div>
                                {
                                    stockCardList.map(v => {
                                        amount = numberCalculate(amount,v.get('amount'))
                                        return <div key={v.get('uuid')} className='multi-content'>
                                            <li ><span><b>•</b>存货：</span><span>{`${v.get('code')}_${v.get('name')}`}</span></li>
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
                                                enableWarehouse && oriState === 'STATE_YYSR_ZJ'?
                                                <li ><span>仓库：</span><span>{`${v.get('warehouseCardCode')}_${v.get('warehouseCardName')}`}</span></li>:''
                                            }
                                            {
                                                v.get('isOpenedQuantity')?
                                                <li ><span>数量：</span><span>{formatFour(v.get('quantity'))}&nbsp;{v.get('unitName')}</span></li>:''
                                            }
                                            {
                                                v.get('isOpenedQuantity')?
                                                <li ><span>单价：</span><span>{formatFour(v.get('price'))}</span></li>:''
                                            }
                                            <li><span>成本金额：</span><span>{formatMoney(v.get('amount'))}</span></li>
                                        </div>
                                    }


                                    )
                                }
                            </div>
                            <li><span>总金额：</span><span>{formatMoney(amount, 2, '')}</span></li>
                        </Fragment> :''
                    }
                </ul>
                <Calculation
                    title={'结转情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    // itemList={lsItemData.get('ca')}
                    itemList={lsItemData.get('stockWeakList')}
                    amountStr='amount'
                    isCurrentRunning={isCurrentRunning}
                    dispatch={dispatch}
                    showRelatedRunning={showRelatedRunning}
                />
            </div>
        )
    }
}

//发票认证/开具发票
export class FpKr extends React.Component {
    render() {
        const { jrOri, category, oriState, activeKey, onChangeActiveKey, isCurrentRunning, dispatch, showRelatedRunning } = this.props
        const categoryTypeObj = categoryTypeAll[category.get('categoryType')]
        const stockCardList = jrOri.getIn([categoryTypeObj,'stockCardList'])
        return (
            <div>
                <ul className="ylls-item-detail">
                </ul>
                <ul className="ylls-item-detail">
                    <li><span>{
                        {
                            STATE_KJFP_TS:'对冲',
                            STATE_KJFP_XS:'开票',
                            STATE_FPRZ_CG:'认证',
                            STATE_FPRZ_TG:'对冲'
                        }[oriState]}税额：</span><span>{formatMoney(Math.abs(jrOri.get('amount')))}</span></li>
                </ul>

                <Calculation
                    title={'核销情况'}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={jrOri.get('pendingStrongList')}
                    isCurrentRunning={isCurrentRunning}
                    amountStr='taxAmount'
                    dispatch={dispatch}
                    showRelatedRunning={showRelatedRunning}
                />
            </div>
        )
    }
}

//转出未交增值税
export class Zcwjzzs extends React.Component {
    render() {
        const { oriState, activeKey, onChangeActiveKey, lsItemData, isCurrentRunning, dispatch, showRelatedRunning } = this.props
        const categoryTypeObj = categoryTypeAll[lsItemData.get('categoryType')]
        const stockCardList = lsItemData.getIn([categoryTypeObj,'stockCardList'])
        let outputCount = 0, outputAmount = 0, inputCount = 0, inputAmount = 0
        lsItemData.get('pendingStrongList').forEach(v => {
            if (v.get('pendingStrongType') === 'JR_STRONG_STAY_ZCXX') {
                outputCount = outputCount + 1
                outputAmount = outputAmount + v.get('handleAmount')
            } else {
                inputCount = inputCount + 1
                inputAmount = inputAmount + v.get('handleAmount')
            }
        })
        return (
            <div>
                <ul className="ylls-item-detail">

                    <li><span>处理税额月份：</span><span>{lsItemData.get('oriDate').substr(0, 7)}</span></li>
                    <li><span>销项税额：</span><span>{formatMoney(outputAmount)}</span></li>
                    <li><span>进项税额：</span><span>{formatMoney(inputAmount)}</span></li>
                    <li><span>转出税额：</span><span>{formatMoney(outputAmount - inputAmount)}</span></li>
                </ul>
                <Calculation
                    title={'核销情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={lsItemData.get('pendingStrongList')}
                    isCurrentRunning={isCurrentRunning}
                    amountStr='handleAmount'
                    dispatch={dispatch}
                    showRelatedRunning={showRelatedRunning}
                />
            </div>
        )
    }
}

//项目公共费用分摊
export class Xmft extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey, isCurrentRunning, dispatch, showRelatedRunning } = this.props
        const categoryTypeObj = categoryTypeAll[lsItemData.get('categoryType')]
        const projectCardList = lsItemData.get('projectCardList')
        const usedProject = lsItemData.get('usedProject')
        const jrFlowList = lsItemData.get('jrFlowList')
        const amount = lsItemData.get('amount')
        return (
            <div>
                <ul className="ylls-item-detail">
                    {Project({usedProject, projectCardList})}
                    <li><span>{projectCardList && projectCardList.size > 1 ? '总' : ''}金额：</span><span>{formatMoney(amount)}</span></li>
                </ul>
                <Calculation
                    title={'核销情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={lsItemData.get('pendingProjectShareList')}
                    isCurrentRunning={isCurrentRunning}
                    amountStr='amount'
                    dispatch={dispatch}
                    showRelatedRunning={showRelatedRunning}

                />
            </div>
        )
    }
}
//处置损益
export class Jzsy extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey, isCurrentRunning, dispatch, showRelatedRunning } = this.props
        const categoryTypeObj = categoryTypeAll[lsItemData.get('categoryType')]
        const projectCardList = lsItemData.get('projectCardList')
        const amount = lsItemData.get('amount')
        const usedProject = lsItemData.get('usedProject')
        return (
            <div>
                <ul className="ylls-item-detail">
                    <li><span>处理类别：</span><span>{lsItemData.get('name')}</span></li>
                    {Project({usedProject, projectCardList})}
                    <li><span>{`${amount>0?'收益':'损失'}金额：`}</span><span>{formatMoney(Math.abs(lsItemData.get('amount')))}</span></li>
                    <div className='multi-content'>
                        <li><span><b>•</b>处置收入</span></li>
                        <li><span>金额：</span><span>{formatMoney(lsItemData.getIn(['assets','cleaningAmount']))}</span></li>
                        <li><span><b>•</b>累计折旧</span></li>
                        <li><span>金额：</span><span>{formatMoney(lsItemData.getIn(['assets','depreciationAmount']))}</span></li>
                        <li><span><b>•</b>资产原值</span></li>
                        <li><span>金额：</span><span>{formatMoney(lsItemData.getIn(['assets','originalAssetsAmount']))}</span></li>
                    </div>
                </ul>
                <Calculation
                    title={'核销情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={lsItemData.get('pendingStrongList')}
                    isCurrentRunning={isCurrentRunning}
                    amountStr='amount'
                    dispatch={dispatch}
                    showRelatedRunning={showRelatedRunning}

                />
            </div>
        )
    }
}
// 存货调拨
export class Chdb extends React.Component {

    render() {
        const { jrOri, oriState, lsItemData } = this.props

        const amount = jrOri.get('amount')
        const warehouseCardList = jrOri.get('warehouseCardList')
        const fromWarehouseCard = warehouseCardList.find(v => v.get('warehouseStatus') === 'WAREHOUSE_STATUS_FROM')
        const toWarehouseCard = warehouseCardList.find(v => v.get('warehouseStatus') === 'WAREHOUSE_STATUS_TO')
        const stockCardList = lsItemData.get('stockCardList')

        return (
            <div>
                <ul className="ylls-item-detail">
                    <li>
                        <span>调出仓库：</span><span>
                            {
                                fromWarehouseCard && `${fromWarehouseCard.get('code')} ${fromWarehouseCard.get('name')}`
                            }
                        </span>
                    </li>
                    <li>
                        <span>调入仓库：</span>
                        <span>
                            {
                                toWarehouseCard && `${toWarehouseCard.get('code')} ${toWarehouseCard.get('name')}`
                            }
                        </span>
                    </li>
                    {
                        stockCardList && stockCardList.size?
                        stockCardList.size === 1 ?
                        <div>
                            <li><span>存货：</span><span>{`${stockCardList.getIn([0,'code'])}_${stockCardList.getIn([0,'name'])}`}</span></li>
                            {
                                stockCardList.getIn([0,'isOpenedQuantity']) ?
                                <Fragment>
                                    <li ><span>数量：</span><span>{`${formatFour(stockCardList.getIn([0,'quantity']))} ${stockCardList.getIn([0,'unitName'])}`}</span></li>
                                    <li ><span>单价：</span><span>{`${formatFour(stockCardList.getIn([0,'price']))}`}</span></li>
                                </Fragment> : null
                            }
                            <li><span>成本金额：</span><span>{formatMoney(stockCardList.getIn([0,'amount']))}</span></li>
                        </div> :
                        <div>
                            <li style={{marginBottom:'10px'}}> <span>存货：</span> <span>多存货</span> </li>
                            {
                                 stockCardList.map(v =>
                                    <div key={v.get('uuid')} className='multi-content'>
                                        <li ><span><b>•</b>存货：</span><span>{`${v.get('code')}_${v.get('name')}`}</span></li>
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
                                            v.get('isOpenedQuantity') ?
                                            <Fragment>
                                                <li ><span>数量：</span><span>{`${formatFour(v.get('quantity'))} ${v.get('unitName')}`}</span></li>
                                                <li ><span>单价：</span><span>{`${formatFour(v.get('price'))}`}</span></li>
                                            </Fragment> : null
                                        }
                                        <li><span>成本金额：</span><span>{formatMoney(v.get('amount'))}</span></li>
                                    </div>
                                )
                            }

                        </div>:''
                    }
                    {
                        stockCardList.size > 1 ?
                        <li><span>总金额：</span><span>{formatMoney(amount, 2, '')}</span></li> : null
                    }



                </ul>
            </div>
        )
    }
}
//余额调整
export class Chyetz extends React.Component {

    render() {
        const { jrOri, oriState, lsItemData,enableWarehouse } = this.props

        const amount = jrOri.get('amount')
        const warehouseCardList = jrOri.get('warehouseCardList')
        const stockCardList = jrOri.get('stockCardList')
        const jrState = lsItemData.get('jrState')

        return (
            <div>
                <ul className="ylls-item-detail">

                {
                    stockCardList && stockCardList.size?
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
                            enableWarehouse ?
                            <li ><span>仓库：</span><span>{`${stockCardList.getIn([0,'warehouseCardCode'])}_${stockCardList.getIn([0,'warehouseCardName'])}`}</span></li>:''
                        }
                        {
                            stockCardList.getIn([0,'isOpenedQuantity'])?
                            <li ><span>数量：</span><span>{formatFour(stockCardList.getIn([0,'quantity']))}&nbsp;{stockCardList.getIn([0,'unitName'])}</span></li>:''
                        }
                        {
                            stockCardList.getIn([0,'isOpenedQuantity']) && jrState === 'STATE_CHYE_CK' ?
                            <li ><span>单价：</span><span>{formatFour(stockCardList.getIn([0,'price'])? stockCardList.getIn([0,'price']) : 0)}</span></li>:''
                        }
                        <li><span>成本金额：</span><span>{formatMoney(stockCardList.getIn([0,'amount']))}</span></li>
                    </div> :
                    <Fragment>
                        <li style={{marginBottom:'10px'}}><span>存货：</span><span>多存货</span></li>
                        <div>
                            {
                                stockCardList.map(v =>
                                   <div key={v.get('uuid')} className='multi-content'>
                                       <li ><span><b>•</b>存货：</span><span>{`${v.get('code')}_${v.get('name')}`}</span></li>
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
                                           enableWarehouse ?
                                           <li ><span>仓库：</span><span>{`${v.get('warehouseCardCode')}_${v.get('warehouseCardName')}`}</span></li>:''
                                       }
                                       {
                                           v.get('isOpenedQuantity')?
                                           <li ><span>数量：</span><span>{formatFour(v.get('quantity'))}&nbsp;{v.get('unitName')}</span></li>:''
                                       }
                                       {
                                           v.get('isOpenedQuantity') && jrState === 'STATE_CHYE_CK'?
                                           <li ><span>单价：</span><span>{formatFour(v.get('price')?v.get('price'):0)}</span></li>:''
                                       }
                                       <li><span>成本金额：</span><span>{formatMoney(v.get('amount'))}</span></li>
                                   </div>
                                )
                            }
                        </div>
                        <li><span>总金额：</span><span>{formatMoney(amount, 2, '')}</span></li>
                    </Fragment> :''
                }
                    {
                        warehouseCardList && warehouseCardList.size > 1 || stockCardList && stockCardList.size > 1 ?
                        <li><span>总金额：</span><span>{formatMoney(amount, 2, '')}</span></li> : null
                    }

                </ul>
            </div>
        )
    }
}

//进项税额转出
export class Jxsezc extends React.Component {
    render() {
        const { jrOri, category, lsItemData, enableWarehouse } = this.props

        const stockCardList = lsItemData.get('stockCardList')
        const relationCategoryName = lsItemData.get('relationCategoryName')
        const usedProject = lsItemData.get('usedProject')
        const projectCardList = lsItemData.get('projectCardList')
        const propertyCostList = category.get('propertyCostList')
        const propertyCost = jrOri.get('propertyCost')
        const amount = jrOri.get('amount')
        return (
            <div>
                <ul className="ylls-item-detail">
                    <li><span>处理类别：</span><span>{relationCategoryName}</span></li>
                    {
                        propertyCostList.size > 1 && propertyCost ?
                        <li><span>费用性质：</span><span>{propertyCostName[propertyCost]}</span></li> : ''
                    }
                    {Project({usedProject, projectCardList})}
                    {
                        stockCardList && stockCardList.size?
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
                                enableWarehouse ?
                                <li ><span>仓库：</span><span>{`${stockCardList.getIn([0,'warehouseCardCode'])}_${stockCardList.getIn([0,'warehouseCardName'])}`}</span></li>:''
                            }
                            <li><span>税额：</span><span>{formatMoney(stockCardList.getIn([0,'amount']))}</span></li>
                        </div> :
                        <Fragment>
                            <li style={{marginBottom:'10px'}}><span>存货：</span><span>多存货</span></li>
                            <div>
                                {
                                    stockCardList.map(v =>
                                       <div key={v.get('uuid')} className='multi-content'>
                                           <li ><span><b>•</b>存货：</span><span>{`${v.get('code')}_${v.get('name')}`}</span></li>
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
                                               enableWarehouse ?
                                               <li ><span>仓库：</span><span>{`${v.get('warehouseCardCode')}_${v.get('warehouseCardName')}`}</span></li>:''
                                           }
                                           <li><span>税额：</span><span>{formatMoney(v.get('amount'))}</span></li>
                                       </div>
                                    )
                                }
                            </div>
                            <li><span>总税额：</span><span>{formatMoney(amount, 2, '')}</span></li>
                        </Fragment> :
                        <li><span>税额：</span><span>{formatMoney(amount, 2, '')}</span></li>
                    }
                </ul>
            </div>
        )
    }
}
//存货组装拆卸
export class Chzzcx extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey, isCurrentRunning, dispatch, showRelatedRunning, enableWarehouse, jrOri } = this.props
        const oriState = lsItemData.get('oriState')
        const stockCardList = lsItemData.get('stockCardList')
        const stockCardOtherList = lsItemData.get('stockCardOtherList')
        const relationCategoryName = lsItemData.get('relationCategoryName')
        const usedProject = lsItemData.get('usedProject')
        const projectCardList = lsItemData.get('projectCardList')
        const amount = jrOri.get('amount')
        return (
            <div>
                {
                    oriState === 'STATE_CHZZ_ZZCX' ?
                    <ul className="ylls-item-detail">
                        {
                            stockCardList && stockCardList.size?
                            stockCardList.size === 1?
                            <div>
                                <li ><span>物料：</span><span>{`${stockCardList.getIn([0,'code'])}_${stockCardList.getIn([0,'name'])}`}</span></li>
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
                                    enableWarehouse ?
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
                                <li><span>金额：</span><span>{formatMoney(stockCardList.getIn([0,'amount']))}</span></li>
                            </div> :
                            <Fragment>
                                <li style={{marginBottom:'10px'}}><span>物料：</span><span>多物料</span></li>
                                <div>
                                    {
                                        stockCardList.map(v =>
                                           <div key={v.get('uuid')} className='multi-content'>
                                               <li ><span><b>•</b>物料：</span><span>{`${v.get('code')}_${v.get('name')}`}</span></li>
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
                                                   enableWarehouse ?
                                                   <li ><span>仓库：</span><span>{`${v.get('warehouseCardCode')}_${v.get('warehouseCardName')}`}</span></li>:''
                                               }
                                               {
                                                   v.get('isOpenedQuantity')?
                                                   <li ><span>数量：</span><span>{formatFour(v.get('quantity'))}&nbsp;{v.get('unitName')}</span></li>:''
                                               }
                                               {
                                                   v.get('isOpenedQuantity')?
                                                   <li ><span>单价：</span><span>{formatFour(v.get('price'))}</span></li>:''
                                               }
                                               <li><span>金额：</span><span>{formatMoney(v.get('amount'))}</span></li>
                                           </div>
                                        )
                                    }
                                </div>
                                <li><span>总金额：</span><span>{formatMoney(amount, 2, '')}</span></li>
                            </Fragment> :''
                        }
                        {
                            stockCardOtherList && stockCardOtherList.size?
                            stockCardOtherList.size === 1?
                            <div>
                                <li ><span>成品：</span><span>{`${stockCardOtherList.getIn([0,'code'])}_${stockCardOtherList.getIn([0,'name'])}`}</span></li>
                                {
                                    stockCardOtherList.getIn([0,'assistList']) && stockCardOtherList.getIn([0,'assistList']).size?
                                    <li ><span>属性：</span><span>{stockCardOtherList.getIn([0,'assistList']).map(v => v.get('propertyName')).join(';')}</span></li>
                                    :''
                                }
                                {
                                    stockCardOtherList.getIn([0,'batch'])?
                                    <li ><span>批次：</span><span>{stockCardOtherList.getIn([0,'batch'])}</span></li>
                                    :''
                                }
                                {
                                    enableWarehouse ?
                                    <li ><span>仓库：</span><span>{`${stockCardOtherList.getIn([0,'warehouseCardCode'])}_${stockCardOtherList.getIn([0,'warehouseCardName'])}`}</span></li>:''
                                }
                                {
                                    stockCardOtherList.getIn([0,'isOpenedQuantity'])?
                                    <li ><span>数量：</span><span>{formatFour(stockCardOtherList.getIn([0,'quantity']))}&nbsp;{stockCardOtherList.getIn([0,'unitName'])}</span></li>:''
                                }
                                {
                                    stockCardOtherList.getIn([0,'isOpenedQuantity'])?
                                    <li ><span>单价：</span><span>{formatFour(stockCardOtherList.getIn([0,'price']))}</span></li>:''
                                }
                                <li><span>金额：</span><span>{formatMoney(stockCardOtherList.getIn([0,'amount']))}</span></li>
                            </div> :
                            <Fragment>
                                <li style={{marginBottom:'10px'}}><span>成品：</span><span>多成品</span></li>
                                <div>
                                    {
                                        stockCardOtherList.map(v =>
                                           <div key={v.get('uuid')} className='multi-content'>
                                               <li ><span><b>•</b>成品：</span><span>{`${v.get('code')}_${v.get('name')}`}</span></li>
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
                                                   enableWarehouse ?
                                                   <li ><span>仓库：</span><span>{`${v.get('warehouseCardCode')}_${v.get('warehouseCardName')}`}</span></li>:''
                                               }
                                               {
                                                   v.get('isOpenedQuantity')?
                                                   <li ><span>数量：</span><span>{formatFour(v.get('quantity'))}&nbsp;{v.get('unitName')}</span></li>:''
                                               }
                                               {
                                                   v.get('isOpenedQuantity')?
                                                   <li ><span>单价：</span><span>{formatFour(v.get('price'))}</span></li>:''
                                               }
                                               <li><span>金额：</span><span>{formatMoney(v.get('amount'))}</span></li>
                                           </div>
                                        )
                                    }
                                </div>
                                <li><span>总金额：</span><span>{formatMoney(amount, 2, '')}</span></li>
                            </Fragment> :''
                        }
                    </ul> :
                    <ul className="ylls-item-detail">
                    {
                        stockCardList && stockCardList.size?
                        stockCardList.map( (item,i) =>
                            <Fragment>
                                <div>
                                    <li ><span>成品：</span><span>{`${item.get('code')}_${item.get('name')}`}</span></li>
                                    {
                                        enableWarehouse ?
                                        <li ><span>仓库：</span><span>{`${item.get('warehouseCardCode')}_${item.get('warehouseCardName')}`}</span></li>:''
                                    }
                                    {
                                        item.get('isOpenedQuantity')?
                                        <li ><span>数量：</span><span>{formatFour(item.get('quantity'))}&nbsp;{item.get('unitName')}</span></li>:''
                                    }
                                    {
                                        item.get('isOpenedQuantity')?
                                        <li ><span>单价：</span><span>{formatFour(item.get('price'))}</span></li>:''
                                    }
                                    <li><span>金额：</span><span>{formatMoney(item.get('amount'))}</span></li>
                                </div>
                                {
                                    item.get('childCardList') && item.get('childCardList').size === 1?
                                    <div>
                                        <li ><span>物料：</span><span>{`${item.getIn(['childCardList',0,'code'])}_${item.getIn(['childCardList',0,'name'])}`}</span></li>
                                        {
                                            enableWarehouse ?
                                            <li ><span>仓库：</span><span>{`${item.getIn(['childCardList',0,'warehouseCardCode'])}_${item.getIn(['childCardList',0,'warehouseCardName'])}`}</span></li>:''
                                        }
                                        {
                                            item.getIn(['childCardList',0,'isOpenedQuantity'])?
                                            <li ><span>数量：</span><span>{formatFour(item.getIn(['childCardList',0,'quantity']))}&nbsp;{item.getIn(['childCardList',0,'unitName'])}</span></li>:''
                                        }
                                        {
                                            item.getIn(['childCardList',0,'isOpenedQuantity'])?
                                            <li ><span>单价：</span><span>{formatFour(item.getIn(['childCardList',0,'price']))}</span></li>:''
                                        }
                                        <li><span>金额：</span><span>{formatMoney(item.getIn(['childCardList',0,'amount']))}</span></li>
                                    </div> :
                                    <Fragment>
                                        <li style={{marginBottom:'10px'}}><span>物料：</span><span>多物料</span></li>
                                        <div>
                                            {
                                                item.get('childCardList').map(v =>
                                                   <div key={v.get('uuid')} className='multi-content'>
                                                       <li ><span><b>•</b>物料：</span><span>{`${v.get('code')}_${v.get('name')}`}</span></li>
                                                       {
                                                           enableWarehouse ?
                                                           <li ><span>仓库：</span><span>{`${v.get('warehouseCardCode')}_${v.get('warehouseCardName')}`}</span></li>:''
                                                       }
                                                       {
                                                           v.get('isOpenedQuantity')?
                                                           <li ><span>数量：</span><span>{formatFour(v.get('quantity'))}&nbsp;{v.get('unitName')}</span></li>:''
                                                       }
                                                       {
                                                           v.get('isOpenedQuantity')?
                                                           <li ><span>单价：</span><span>{formatFour(v.get('price'))}</span></li>:''
                                                       }
                                                       <li><span>金额：</span><span>{formatMoney(v.get('amount'))}</span></li>
                                                   </div>
                                                )
                                            }
                                        </div>
                                    </Fragment>

                                }
                            </Fragment>

                    ) : ''
                    }
                        <li><span>总金额：</span><span>{formatMoney(amount, 2, '')}</span></li>
                    </ul>

                }

                <Calculation
                    title={'结转情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    // itemList={lsItemData.get('ca')}
                    itemList={lsItemData.get('stockWeakList')}
                    amountStr='amount'
                    isCurrentRunning={isCurrentRunning}
                    dispatch={dispatch}
                    showRelatedRunning={showRelatedRunning}
                />
            </div>
        )
    }
}
//存货投入项目
export class Chtrxm extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey, isCurrentRunning, dispatch, showRelatedRunning, enableWarehouse, jrOri } = this.props
        const oriState = lsItemData.get('oriState')
        const stockCardList = lsItemData.get('stockCardList')
        const stockCardOtherList = lsItemData.get('stockCardOtherList')
        const relationCategoryName = lsItemData.get('relationCategoryName')
        const usedProject = lsItemData.get('usedProject')
        const projectCardList = lsItemData.get('projectCardList')
        const amount = jrOri.get('amount')
        return (
            <div>
                <ul className="ylls-item-detail">
                    {Project({usedProject, projectCardList})}
                    {
                        stockCardList && stockCardList.size?
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
                                enableWarehouse ?
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
                            <li><span>金额：</span><span>{formatMoney(stockCardList.getIn([0,'amount']))}</span></li>
                        </div> :
                        <Fragment>
                            <li style={{marginBottom:'10px'}}><span>存货：</span><span>多存货</span></li>
                            <div>
                                {
                                    stockCardList.map(v =>
                                       <div key={v.get('uuid')} className='multi-content'>
                                           <li ><span><b>•</b>存货：</span><span>{`${v.get('code')}_${v.get('name')}`}</span></li>
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
                                               enableWarehouse ?
                                               <li ><span>仓库：</span><span>{`${v.get('warehouseCardCode')}_${v.get('warehouseCardName')}`}</span></li>:''
                                           }
                                           {
                                               v.get('isOpenedQuantity')?
                                               <li ><span>数量：</span><span>{formatFour(v.get('quantity'))}&nbsp;{v.get('unitName')}</span></li>:''
                                           }
                                           {
                                               v.get('isOpenedQuantity')?
                                               <li ><span>单价：</span><span>{formatFour(v.get('price'))}</span></li>:''
                                           }
                                           <li><span>金额：</span><span>{formatMoney(v.get('amount'))}</span></li>
                                       </div>
                                    )
                                }
                            </div>
                            <li><span>总金额：</span><span>{formatMoney(amount, 2, '')}</span></li>
                        </Fragment> :''
                    }
                </ul>
                <Calculation
                    title={'结转情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    // itemList={lsItemData.get('ca')}
                    itemList={lsItemData.get('stockWeakList')}
                    amountStr='amount'
                    isCurrentRunning={isCurrentRunning}
                    dispatch={dispatch}
                    showRelatedRunning={showRelatedRunning}
                />
            </div>
        )
    }
}
//项目结转
export class Xmjz extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey, isCurrentRunning, dispatch, showRelatedRunning, enableWarehouse, jrOri } = this.props
        const oriState = lsItemData.get('oriState')
        const stockCardList = lsItemData.get('stockCardList')
        const stockCardOtherList = lsItemData.get('stockCardOtherList')
        const relationCategoryName = lsItemData.get('relationCategoryName')
        const usedProject = lsItemData.get('usedProject')
        const projectCardList = lsItemData.get('projectCardList')
        const amount = jrOri.get('amount')
        const currentAmount = jrOri.get('currentAmount')
        return (
            <div>
                <ul className="ylls-item-detail">
                    {Project({usedProject, projectCardList})}
                    {
                        stockCardList && stockCardList.size?
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
                                enableWarehouse ?
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
                            <li><span>金额：</span><span>{formatMoney(stockCardList.getIn([0,'amount']))}</span></li>
                        </div> :
                        <Fragment>
                            <li style={{marginBottom:'10px'}}><span>存货：</span><span>多存货</span></li>
                            <div>
                                {
                                    stockCardList.map(v =>
                                       <div key={v.get('uuid')} className='multi-content'>
                                           <li ><span><b>•</b>存货：</span><span>{`${v.get('code')}_${v.get('name')}`}</span></li>
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
                                               enableWarehouse ?
                                               <li ><span>仓库：</span><span>{`${v.get('warehouseCardCode')}_${v.get('warehouseCardName')}`}</span></li>:''
                                           }
                                           {
                                               v.get('isOpenedQuantity')?
                                               <li ><span>数量：</span><span>{formatFour(v.get('quantity'))}&nbsp;{v.get('unitName')}</span></li>:''
                                           }
                                           {
                                               v.get('isOpenedQuantity')?
                                               <li ><span>单价：</span><span>{formatFour(v.get('price'))}</span></li>:''
                                           }
                                           <li><span>金额：</span><span>{formatMoney(v.get('amount'))}</span></li>
                                       </div>
                                    )
                                }
                            </div>
                            <li><span>总金额：</span><span>{formatMoney(amount, 2, '')}</span></li>
                        </Fragment> :''
                    }
                    {
                        oriState === 'STATE_XMJZ_QRSRCB' ?
                        <li>
                            <span> 收入金额： </span>
                            <span>{formatMoney(Math.abs(amount))}</span>
                        </li> : null
                    }
                    {
                        oriState === 'STATE_XMJZ_QRSRCB'?
                        <li>
                            <span> 成本金额： </span>
                            <span>{formatMoney(Math.abs(currentAmount))}</span>
                        </li> : null
                    }
                </ul>
                <Calculation
                    title={'结转情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    // itemList={lsItemData.get('ca')}
                    itemList={lsItemData.get('stockWeakList')}
                    amountStr='amount'
                    isCurrentRunning={isCurrentRunning}
                    dispatch={dispatch}
                    showRelatedRunning={showRelatedRunning}
                />
            </div>
        )
    }
}
//结账结转损益
export class Jzjzsy extends React.Component {
    render() {
        const { jrOri } = this.props
        const amount = jrOri.get('amount')
        const oriState = jrOri.get('oriState')
        const amountName = {
            'STATE_SYJZ_JZSR':'收入',
            'STATE_SYJZ_JZCBFY':'成本费用',
            'STATE_SYJZ_JZBNLR':'本年利润',
            '':'金额'
        }[oriState]
        return (
            <div>
            <ul className="ylls-item-detail">
                <li><span>{amountName}：</span><span>{formatMoney(amount, 2, '')}</span></li>
            </ul>
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
