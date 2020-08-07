import React, { PropTypes } from 'react'
import { Map, toJS } from 'immutable'
import { connect }	from 'react-redux'
import { Button, ButtonGroup, Icon, Container, Row, ScrollView, Collapse } from 'app/components'
import * as currencyActions from 'app/redux/Config/Currency/currency.action'
import * as allActions from 'app/redux/Home/All/aclist.actions'
import thirdParty from 'app/thirdParty'
import Item from './Item.jsx'
import './currency.less'

@connect(state => state)
export default
class Currency extends React.Component {

	componentDidMount() {
        thirdParty.setTitle({title: '外币设置'})
		thirdParty.setRight({show: false})
		thirdParty.setIcon({
            showIcon: false
        })

        this.props.dispatch(currencyActions.getFCListFetch())
		this.props.dispatch(currencyActions.getFCRelateAcListFetch())
		// this.props.dispatch(allActions.getAcListFetch())
	}

	render() {
		const {
			dispatch,
			currencyState,
			history,
			allState,
			homeState
		} = this.props

		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])
		const relatedAclist = currencyState.get('relatedAclist')
		const currencyList = currencyState.get('currencyList')
		const currencyModelList = allState.get('currencyModelList')
		const acRelateFCList = currencyState.get('acRelateFCList')
        const allCheckboxDisplay = currencyState.get('allCheckboxDisplay')
		// 是否有非零个item被选中
		const selectCurrencyItem = currencyList.some(v => v.get('selected'))

		return (
			<Container className="currency">
                <ScrollView flex="1">
					<Collapse title="关联科目" maxHeight=".33rem" showedCollapseFooter={true}>
                        {(acRelateFCList || []).map((u,i) => (
                                <span className="currency-info">
									<span className="currency-info-icon"><Icon type="label" color="#7E6B5A" /></span>
                                    <span className="currency-info-number">{u.get('acid')}</span>
                                    <span className="currency-info-name">{u.get('acfullname')}</span>
                                </span>
							))
						}
					</Collapse>
                    {currencyList.map((u,i) =>
                        <Item
                            key={i}
                            item={u}
                            idx={i}
							history={history}
                            dispatch={dispatch}
							allCheckboxDisplay={allCheckboxDisplay}
							isEnd={i === currencyList.size-1 ? true : false}
                        />
                    )}
				</ScrollView>
				<ButtonGroup height={50} style={{display: allCheckboxDisplay ? 'none' : ''}}>
					<Button
						disabled={!editPermission}
						onClick={() => {
							dispatch(currencyActions.getModelFCListFetch())
							dispatch(currencyActions.insertCurrency())
							history.push('/currency/relation/currencyoption')
						}}>
						<Icon type="add-plus"/><span>添加</span>
					</Button>
					<Button disabled={!editPermission} onClick={() => dispatch(currencyActions.showAllCurrencyCheckBox())}><Icon type="select" size='15'/><span>选择</span></Button>
					<Button disabled={!editPermission} onClick={() => history.push('/currency/relation/currencyac')}><Icon type="edit"/><span>关联科目</span></Button>
				</ButtonGroup>
				<ButtonGroup height={50} style={{display: allCheckboxDisplay ? '' : 'none'}}>
					<Button onClick={() => dispatch(currencyActions.selectAllCurrencyCheckBox())}><Icon type="choose"/><span>全选</span></Button>
					<Button onClick={() => dispatch(currencyActions.hideAllCurrencyCheckBox())}><Icon type="cancel"/><span>取消</span></Button>
					<Button disabled={!selectCurrencyItem} onClick={() => dispatch(currencyActions.deleteCurrencyFetch(currencyList))}><Icon type="delete"/><span>删除</span></Button>
				</ButtonGroup>
			</Container>
		)
	}
}
