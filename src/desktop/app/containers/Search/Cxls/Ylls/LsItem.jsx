import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Collapse, Icon } from 'antd'
const Panel = Collapse.Panel
import { formatNum, formatMoney } from 'app/utils'
import { categoryTypeAll, runningStateType, categoryTypeName } from 'app/containers/components/moduleConstants/common'
import Invoice from './Invoice'
import Calculation from './Calculation'
// 营业收入/支出
@immutableRenderDecorator
export class Yysz extends React.Component {

    render() {

        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        const categoryTypeObj = categoryTypeAll[lsItemData.get('categoryType')]
        const beManagemented = lsItemData.getIn([categoryTypeObj,'beManagemented'])
        const stockCardList = lsItemData.getIn([categoryTypeObj,'stockCardList'])
        const runningState = lsItemData.get('runningState')
        const accountName = lsItemData.get('accountName')
        const usedProject = lsItemData.get('usedProject')
        const projectCard = lsItemData.get('projectCard')
        const amount = lsItemData.get('amount')
        const propertyCarryover = lsItemData.get('propertyCarryover')

        return (
            <div>
                <ul className="ylls-item-detail">
                    <li><span>摘要：</span><span>{lsItemData.get('runningAbstract')}</span></li>
                    {
                        beManagemented?
                            <li><span>往来单位：</span><span>{`${lsItemData.getIn(['usedCard','code'])}_${lsItemData.getIn(['usedCard','name'])}`}</span></li>:''
                    }
                    {
                        usedProject && projectCard && projectCard.size ?
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
                    {
                        propertyCarryover === 'SX_HW' && runningState !== 'STATE_YYSR_DJ' && runningState !== 'STATE_YYZC_DJ' && stockCardList && stockCardList.size ?
                            stockCardList.map(v =>
                                <div key={v.get('uuid')}>
                                    <li ><span>存货：</span><span>{`${v.get('code')}_${v.get('name')}`}</span></li>
                                    {
                                        stockCardList.size>1?
                                            <li key={v.get('uuid')}><span>金额：</span><span>{formatMoney(v.get('amount'),2,'')}</span></li>:''
                                    }
                                </div>
                            ):''
                    }
                    <li><span>{projectCard && projectCard.size>1 || stockCardList && stockCardList.size>1?'总':''}金额：</span><span>{formatMoney(lsItemData.get('amount'),2,'')}</span></li>
                    {
                        accountName && (beManagemented && Number(amount) === Number(lsItemData.get('currentAmount')) || !beManagemented || runningState === 'STATE_YYSR_DJ'|| runningState === 'STATE_YYZC_DJ')?
                            <li><span>账户：</span><span>{lsItemData.get('accountName')}</span></li>:''
                    }
                    {
                        runningState !== 'STATE_YYSR_DJ' && runningState !== 'STATE_YYZC_DJ'?
                        <Invoice
                            itemData={lsItemData}
                        />:''
                    }

                </ul>
                {
                    beManagemented?
                        <Calculation
                            title={'核销情况'}
                            lsItemData={lsItemData}
                            activeKey={activeKey}
                            onChangeActiveKey={onChangeActiveKey}
                            itemList={lsItemData.get('paymentList')}
                        />:''
                }

            </div>
        )
    }
}
//费用支出
export class Fyzc extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        const categoryTypeObj = categoryTypeAll[lsItemData.get('categoryType')]
        const beManagemented = lsItemData.getIn([categoryTypeObj,'beManagemented'])
        const usedProject = lsItemData.get('usedProject')
        const projectCard = lsItemData.get('projectCard')
        const accountName = lsItemData.get('accountName')
        const runningState = lsItemData.get('runningState')
        return(
            <div>
                <ul className="ylls-item-detail">
                    {
                        runningState !== 'STATE_FY_DJ'?
                        <li><span>费用性质：</span><span>{{XZ_MANAGE:'管理费用',XZ_FINANCE:'财务费用',XZ_SALE:'销售费用'}[lsItemData.get('propertyCost')]}</span></li>:''
                    }
                    <li><span>摘要：</span><span>{lsItemData.get('runningAbstract')}</span></li>
                    {
                        beManagemented?
                            <li><span>往来单位：</span><span>{`${lsItemData.getIn(['usedCard','code'])}_${lsItemData.getIn(['usedCard','name'])}`}</span></li>:''
                    }
                    {
                        usedProject && projectCard && projectCard.size ?
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
                    <li><span>{projectCard && projectCard.size>1 ?'总':''}金额：</span><span>{formatMoney(lsItemData.get('amount'),2,'')}</span></li>
                    {
                        accountName?
                            <li><span>账户：</span><span>{lsItemData.get('accountName')}</span></li>:''
                    }
                    {
                        runningState !== 'STATE_FY_DJ'?
                        <Invoice
                            itemData={lsItemData}
                        />:''
                    }

                </ul>
                <Calculation
                    title={'核销情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={lsItemData.get('paymentList')}
                />
            </div>
        )
    }
}
//薪酬支出
export class Xczc extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        const categoryTypeObj = categoryTypeAll[lsItemData.get('categoryType')]
        const beAccrued = lsItemData.getIn([categoryTypeObj,'beAccrued'])
        const personAccumulationAmount = lsItemData.getIn([categoryTypeObj,'personAccumulationAmount'])
        const personSocialSecurityAmount = lsItemData.getIn([categoryTypeObj,'personSocialSecurityAmount'])
        const incomeTaxAmount = lsItemData.getIn([categoryTypeObj,'incomeTaxAmount'])
        const companySocialSecurityAmount = lsItemData.getIn([categoryTypeObj,'companySocialSecurityAmount'])
        const companyAccumulationAmount = lsItemData.getIn([categoryTypeObj,'companyAccumulationAmount'])
        const actualAmount = lsItemData.getIn([categoryTypeObj,'actualAmount'])
        const usedProject = lsItemData.get('usedProject')
        const projectCard = lsItemData.get('projectCard')
        const accountName = lsItemData.get('accountName')
        const amount = lsItemData.get('amount')
        const propertyPay = lsItemData.get('propertyPay')
        const runningState = lsItemData.get('runningState')
        return(
            <div>
                <ul className="ylls-item-detail">
                    {
                        runningState === 'STATE_XC_JT' || (runningState === 'STATE_XC_JN' || runningState === 'STATE_XC_FF') && !beAccrued?
                        <li><span>费用性质：</span><span>{{XZ_MANAGE:'管理费用',XZ_FINANCE:'财务费用',XZ_SALE:'销售费用'}[lsItemData.get('propertyCost')]}</span></li>
                        :''
                    }
                    <li><span>摘要：</span><span>{lsItemData.get('runningAbstract')}</span></li>
                    {
                        usedProject && projectCard && projectCard.size ?
                            projectCard.map(v =>
                                <div key={v.get('uuid')}>
                                    <li><span>项目：</span><span>{`${v.get('code') !== 'COMNCRD'?v.get('code')+'_':''}${v.get('name')}`}</span></li>
                                    {
                                        projectCard.size>1?
                                            <li key={v.get('uuid')}><span>金额：</span><span>{formatMoney(v.get('amount'))}</span></li>:''
                                    }
                                </div>
                            ):''
                    }
                    {
                        runningState === 'STATE_XC_JT' || propertyPay === 'SX_QTXC' || propertyPay === 'SX_FLF'?
                            <li><span>{projectCard && projectCard.size>1 ?'总':''}金额：</span><span>{formatMoney(amount,2,'')}</span></li>
                        :''
                    }
                    {
                        propertyPay === 'SX_GZXJ' && runningState === 'STATE_XC_FF'?
                        <li><span>工资薪金：</span><span>{formatMoney(lsItemData.get('amount'),2,'')}</span></li>:''
                    }
                    {
                        accountName && runningState !== 'STATE_XC_JT' ?
                            <li><span>账户：</span><span>{lsItemData.get('accountName')}</span></li>:''
                    }
                    </ul>
                    {
                        beAccrued &&  (runningState === 'STATE_XC_JN' || runningState === 'STATE_XC_FF') && propertyPay !== 'SX_QTXC'?
                        <div className="ylls-item-child-list">
                            <Collapse bordered={false} activeKey='1' >
                                <Panel
                                    showArrow={false}
                                    header={
                                        <div className={"ylls-item-child-title"}>
                                            <span>{`实际支付金额：${runningState === 'STATE_XC_JN'?formatMoney(amount,2,''):formatMoney(actualAmount,2,'')}`}</span>
                                        </div>
                                    }
                                key="1">
                                    <div className='ylls-item-content'>
                                        {
                                            propertyPay === 'SX_SHBX'?
                                                <span>社会保险(公司部分)：{formatMoney(companySocialSecurityAmount,2,'')}</span>:''
                                        }
                                        {
                                            propertyPay === 'SX_SHBX' || propertyPay === 'SX_GZXJ' ?
                                            <span>{propertyPay==='SX_SHBX'?'代缴':'代扣'}社会保险(个人部分)：{formatMoney(personSocialSecurityAmount,2,'')}</span>:''
                                        }
                                        {
                                            propertyPay === 'SX_ZFGJJ'?
                                                <span>公积金(公司部分)：{formatMoney(companyAccumulationAmount,2,'')}</span>:''
                                        }
                                        {
                                            propertyPay === 'SX_ZFGJJ' || propertyPay === 'SX_GZXJ'?
                                                <span>{propertyPay==='SX_ZFGJJ'?'代缴':'代扣'}公积金(个人部分)：{formatMoney(personAccumulationAmount,2,'')}</span>:''
                                        }
                                        {
                                            propertyPay === 'SX_GZXJ'?
                                                <span>代扣个人所得税：{formatMoney(incomeTaxAmount,2,'')}</span>:''
                                        }
                                    </div>
                                </Panel>
                            </Collapse>
                        </div>:''

                    }
                    {
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
                    }

                </div>
                )
            }
    }
