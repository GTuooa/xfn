
import React, { Fragment } from 'react'
import { InputItem } from 'antd-mobile'
import { Row, Icon, ChosenPicker } from 'app/components'
import { chineseAmount} from 'app/utils'
import Star from './Star'
import CommonRow from './CommonRow'

import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'

export default
class CommonInput extends React.Component {
    componentDidMount() {

    }
    render() {
        const {
            label,
            placeHolder,
            value,
            className,
            onChange,
            dispatch,
            type,
            item
        } = this.props
        return (
            type === 'money' ?
            <Fragment>

                <div className={['approval-item',className].join(' ')} style={{marginBottom:0,borderBottom:'1px solid #eee'}}>
                        <InputItem
                            value={item.get('value')}
                            placeholder={placeHolder}
                            onChange={value => {
                                if (/^-{0,1}\d*\.?\d{0,2}$/g.test(value)) {
                                    onChange(value)
                                }
                            }}
                        >
                            {item.get('required')?<Star/>:''}{label}
                        </InputItem>
                </div>
                <div className={['approval-item input-disabled',className].join(' ')}>
                    <label style={{color:'#999'}}>大写</label>
                    <div className='approval-text'  style={{color:'#999'}}>
                        <span>
                            {chineseAmount(item.get('value'))}
                        </span>
                    </div>
                    {/* <InputItem
                        disabled={true}
                        value={chineseAmount(item.get('value'))}
                    >
                        <span style={{color:'#999'}}>{'大写'}</span>

                    </InputItem> */}
                </div>
            </Fragment>
            :
            <div className={['approval-item',className].join(' ')}>
                    <InputItem
                        value={item.get('value')}
                        placeholder={placeHolder}
                        onChange={value => {
                            if (type === 'number') {
                                if (/^-{0,1}\d*\.?\d{0,2}$/g.test(value)) {
                                    onChange(value)
                                }

                            } else {
                                onChange(value)
                            }
                        } }
                    >
                        {item.get('required')?<Star/>:''}{label}
                    </InputItem>
            </div>

        )
    }
}
