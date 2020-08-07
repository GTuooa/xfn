import React,{ Fragment } from 'react'
import { Row, Icon, ChosenPicker,  } from 'app/components'
import CommonChoose from './CommonChoose'
import CommonRow from './CommonRow'

import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'

export default
class CategoryComp extends React.Component {

    state = {
        visible: false,
    }

    componentDidMount() {
        const { idx, isMx } = this.props
        const needDispatch  = idx === 0 || !isMx
        needDispatch && this.props.dispatch(editApprovalActions.getCategorySubList(this.props.modelInfo.get('jrCategoryId'),this.props.modelInfo.get('jrCategoryProperty')))
    }

    render() {
        const {
            disabled,
            item,
            dispatch,
            modelInfo,
            onChange,
            className,
            placeArr
        } = this.props
        const { visible } = this.state
        let district = this.props.district.toJS()
        let list = []
        const loop = (data) => {
            data.forEach(v => {
                v['key'] = v['name']
                v['label'] = v['name']
                if (v['childList'].length) {
                    loop(v['childList'])
                }
            })
        }
        loop(district)
        return (
                <ChosenPicker
                    className={className}
                    visible={visible}
                    disabled={disabled}
                    district={district}
                    onChange={value => {
                        dispatch(editApprovalActions.changeModelString([...placeArr,'name'],value.name))
                        dispatch(editApprovalActions.changeModelString([...placeArr,'value'],value.fullName))
                    }}
                    onCancel={()=> { this.setState({visible: false}) }}
                >
                    <CommonRow
                        label={item.get('label')}
                        placeHolder={item.get('placeHolder')}
                        value={item.get('name')}
                        onDelete={() => {
                            dispatch(editApprovalActions.changeModelString([...placeArr,'name'],''))
                            dispatch(editApprovalActions.changeModelString([...placeArr,'value'],''))
                        }}
                        StarDisabled={!item.get('required')}
                    />
                </ChosenPicker>
        )
    }
}
