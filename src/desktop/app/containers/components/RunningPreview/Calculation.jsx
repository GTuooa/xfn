import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Collapse, Icon } from 'antd'
import { formatNum, formatMoney } from 'app/utils'
const Panel = Collapse.Panel

import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'

@immutableRenderDecorator
export default
class Calculation extends React.Component {

    render() {

        const { title, activeKey, onChangeActiveKey, itemList, amountStr, amountStr2, isCurrentRunning, showRelatedRunning, dispatch } = this.props

        const header = <div className={activeKey.length > 0 ? "ylls-item-child-title" : "ylls-item-child-title-no"}>
            <span>{title}</span>
            <span>{activeKey.length > 0 ? '收起' : '展开'}<Icon type={activeKey.length > 0 ? "up" : "down"} /></span>
        </div>
        let showAmount = amountStr || 'handleAmount'
        return (
            <div className="ylls-item-child-list">
                {/* {
                    itemList && itemList.size ?
                        <Collapse bordered={false} activeKey={activeKey} onChange={onChangeActiveKey}>
                            <Panel showArrow={false} header={header} key="1">
                                <ul>
                                    {
                                        itemList.map((v, i) =>
                                            <li className="ylls-item-child-item" key={i}>
                                                <div>
                                                    <span
                                                        className={isCurrentRunning ? 'ylls-item-child-item-underline' : ''}
                                                        onClick={() => {
                                                            if (isCurrentRunning) {
                                                                dispatch(previewRunningActions.getPreviewRelatedRunningBusinessFetch(v.get('oriUuid'), () => showRelatedRunning()))
                                                            }
                                                        }}
                                                    >{v.get('beOpened')?'':'流水号：'+v.get('jrIndex')+'号'}</span>
                                                    <span>{`${v.get('categoryName')}`}</span>
                                                </div>
                                                <div>
                                                    <span>{v.get('oriAbstract')}</span>
                                                    <span>
                                                        {formatMoney(v.get(showAmount))}
                                                    </span>
                                                </div>
                                            </li>
                                        )
                                    }
                                </ul>
                            </Panel>
                        </Collapse>
                    : ''
                } */}
            </div>
        )
    }
}
