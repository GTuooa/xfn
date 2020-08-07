import React, { PropTypes }	from 'react'
import { Map, toJS } from 'immutable'
import { connect }	from 'react-redux'
import * as assconfigActions from 'app/redux/Config/Ass/assconfig.action'
import './ass-reverse.less'
import { Input, Button, ButtonGroup, Icon, Container, Row, Form, Amount, ScrollView, PopUp } from 'app/components'

import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class InfoConfirm extends React.Component {

	render() {
		const {
            reversAss,
            dispatch,
            assMessage,
            showReversModal,
			history,
			oldName,
			newName,
			ifAssConfig,
		} = this.props


		return (
            <PopUp
                title={'信息确认'}
                onCancel={() => dispatch(assconfigActions.showReversConfirmModal(false))}
                visible={showReversModal}
                footerVisible={false}
                footer={[
                    <span onClick={() => dispatch(assconfigActions.showReversConfirmModal(false))}>取消</span>,
                    <span onClick={() => {
						if(ifAssConfig){
							dispatch(assconfigActions.reversAssFetch(reversAss, history))
						}else{
							dispatch(assconfigActions.changeAssTypeName(oldName,newName,history))
						}
					}}>
                        确定
                    </span>
                ]}
                >
				{ifAssConfig ? <div className="ass-reverse-confirm">
                    <div className="ass-reverse-confirm-title">修改后核算对象修改为：</div>
						<ul className="ass-tip">
							<li className="ass-tip-item">辅助类别：{reversAss.get('assCategory')}</li>
							<li className="ass-tip-item">编码：{reversAss.get('assId')}</li>
							<li className="ass-tip-item">名称：{reversAss.get('assName')}</li>
						</ul>
						<div className="ass-reverse-confirm-title ass-reverse-confirm-title2">已使用的内容将统一修改编码：</div>
						<ul className="ass-tip">
							{
								assMessage.map(u => <li className="ass-tip-item">{u === 'vc' ? '所有相关凭证' : u}</li>)
							}
						</ul>
					</div>
					:
					<div className="ass-reverse-confirm">
					<div className="ass-reverse-confirm-title">辅助类别名称修改为：</div>
						<ul className="ass-tip">
							<li className="ass-tip-item">原名称：{oldName}</li>
							<li className="ass-tip-item">新名称：{newName}</li>
						</ul>
					</div>
				}

            </PopUp>
		)
	}
}
