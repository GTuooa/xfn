import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS, toJS }	from 'immutable'

import * as fzhsActions from 'app/redux/Config/Ass/assConfig.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

import * as Limit from 'app/constants/Limit.js'
import { Input, Select, Modal, Button, message, Radio } from 'antd'
import { judgePermission } from 'app/utils'
const Option = Select.Option
const RadioGroup = Radio.Group

import './style/index.less'

@immutableRenderDecorator
export default
class FzModel extends React.Component {

	render() {

		const {
			dispatch,
			assItem,
			tags,
			asscategory,
			FzModelDisplay,
			// configPermissionInfo,
			// PzPermissionInfo,
			lrpzFzhsPermission,
			fzhsState,
			judgeAssEnter,
			onCancel,
			onOk,
			onChangeId,
			onChangeName,
			CUD_ASS
		} = this.props
		const session = sessionStorage.getItem('handleAss')

		return (
			<Modal
				title={judgeAssEnter== 'insertLrpz' || sessionStorage.getItem('handleAss') == 'insert' ? '新增辅助核算' : '编辑'}
				cancelText="关闭"
				maskClosable={false}
				visible={FzModelDisplay}
				onCancel={onCancel}
				footer={[
					<Button key="cancel" type="ghost"
						onClick={onCancel}
						>
						取 消
					</Button>,
					<Button
						key="ok"
						//权限修改lrpzFzhsPermission
						// disabled={judgeAssEnter=='insertLrpz' ? !PzPermissionInfo.getIn(['edit', 'permission']) : !configPermissionInfo.getIn(['edit', 'permission'])}
						disabled={judgeAssEnter=='insertLrpz' ? judgePermission(lrpzFzhsPermission).disabled : judgePermission(CUD_ASS).disabled}
						// style={{display:judgePermission(CUD_ASS).display? '' : 'none'}}
						type={sessionStorage.getItem('handleAss') == 'insert' ? 'ghost' : 'primary'}
						onClick={() => onOk('save')}
						>
						保 存
					</Button>,
					<Button
						key="addNextAc"
						type="primary"
						// disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
						disabled={judgePermission(CUD_ASS).disabled}
						style={{display: sessionStorage.getItem('handleAss') == 'insert' ? (judgeAssEnter=='insertLrpz' ? 'none' : 'inline-block') : 'none'}}
						onClick={() => {
							onOk()
						}}>
						保存并新增
					</Button>
				]}
				width="480px"
				>
					<div className="fzmodel-wrap">
						<div className="fzmodel-item"
							style={{display: sessionStorage.getItem('handleAssCustom') === 'insert' ? 'block' : 'none'}}
							>
							<label>类别：</label>
							<Input
								value={assItem.get('asscategory')}
								onChange={(e) => {
									dispatch(fzhsActions.changeAssCategory(e.target.value))
								}}
							/>
						</div>
						<div className="fzmodel-item">
							<label>编码：</label>
							<Input
								value={assItem.get('assid')}
								placeholder="编码支持数字和大小写英文字母"
								// onChange={(e) => dispatch(fzhsActions.changeAssId(e.target.value))}
								onChange={(e) => {
									if(e.target.value.length > Limit.CODE_LENGTH){
										return message.warn(`辅助核算编码位数不能超过${Limit.CODE_LENGTH}位`)
									}
									onChangeId(e.target.value)
								}}
							/>
						</div>
						<div className="fzmodel-item">
							<label>名称：</label>
							<Input
								value={assItem.get('assname')}
								// onChange={(e) => dispatch(fzhsActions.changeAssName(e.target.value))}
								onChange={(e) => {
									onChangeName(e.target.value)
								}}

							/>
						</div>
						<div className="fzmodel-item"
							style={{display: judgeAssEnter=='insertLrpz' ? 'block' : 'none'}}
							>
							<label>类别：</label>
							<span className="fzmodel-item-category"
								>{assItem.get('asscategory')}
							</span>
						</div>
						<div className="fzmodel-item"
							style={{display: judgeAssEnter=='insertLrpz' || sessionStorage.getItem('handleAssCustom') === 'insert' ? 'none' : 'block'}}
							>
							<label>类别：</label>
							<Select
								style={{width: 150}}
								showSearch
								mode="tags"
								allowClear={true}
								optionFilterProp="children"
								notFoundContent="无法找到相应科目"
								value={asscategory ? [asscategory] : []}
								onChange={(value) => {
									if (value.length == 0) {
										dispatch(fzhsActions.changeAssCategory(''))
									} else if (value.length >= 1) {
										dispatch(fzhsActions.changeAssCategory(value[0]))
									}
								}}
								disabled={assItem.get('handleAss') == 'modifyass'}
								>
								{(tags || []).map((v, i) => <Option key={i} value={v}>{v}</Option>)}
							</Select>
						</div>
						<div className="fzmodel-item"
							style={{display: judgeAssEnter== 'insertLrpz' || sessionStorage.getItem('handleAss') == 'insert' || sessionStorage.getItem('handleAssCustom') === 'insert' ? 'none' : 'block'}}
							>
							<label>状态：</label>
							<RadioGroup
								value={assItem.get('disable') ==='TRUE' ? 'TRUE' : 'FALSE'}
								onChange={(e) => dispatch(fzhsActions.changeAssDisableState(e.target.value))}
								>
								<Radio key="FALSE" value={'FALSE'}>启用</Radio>
      							<Radio key="TRUE" value={'TRUE'}>禁用</Radio>
							</RadioGroup>
						</div>
						<ul className="uses-tip"
							style={{display: judgeAssEnter=='insertLrpz' ? 'none' : 'block'}}
							>
							<li>系统预置“客户”、“供应商”、“职员”、“项目”、“部门”五种辅助核算类别，这五种类别不能被修改或删除；</li>
							<li>用户可自定义辅助核算类别，请在“类别”栏输入需要自定义的类型名称即可；</li>
							<li>用户自定义的辅助核算类别下应至少有一个“编码”，否则该类别将被自动清除。</li>
						</ul>
					</div>
			</Modal>

		)
	}
}
