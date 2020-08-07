import React from 'react'
import { fromJS, toJS } from 'immutable'
import { connect }	from 'react-redux'
import { cxAccountActions } from 'app/redux/Search/Cxls'
import { yllsActions } from 'app/redux/Ylls'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { Icon, Container, Row, ScrollView, Checkbox, Amount, ButtonGroup, Button } from 'app/components'


@connect(state => state)
export default
class Sfgl extends React.Component {
	state = {
		isEdit: false
	}

	componentDidMount() {
		this.props.dispatch(cxAccountActions.getKjfpList())
	}

	render() {
		const { dispatch, cxAccountState, history, homeState } = this.props
		const { isEdit } = this.state

		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])

		const hsgl = cxAccountState.get('hsgl')
		const billMakeOutType = hsgl.get('billMakeOutType')
		const dataList = hsgl.get('dataList')

		return (
			<Container className="cxhsgl">
				<div className='cxhsgl-flex'>
					<Row className='top-flex'
						onClick={() => {
							thirdParty.actionSheet({
								title: "开具类型",
								cancelButton: "取消",
								otherButtons: ['全部类型', '销项开票', '退销开票'],
								onSuccess: function(result) {
									if (result.buttonIndex == -1) {
										return
									}
									dispatch(cxAccountActions.changeCxlsData(['hsgl', 'billMakeOutType'], ['', 'BILL_MAKE_OUT_TYPE_XS', 'BILL_MAKE_OUT_TYPE_TS'][result.buttonIndex]))
									dispatch(cxAccountActions.getKjfpList())
								}
							})
					}}>
						<div> {billMakeOutType == '' ? '全部' : {BILL_MAKE_OUT_TYPE_XS: '销项开票', BILL_MAKE_OUT_TYPE_TS: '退销开票'}[billMakeOutType]} </div>
						<Icon type="triangle" />
					</Row>
				</div>

				<ScrollView flex="1" uniqueKey="cxls-kjfp" savePosition>
					{
						dataList.map((v, i) => {
							const selected = v.get('selected')
							const runningDate = v.get('runningDate') ? v.get('runningDate').replace(/-/g, '/') : ''
							const cardAbstract = v.get('cardAbstract') ? v.get('cardAbstract') : ''
							const runningAbstract = `${v.get('runningAbstract')}${cardAbstract}`
							return (
								<div key={v.get('uuid')} className='cxhsgl-item'>
									<div onClick={() => {
										if (isEdit) {
											dispatch(cxAccountActions.changeCxlsData(['hsgl', 'dataList', i, 'selected'], !selected))
										} else {
											sessionStorage.setItem("ylPage", "cxls")
											dispatch(yllsActions.getYllsSingleAccount(history, 'CX_HSGL', v.get('parentUuid'), i, true))
											dispatch(cxAccountActions.hsglToYlData('CX_KJFP'))
										}

									}}>

										<div className='cxhsgl-item-line cxhsgl-item-flex'>
											<div onClick={() => dispatch(cxAccountActions.changeCxlsData(['hsgl', 'dataList', i, 'selected'], !selected))}>
												<Checkbox
													checked={selected ? true : false}
													style={{display: isEdit ? '' : 'none', 'paddingRight': '10px'}}
												/>
												{v.get('flowNumber')}
											</div>
											<div className='cxhsgl-disabled'>{runningDate}</div>
										</div>
										<div className='cxhsgl-item-flex'>
											<div className='overElli'>
												{v.get('categoryName')}
											</div>
											<div>
												<div><Amount showZero>{v.get('tax')}</Amount></div>
											</div>
										</div>
										<div className="overElli cxhsgl-disabled cxhsgl-item-flex">{runningAbstract}</div>
										<div className='cxhsgl-item-flex cxhsgl-disabled'>
											<span className='cxhsgl-item-border'>{v.get('manageTypeName')}</span>
											<span>价税合计：<Amount showZero>{v.get('amount')}</Amount></span>
											<span className='cxhsgl-item-margin-left'>税率：{v.get('taxRate')}%</span>
										</div>
									</div>

									<div className='cxhsgl-item-flex cxhsgl-item-bottom'>
										<div></div>
										<div>
											<span>
												<Button
													disabled={!editPermission}
													onClick={() => {
														dispatch(cxAccountActions.getCxlsSingle(v.get('uuid'), 'CX_HSGL', 'KJFP'))
													}}>
													开票
												</Button>
											</span>
										</div>
									</div>
								</div>
							)
						})
					}
				</ScrollView>

				<ButtonGroup>
					{/* <Button
						style={{display: isEdit ? 'none' : ''}}
						onClick={() => dispatch(cxAccountActions.changeCxlsData(['views', 'currentRouter'], 'CXLS'))}>
						<Icon type="choose"/><span>返回</span>
					</Button> */}
					<Button
						style={{display: isEdit ? 'none' : ''}}
						disabled={dataList.size === 0}
						onClick={() => this.setState({ isEdit: true })}
					>
						<Icon type="select" size='15'/><span>选择</span>
					</Button>

					<Button
						style={{display: isEdit ? '' : 'none'}}
						onClick={() => dispatch(cxAccountActions.selectLsAll('CX_HSGL', true))}>
						<Icon type="choose"/><span>全选</span>
					</Button>
					<Button
						style={{display: isEdit ? '' : 'none'}}
						onClick={() => {
							this.setState({ isEdit: false })
							dispatch(cxAccountActions.selectLsAll('CX_HSGL', false))
						}}>
						<Icon type="cancel"/><span>取消</span>
					</Button>
					<Button
						style={{display: isEdit ? '' : 'none'}}
						disabled={!(dataList.some(v => v.get('selected'))) || !editPermission}
						onClick={() => dispatch(cxAccountActions.deleteLs(dataList, 'CX_KJFP'))}
					>
						<Icon type="delete"/><span>删除</span>
					</Button>
					<Button
						style={{display: isEdit && billMakeOutType ? '' : 'none'}}
						disabled={!(dataList.some(v => v.get('selected'))) || !editPermission}
						onClick={() => dispatch(cxAccountActions.cxhsglAllBatch('CX_KJFP'))}
					>
						<span>一键开票</span>
					</Button>
				</ButtonGroup>
			</Container>
		)
	}
}
