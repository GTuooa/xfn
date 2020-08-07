import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Row, Amount, Icon } from 'app/components'
import { stateFunc } from 'app/containers/Search/SearchRunning/Cxls/stateButton.js'
import { runningPreviewActions } from 'app/redux/Edit/RunningPreview'

@immutableRenderDecorator
export default
class Calculation extends React.Component {

    constructor(props) {
		super(props)
		this.state = {
			showList: false,
            showIdArr: []
		}
    }
    componentWillReceiveProps(){
        this.setState({showIdArr: []})
    }


    render() {

        const { itemList, dispatch, history, editPermission } = this.props
        const { showIdArr } = this.state
        const style = {color: '#222'}

        return (
            <div className='running-preview-bottom-card'>
                <div className='running-preview-four running-preview-bold running-preview-middle'>
                    <span className='running-preview-four-item'>流水类型</span>
                    <span className='running-preview-four-item center'>借方金额</span>
                    <span className='running-preview-four-item center'>贷方金额</span>
                    <span className='running-preview-four-item right'>状态</span>
                </div>
                {
                    itemList && itemList.map((v,i) => {
                        const debitAmount = v.get('debitAmount')
                        const creditAmount = v.get('creditAmount')
                        const showChild = showIdArr.includes(i)
                        const childListSize = v.get('childList').size
                        const jrIndex = v.get('jrIndex')
                        const oriDate = v.get('oriDate')

                        let typeName = '全部核销'
                        if (v.get('writeOff') == 1) {
                            typeName = '未核销'
                        } else if (v.get('writeOff') == 2) {
                            typeName = '部分核销'
                        }

                        if (i < itemList.size-1) {
                            const stateButton = stateFunc(dispatch, history, v, editPermission)
                            return (
                                <div key={i} className='running-preview-four-wrap' style={{paddingBottom: showChild?'0rem':'.03rem'}}>
                                    <span className='running-preview-item running-preview-gray'>
                                        <span className='running-preview-item-content'>
                                            {`${v.get('oriAbstract')} ${v.get('jrJvCardAbstract')}`}
                                        </span>
                                        { stateButton ? <span className='state-button'>{stateButton}</span> : null }
                                    </span>
                                    <div className='running-preview-four'>
                                        <span className='running-preview-four-item overElli'>{v.get('jrJvTypeName')}</span>
                                        <span className='running-preview-four-item center'>
                                            {debitAmount==null ? null : <Amount showZero className='running-preview-bold' style={style}>{debitAmount}</Amount>}
                                        </span>
                                        <span className='running-preview-four-item center'>
                                            {creditAmount==null ? null : <Amount showZero className='running-preview-bold' style={style}>{creditAmount}</Amount>}
                                        </span>
                                        <span className='running-preview-four-item right'>
                                            <span className='running-preview-blue'
                                                style={{display: v.get('childList').size ? '' : 'none'}}
                                                onClick={() => {
                                                    let oldShowIdArr = showIdArr
                                                    if (showIdArr.includes(i)) {
                                                        oldShowIdArr.splice(oldShowIdArr.indexOf(i),1)
                                                    } else {
                                                        oldShowIdArr.push(i)
                                                    }
                                                    this.setState({showIdArr: oldShowIdArr})
                                                }}
                                            >
                                                <span>详情</span>
                                                <Icon style={ showChild ? {transform: 'rotate(180deg)'} : ''} type="arrow-down"/>
                                            </span>
                                        </span>
                                    </div>
                                    {/* 详情 */}
                                    <div style={{display: showChild ? '' : 'none'}} className='running-preview-child-wrap'>
                                        <div className='running-preview-child running-preview-gray'>
                                            <span>核销情况：{typeName}</span>
                                            <span>待核销余额</span>
                                        </div>
                                        {
                                            v.get('childList').map((w,j) => {
                                                const debitAmount = w.get('debitAmount')
                                                const creditAmount = w.get('creditAmount')
                                                const childJrIndex = w.get('jrIndex')
                                                const childOriDate = w.get('oriDate')
                                                const isBold = (jrIndex==childJrIndex && oriDate==childOriDate) ? true: false

                                                if (j < childListSize-1) {
                                                    return (
                                                        <div key={j} className='running-preview-four-wrap running-preview-dotted'>
                                                            {
                                                                childJrIndex ? <span className='running-preview-item running-preview-light-gray'>
                                                                    {`${w.get('oriDate')} ${w.get('oriAbstract')}`}
                                                                </span> : null
                                                            }
                                                            <div className='running-preview-four'>
                                                                <span className='running-preview-four-item'>
                                                                    {childJrIndex ? `${childJrIndex} 号` : '期初余额'}
                                                                </span>
                                                                <span className='running-preview-four-item center'>
                                                                    {debitAmount==null ? null : <Amount showZero className={isBold ? 'running-preview-bold': ''} style={style}>{debitAmount}</Amount>}
                                                                </span>
                                                                <span className='running-preview-four-item center'>
                                                                    {creditAmount==null ? null : <Amount showZero className={isBold ? 'running-preview-bold': ''} style={style}>{creditAmount}</Amount>}
                                                                </span>
                                                                <span className='running-preview-four-item right'>
                                                                    <Amount showZero
                                                                        style={style}
                                                                        className={isBold ? 'running-preview-bold': ''}
                                                                    >
                                                                        {w.get('balanceAmount')}
                                                                    </Amount>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div key={j} className='running-preview-four running-preview-dotted'>
                                                            <span className='running-preview-four-item'>合计</span>
                                                            <span className='running-preview-four-item center'>
                                                                <Amount showZero style={style}>{debitAmount}</Amount>
                                                            </span>
                                                            <span className='running-preview-four-item center'>
                                                                <Amount showZero style={style}>{creditAmount}</Amount>
                                                            </span>
                                                            <span className='running-preview-four-item right'>
                                                                <Amount showZero style={style}>{w.get('balanceAmount')}</Amount>
                                                            </span>
                                                        </div>
                                                    )
                                                }
                                            })
                                        }
                                    </div>

                                </div>
                            )
                        } else {
                            return (
                                <div key={i} className='running-preview-four-wrap'>
                                    <div className='running-preview-four running-preview-bold'>
                                        <span className='running-preview-four-item'>合计</span>
                                        <span className='running-preview-four-item center'>
                                            <Amount showZero style={style}>{debitAmount}</Amount>
                                        </span>
                                        <span className='running-preview-four-item center'>
                                            <Amount showZero style={style}>{creditAmount}</Amount>
                                        </span>
                                        <span className='running-preview-four-item right'></span>
                                    </div>
                                </div>
                            )
                        }

                    })
                }
            </div>
        )
    }
}
