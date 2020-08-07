import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Button, Input, Checkbox } from 'antd'


import * as Limit from 'app/constants/Limit.js'
import { toJS ,fromJS } from 'immutable'


import CheckBoxModule from './CheckBoxModule'
import './index.less'

@immutableRenderDecorator
export default
class CheckBoxModal extends React.Component {
    state = {
        newChooseObj: this.props.chooseCardObj
    }
    render() {
        const {
            dispatch,
            modalStyle,
            cancel,
            moudleList,
            chooseCardObj,
            onOkCallback,
        } = this.props

        const {
            newChooseObj
        } = this.state
        return (
            <div className='mxb-common-modal mxb-common-modal-checkbox-group' style={modalStyle}>

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
                <div className="mxb-common-modal-content checkbox-group-height">
                <div className="checkbox-group-content">
                    {
                        moudleList.map((item,index) => {
                            return <CheckBoxModule
                                item={item}
                                moduleIndex={index}
                                newChooseObj={newChooseObj}
                                checkBoxClick={(newChooseObj)=>{
                                    this.setState({newChooseObj})
                                }}
                            />
                        })
                    }
                </div>


                </div>
                <div className="mxb-common-modal-bottom">
                    <Button
                        type="primary"
                        onClick={(e)=>{
                            e.stopPropagation()
                            cancel()
                            onOkCallback(newChooseObj)
                        }}
                    >确定</Button>

                </div>



            </div>
            )
    }

}
