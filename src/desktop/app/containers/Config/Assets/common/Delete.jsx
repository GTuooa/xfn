import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Modal , Button, Tooltip }	from 'antd'

@immutableRenderDecorator
export default
class CardDelete extends React.Component {// 删除卡片弹窗

	render() {

		const {
            disabled,
			visible,
			onOk,
			onCancel,
			tipText,
            ButtonClick,
			style,
			// configPermissionInfo,
			froms,
			disabledFlag
		} = this.props
		return (
			<span>
				<Tooltip 
					placement="bottom" 
					// title={!configPermissionInfo.getIn(['edit', 'permission']) ? '当前角色无该权限' : (disabled ? '请选择要删除的选项' : '')}
					title={disabledFlag ? '当前角色无该权限' : (disabled ? '请选择要删除的选项' : '')}
				>
					<Button
						disabled={disabled}
						style={style}
						className={froms === 'cardBomb' ? '' : "title-right"}
						type="ghost"
						onClick={ButtonClick}
						>
						删除
					</Button>
				</Tooltip>
				{/* <div className='modalBomb' style={{display: visible ? '' : 'none'}}> */}
				<div style={{display: visible ? '' : 'none'}}>
					<Modal
						visible={visible}
						width={'420px'}
						style={{paddingTop: '100px'}}
						onOk={onOk}
						onCancel={onCancel}
						title="确认删除提示"
						okText="删除"
						cancelText="取消"
						>
						<p style={{'fontSize':'14px','color':'#333333','margin': '10px 0'}}>{tipText}</p>
					</Modal>
				</div>
			</span>
		)
	}
}
