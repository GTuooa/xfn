import React, { PropTypes } from 'react'
import { Map, toJS, fromJS } from 'immutable'
import { connect }	from 'react-redux'
import './Assets.less'
import { Container, ButtonGroup, Button, Icon, ScrollView, Row, Form, TextInput, SinglePicker } from 'app/components'
// import { Select } from 'app/containers/All/Thirdparty'
import * as acconfigActions from 'app/redux/Config/Ac/acconfig.action'
import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'
import thirdParty from 'app/thirdParty'
import { selectAc } from 'app/utils'
const {
	Label,
	Control,
	Item
} = Form

@connect(state => state)
export default
class AssetsCategory extends React.Component {

    componentDidMount() {
		const assetsConfigMode = this.props.assetsState.get('assetsConfigMode')
		const serialNumber = this.props.assetsState.getIn(['classification', 'serialNumber'])
	}

    render() {
		const { dispatch, assetsState, allState, history, homeState } = this.props

		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

		const assetsConfigMode = assetsState.get('assetsConfigMode')
		const serialNumber = assetsState.getIn(['classification', 'serialNumber'])
		if (assetsConfigMode === 'insert') {
			thirdParty.setTitle({title: '新增资产类别'})
		} else if (assetsConfigMode === 'modify') {
			if (serialNumber.length === 1) {
				thirdParty.setTitle({title: '修改资产类别'})
			} else {
				thirdParty.setTitle({title: '修改资产类别'})
			}
		}

		const currentassetsindex = assetsState.get('currentassetsindex')
		const classification = assetsState.get('classification')
		const assetsAcId = classification.get('assetsAcId')
		const debitId = classification.get('debitId')
		const creditId = classification.get('creditId')
		const assetsAcAssList = classification.get('assetsAcAssList')
		const debitAssList = classification.get('debitAssList')
		const creditAssList = classification.get('creditAssList')
		const defaultNetSalvage = classification.get('defaultNetSalvage')

		const acasslist = allState.get('acasslist')

		// console.log(1,classification.toJS())

		function getSourceList (assCategory) {
			return acasslist.filter(v => v.get('asscategory') === assCategory).getIn([0, 'asslist']).filter(v => !v.get('disableTime'))
			.map(v => {return {value: `${v.get('assid')}_${v.get('assname')}`, key: `${v.get('assid')}_${v.get('assname')}`}})
		}

		// console.log('assetsAcAssList', assetsAcAssList.toJS())
		// 科目选择
		const cascadeDataAclist = allState.get('cascadeDataAclist')
		const aclist = allState.get('aclist')

        return (
            <Container className="assetscategory assetscard">
                <ScrollView uniqueKey="assetsCategory-scroll" flex="1" savePosition>
                    <Form style={{'paddingTop': '10px'}}>
                        <Item label="编码">
                            <TextInput
								disabled={assetsConfigMode === 'modify'}
                                type="text"
								textAlign='right'
                                className={`form-input ${assetsConfigMode === 'modify' ? '' : 'number-input-assets'}`}
                                value={classification.get('serialNumber')}
								onChange={value => dispatch(assetsActions.changeClassificationId(value, classification.get('upperAssetsNumber')))}
                            />
                        </Item>
                        <Item label="名称" showAsterisk={true}>
                            <TextInput
                                type="text"
								textAlign='right'
								disabled={classification.get('serialNumber').length === 1}
								value={classification.get('serialName')}
                                className="form-input"
                                placeholder="名称填写..."
								onChange={value => dispatch(assetsActions.changeSerialName(value))}
                            />
							&nbsp;<Icon type='arrow-right' className="assets-item-color"/>
                        </Item>
                        <Item label="上级资产">
                            <TextInput
                                type="text"
                                className="form-input"
								textAlign='right'
                                value={classification.get('upperAssetsNumber') ? classification.get('upperAssetsNumber') + '_' + classification.get('upperAssetsName') : '无'}
                                disabled
                            />
                        </Item>
                        <Item label="折旧/分摊方法">
                            <TextInput
                                type="text"
                                className="form-input"
                                value={classification.get('depreciationMethod')}
                                disabled
								textAlign='right'
                            />
                        </Item>
                        <Item label="默认使用总期限" className="input-text-sign-box">
                            <TextInput
                                type="number"
								textAlign='right'
								value={classification.get('totalMonth')}
								className="number-input-assets form-input input-text-sign"
								onChange={value => dispatch(assetsActions.changeDefaultUseMonth(value))}
                            />
                        </Item>
                        <Item label="默认净残值率" className="input-percent-sign-box">
                            <TextInput
                                type="number"
								textAlign='right'
                                className="number-input-assets form-input input-percent-sign"
								value={classification.get('salvage')}
								onChange={value => dispatch(assetsActions.changeSalvage(value))}
                            />
                        </Item>
                        <Item
							label="资产科目"
							className="input-ac-sign-box"
							onClick={() => {
								dispatch(assetsActions.assetsToAc('assetsAc', 'classification'))
								selectAc(cascadeDataAclist, aclist, (...value) => dispatch(assetsActions.assetsSelectAc(...value)))
								// history.push('/config/acassets/ac')
								// dispatch(acconfigActions.assetsToAc('assetsAc', 'classification'))
							}}
						>
							{
								assetsAcId ?
								<span className="input-ac-wrap">
									<span className="input-ac">
										<span>
											{assetsAcId + '_' + classification.get('assetsAcName')}
										</span>
									</span>
									<Icon className="assets-item-triangle" type='triangle'/>
								</span>
								: <span className="input-ac-wrap">
									<span className="input-ac">
										<span style={{color: '#999'}}>
											科目选择
										</span>
									</span>
									<Icon className="assets-item-triangle" type='triangle'/>
								</span>
							}
                        </Item>
						{
							assetsAcAssList.size ?
							assetsAcAssList.map((v, i) =>{
								const sourceList = getSourceList(v.get('assCategory'))
								const assCategory = v.get('assCategory')
								return <Item
									label={`辅助核算(${v.get('assCategory')}):`}
									key={i}
									onClick={() => {
										if (!sourceList.size) {
											thirdParty.Alert(`${assCategory}中所有的核算项目为禁用状态，您可以：1、账套管理员在“辅助核算设置”页面中，启用已有的核算项目；2、在当前页面，“新增”新的核算项目`)
											return
										}
									}}
									>
									{sourceList.size ?
										<SinglePicker
											className="info-select"
											district={getSourceList(v.get('assCategory'))}
											onOk={(result) => dispatch(assetsActions.enterClassificationOrCardAsslist(result.value, 'classification', 'assetsAcAssList', i))}
										>
											{/* <span className="css-triangle"> */}
											<span className="css-triangle-color">
												<span>{v.get('assId') ?
													v.get('assCategory') + '_' + v.get('assId') + '_' + v.get('assName')
													: ''}
												</span>
											</span>
										</SinglePicker> :
										// <span className="css-triangle"></span>
										<span className="css-triangle-color"></span>
									}
									{/* {sourceList.size ?
										<Select
											className="info-select"
											source={getSourceList(v.get('assCategory'))}
											text={v.get('assId') ?
											v.get('assCategory') + '_' + v.get('assId') + '_' + v.get('assName')
											: ''}
											onOk={(result) => dispatch(assetsActions.enterClassificationOrCardAsslist(result.value, 'classification', 'assetsAcAssList', i))}
										/> : (<span className="css-triangle"></span>)
									} */}
								</Item>
							}) : ''
						}
						<Item
							label="账务处理借方科目"
							className="input-ac-sign-box"
							onClick={() => {
								dispatch(assetsActions.assetsToAc('debit', 'classification'))
								selectAc(cascadeDataAclist, aclist, (...value) => dispatch(assetsActions.assetsSelectAc(...value)))
								// history.push('/config/acassets/ac')
								// dispatch(acconfigActions.assetsToAc('debit', 'classification'))
							}}
						>
							{
								debitId ?
								<span className="input-ac-wrap">
									<span className="input-ac">
										<span>
											{debitId + '_' + classification.get('debitName')}
										</span>
									</span>
									<Icon type='triangle' className="assets-item-triangle"/>
								</span>
								: <span className="input-ac-wrap">
									<span className="input-ac">
										<span style={{color: '#999'}}>
											科目选择
										</span>
									</span>
									<Icon type='triangle' className="assets-item-triangle"/>
								</span>
							}
                        </Item>
						{
							debitAssList.size ?
							debitAssList.map((v, i) =>{
								const sourceList = getSourceList(v.get('assCategory'))
								const assCategory = v.get('assCategory')
								return <Item label={`辅助核算:(${v.get('assCategory')}):`}
									onClick={() => {
										if (!sourceList.size) {
											thirdParty.Alert(`${assCategory}中所有的核算项目为禁用状态，您可以：1、账套管理员在“辅助核算设置”页面中，启用已有的核算项目；2、在当前页面，“新增”新的核算项目`)
											return
										}
									}}>
									{sourceList.size ?
										<SinglePicker
											className="info-select"
											district={getSourceList(v.get('assCategory'))}
											onOk={(result) => dispatch(assetsActions.enterClassificationOrCardAsslist(result.value, 'classification', 'debitAssList', i))}
										>
											<span className="css-triangle-color">
												<span>{v.get('assId') ?
													v.get('assCategory') + '_' + v.get('assId') + '_' + v.get('assName') : ''}
												</span>
											</span>
										</SinglePicker> :
										(<span className="css-triangle-color"></span>)
									}
									{/* {sourceList.size ?
										<Select
											className="info-select"
											source={getSourceList(v.get('assCategory'))}
											text={v.get('assId') ?
											v.get('assCategory') + '_' + v.get('assId') + '_' + v.get('assName') : ''}
											onOk={(result) => dispatch(assetsActions.enterClassificationOrCardAsslist(result.value, 'classification', 'debitAssList', i))}
										/> : (<span className="css-triangle"></span>)
									} */}
								</Item>
							}) : ''
						}
						<Item
							label="账务处理贷方科目"
							className="input-ac-sign-box"
							onClick={() => {
								dispatch(assetsActions.assetsToAc('credit', 'classification'))
								selectAc(cascadeDataAclist, aclist, (...value) => dispatch(assetsActions.assetsSelectAc(...value)))
								// history.push('/config/acassets/ac')
								// dispatch(acconfigActions.assetsToAc('credit', 'classification'))
							}}
						>
							{
								creditId ?
								<span className="input-ac-wrap">
									<span className="input-ac">
										<span>
											{creditId + '_' + classification.get('creditName')}
										</span>
									</span>
									<Icon type='triangle' className="assets-item-triangle"/>
								</span>
								:
								<span className="input-ac-wrap">
									<span className="input-ac">
										<span style={{color: '#999'}}>
											科目选择
										</span>
									</span>
									<Icon type='triangle' className="assets-item-triangle"/>
								</span>
							}
                        </Item>
						{
							creditAssList.size ?
							creditAssList.map((v, i) =>{
								const sourceList = getSourceList(v.get('assCategory'))
								const assCategory = v.get('assCategory')
								return <Item
									label={`辅助核算(${v.get('assCategory')}):`}
									style={{display: creditAssList.size === 0 ? 'none' : ''}}
									onClick={() => {
										if (!sourceList.size) {
											thirdParty.Alert( `${assCategory}中所有的核算项目为禁用状态，您可以：1、账套管理员在“辅助核算设置”页面中，启用已有的核算项目；2、在当前页面，“新增”新的核算项目`)
											return
										}
									}}>
									{sourceList.size ?
										<SinglePicker
											className="info-select"
											district={getSourceList(v.get('assCategory'))}
											onOk={(result) => dispatch(assetsActions.enterClassificationOrCardAsslist(result.value, 'classification', 'creditAssList', i))}
										>
											<span className="css-triangle-color">
												<span>
													{v.get('assId') ?
														v.get('assCategory') + '_' + v.get('assId') + '_' + v.get('assName')
														: ''}
												</span>
											</span>
										</SinglePicker> :
										(<span className="css-triangle-color"></span>)
										// {/* <Select
										// 	className="info-select"
										// 	source={getSourceList(v.get('assCategory'))}
											// text={v.get('assId') ?
											// v.get('assCategory') + '_' + v.get('assId') + '_' + v.get('assName')
											// : ''}
										// 	onOk={(result) => dispatch(assetsActions.enterClassificationOrCardAsslist(result.value, 'classification', 'creditAssList', i))}
										// /> : (<span className="css-triangle"></span>) */}
									}
								</Item>
							}) : ''
						}
                        <Item label="备注">
                            <TextInput
                                type="text"
								value={classification.get('remark')}
                                className="form-input"
                                placeholder="备注填写..."
								textAlign='right'
								onChange={value => dispatch(assetsActions.changeRemark(value))}
                            />
							&nbsp;<Icon type='arrow-right' className="assets-item-color"/>
                        </Item>
                    </Form>
                </ScrollView>
                <Row>
                    <ButtonGroup>
						<Button onClick={() => history.goBack()}><Icon type='cancel'/><span>取消</span></Button>
                        <Button
							disabled={!editPermission}
							onClick={() => {
								dispatch(assetsActions.enterClassification(history))
							}}
						><Icon type='save'/><span>保存</span></Button>
                    </ButtonGroup>
                </Row>
            </Container>
        )
    }
}
