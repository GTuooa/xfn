import React, { PropTypes }	from 'react'
import { Map, toJS } from 'immutable'
import { connect }	from 'react-redux'
import * as assconfigActions from 'app/redux/Config/Ass/assconfig.action'
import './ass-reverse.less'
import { Input, Button, ButtonGroup, Icon, Container, Row, Form, Amount, ScrollView, PopUp } from 'app/components'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
@immutableRenderDecorator
export default
class AssTypeChangeConfirm extends React.Component {
    render(){
        const { showAssTypeChangeConfirmModal,dispatch,oldName,newName,history} = this.props
        return(
            <PopUp
                title={'信息确认'}
                visible={showAssTypeChangeConfirmModal}
                footerVisible={false}
                onCancel={() => dispatch(assconfigActions.changeAssTypeConfirmModalVisible(false))}
                footer={[
                    <span onClick={() => dispatch(assconfigActions.showReversConfirmModal(false))}>取消</span>,
                    <span onClick={() => {
						dispatch(assconfigActions.changeAssTypeName(oldName,newName,history,'true'))
					}}>
                        确定
                    </span>
                ]}
            >
                <div>该类别下的辅助核算对象超过1000，修改需要等待一段时间，是否确定修改</div>
            </PopUp>
        )
    }
}
