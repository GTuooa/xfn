import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Collapse } from 'antd'
import { Icon } from 'app/components'
import { formatNum, formatMoney } from 'app/utils'
const Panel = Collapse.Panel

@immutableRenderDecorator
export default
class Calculation extends React.Component {

    render() {

        const { title, lsItemData, activeKey, onChangeActiveKey, itemList, amountStr, amountStr2 } = this.props

        const header = <div className={activeKey.length > 0 ? "ylls-item-child-title" : "ylls-item-child-title-no"}>
            <span>{title}</span>
            <span>{activeKey.length > 0 ? '收起' : '展开'}<Icon type={activeKey.length > 0 ? "up" : "down"} /></span>
        </div>
        return (
            <div className="ylls-item-child-list">
                {
                    itemList && itemList.size ?
                        <Collapse bordered={false} activeKey={activeKey} onChange={onChangeActiveKey}>
                            <Panel showArrow={false} header={header} key="1">
                                <ul>
                                    {
                                        itemList.map((v, i) =>
                                            <li className="ylls-item-child-item" key={i}>
                                                <div>
                                                    <span>{`${v.get('categoryName')}`}</span>
                                                    <span>流水号：{v.get('flowNumber')}</span>
                                                </div>
                                                <div>
                                                    <span>金额</span>
                                                    <span>
                                                        {
                                                            amountStr === 'amount-tax'?
                                                                formatMoney(Number(v.get('amount'))-Number(v.get('tax')),2,'')
                                                                :
                                                                amountStr?
                                                                    formatMoney((v.get(amountStr)?v.get(amountStr):v.get(amountStr2)),2,'')
                                                                    :
                                                                    formatMoney(v.get('handleAmount'),2,'')
                                                        }
                                                    </span>
                                                </div>
                                            </li>
                                        )
                                    }
                                    {/* ${categoryTypeName[v.get('categoryType')]}_ */}
                                </ul>
                            </Panel>
                        </Collapse>
                    : ''
                }
            </div>
        )
    }
}
