import React from 'react'
import { fromJS, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Button, Menu, Tooltip, Icon, Modal, Radio, Input ,message} from 'antd'
const RadioGroup = Radio.Group
import { ROOT } from 'app/constants/fetch.constant.js'
import { ImportModal, ExportModal } from 'app/components'

import * as allActions from 'app/redux/Home/All/all.action'
import * as fzhsActions from 'app/redux/Config/Ass/assConfig.action.js'

@immutableRenderDecorator
export default
class ReversAssDetail extends React.Component {
	constructor() {
		super()
		this.state = {

		}
	}

	render() {
		const {
			dispatch,
            reversAss,
			assMessage,
			reversAssConfirmShow,
			reversType,
			oldName,
			newName,
			assCategoryModalVisible,
			ass
		} = this.props

		const { reversAssName, showInfo } = this.state

		return (
            <div className='modalBomb' style={{display: reversAssConfirmShow ? '' : 'none'}}>
				{reversType==='id'?
					<Modal
						width="335px"
						visible={reversAssConfirmShow}
						title="信息确认"
						onOkText="确认修改"
						onCancel={() => dispatch(fzhsActions.changeReversAssConfirmShow(false))}
						onOk={() => {
							dispatch(fzhsActions.reversAssFetch(reversAss))
						}}
						>
						<div className="reversAssDetail">
							<div className="reversAssDetail-title">核算对象修改为：</div>
							<ul className="reverse-item-show-tip">
								<li>辅助类别：{reversAss.get('assCategory')}</li>
								<li>编&nbsp;&nbsp;码：{reversAss.get('assId')}</li>
								<li>名&nbsp;&nbsp;称：{reversAss.get('assName')}</li>
							</ul>
							<div className="reversAssDetail-title">已使用的内容将统一修改编码：</div>
							<ul className="reverse-item-show-tip">
								{assMessage.map(u => <li>{u === 'vc' ? '所有相关凭证' : u}</li>)}
							</ul>
						</div>
						<div className="reversAssDetail-bottom">您确定修改核算对象编码吗？</div>
					</Modal>
					:<Modal
						width="335px"
						visible={reversAssConfirmShow}
						title="信息确认"
						onOkText="确认修改"
						onCancel={() => dispatch(fzhsActions.changeReversAssConfirmShow(false))}
						onOk={() => {
							dispatch(fzhsActions.changeAssCategoryName(oldName,newName))
						}}
						>
						<div className="reversAssDetail">
						<div className="reversAssDetail-title">辅助类别名称修改为：</div>
							<ul className="reverse-item-show-tip">
								<li>原名称：{oldName}</li>
								<li>新名称：{newName}</li>
							</ul>
						</div>
						<div className="reversAssDetail-bottom">您确定修改辅助类别名称吗？</div>
					</Modal>
				}

				<Modal
					okText="确定"
					cancelText="取消"
					visible={assCategoryModalVisible}
					title="确认修改"
					onCancel={()=>{
						dispatch(fzhsActions.changeAssCategoryModalVisible(false))
						dispatch(fzhsActions.changeReverseNewName(""))
					}}
					onOk={()=>dispatch(fzhsActions.changeAssCategoryName(oldName,newName,ass,"true"))}
				>
					<p>该类别下的辅助核算对象超过1000，修改需要等待一段时间，是否确定修改</p>
				</Modal>
            </div>
		)
	}
}
