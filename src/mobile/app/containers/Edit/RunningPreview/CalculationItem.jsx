import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS }	from 'immutable'
import { formatMoney } from 'app/utils'
import ProjectCom from './ProjectCom'
import { Amount } from 'app/components'


const propertyCostObj = {'XZ_SALE': '销售费用', 'XZ_MANAGE': '管理费用', 'XZ_FINANCE': '财务费用', 'XZ_SCCB': '生产成本', 'XZ_FZSCCB': '辅助生产成本', 'XZ_ZZFY': '制造费用', 'XZ_HTCB': '合同成本', 'XZ_JJFY': '间接费用', 'XZ_JXZY': '机械作业',}
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


//内部转账
export class Nbzz extends React.Component {

    render() {
        const { jrOri, category, oriState, dispatch } = this.props

        const amount = jrOri.get('amount')
        const accounts = jrOri.get('accounts')
        const fromAcount = accounts.find(v => v.get('accountStatus') === 'ACCOUNT_STATUS_FROM')
        const toAcount = accounts.find(v => v.get('accountStatus') === 'ACCOUNT_STATUS_TO')

        return (
            <div>
                <div className='running-preview-bottom-card'>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>金额：</div>
                        <div className='running-preview-item-content'>
                            {formatMoney(amount, 2, '')}
                        </div>
                    </div>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>转出账户：</div>
                        <div className='running-preview-item-content overElli'>
                            {fromAcount && fromAcount.get('accountName')}
                        </div>
                    </div>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>转入账户：</div>
                        <div className='running-preview-item-content overElli'>
                            {toAcount && toAcount.get('accountName')}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

//收付管理
export class Sfgl extends React.Component {

    render() {

        const { jrOri, category, oriState, dispatch } = this.props

        const oriAbstract = jrOri.get('oriAbstract')
        const currentCardList = jrOri.get('currentCardList')
        const amount = jrOri.get('amount')
        const accounts = jrOri.get('accounts')
        const moedAmount = jrOri.get('moedAmount')
        const relationCategoryName = jrOri.get('relationCategoryName')
        const debitAmount = jrOri.getIn(['jrFlowList', 0, 'debitAmount'])

        return (
            <div>
                <div className='running-preview-bottom-card'>
                    {/* <div className='running-preview-item'>
                        <div className='running-preview-item-title'>处理类别：</div>
                        <div className='running-preview-item-content'>
                            {relationCategoryName}
                        </div>
                    </div>
                    <Relative currentCardList={currentCardList}/> */}
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>{debitAmount==null ? '付款' : '收款'}金额：</div>
                        <div className='running-preview-item-content'>
                            {formatMoney(Math.abs(amount), 2, '')}
                        </div>
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
                </div>
            </div>
        )
    }
}

//发票认证/开具发票
export class FpKr extends React.Component {
    render() {
        const { jrOri, category, oriState, dispatch } = this.props
        const amount = Math.abs(jrOri.get('amount'))

        return (
            <div>
                <div className='running-preview-bottom-card'>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>{{
                            STATE_KJFP_TS:'对冲',
                            STATE_KJFP_XS:'开票',
                            STATE_FPRZ_CG:'认证',
                            STATE_FPRZ_TG:'对冲'
                        }[oriState]}税额：</div>
                        <div className='running-preview-item-content'>
                            {formatMoney(amount, 2, '')}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

//转出未交增值税
export class Zcwjzzs extends React.Component {
    render() {
        const { jrOri, category, oriState, dispatch } = this.props

        const oriAbstract = jrOri.get('oriAbstract')
        let outputCount = 0, outputAmount = 0, inputCount = 0, inputAmount = 0
        jrOri.get('pendingStrongList').forEach(v => {
            if (v.get('pendingStrongType') === 'JR_STRONG_STAY_ZCXX') {
                outputCount = outputCount + 1
                outputAmount = outputAmount + v.get('taxAmount')
            } else {
                inputCount = inputCount + 1
                inputAmount = inputAmount + v.get('taxAmount')
            }
        })
        return (
            <div>
                <div className='running-preview-bottom-card'>
                    <div className="running-preview-padding">
                        摘要：{oriAbstract}
                    </div>
                    <div className="running-preview-padding">
                        处理税额月份：{jrOri.getIn(['pendingStrongList', 0, 'oriDate']).substr(0, 7)}
                    </div>
                    <div className="running-preview-padding">
                        销项税额：{formatMoney(outputAmount, 2, '')}
                    </div>
                    <div className="running-preview-padding">
                        进项税额：{formatMoney(inputAmount, 2, '')}
                    </div>
                    <div className="running-preview-padding">
                        转出税额：{formatMoney(outputAmount - inputAmount, 2, '')}
                    </div>
                </div>
                <Calculation
                    title={'转出税额'}
                    itemList={jrOri.get('pendingStrongList')}
                    amountStr='taxAmount'
                    wjAmount={formatMoney(outputAmount - inputAmount, 2, '')}
                />
            </div>
        )
    }
}

//项目公共费用分摊
export class Xmft extends React.Component {
    render() {
        const { jrOri, category, oriState, dispatch } = this.props

        const projectCardList = jrOri.get('projectCardList')
        const projectCardListSize = projectCardList.size
        const amount = jrOri.get('amount')

        return (
            <div>
                <div className='running-preview-bottom-card'>
                    <div className='running-preview-item'
                        style={{display: projectCardListSize > 1 ? '' : 'none'}}
                    >
                        <div className='running-preview-item-title'>项目：</div>
                        <div className='running-preview-item-content'>
                            多项目
                        </div>
                    </div>
                    {
                        <div className={projectCardListSize > 1 ? 'running-preview-bgColor': '' }>
                            {
                                projectCardList.map((v,i) => {
                                    const code = v.get('code')
                                    const propertyCost = v.get('propertyCost')
                                    let showName = `${v.get('code')} ${v.get('name')}`
                                    if (['COMNCRD', 'ASSIST', 'MAKE', 'INDIRECT', 'MECHANICAL'].includes(v.get('code'))) {
                                        showName = v.get('name')
                                    }

                                    let propertyCostName = '请选择费用性质'
                                    if (propertyCost) {
                                        propertyCostName = {'XZ_SALE': '销售费用', 'XZ_MANAGE': '管理费用', 'XZ_FINANCE': '财务费用'}[propertyCost]
                                    }

                                    return (
                                        <div key={i}>
                                            <div className='running-preview-item'>
                                                <div className='running-preview-item-title'>
                                                    <span className='spot' style={{display: projectCardListSize > 1 ? '' : 'none'}}>• </span>项目：
                                                </div>
                                                <div className='running-preview-item-content overElli'>
                                                    {showName}
                                                </div>
                                            </div>
                                            <div className='running-preview-item' style={{display: code=='COMNCRD' ? '' : 'none'}}>
                                                <div className='running-preview-item-title'>
                                                    费用性质：
                                                </div>
                                                <div className='running-preview-item-content overElli'>
                                                    {propertyCostName}
                                                </div>
                                            </div>
                                            <div className='running-preview-item'>
                                                <div className='running-preview-item-title'>金额：</div>
                                                <div className='running-preview-item-content'>
                                                    <Amount>{v.get('amount')}</Amount>
                                                </div>
                                            </div>
                                        </div>

                                    )
                                })
                            }
                        </div>
                    }


                    <div className='running-preview-item' style={{display: projectCardListSize > 1 ? '' : 'none'}}>
                        <div className='running-preview-item-title'>总金额：</div>
                        <div className='running-preview-item-content'>
                            <Amount>{amount}</Amount>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

//处置损益
export class Jzsy extends React.Component {
    render() {
        const { jrOri, category, oriState, dispatch } = this.props

        const name = category.get('name')
        const projectCardList = jrOri.get('projectCardList')
        const originalAssetsAmount = jrOri.getIn(['assets','originalAssetsAmount'])
        const depreciationAmount = jrOri.getIn(['assets','depreciationAmount'])
        const cleaningAmount = jrOri.getIn(['assets','cleaningAmount'])
        const amount = jrOri.get('amount')

        return (
            <div>
                <div className='running-preview-bottom-card'>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>处理类别：</div>
                        <div className='running-preview-item-content'>{name}</div>
                    </div>
                    <ProjectCom projectCardList={projectCardList}/>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>{`${amount>0?'收益':'损失'}金额：`}</div>
                        <div className='running-preview-item-content'>
                            <Amount>{Math.abs(amount)}</Amount>
                        </div>
                    </div>
                    <div className='running-preview-bgColor'>
                        <div>
                            <span className='running-preview-blue'>• </span>
                            <span style={{color: '#666'}}>处置收入</span>
                        </div>
                        <div className='running-preview-item'>
                            <div className='running-preview-item-title'>金额：</div>
                            <div className='running-preview-item-content'>
                                <Amount>{cleaningAmount}</Amount>
                            </div>
                        </div>
                        <div>
                            <span className='running-preview-blue'>• </span>
                            <span style={{color: '#666'}}>资产原值</span>
                        </div>
                        <div className='running-preview-item'>
                            <div className='running-preview-item-title'>金额：</div>
                            <div className='running-preview-item-content'>
                                <Amount>{originalAssetsAmount}</Amount>
                            </div>
                        </div>
                        <div>
                            <span className='running-preview-blue'>• </span>
                            <span style={{color: '#666'}}>累计折旧</span>
                        </div>
                        <div className='running-preview-item'>
                            <div className='running-preview-item-title'>金额：</div>
                            <div className='running-preview-item-content'>
                                <Amount>{depreciationAmount}</Amount>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

//折旧摊销
export class Zjtx extends React.Component {
    render() {
        const { jrOri, category, oriState, dispatch } = this.props

        const amount = jrOri.get('amount')
        const name = category.get('name')
        const propertyCost = jrOri.get('propertyCost')
        const projectCardList = jrOri.get('projectCardList')
        const propertyCostList = category.get('propertyCostList')

        return (
            <div>
                <div className='running-preview-bottom-card'>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>处理类别：</div>
                        <div className='running-preview-item-content'>{name}</div>
                    </div>
                    <div className='running-preview-item' style={{display: propertyCostList.size > 1 ? '' : 'none'}}>
                        <div className='running-preview-item-title'>费用性质：</div>
                        <div className='running-preview-item-content'>{propertyCostObj[propertyCost]}</div>
                    </div>
                    <ProjectCom projectCardList={projectCardList}/>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>金额：</div>
                        <div className='running-preview-item-content'>
                            <Amount>{amount}</Amount>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

//货物调拨
export class Chdb extends React.Component {
    render() {
        const { jrOri, category, oriState, dispatch } = this.props

        const stockCardList = jrOri.get('stockCardList') ? jrOri.get('stockCardList') : fromJS([])
        const oriAbstract = jrOri.get('oriAbstract')
        let warehouseCardList = []
        jrOri.get('warehouseCardList').map(v => {
            if (v.get('warehouseStatus')=='WAREHOUSE_STATUS_FROM') {
                warehouseCardList[0]=v
            }
            if (v.get('warehouseStatus')=='WAREHOUSE_STATUS_TO') {
                warehouseCardList[1]=v
            }
        })
        warehouseCardList = fromJS(warehouseCardList)


        return (
            <div>
                <div className='running-preview-bottom-card'>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>调出仓库：</div>
                        <div className='running-preview-item-content overElli'>
                            {warehouseCardList.getIn([0, 'code'])} {warehouseCardList.getIn([0, 'name'])}
                        </div>
                    </div>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>调入仓库：</div>
                        <div className='running-preview-item-content overElli'>
                            {warehouseCardList.getIn([1, 'code'])} {warehouseCardList.getIn([1, 'name'])}
                        </div>
                    </div>
                    <div className='running-preview-item'
                        style={{display: stockCardList.size > 1 ? '' : 'none'}}
                    >
                        <div className='running-preview-item-title'>存货：</div>
                        <div className='running-preview-item-content'>多存货</div>
                    </div>
                    <div className={stockCardList.size > 1 ? 'running-preview-bgColor': '' }>
                    {
                        stockCardList && stockCardList.size ?
                         stockCardList.map(v => {
                             const assistList = v.get('assistList') ? v.get('assistList') : fromJS([])//选择的属性
                             const assistName = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, '')
                             const batch = v.get('batch') ? v.get('batch') : ''
                             const batchUuid = v.get('batchUuid') ? v.get('batchUuid') : ''
                             const expirationDate = v.get('expirationDate') ? v.get('expirationDate') : ''
                             const batchName = expirationDate ? `${batch}(${expirationDate})` : batch

                             return (
                                 <div key={v.get('cardUuid')}>
                                     <div className='running-preview-item'>
                                         <div className='running-preview-item-title'>
                                             <span className='spot' style={{display: stockCardList.size > 1 ? '' : 'none'}}>• </span>
                                             存货：
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
                                     <div style={{display: v.get('isOpenedQuantity') ? '' : 'none'}}>
                                         <div className='running-preview-item'>
                                             <div className='running-preview-item-title'>数量：</div>
                                             <div className='running-preview-item-content'>
                                                 {`${formatMoney(v.get('quantity'), 4, '', false)} ${v.get('unitName')}`}
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
                         }
                        ) : null
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

//货物余额调整
export class Chye extends React.Component {
    render() {
        const { jrOri, category, oriState, dispatch, isOpenedWarehouse } = this.props

        const stockCardList = jrOri.get('stockCardList')
        const oriAbstract = jrOri.get('oriAbstract')
        const jrState = jrOri.get('jrState')
        const isOpenedQuantity = stockCardList.getIn([0, 'isOpenedQuantity'])

        return (
            <div>
                <div className='running-preview-bottom-card'>
                    <div className='running-preview-item'
                        style={{display: stockCardList.size > 1 ? '' : 'none'}}
                    >
                        <div className='running-preview-item-title'>存货：</div>
                        <div className='running-preview-item-content'>多存货</div>
                    </div>

                    <div className={stockCardList.size > 1 ? 'running-preview-bgColor': '' }>
                        {
                            stockCardList.map(v => {
                                const assistList = v.get('assistList') ? v.get('assistList') : fromJS([])//选择的属性
                                const assistName = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, '')
                                const batch = v.get('batch') ? v.get('batch') : ''
                                const batchUuid = v.get('batchUuid') ? v.get('batchUuid') : ''
                                const expirationDate = v.get('expirationDate') ? v.get('expirationDate') : ''
                                const batchName = expirationDate ? `${batch}(${expirationDate})` : batch

                                return (
                                    <div key={v.get('cardUuid')}>
                                        <div className='running-preview-item'>
                                            <div className='running-preview-item-title'>
                                                <span className='spot' style={{display: stockCardList.size > 1 ? '' : 'none'}}>• </span>
                                                存货：
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
                                        <div style={{display: v.get('warehouseCardUuid') ? '' : 'none'}}>
                                            <div className='running-preview-item'>
                                                <div className='running-preview-item-title'>仓库：</div>
                                                <div className='running-preview-item-content'>
                                                    {`${v.get('warehouseCardCode')} ${v.get('warehouseCardName')}`}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{display: v.get('isOpenedQuantity') ? '' : 'none'}}>
                                            <div className='running-preview-item'>
                                                <div className='running-preview-item-title'>数量：</div>
                                                <div className='running-preview-item-content'>
                                                    {`${formatMoney(v.get('quantity'), 4, '', false)} ${v.get('unitName')?v.get('unitName'):''}`}
                                                </div>
                                            </div>
                                            <div className='running-preview-item' style={{display: jrState=='STATE_CHYE_CH'?'none':''}}>
                                                <div className='running-preview-item-title'>单价：</div>
                                                <div className='running-preview-item-content'>
                                                    {`${formatMoney(v.get('price'), 4, '', false)}`}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='running-preview-item'>
                                            <div className='running-preview-item-title'>金额：</div>
                                            <div className='running-preview-item-content'>{formatMoney(v.get('amount'),2,'')}</div>
                                        </div>
                                    </div>                               
                                )
                            })
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


//进项税额转出
export class Jxsezc extends React.Component {
    render() {
        const { jrOri, category, oriState, dispatch, isOpenedWarehouse } = this.props

        const stockCardList = jrOri.get('stockCardList')
        const oriAbstract = jrOri.get('oriAbstract')
        const relationCategoryName = jrOri.get('relationCategoryName')
        const propertyCostList = category.get('propertyCostList') ? category.get('propertyCostList') : fromJS([])
        const propertyCost = jrOri.get('propertyCost')
        const projectCardList = jrOri.get('projectCardList')

        return (
            <div>
                <div className='running-preview-bottom-card'>
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>处理类别：</div>
                        <div className='running-preview-item-content'>{relationCategoryName}</div>
                    </div>
                    <div className='running-preview-item' style={{display: propertyCostList.size > 1 && propertyCost ? '' : 'none'}}>
                        <div className='running-preview-item-title'>费用性质：</div>
                        <div className='running-preview-item-content'>{propertyCostObj[propertyCost]}</div>
                    </div>
                    <ProjectCom projectCardList={projectCardList}/>
                    <div className='running-preview-item' style={{display: stockCardList.size > 1 ? '' : 'none'}}>
                        <div className='running-preview-item-title'>存货：</div>
                        <div className='running-preview-item-content'>多存货：</div>
                    </div>

                    <div className={stockCardList.size > 1 ? 'running-preview-bgColor': '' }>
                        {
                             stockCardList.map(v =>
                                <div key={v.get('cardUuid')}>
                                    <div className='running-preview-item'>
                                        <div className='running-preview-item-title'>
                                            <span className='spot' style={{display: stockCardList.size > 1 ? '' : 'none'}}>• </span>
                                            存货：
                                        </div>
                                        <div className='running-preview-item-content'>{`${v.get('code')} ${v.get('name')}`}</div>
                                    </div>
                                    <div style={{display: v.get('warehouseCardUuid') ? '' : 'none'}}>
                                        <div className='running-preview-item'>
                                            <div className='running-preview-item-title'>仓库：</div>
                                            <div className='running-preview-item-content'>
                                                {`${v.get('warehouseCardCode')} ${v.get('warehouseCardName')}`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='running-preview-item'>
                                        <div className='running-preview-item-title'>税额：</div>
                                        <div className='running-preview-item-content'>{formatMoney(v.get('amount'),2,'')}</div>
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    <div className="running-preview-item">
                        <div className='running-preview-item-title'>{stockCardList.size > 1 ? '总金额：' : '税额：'}</div>
                        <div className='running-preview-item-content'>{formatMoney(jrOri.get('amount'), 2, '')}</div>
                    </div>
                </div>
            </div>
        )
    }
}

//组装拆卸
export class Zzcx extends React.Component {
    render() {
        const { jrOri, category, oriState, dispatch } = this.props

        const stockCardList = jrOri.get('stockCardList') ? jrOri.get('stockCardList') : fromJS([])
        const stockCardOtherList = jrOri.get('stockCardOtherList') ? jrOri.get('stockCardOtherList') : fromJS([])

        return (
            <div>
                {
                    oriState == 'STATE_CHZZ_ZZCX' ? <div className='running-preview-bottom-card'>
                        <div className='running-preview-item'
                            style={{display: stockCardList.size > 1 ? '' : 'none'}}
                        >
                            <div className='running-preview-item-title'>物料：</div>
                            <div className='running-preview-item-content'>多物料</div>
                        </div>
                        <div className={stockCardList.size > 1 ? 'running-preview-bgColor': '' }>
                        {
                            stockCardList && stockCardList.size ?
                             stockCardList.map(v => {
                                 const assistList = v.get('assistList') ? v.get('assistList') : fromJS([])//选择的属性
                                 const assistName = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, '')
                                 const batch = v.get('batch') ? v.get('batch') : ''
                                 const batchUuid = v.get('batchUuid') ? v.get('batchUuid') : ''
                                 const expirationDate = v.get('expirationDate') ? v.get('expirationDate') : ''
                                 const batchName = expirationDate ? `${batch}(${expirationDate})` : batch

                                 return (
                                     <div key={v.get('cardUuid')}>
                                         <div className='running-preview-item'>
                                             <div className='running-preview-item-title'>
                                                 <span className='spot' style={{display: stockCardList.size > 1 ? '' : 'none'}}>• </span>
                                                 物料：
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
                                         <div style={{display: v.get('warehouseCardUuid') ? '' : 'none'}}>
                                             <div className='running-preview-item'>
                                                 <div className='running-preview-item-title'>仓库：</div>
                                                 <div className='running-preview-item-content'>
                                                     {`${v.get('warehouseCardCode')} ${v.get('warehouseCardName')}`}
                                                 </div>
                                             </div>
                                         </div>
                                         <div style={{display: v.get('isOpenedQuantity') ? '' : 'none'}}>
                                             <div className='running-preview-item'>
                                                 <div className='running-preview-item-title'>数量：</div>
                                                 <div className='running-preview-item-content'>
                                                     {`${formatMoney(v.get('quantity'), 4, '', false)} ${v.get('unitName')}`}
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
                                             <div className='running-preview-item-content'>{formatMoney(v.get('amount'),2,'')}</div>
                                         </div>
                                     </div>
                                 )}
                            ) : null
                        }
                        </div>
                        <div className="running-preview-item" style={{display: stockCardList.size > 1 ? '' : 'none'}}>
                            <div className='running-preview-item-title'>总金额：</div>
                            <div className='running-preview-item-content'>{formatMoney(jrOri.get('amount'), 2, '')}</div>
                        </div>


                        {/* 成品 */}
                        <div className='running-preview-item'
                            style={{display: stockCardOtherList.size > 1 ? '' : 'none'}}
                        >
                            <div className='running-preview-item-title'>成品：</div>
                            <div className='running-preview-item-content'>多成品</div>
                        </div>
                        <div className={stockCardOtherList.size > 1 ? 'running-preview-bgColor': '' }>
                        {
                            stockCardOtherList && stockCardOtherList.size ?
                             stockCardOtherList.map(v => {
                                 const assistList = v.get('assistList') ? v.get('assistList') : fromJS([])//选择的属性
                                 const assistName = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, '')
                                 const batch = v.get('batch') ? v.get('batch') : ''
                                 const batchUuid = v.get('batchUuid') ? v.get('batchUuid') : ''
                                 const expirationDate = v.get('expirationDate') ? v.get('expirationDate') : ''
                                 const batchName = expirationDate ? `${batch}(${expirationDate})` : batch

                                 return (
                                     <div key={v.get('cardUuid')}>
                                         <div className='running-preview-item'>
                                             <div className='running-preview-item-title'>
                                                 <span className='spot' style={{display: stockCardOtherList.size > 1 ? '' : 'none'}}>• </span>
                                                 成品：
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
                                         <div style={{display: v.get('warehouseCardUuid') ? '' : 'none'}}>
                                             <div className='running-preview-item'>
                                                 <div className='running-preview-item-title'>仓库：</div>
                                                 <div className='running-preview-item-content'>
                                                     {`${v.get('warehouseCardCode')} ${v.get('warehouseCardName')}`}
                                                 </div>
                                             </div>
                                         </div>
                                         <div style={{display: v.get('isOpenedQuantity') ? '' : 'none'}}>
                                             <div className='running-preview-item'>
                                                 <div className='running-preview-item-title'>数量：</div>
                                                 <div className='running-preview-item-content'>
                                                     {`${formatMoney(v.get('quantity'), 4, '', false)} ${v.get('unitName')}`}
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
                                             <div className='running-preview-item-content'>{formatMoney(v.get('amount'),2,'')}</div>
                                         </div>
                                     </div>
                                 )}

                            ) : null
                        }
                        </div>
                        <div className="running-preview-item" style={{display: stockCardOtherList.size > 1 ? '' : 'none'}}>
                            <div className='running-preview-item-title'>总金额：</div>
                            <div className='running-preview-item-content'>{formatMoney(jrOri.get('amount'), 2, '')}</div>
                        </div>
                    </div> : null
                }


                {
                    oriState=='STATE_CHZZ_ZZD' ?
                    <div className='running-preview-bottom-card'>
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
                                            <div className='running-preview-item-title'>
                                                成品：
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
                                        <div style={{display: v.get('warehouseCardUuid') ? '' : 'none'}}>
                                            <div className='running-preview-item'>
                                                <div className='running-preview-item-title'>仓库：</div>
                                                <div className='running-preview-item-content'>
                                                    {`${v.get('warehouseCardCode')} ${v.get('warehouseCardName')}`}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{display: v.get('isOpenedQuantity') ? '' : 'none'}}>
                                            <div className='running-preview-item'>
                                                <div className='running-preview-item-title'>数量：</div>
                                                <div className='running-preview-item-content'>
                                                    {`${formatMoney(v.get('quantity'), 4, '', false)} ${v.get('unitName')}`}
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
                                            <div className='running-preview-item-content'>{formatMoney(v.get('amount'),2,'')}</div>
                                        </div>
                                        <div className='running-preview-item'
                                            style={{display: v.get('childCardList').size > 1 ? '' : 'none'}}
                                        >
                                            <div className='running-preview-item-title'>物料：</div>
                                            <div className='running-preview-item-content'>多物料</div>
                                        </div>
                                        <div className={v.get('childCardList').size > 1 ? 'running-preview-bgColor': '' }>
                                        {
                                            v.get('childCardList').map((item, j) => {
                                                const assistList = item.get('assistList') ? item.get('assistList') : fromJS([])//选择的属性
                                                const assistName = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, '')
                                                const batch = item.get('batch') ? item.get('batch') : ''
                                                const batchUuid = item.get('batchUuid') ? item.get('batchUuid') : ''
                                                const expirationDate = item.get('expirationDate') ? item.get('expirationDate') : ''
                                                const batchName = expirationDate ? `${batch}(${expirationDate})` : batch

                                                return (
                                                    <div key={`${i}-${j}`}>
                                                        <div className='running-preview-item'>
                                                            <div className='running-preview-item-title'>
                                                                <span className='spot' style={{display: v.get('childCardList').size > 1 ? '' : 'none'}}>• </span>
                                                                物料：
                                                            </div>
                                                            <div className='running-preview-item-content'>{`${item.get('code')}_${item.get('name')}`}</div>
                                                        </div>
                                                        <div className='running-preview-item' style={{display: assistName ? '' : 'none'}}>
                                                            <div className='running-preview-item-title'>属性：</div>
                                                            <div className='running-preview-item-content'>{assistName}</div>
                                                        </div>
                                                        <div className='running-preview-item' style={{display: batchName ? '' : 'none'}}>
                                                            <div className='running-preview-item-title'>批次：</div>
                                                            <div className='running-preview-item-content'>{batchName}</div>
                                                        </div>
                                                        <div style={{display: item.get('warehouseCardUuid') ? '' : 'none'}}>
                                                            <div className='running-preview-item'>
                                                                <div className='running-preview-item-title'>仓库：</div>
                                                                <div className='running-preview-item-content'>
                                                                    {`${item.get('warehouseCardCode')} ${item.get('warehouseCardName')}`}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{display: item.get('isOpenedQuantity') ? '' : 'none'}}>
                                                            <div className='running-preview-item'>
                                                                <div className='running-preview-item-title'>数量：</div>
                                                                <div className='running-preview-item-content'>
                                                                    {`${formatMoney(item.get('quantity'), 4, '', false)} ${item.get('unitName')}`}
                                                                </div>
                                                            </div>
                                                            <div className='running-preview-item'>
                                                                <div className='running-preview-item-title'>单价：</div>
                                                                <div className='running-preview-item-content'>
                                                                    {`${formatMoney(item.get('price'), 4, '', false)}`}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='running-preview-item'>
                                                            <div className='running-preview-item-title'>金额：</div>
                                                            <div className='running-preview-item-content'>{formatMoney(item.get('amount'),2,'')}</div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        </div>
                                    </div>
                                )
                            }

                            )
                        }
                        <div className="running-preview-item" style={{display: stockCardList.size > 1 ? '' : 'none'}}>
                            <div className='running-preview-item-title'>总金额：</div>
                            <div className='running-preview-item-content'>{formatMoney(jrOri.get('amount'), 2, '')}</div>
                        </div>
                    </div> : null
                }
            </div>
        )
    }
}

export class Chtrxm extends React.Component {
    render() {
        const { jrOri, category, oriState, dispatch } = this.props

        const stockCardList = jrOri.get('stockCardList') ? jrOri.get('stockCardList') : fromJS([])
        const projectCardList = jrOri.get('projectCardList')

        return (
            <div>
                <div className='running-preview-bottom-card'>
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
                                            <span className='spot' style={{display: stockCardList.size > 1 ? '' : 'none'}}>• </span>
                                            存货：
                                        </div>
                                        <div className='running-preview-item-content'>{`${v.get('code')}_${v.get('name')}`}</div>
                                    </div>
                                    <div style={{display: v.get('warehouseCardUuid') ? '' : 'none'}}>
                                        <div className='running-preview-item'>
                                            <div className='running-preview-item-title'>仓库：</div>
                                            <div className='running-preview-item-content'>
                                                {`${v.get('warehouseCardCode')} ${v.get('warehouseCardName')}`}
                                            </div>
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
                                        <div className='running-preview-item-content'>{formatMoney(v.get('amount'),2,'')}</div>
                                    </div>
                                </div>
                            )

                         }) : null
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

export class Xmjz extends React.Component {
    render() {
        const { jrOri, category, oriState, dispatch } = this.props

        const stockCardList = jrOri.get('stockCardList') ? jrOri.get('stockCardList') : fromJS([])
        const projectCardList = jrOri.get('projectCardList')
        const projectProperty = projectCardList.getIn([0, 'projectProperty'])
        const amount = jrOri.get('amount') ? jrOri.get('amount') : 0
        const currentAmount = jrOri.get('currentAmount') ? jrOri.get('currentAmount') : 0

        return (
            <div>
                <div className='running-preview-bottom-card'>
                    <ProjectCom projectCardList={projectCardList}/>
                    <div style={{display: oriState=='STATE_XMJZ_QRSRCB' ? '' : 'none'}}>
                        <div className='running-preview-item'>
                            <div className='running-preview-item-title'>收入金额：</div>
                            <div className='running-preview-item-content'>{formatMoney(amount, 2, '')}</div>
                        </div>
                        <div className='running-preview-item'>
                            <div className='running-preview-item-title'>成本金额：</div>
                            <div className='running-preview-item-content'>{formatMoney(currentAmount, 2, '')}</div>
                        </div>
                        <div className='running-preview-item'>
                            <div className='running-preview-item-title'>合同毛利：</div>
                            <div className='running-preview-item-content'>{formatMoney(amount-currentAmount, 2, '')}</div>
                        </div>
                    </div>
                    <div className='running-preview-item'
                        style={{display: stockCardList.size > 1 ? '' : 'none'}}
                    >
                        <div className='running-preview-item-title'>存货：</div>
                        <div className='running-preview-item-content'>多存货</div>
                    </div>
                    <div className={stockCardList.size > 1 ? 'running-preview-bgColor': '' }>
                    {
                        stockCardList && stockCardList.size ?
                            stockCardList.map(v => {
                                const assistList = v.get('assistList') ? v.get('assistList') : fromJS([])//选择的属性
                                const assistName = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, '')
                                const batch = v.get('batch') ? v.get('batch') : ''
                                const batchUuid = v.get('batchUuid') ? v.get('batchUuid') : ''
                                const expirationDate = v.get('expirationDate') ? v.get('expirationDate') : ''
                                const batchName = expirationDate ? `${batch}(${expirationDate})` : batch

                                return (
                                    <div key={v.get('cardUuid')}>
                                        <div className='running-preview-item'>
                                            <div className='running-preview-item-title'>
                                                <span className='spot' style={{display: stockCardList.size > 1 ? '' : 'none'}}>• </span>
                                                存货：
                                            </div>
                                            <div className='running-preview-item-content'>{`${v.get('code')}_${v.get('name')}`}</div>
                                        </div>
                                        <div style={{display: v.get('warehouseCardUuid') ? '' : 'none'}}>
                                            <div className='running-preview-item'>
                                                <div className='running-preview-item-title'>仓库：</div>
                                                <div className='running-preview-item-content'>
                                                    {`${v.get('warehouseCardCode')} ${v.get('warehouseCardName')}`}
                                                </div>
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
                                            <div className='running-preview-item-content'>{formatMoney(v.get('amount'),2,'')}</div>
                                        </div>
                                    </div>
                                )
                            }
                            
                        ) : null
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

export class Other extends React.Component {

    render() {

        return (
            <div>
                没写
            </div>
        )
    }
}
