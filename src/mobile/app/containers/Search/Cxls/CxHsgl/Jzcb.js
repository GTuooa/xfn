import React from 'react'
import { fromJS, toJS } from 'immutable'
import { connect }	from 'react-redux'
import { cxAccountActions } from 'app/redux/Search/Cxls'
import { yllsActions } from 'app/redux/Ylls'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import * as Common from 'app/containers/Edit/Lrls/CommonData.js'
import { getCarrayOver } from './getCarrayOver'
import { Icon, Container, Row, ScrollView, Checkbox, Amount, ButtonGroup, Button, Single } from 'app/components'


@connect(state => state)
export default
class Jzcb extends React.Component {
	state = {
		isEdit: false
	}

	componentDidMount() {
		this.props.dispatch(cxAccountActions.getFirstStockCardList())
		this.props.dispatch(cxAccountActions.getJzcbList())
	}

	render() {
		const { dispatch, cxAccountState, history, homeState } = this.props
		const { isEdit } = this.state

		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])

		const hsgl = cxAccountState.get('hsgl')
		const stockCardList =  hsgl.get('stockCardList')
		const cardNameList =  hsgl.get('cardNameList')

		const stockCard = hsgl.get('stockCard')
		const runningState = hsgl.get('runningState')
		const runningStateList = {STATE_YYSR_XS: '销售结转成本', STATE_YYSR_TS: '退销结转成本'}
		const dataList = hsgl.get('dataList')

		return (
			<Container className="cxhsgl">
				<div className='cxhsgl-flex'>
					<Single
						className='top-flex'
						district={[{key: '全部类型', value: ''},{key: '销售结转成本', value: 'STATE_YYSR_XS'},{key: '退销结转成本', value: 'STATE_YYSR_TS'}]}
						title='结转类型'
						onOk={(value) => {
							dispatch(cxAccountActions.changeCxlsData(['hsgl', 'runningState'], value.value))
							dispatch(cxAccountActions.getJzcbList())
					}}>
						<div> {runningState == '' ? '全部类型' : runningStateList[runningState]} </div>
						<Icon type="triangle" />
					</Single>

					<Single
						className='top-flex left-line'
						district={stockCardList.toJS()}
						title='存货'
						onOk={(value) => {
							dispatch(cxAccountActions.changeCxlsCard('stockCard', value.value))
							dispatch(cxAccountActions.getJzcbList())
					}}>
						<div> {stockCard.get('name') == '全部存货' ? '全部存货' : `${stockCard.get('code')} ${stockCard.get('name')}`} </div>
						<Icon type="triangle" />
					</Single>
				</div>

				<ScrollView flex="1" uniqueKey="cxls-jzcb" savePosition>
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
											const sendUuid = v.get('parentUuid') ? v.get('parentUuid') : v.get('uuid')
											dispatch(yllsActions.getYllsSingleAccount(history, 'CX_HSGL', sendUuid, i, true))
											dispatch(cxAccountActions.hsglToYlData('CX_JZCB'))
										}

									}}>
										<div className='cxhsgl-item-line cxhsgl-item-flex'>
											<div>
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
												<Amount showZero>{v.get('amount')}</Amount>
											</div>
										</div>
										<div className="overElli cxhsgl-disabled cxhsgl-item-flex">{runningAbstract}</div>
										<div className='cxhsgl-item-flex cxhsgl-disabled'>
											<div>
												<span className='cxhsgl-item-border'>{v.get('manageTypeName')}</span>
											</div>
										</div>
									</div>

									<div className='cxhsgl-item-flex cxhsgl-item-bottom'>
										<div></div>
										<div>
											<span>
												<Button
													disabled={!editPermission}
													onClick={() => {
														dispatch(cxAccountActions.getCxlsSingle(v.get('uuid'), 'CX_HSGL', 'JZCB'))
													}}>
													结转
												</Button>
											</span>
										</div>
									</div>
								</div>
							)
						})
					}
				</ScrollView>

				<ButtonGroup type="ghost">
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
						onClick={() => dispatch(cxAccountActions.deleteLs(dataList, 'CX_JZCB'))}
					>
						<Icon type="delete"/><span>删除</span>
					</Button>
					<Button
						style={{display: isEdit && runningState && stockCard.get('uuid') ? '' : 'none'}}
						disabled={!(dataList.some(v => v.get('selected'))) || !editPermission}
						onClick={() => dispatch(cxAccountActions.cxhsglAllBatch('CX_JZCB'))}
					>
						<span>一键结转</span>
					</Button>
				</ButtonGroup>
			</Container>
		)
	}
}
