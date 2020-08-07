import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as Icons from './Icons'

const components = {
    'down': 'DownOutlined',
    'left': 'LeftOutlined',
    'right': 'RightOutlined',
    'close': 'CloseOutlined',
    'plus': 'PlusOutlined',
    'up': 'UpOutlined',
    'filter': 'FilterOutlined',
    'download': 'DownloadOutlined',
    'left-circle': 'LeftCircleOutlined',
    'reload': 'ReloadOutlined',
    'zoom-out': 'ZoomOutOutlined',
    'minus-circle': 'MinusCircleOutlined',
    'zoom-in': 'ZoomInOutlined',
    'plus-circle': 'PlusCircleOutlined',
    'printer': 'PrinterOutlined',
    'right-circle': 'RightCircleOutlined',
    'file': 'FileOutlined',
    'calendar': 'CalendarOutlined',
    'step-backward': 'StepBackwardOutlined',
    'caret-left': 'CaretLeftOutlined',
    'caret-right': 'CaretRightOutlined',
    'step-forward': 'StepForwardOutlined',
    'edit': 'EditOutlined',
    'check': 'CheckOutlined',
    'check-circle': 'CheckCircleOutlined',
    'info-circle-o': 'InfoCircleOutlined',
    'arrow-up': 'ArrowUpOutlined',
    'arrow-down': 'ArrowDownOutlined',
    'search': 'SearchOutlined',
    'exclamation-circle-o': 'ExclamationCircleOutlined',
    'close-circle': 'CloseCircleOutlined',
    'setting': 'SettingOutlined',
    'question-circle-o': 'QuestionCircleOutlined',
    'exclamation-circle': 'ExclamationCircleOutlined',
    'delete': 'DeleteOutlined',
    'upload': 'UploadOutlined',
    'info-circle': 'InfoCircleOutlined',
    'swap': 'SwapOutlined',
}

@immutableRenderDecorator
class Icon extends React.Component{
	render() {
        const { type, className, ...other } = this.props

        const Component = Icons[components[type]]

        if (Component) {
            return (
                <Component className={className} {...other} />
            )
        } else {
            return <i></i>
        }
	}
};

export default Icon;