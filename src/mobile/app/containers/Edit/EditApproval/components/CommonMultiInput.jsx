
import React, { Fragment } from 'react'
import { InputItem, TextareaItem } from 'antd-mobile'
import { Row, Icon, ChosenPicker } from 'app/components'
import { chineseAmount} from 'app/utils'
import Star from './Star'
import CommonRow from './CommonRow'

import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'

export default
class CommonMultiInput extends React.Component {
    render() {
        const {
            label,
            StarDisabled,
            ArrowDisabled,
            placeHolder,
            value,
            className,
            onChange,
            dispatch,
            type,
            item
        } = this.props
        return (
            <Fragment>
                <CommonRow
                    multiple={type === 'multiple'}
                    label={label}
                    placeHolder={''}
                    StarDisabled={!item.get('required')}
                    ArrowDisabled={true}
                    style={{marginBottom:0}}
                />
                <TextareaItem
                    className={['approval-textarea',className].join(' ')}
                    value={item.get('value')}
                    placeholder={placeHolder}
                    onChange={onChange}
                    rows={4}
                />
            </Fragment>


        )
    }
}
