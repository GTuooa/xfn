import React from 'react'
import { fromJS, toJS } from 'immutable'
import { connect }	from 'react-redux'
import { cxAccountActions } from 'app/redux/Search/Cxls'
import { yllsActions } from 'app/redux/Ylls'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { getCarrayOver } from './getCarrayOver'
import { Icon, Container, Row, ScrollView, Checkbox, Amount, ButtonGroup, Button, Single } from 'app/components'

const runningName = (flowType, direction) => {
	let name = ''
	if (flowType == 'FLOW_INADVANCE') {
		if (direction=='credit') {
			name = '预付款'
		} else {
			name = '预收款'
		}
	} else {
		if (direction=='credit') {
			name = '应付款'
		} else {
			name = '应收款'
		}
	}
	return name
}

@connect(state => state)
export default
class Sfgl extends React.Component {
	state = {
		isEdit: false
	}

	componentDidMount() {
		this.props.dispatch(cxAccountActions.getBusinessManagerCardList())
		this.props.dispatch(cxAccountActions.getManageList())
	}

	render() {
		const { dispatch, cxAccountState, history, homeState } = this.props
		const { isEdit } = this.state

		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])

		const hsgl = cxAccountState.get('hsgl')
		const contactsCardList =  hsgl.get('contactsCardList')
		const cardNameList =  hsgl.get('cardNameList')

		const contactsCard = hsgl.get('contactsCard')
		const isCheck = hsgl.get('isCheck')//是否勾选查看已核销流水
		const dataList = hsgl.get('dataList')
		const isAll = contactsCard.get('name') == '全部往来单位' ?  true : false

		return (
			<Container className="cxhsgl">
				<div className='cxhsgl-flex'>
					<Single
						className='top-flex'
						district={contactsCardList.toJS()}
						title="选择往来关系"
						onOk={(value) => {
							if (value.value.split(Limit.TREE_JOIN_STR)[0]=='') {//选择全部往来单位
								dispatch(cxAccountActions.changeCxlsData(['hsgl', 'isCheck'], false))
							}
							dispatch(cxAccountActions.changeCxlsCard('contactsCard', value.value))
							dispatch(cxAccountActions.getManageList())

					}}>
						<div> {`${contactsCard.get('code')} ${contactsCard.get('name')}`} </div>
						<Icon type="triangle" />
					</Single>

					{
						isAll ? null : <Single
							className='top-flex left-line'
							district={[{key: '未核销流水', value: '0'}, {key: '全部往来流水', value: '1'}]}
							title="类型选择"
							onOk={(value) => {
								let hasHx = value.value == '1' ? true : false
								dispatch(cxAccountActions.changeCxlsData(['hsgl', 'isCheck'], hasHx))
								dispatch(cxAccountActions.getManageList())
						}}>
							<span>{isCheck ? '全部往来流水' : '未核销流水'}</span>
							<Icon type="triangle" />
						</Single>
					}
				</div>

				<ScrollView flex="1" uniqueKey="cxls-sfgl" savePosition>
					{
						dataList.map((v, i) => {
							const selected = v.get('selected')
							const uuid = v.get('uuid')
							const beOpened = v.get('beOpened')
							const buttonContent = getCarrayOver(dispatch, v, editPermission)
							const runningDate = v.get('runningDate') ? v.get('runningDate').replace(/-/g, '/') : ''
							const cardAbstract = v.get('cardAbstract') ? v.get('cardAbstract') : ''
							const runningAbstract = `${v.get('runningAbstract')}${cardAbstract}`
							return (
								<div key={uuid} className='cxhsgl-item'>
									<div onClick={() => {
										if (isEdit) {
											dispatch(cxAccountActions.changeCxlsData(['hsgl', 'dataList', i, 'selected'], !selected))
										} else {
											if (beOpened) {//是期初的屏蔽掉
												return
											}
											sessionStorage.setItem("ylPage", "cxls")
											let idx = dataList.filter(v => v.get('beOpened')==false).findIndex(w => w.get('uuid') == uuid)
											dispatch(yllsActions.getYllsSingleAccount(history, 'CX_HSGL', uuid, idx, true))
											dispatch(cxAccountActions.hsglToYlData('CX_SFGL'))
										}
									}}>
										<div className='cxhsgl-item-line cxhsgl-item-flex' style={{display: isEdit ? '' : 'none'}}>
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
												{beOpened ? runningAbstract : v.get('categoryName')}
											</div>
											<div>
												<Amount showZero>{isCheck ? v.get('amount') : v.get('notHandleAmount')}</Amount>
											</div>
										</div>
										<div className="overElli cxhsgl-disabled cxhsgl-item-flex"
											style={{display: beOpened ? 'none' : ''}}
										>
											{runningAbstract}
										</div>
										<div className='cxhsgl-item-flex cxhsgl-disabled'>
											<div>
												<span className='cxhsgl-item-border'>
													{ runningName(v.get('flowType'), v.get('direction')) }
												</span>
											</div>
											<div className='overElli'>
												核账对象：{v.get('cardPersonName') ? v.get('cardPersonName') : `${contactsCard.get('code')} ${contactsCard.get('name')}`}
											</div>
										</div>
									</div>

									<div className='cxhsgl-item-flex cxhsgl-item-bottom'
										style={{display: isCheck || buttonContent ? '' : 'none'}}
									>
										{
											isCheck ? <div className="cxhsgl-disabled">
												未处理：<Amount showZero>{v.get('notHandleAmount')}</Amount>
											</div> : <div></div>
										}
										<div>
											{buttonContent}
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
						onClick={() => dispatch(cxAccountActions.deleteLs(dataList, 'CX_SFGL'))}
					>
						<Icon type="delete"/><span>删除</span>
					</Button>
					<Button
						style={{display: isEdit && (!isCheck) && contactsCard.get('uuid') ? '' : 'none'}}
						disabled={!(dataList.some(v => v.get('selected'))) || !editPermission}
						onClick={() => {
							dispatch(cxAccountActions.cxhsglAllBatch('CX_SFGL'))
							dataList.forEach(v => {
								if (v.get('selected') && v.get('beOpened')) {
									dispatch(cxAccountActions.getSfglCategoryList(v.get('assType'), v.get('uuid')))
								}
							})
						}}
					>
						<span>一键收付</span>
					</Button>
				</ButtonGroup>
			</Container>
		)
	}
}
