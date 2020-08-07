import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Collapse, Icon } from 'antd'
const Panel = Collapse.Panel
import { formatNum, formatMoney } from 'app/utils'
import { categoryTypeAll, runningStateType, categoryTypeName } from 'app/containers/components/moduleConstants/common'
import Invoice from './Invoice'
import Calculation from './Calculation'
//内部转账
export class Nbzz extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        return (
            <div>
                <ul className="ylls-item-detail">
                    <li><span>摘要：</span><span>{lsItemData.get('runningAbstract')}</span></li>
                    <li><span>金额：</span><span>{formatMoney(lsItemData.get('amount'),2,'')}</span></li>
                    <li><span>转出账户：</span><span>{lsItemData.getIn(['childList',0,'accountName'])}</span></li>
                    <li><span>转入账户：</span><span>{lsItemData.getIn(['childList',1,'accountName'])}</span></li>
                </ul>
            </div>
        )
    }
}
//折旧摊销
export class Zjtx extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        const name ={
            XZ_SALE:'销售费用',
            XZ_MANAGE:'管理费用',
            'XZ_FINANCE':'财务费用',
            '' : ''
        }[lsItemData.get('propertyCost')]
        return (
            <div>
                <ul className="ylls-item-detail">
                    <li><span>处理类别：</span><span>{lsItemData.get('categoryName')}</span></li>
                    {
                        lsItemData.get('propertyCostList') &&  lsItemData.get('propertyCostList').size > 1?
                        <li><span>费用性质：</span><span>{name}</span></li> : ''
                    }
                    <li><span>摘要：</span><span>{lsItemData.get('runningAbstract')}</span></li>
                    {
                        lsItemData.get('usedProject') ?
                        <li><span>项目：</span><span>{`${lsItemData.getIn(['projectCard',0,'code'])} ${lsItemData.getIn(['projectCard',0,'name'])}` }</span></li> : ''
                    }
                    <li><span>金额：</span><span>{formatMoney(lsItemData.get('amount'),2,'')}</span></li>
                </ul>
            </div>
        )
    }
}
//收付管理
export class Sfgl extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        const categoryTypeObj = categoryTypeAll[lsItemData.get('categoryType')]
        const accountName = lsItemData.get('accountName')
        const moedAmount = lsItemData.get('moedAmount')
        return (
            <div>
                <ul className="ylls-item-detail">
                    <li><span>往来单位：</span><span>{`${lsItemData.getIn(['usedCard','code'])}_${lsItemData.getIn(['usedCard','name'])}`}</span></li>
                    <li><span>摘要：</span><span>{lsItemData.get('runningAbstract')}</span></li>
                    <li><span>金额：</span><span>{formatMoney(lsItemData.get('amount'),2,'')}</span></li>
                    {
                        accountName?
                            <li><span>账户：</span><span>{accountName}</span></li>:''
                    }
                    {
                        moedAmount>0 ?
                            <li><span>抹零金额：</span><span>{formatMoney(moedAmount)}</span></li>:''
                    }
                </ul>
                <Calculation
                    title={'核销情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={lsItemData.get('detail')}
                />
            </div>
        )
    }
}

//货物结转成本
export class Jzcb extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        const runningState = lsItemData.get('runningState')
        const categoryTypeObj = {STATE_YYSR_JZCB:'acBusinessIncome',STATE_YYZC_JZCB:'acBusinessExpense'}[runningState]
        const stockCardList = lsItemData.getIn([categoryTypeObj,'stockCardList'])
        return (
            <div>
                <ul className="ylls-item-detail">
                    <li><span>摘要：</span><span>{lsItemData.get('runningAbstract')}</span></li>
                    {
                        stockCardList && stockCardList.size?
                         stockCardList.map(v =>
                            <div key={v.get('uuid')}>
                                <li ><span>存货：</span><span>{`${v.get('code')}_${v.get('name')}`}</span></li>
                                <li><span>成本金额：</span><span>{formatMoney(v.get('amount'),2,'')}</span></li>
                            </div>
                        ):''
                    }
                </ul>
                <Calculation
                    title={'核销情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={lsItemData.get('businessList')}
                    amountStr='amount'
                />
            </div>
        )
    }
}

//发票认证/开具发票
export class FpKr extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        const categoryTypeObj = categoryTypeAll[lsItemData.get('categoryType')]
        const stockCardList = lsItemData.getIn([categoryTypeObj,'stockCardList'])
        return (
            <div>
                <ul className="ylls-item-detail">
                    <li><span>摘要：</span><span>{lsItemData.get('runningAbstract')}</span></li>
                </ul>
                <Calculation
                    title={'核销情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={lsItemData.get('businessList')}
                    amountStr='tax'
                />
            </div>
        )
    }
}

