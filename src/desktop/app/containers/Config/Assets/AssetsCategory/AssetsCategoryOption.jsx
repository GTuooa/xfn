import React from 'react'
import { toJS } from 'immutable'
import { connect } from 'react-redux'

import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'

import { Input, Modal, Button, Icon, message } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { nameCheck } from 'app/utils'
import SelectAc from './SelectAc'
import SelectAss from './SelectAss'
import { judgePermission } from 'app/utils'
import './style.less'

@connect(state => state)
export default
class AssetsCategoryOption extends React.Component {

	render() {
		const {
			dispatch,
			allState,
			assetsState,
			classModalShow,
			homeState,
		} = this.props
		const CUD_ASSETS = homeState.getIn(['data','userInfo','pageController','MANAGER','preDetailList','ASSETS_SETTING','detailList','CUD_ASSETS'])
		// 科目选择ac(可选的末端科目)
		const lrAclist = allState.get('lrAclist')
		// asslist
		const allasscategorylist = allState.get('allasscategorylist')
		// 资产类别和卡片列表（缩略）
		// const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])

		// 类别修改还是新增
		const assetsClassMode = assetsState.getIn(['flags', 'assetsClassMode'])
		// 资产卡片模版
		const classification = assetsState.get('classification')
		
		const serialNumber = classification.get('serialNumber')
		const serialName = classification.get('serialName')

		const upperAssetsName = classification.get('upperAssetsName')
		const upperAssetsNumber = classification.get('upperAssetsNumber')
		const depreciationMethod = classification.get('depreciationMethod')
		const totalMonth = classification.get('totalMonth')
		const salvage = classification.get('salvage')
		const remark = classification.get('remark')

		const assetsAcId = classification.get('assetsAcId')
		const assetsAcName = classification.get('assetsAcName')
		const assetsAcAssList = classification.get('assetsAcAssList')

		const debitId = classification.get('debitId')
		const debitName = classification.get('debitName')
		const debitAssList = classification.get('debitAssList')

		const creditId = classification.get('creditId')
		const creditName = classification.get('creditName')
		const creditAssList = classification.get('creditAssList')

		return (
			<Modal
				width="480px"
				okText="保存"
				visible={classModalShow}
				maskClosable={false}
				title={assetsClassMode == 'insert' ? '新增资产类别' : '编辑资产类别'}
				onCancel={() => dispatch(assetsActions.changeClassificationModalDisplay())}
				footer={[
					<Button key="cancel" type="ghost" onClick={() => dispatch(assetsActions.changeClassificationModalDisplay())}
					>
						取 消
					</Button>,
					<Button key="ok"
						disabled={judgePermission(CUD_ASSETS).disabled}
						style={{display:judgePermission(CUD_ASSETS)?'':'none'}}
						type={assetsClassMode == 'insert' ? 'ghost' : 'primary'}
						onClick={() => {
							if(nameCheck(serialName)){
								return message.warn(`类别名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
							}
							dispatch(assetsActions.enterAssetsClassFetch())
						}}>
						保 存
					</Button>,
					<Button key="addNextAc" type="primary"
						disabled={judgePermission(CUD_ASSETS).disabled}
						style={{display: assetsClassMode == 'insert' ? 'inline-block' : 'none'}}
						onClick={() => {
							if(nameCheck(serialName)){
								return message.warn(`类别名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
							}
							let nextacid = Number(serialNumber) + 1
							dispatch(assetsActions.enterAssetsClassFetch(upperAssetsNumber, upperAssetsName, nextacid))
						}}>
						保存并新增
					</Button>
				]}
				>
				<div className="assets-kmset">
					<div className="assets-kmset-item">
						<label className="assets-kmset-item-lable">类别编码：</label>
						<Input
							className="assets-kmset-item-input"
							disabled={assetsClassMode == 'modify'}
							value={serialNumber}
							placeholder="必填，请输入数字"
							onChange={e => dispatch(assetsActions.changeAssetsclassNumber(e.target.value, upperAssetsNumber))}
						/>
					</div>
					<ul className="uses-tip">
						<li>类别编码支持两级，以1/2/3/4/5开头，一级编码长度为1位，二级编码长度为3位；</li>
					</ul>
					<div className="assets-kmset-item">
						<label className="assets-kmset-item-lable">类别名称：</label>
						<Input
							className="assets-kmset-item-input"
							disabled={assetsClassMode == 'modify' && serialNumber.length === 1}
							value={serialName}
							placeholder="必填，请输入类别名称"
							onChange={(e) => {
								dispatch(assetsActions.changeAssetsclassName(e.target.value))
							}}
						/>
					</div>
					<div className="assets-kmset-item">
						<label className="assets-kmset-item-lable">上级资产：</label>
						<Input
							className="assets-kmset-item-input"
							disabled={true}
							placeholder="无"
							value={upperAssetsNumber ? upperAssetsNumber + ' ' + upperAssetsName : ''}
							onChange={e => {}}
						/>
					</div>
					<div className="assets-kmset-item">
						<label className="assets-kmset-item-lable">折旧/摊销方法：</label>
						<Input
							className="assets-kmset-item-input"
							disabled={true}
							value={depreciationMethod}
							onChange={e => {}}
						/>
					</div>
					<div className="assets-kmset-item">
						<label className="assets-kmset-item-lable">默认使用总期限(月)：</label>
						<Input
							className="assets-kmset-item-input"
							value={totalMonth}
							placeholder="选填，请输入数字"
							onChange={(e) => {
								if(e.target.value > Limit.ASS_TOTAL_MONTH){
									return message.warn(`资产默认总期限不超过${Limit.ASS_TOTAL_MONTH}月`)
								}
								dispatch(assetsActions.changeAssetsClassTotalMonth(e.target.value))
							}}
						/>
					</div>
					<div className="assets-kmset-item">
						<label className="assets-kmset-item-lable">默认残值率(%)：</label>
						<Input
							className="assets-kmset-item-input"
							value={salvage}
							placeholder="选填，请输入小于100的数字"
							onChange={e => dispatch(assetsActions.changeAssetsClassSalvage(e.target.value))}
						/>
					</div>
					<div className="assets-kmset-item">
						<label className="assets-kmset-item-lable">默认资产科目：</label>
						<SelectAc
							className="assets-kmset-item-input"
							tipText='选填，请选择科目'
							acId={assetsAcId}
							acName={assetsAcName}
							debitAssList={assetsAcAssList}
							lrAclist={lrAclist}
							onChange={(value) => {
								const acid = value.split(' ')[0]
								const acItem = lrAclist.find(v => v.get('acid') === acid)
								dispatch(assetsActions.selectAssetsAc(acItem ? acid : '', acItem && acItem.get('acfullname'), acItem && acItem.get('asscategorylist'), 'classification', 'assetsAc'))
							}}
						/>
					</div>
					{
						assetsAcAssList.size ?
						assetsAcAssList.map((v, i) =>
							<div className="assets-kmset-item">
								<label className="assets-kmset-item-lable">{`辅助核算(${v.get('assCategory')}):`}</label>
								<SelectAss
									className="assets-kmset-item-input"
									assid={v.get('assId') ? v.get('assId') : ''}
									assname={v.get('assName') ? v.get('assName') : ''}
									asscategory={v.get('assCategory')}
									allasscategorylist={allasscategorylist}
									onChange={(value) => {
										const assid = value.split(' ')[0]
										const assname = value.split(' ')[1]
										dispatch(assetsActions.selectAssetsAss(assid, assname, i, 'classification', 'assetsAc'))
									}}
									dispatch={dispatch}
								/>
							</div>
						) : ''
					}
					<div className="assets-kmset-item">
						<label className="assets-kmset-item-lable">账务处理默认借方科目：</label>
						<SelectAc
							className="assets-kmset-item-input"
							tipText='选填，请选择科目'
							acId={debitId}
							acName={debitName}
							debitAssList={debitAssList}
							lrAclist={lrAclist}
							onChange={(value) => {
								const acid = value.split(' ')[0]
								const acItem = lrAclist.find(v => v.get('acid') === acid)
								dispatch(assetsActions.selectAssetsAc(acItem ? acid : '', acItem && acItem.get('acfullname'), acItem && acItem.get('asscategorylist'), 'classification', 'debit'))
							}}
						/>
					</div>
					{
						debitAssList.size ?
						debitAssList.map((v, i) =>
							<div className="assets-kmset-item">
								<label className="assets-kmset-item-lable">{`辅助核算(${v.get('assCategory')}):`}</label>
								<SelectAss
									className="assets-kmset-item-input"
									assid={v.get('assId') ? v.get('assId') : ''}
									assname={v.get('assName') ? v.get('assName') : ''}
									asscategory={v.get('assCategory')}
									allasscategorylist={allasscategorylist}
									onChange={(value) => {
										const assid = value.split(' ')[0]
										const assname = value.split(' ')[1]
										dispatch(assetsActions.selectAssetsAss(assid, assname, i, 'classification', 'debit'))
									}}
									dispatch={dispatch}
								/>
							</div>
						) : ''
					}
					<div className="assets-kmset-item">
						<label className="assets-kmset-item-lable">账务处理默认贷方科目：</label>
						<SelectAc
							className="assets-kmset-item-input"
							tipText='选填，请选择科目'
							acId={creditId}
							acName={creditName}
							debitAssList={creditAssList}
							lrAclist={lrAclist}
							onChange={(value) => {
								const acid = value.split(' ')[0]
								const acItem = lrAclist.find(v => v.get('acid') === acid)
								dispatch(assetsActions.selectAssetsAc(acItem ? acid : '', acItem && acItem.get('acfullname'), acItem && acItem.get('asscategorylist'), 'classification', 'credit'))
							}}
						/>
					</div>
					{
						creditAssList.size ?
						creditAssList.map((v, i) =>
							<div className="assets-kmset-item">
								<label className="assets-kmset-item-lable">{`辅助核算(${v.get('assCategory')}):`}</label>
								<SelectAss
									className="assets-kmset-item-input"
									assid={v.get('assId') ? v.get('assId') : ''}
									assname={v.get('assName') ? v.get('assName') : ''}
									asscategory={v.get('assCategory')}
									allasscategorylist={allasscategorylist}
									onChange={(value) => {
										const assid = value.split(' ')[0]
										const assname = value.split(' ')[1]
										dispatch(assetsActions.selectAssetsAss(assid, assname, i, 'classification', 'credit'))
									}}
									dispatch={dispatch}
								/>
							</div>
						) : ''
					}
					<div className="assets-kmset-item">
						<label className="assets-kmset-item-lable">备注：</label>
						<Input
							className="assets-kmset-item-input"
							value={remark}
							placeholder="选填，请输入备注"
							onChange={e => dispatch(assetsActions.changeAssetsClassRemark(e.target.value))}
						/>
					</div>
				</div>
			</Modal>
		)
	}
}
