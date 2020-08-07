import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Button, Input, Checkbox } from 'antd'


import * as Limit from 'app/constants/Limit.js'
import { toJS ,fromJS } from 'immutable'


import './index.less'

@immutableRenderDecorator
export default
class CommonModal extends React.Component {
    state = {
        inputValue:''
    }
    render() {
        const {
            dispatch,
            modalStyle,
            modalName,
            cardList,
            curSelectUuid,
            cancel,
            allCheckBoxClick,
            singleCheckBoxClick,
            onOkCallback,
            hideEmpty,
            isCardUuid,
        } = this.props
        const { inputValue } = this.state
        const uuidString = isCardUuid ? 'cardUuid' : 'uuid'
        const list = cardList && cardList.size ? cardList : fromJS([])
        const allList = hideEmpty ? list : list.concat(fromJS([{name:'(空白)',[uuidString]:'空白',code: ''}]))
        const finallyList = allList.filter(v => inputValue ? v.get('code') && v.get('code').indexOf(inputValue)> -1 || v.get('name').indexOf(inputValue)> -1 : true)

        const checkedAll = finallyList.every(v => curSelectUuid.some(w => w === v.get(uuidString)))

        return (
            <div className='mxb-common-modal' style={modalStyle}>

                <div className="mxb-common-modal-title">
                    <span
                        className='title-icon'
                        onClick={(e)=>{
                            e.stopPropagation()
                            cancel()
                        }}
                    >
                        <Icon type="close" />
                    </span>

                </div>
                <div className="mxb-common-modal-content">
                    <div className='common-modal-serch'>
                    {
                        inputValue ?
                        <Icon className="search-delete" type="close-circle" theme='filled'
                            onClick={() => {
                                this.setState({inputValue:''})
                            }}
                        /> : null
                    }
                        <Icon
                            className="serch-icon"
                            type="search"
                            onClick={(e) => {
                                // this.setState({inputValue:e.target.value})
                            }}
                        />
                        <Input
                            className="serch-input"
                            placeholder={`筛选${modalName}`}
                            value={inputValue}
                            onChange={e => {
                                this.setState({inputValue:e.target.value})
                            }}
                        />
                    </div>
                    <div className="common-mocal-card-list">
                        <ul className='mxb-common-modal-account'>
                            {
                                !inputValue || '(全选)'.indexOf(inputValue) > -1 ?
                                <li>
                                    <Checkbox
                                      checked={checkedAll}
                                      onClick={(e)=>{
                                          e.stopPropagation()
                                          allCheckBoxClick(checkedAll,finallyList)
                                      }}

                                    />
                                    <span>(全选)</span>
                                </li>: null
                            }

                            {
                                finallyList.map(item => {
                                    const checked = curSelectUuid.indexOf(item.get(uuidString)) > -1
                                    return <li key={item.get(uuidString)}>
                                        <Checkbox
                                          checked={checked}
                                          onClick={(e)=>{
                                              e.stopPropagation()
                                              singleCheckBoxClick(checked,item.get(uuidString))
                                          }}
                                        />
                                        <span>{
                                            item.get('code') !== 'COMNCRD' &&
                                            item.get('code') !== 'INDIRECT' &&
                                            item.get('code') !== 'ASSIST' &&
                                            item.get('code') !== 'MAKE' &&
                                            item.get('code') !== 'MECHANICAL' &&
                                            item.get('code') ? `${item.get('code')} ${item.get('name')}` : item.get('name')}</span>
                                    </li>
                                })
                            }
                        </ul>

                    </div>

                </div>
                <div className="mxb-common-modal-bottom">
                    <Button
                        type="primary"
                        onClick={(e)=>{
                            e.stopPropagation()
                            cancel()
                            onOkCallback(curSelectUuid)
                        }}
                    >确定</Button>

                </div>



            </div>
            )
    }

}