//转出未交增值税
export class Zcwjzzs extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        const categoryTypeObj = categoryTypeAll[lsItemData.get('categoryType')]
        const stockCardList = lsItemData.getIn([categoryTypeObj,'stockCardList'])
        let outputCount = 0, outputAmount = 0, inputCount = 0, inputAmount = 0
        lsItemData.get('businessList').forEach(v => {
            if (v.get('billType') === 'bill_common') {
                outputCount = outputCount + 1
                outputAmount = outputAmount + (v.get('parentTax')?v.get('parentTax'):v.get('tax'))
            } else {
                inputCount = inputCount + 1
                inputAmount = inputAmount + (v.get('parentTax')?v.get('parentTax'):v.get('tax'))
            }
        })
        return (
            <div>
                <ul className="ylls-item-detail">
                    <li><span>摘要：</span><span>{lsItemData.get('runningAbstract')}</span></li>
                    <li><span>处理税额月份：</span><span>{lsItemData.getIn(['businessList', 0, 'runningDate']).substr(0, 7)}</span></li>
                    <li><span>未交税额：</span><span>{formatMoney(outputAmount - inputAmount,2,'')}</span></li>
                    <li><span>销项税-流水数： {outputCount}条；</span> <span>合计税额： {formatNum(outputAmount.toFixed(2))}</span></li>
                    <li><span>进项税-流水数： {inputCount}条；</span> <span>合计税额： {formatNum(inputAmount.toFixed(2))}</span></li>
                </ul>
                <Calculation
                    title={'核销情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={lsItemData.get('businessList')}
                    amountStr='parentTax'
                    amountStr2='tax'
                />
            </div>
        )
    }
}

//项目公共费用分摊
export class Xmft extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        const categoryTypeObj = categoryTypeAll[lsItemData.get('categoryType')]
        const stockCardList = lsItemData.getIn([categoryTypeObj,'stockCardList'])
        const projectCard = lsItemData.get('projectCard')
        return (
            <div>
                <ul className="ylls-item-detail">
                    <li><span>摘要：</span><span>{lsItemData.get('runningAbstract')}</span></li>
                    {
                        projectCard && projectCard.size ?
                            projectCard.map(v =>
                                <div key={v.get('uuid')}>
                                    <li><span>项目：</span><span>{`${v.get('code') !== 'COMNCRD'?v.get('code')+'_':''}${v.get('name')}`}</span></li>
                                    {
                                        projectCard.size>1?
                                            <li key={v.get('uuid')}><span>金额：</span><span>{formatMoney(v.get('amount'),2,'')}</span></li>:''
                                    }
                                </div>
                            ):''
                    }
                </ul>
                <Calculation
                    title={'核销情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={lsItemData.get('paymentList')}
                    amountStr='amount'

                />
            </div>
        )
    }
}
//处置损益
export class Jzsy extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        const categoryTypeObj = categoryTypeAll[lsItemData.get('categoryType')]
        const netProfitAmount = lsItemData.getIn([categoryTypeObj,'netProfitAmount'])
        const lossAmount = lsItemData.getIn([categoryTypeObj,'lossAmount'])
        const projectCard = lsItemData.get('projectCard')
        return (
            <div>
                <ul className="ylls-item-detail">
                <li><span>处理类别：</span><span>{lsItemData.get('categoryName')}</span></li>
                    <li><span>摘要：</span><span>{lsItemData.get('runningAbstract')}</span></li>
                    {
                        projectCard && projectCard.size ?
                            projectCard.map(v =>
                                <div key={v.get('uuid')}>
                                    <li><span>项目：</span><span>{`${v.get('code') !== 'COMNCRD'?v.get('code')+'_':''}${v.get('name')}`}</span></li>
                                </div>
                            ):''
                    }
                    <li><span>{`净${netProfitAmount>0?'收益':'损失'}金额：`}</span><span>{formatMoney(netProfitAmount>0?netProfitAmount:lossAmount)}</span></li>
                    <li><span>资产原值：</span><span>{formatMoney(lsItemData.getIn([categoryTypeObj,'originalAssetsAmount']))}</span></li>
                    <li><span>累计折旧摊销：</span><span>{formatMoney(lsItemData.getIn([categoryTypeObj,'depreciationAmount']),2)}</span></li>
                </ul>
                <Calculation
                    title={'核销情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={lsItemData.get('businessList')}
                    amountStr='amount-tax'

                />
            </div>
        )
    }
}
