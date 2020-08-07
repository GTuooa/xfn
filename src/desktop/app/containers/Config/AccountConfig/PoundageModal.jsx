import React from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect }	from 'react-redux'
import './style/index.less'

import * as Limit from 'app/constants/Limit.js'
import { AcouontAcSelect } from 'app/components'
import { Switch, Input, Select, Checkbox, Button, Modal, message, TreeSelect } from 'antd'
const Option = Select.Option
const { TreeNode } = TreeSelect
import * as accountConfigActions from 'app/redux/Config/AccountConfig/accountConfig.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@connect(state => state)
export default
class PoundageModal extends React.Component {

	render() {
		const {
            dispatch,
            showModal,
            homeState,
			allState,
			accountConfigState,
			onClose,
			fromPage,
			financeCategory,
			poundageTemp,
		} = this.props
		const item = poundageTemp.get('item')
		const poundageNeedProject = poundageTemp.get('poundageNeedProject')
		const poundageNeedCurrent = poundageTemp.get('poundageNeedCurrent')
		const insertOrModify = poundageTemp.get('insertOrModify')
		const name = poundageTemp.get('name')
		const canUsed = poundageTemp.get('canUsed')
		const loop = (list) => list.map(v => {
			if (v.get('childList').size) {
				return <TreeNode
						value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
						title={v.get('name')}
						key={v.get('uuid')}
						disabled={true}
						>
					{loop(v.get('childList'))}
				</TreeNode>
			} else {
				return <TreeNode
					value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}

					title={v.get('name')}
					key={v.get('uuid')}
					onChange={(value) => {
						dispatch(accountConfigActions.changeAccountConfingCommonString('poundage','categoryUuid',value))
					}}
					>
				</TreeNode>
			}
		})


		return (
			<Modal
				okText="保存"
				visible={showModal}
				maskClosable={false}
				title={'手续费设置'}
				onCancel={() => {
					dispatch(accountConfigActions.initPoundageTemp())
					onClose()
				}}
				onOk={() => {
					dispatch(accountConfigActions.savePoundageConfig(insertOrModify,onClose))
				}}
				width="480px"
			>
            <div>
				<div style={{display:'flex',marginBottom:'10px'}}>
					<label style={{lineHeight:'28px'}}>处理类别：</label>
					<div>
						<TreeSelect
							style={{ width: 300 }}
							value={name}
							treeDefaultExpandAll
							onSelect={(value) => {
								const valueList = value.split(Limit.TREE_JOIN_STR)
								const uuid = valueList[0]
								const name = valueList[1]
								dispatch(accountConfigActions.changeAccountConfingCommonString('poundage','categoryUuid',uuid))
								dispatch(accountConfigActions.changeAccountConfingCommonString('poundage','name',name))
								dispatch(accountConfigActions.changeAccountConfingCommonString('poundage','canUsed',true))
								// dispatch(accountConfigActions.changeAccountConfingCommonString('poundage', 'poundageNeedProject', false))
								// dispatch(accountConfigActions.changeAccountConfingCommonString('poundage', 'poundageNeedCurrent', false))
								dispatch(accountConfigActions.selectAccountRunningCategory(uuid))

							}}
						>
							{financeCategory ? loop(fromJS([financeCategory])) : []}
						</TreeSelect>
					</div>
				</div>
				{
					insertOrModify === 'modify' && !canUsed ?
					<div style={{margin:'10px 0'}}>
						处理类别失效，请重新选择
					</div>:''
				}

				{
					item.get('beProject')?
					<div>
						<Checkbox
							onChange={(e)=>{
								dispatch(accountConfigActions.changeAccountConfingCommonString('poundage', 'poundageNeedProject', e.target.checked))
							}}
							checked={poundageNeedProject}>
							关联项目
						</Checkbox>
					</div>:''
				}
				{
					item.getIn(['acCost','contactsManagement'])?
					<div>
						<Checkbox
							onChange={(e)=>{
								dispatch(accountConfigActions.changeAccountConfingCommonString('poundage', 'poundageNeedCurrent', e.target.checked))
							}}
							checked={poundageNeedCurrent}>
							关联往来
						</Checkbox>
					</div>:''
				}

			</div>
			</Modal>
		)
	}
}