//税费支出
export class Sfzc extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        const offsetAmount = lsItemData.get('offsetAmount')
        const handleAmount = lsItemData.get('handleAmount')
        const amount = lsItemData.get('amount')
        const beReduceOut = lsItemData.get('beReduce')
        const reduceAmount = lsItemData.get('reduceAmount')
        const usedProject = lsItemData.get('usedProject')
        const projectCard = lsItemData.get('projectCard')
        const accountName = lsItemData.get('accountName')
        const propertyTax = lsItemData.get('propertyTax')
        const runningState = lsItemData.get('runningState')
        return (
            <div>
                <ul className="ylls-item-detail">
                    <li><span>摘要：</span><span>{lsItemData.get('runningAbstract')}</span></li>
                    {
                        usedProject && projectCard && projectCard.size ?
                            projectCard.map(v =>
                                <div key={v.get('uuid')}>
                                    <li><span>项目：</span><span>{`${v.get('code') !== 'COMNCRD'?v.get('code')+'_':''}${v.get('name')}`}</span></li>
                                    {
                                        projectCard.size>1?
                                            <li key={v.get('uuid')}><span>金额：</span><span>{formatMoney(v.get('amount'))}</span></li>:''
                                    }
                                </div>
                            ):''
                    }
                    {
                        propertyTax === 'SX_ZZS' && runningState!=='STATE_SF_YJZZS'?
                            <li><span>处理税费：</span><span>{formatMoney(Number(offsetAmount) + Number(handleAmount) + (beReduceOut && reduceAmount ? Number(reduceAmount):0),2,'')}</span></li>:''
                    }
                    {
                        propertyTax === 'SX_ZZS' && runningState!=='STATE_SF_YJZZS'?
                            <li><span>预交抵扣金额：</span><span>{formatMoney(offsetAmount,2,'')}</span></li>:''
                    }
                    <li><span>{projectCard && projectCard.size>1 ?'总':''}金额：</span><span>{(propertyTax === 'SX_ZZS' && runningState!=='STATE_SF_YJZZS'?formatMoney(handleAmount,2,''):formatMoney(amount,2,''))}</span></li>
                    {
                        accountName?
                            <li><span>账户：</span><span>{lsItemData.get('accountName')}</span></li>:''
                    }
                    {
                        beReduceOut && reduceAmount ?
                        <li><span>减免金额：</span><span>{formatMoney(reduceAmount,2,'')}</span></li>:''
                    }
                </ul>
                <Calculation
                    title={'核销情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={lsItemData.get('paymentList')}
                />

            </div>
        )
    }
}
// 长期资产
export class Cqzc extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        const categoryTypeObj = categoryTypeAll[lsItemData.get('categoryType')]
        const beManagemented = lsItemData.getIn([categoryTypeObj,'beManagemented'])
        const netProfitAmount = lsItemData.getIn([categoryTypeObj,'netProfitAmount'])
        const lossAmount = lsItemData.getIn([categoryTypeObj,'lossAmount'])
        const originalAssetsAmount = lsItemData.getIn([categoryTypeObj,'originalAssetsAmount'])
        const depreciationAmount = lsItemData.getIn([categoryTypeObj,'depreciationAmount'])
        const usedProject = lsItemData.get('usedProject')
        const projectCard = lsItemData.get('projectCard')
        const accountName = lsItemData.get('accountName')
        const assetType = lsItemData.get('assetType')
        const businessList = lsItemData.get('businessList')
        const runningState = lsItemData.get('runningState')
        const cleaningAmount = lsItemData.getIn([categoryTypeObj,'cleaningAmount'])
        const runningStateName = runningStateType[runningState]?runningStateType[runningState]:''
        return (
            <div>
                <ul className="ylls-item-detail">

                    <li><span>处理类型：</span><span>{{XZ_CZZC:'处置资产',XZ_ZJTX:'折旧摊销',XZ_GJZC:'购进资产'}[lsItemData.get('assetType')]}{runningStateName?'('+runningStateName+')':''}</span></li>
                    <li><span>摘要：</span><span>{lsItemData.get('runningAbstract')}</span></li>
                    {
                        beManagemented && runningState !== 'STATE_CQZC_JZSY' && assetType !== 'XZ_ZJTX'?
                            <li><span>往来单位：</span><span>{`${lsItemData.getIn(['usedCard','code'])}_${lsItemData.getIn(['usedCard','name'])}`}</span></li>:''
                    }
                    {
                        usedProject && projectCard && projectCard.size ?
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
                    {
                        runningState !== 'STATE_CQZC_JZSY'?
                        <li><span>{projectCard && projectCard.size>1 ?'总':''}金额：</span><span>{formatMoney(lsItemData.get('amount'),2,'')}</span></li>:''
                    }
                    {
                        accountName && runningState !== 'STATE_CQZC_JZSY'?
                            <li><span>账户：</span><span>{lsItemData.get('accountName')}</span></li>:''
                    }
                    {
                        assetType !== 'XZ_ZJTX'?
                        <Invoice
                            itemData={lsItemData}
                        />:''
                    }

                </ul>
                {
                    assetType === 'XZ_CZZC' && businessList && businessList.size && runningState !== 'STATE_CQZC_JZSY'?
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
                                            <span>{businessList.getIn([0,'categoryName'])}</span>
                                            <span>流水号：{businessList.getIn([0,'flowNumber'])}</span>
                                        </div>
                                    </li>
                                </ul>
                            </Panel>
                        </Collapse>
                    </div>:''

                }
                {
                    runningState === 'STATE_CQZC_JZSY'?
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
                                    <div className='ylls-item-content'>
                                        {
            								 netProfitAmount > 0?
                								<span>净收益金额：{formatMoney(netProfitAmount,2,'')}</span>
                								:
                								<span>净损失金额：{formatMoney(lossAmount,2,'')}</span>
            							}
                                        <span>资产原值：{formatMoney(originalAssetsAmount,2,'')}</span>
                                        <span>累计折旧余额：{formatMoney(depreciationAmount,2,'')}</span>
                                        <span>处置收入：{formatMoney(cleaningAmount,2,'')}</span>
                                    </div>
                                </Panel>
                            </Collapse>
                        </div>:''
                }
                <Calculation
                    title={'核销情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={lsItemData.get('paymentList')}
                />
                {
                    runningState === 'STATE_CQZC_JZSY'?
                    <Calculation
                        title={'核销情况'}
                        lsItemData={lsItemData}
                        activeKey={activeKey}
                        onChangeActiveKey={onChangeActiveKey}
                        itemList={lsItemData.get('businessList')}
                        amountStr={'amount-tax'}
                    />:''
                }
            </div>
        )
    }
}
// 营业外收支
export class Yywsz extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        const categoryTypeObj = categoryTypeAll[lsItemData.get('categoryType')]
        const beManagemented = lsItemData.getIn([categoryTypeObj,'beManagemented'])
        const usedProject = lsItemData.get('usedProject')
        const projectCard = lsItemData.get('projectCard')
        const accountName = lsItemData.get('accountName')
        return (
            <div>
                <ul className="ylls-item-detail">
                    <li><span>摘要：</span><span>{lsItemData.get('runningAbstract')}</span></li>
                    {
                        beManagemented?
                            <li><span>往来单位：</span><span>{`${lsItemData.getIn(['usedCard','code'])}_${lsItemData.getIn(['usedCard','name'])}`}</span></li>:''
                    }
                    {
                        usedProject && projectCard && projectCard.size ?
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
                    <li><span>{projectCard && projectCard.size>1 ?'总':''}金额：</span><span>{formatMoney(lsItemData.get('amount'),2,'')}</span></li>
                    {
                        accountName?
                            <li><span>账户：</span><span>{lsItemData.get('accountName')}</span></li>:''
                    }
                </ul>
            </div>
        )
    }
}
// 暂收暂付
export class Zszf extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        const categoryTypeObj = categoryTypeAll[lsItemData.get('categoryType')]
        const usedProject = lsItemData.get('usedProject')
        const projectCard = lsItemData.get('projectCard')
        const accountName = lsItemData.get('accountName')
        return (
            <div>
                <ul className="ylls-item-detail">
                    <li><span>摘要：</span><span>{lsItemData.get('runningAbstract')}</span></li>
                    {
                        usedProject && projectCard && projectCard.size ?
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
                    <li><span>{projectCard && projectCard.size>1 ?'总':''}金额：</span><span>{formatMoney(lsItemData.get('amount'),2,'')}</span></li>
                    {
                        accountName?
                            <li><span>账户：</span><span>{lsItemData.get('accountName')}</span></li>:''
                    }
                </ul>
                <Calculation
                    title={'核销情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={lsItemData.get('paymentList')}
                />
            </div>
        )
    }
}
// 借款/投资/资本
export class JkTzZb extends React.Component {
    render() {
        const { lsItemData, activeKey, onChangeActiveKey } = this.props
        const categoryTypeObj = categoryTypeAll[lsItemData.get('categoryType')]
        const beManagemented = lsItemData.getIn([categoryTypeObj,'beManagemented'])
        const usedProject = lsItemData.get('usedProject')
        const projectCard = lsItemData.get('projectCard')
        const accountName = lsItemData.get('accountName')
        const propertyCost = lsItemData.get('propertyCost')
        const businessList = lsItemData.get('businessList')
        const runningState = lsItemData.get('runningState')
        const runningStateName = runningStateType[runningState]?runningStateType[runningState]:''
        return (
            <div>
                <ul className="ylls-item-detail">

                    <li><span>处理类型：</span>
                        <span>
                            {{
                            XZ_QDJK:'取得借款',
                            XZ_CHLX:'偿还利息',
                            XZ_CHBJ:'偿还本金',
                            XZ_DWTZ:'对外投资',
                            XZ_QDSY:'取得收益',
                            XZ_SHTZ:'收回投资',
                            XZ_ZZ:'增资',
                            XZ_LRFP:'利润分配',
                            XZ_JZ:'减资',}[lsItemData.get('propertyCost')]}
                            {runningStateName?'('+runningStateName+')':''}
                        </span>
                    </li>
                    <li><span>摘要：</span><span>{lsItemData.get('runningAbstract')}</span></li>
                    {
                        usedProject && projectCard && projectCard.size ?
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
                    <li><span>{projectCard && projectCard.size>1 ?'总':''}金额：</span><span>{formatMoney(lsItemData.get('amount'),2,'')}</span></li>
                    {
                        accountName?
                            <li><span>账户：</span><span>{lsItemData.get('accountName')}</span></li>:''
                    }
                </ul>
                <Calculation
                    title={'核销情况'}
                    lsItemData={lsItemData}
                    activeKey={activeKey}
                    onChangeActiveKey={onChangeActiveKey}
                    itemList={lsItemData.get('paymentList')}
                />
            </div>
        )
    }
}
export class Other extends React.Component {

    render() {

        const { lsItemData, activeKey, onChangeActiveKey } = this.props

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
