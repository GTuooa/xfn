
import React from 'react'
import { Row, Icon, ChosenPicker } from 'app/components'
import Star from './Star'

export default
class CommonRow extends React.Component {
    render() {
        const {
            label,
            StarDisabled,
            ArrowDisabled,
            placeHolder,
            type='single',
            value,
            onDelete,
            style,
            onClick,
            className
        } = this.props
        const showValue = type === 'single' && value || type === 'multiple' && value && value.length >= 1
        const valueArea = type === 'single'?
                        value
                        :
                        (value || []).map((v,i) =>
                            <span key={i}>{v}</span>
                        )
        return (
            <div className={['approval-item',className].join(' ')} style={style} onClick={onClick}>
                <label>{!StarDisabled?<Star/>:''}{label}</label>
                <div className='approval-text'>
                    <span className={showValue ?'approval-text-area':'approval-text-area approval-placeholder'}>
                        { showValue ? valueArea : placeHolder }
                    </span>
                    {
                        !ArrowDisabled?
                            showValue && type === 'single'?
                            <Icon
                                type="preview"
                                onClick={e => {
                                    e.stopPropagation()
                                    onDelete()

                                }}

                            />
                            :
                            <Icon
                                className={'approval-placeholder'}
                                type="arrow-right"
                            />
                        :''
                    }
                </div>
            </div>
        )
    }
}
