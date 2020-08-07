import React from 'react'
import { connect }	from 'react-redux'

import * as Limit from 'app/constants/Limit.js'
import { Button, Modal, Input, message, Tooltip } from 'antd'
import { TableWrap, TableBody, TableTitle, TableItem, TableOver, TableAll, TableTree, AlertModal } from 'app/components'
import { Icon } from 'app/components'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import Title from './Title.jsx'
import CurrencyModel from './CurrencyModel.jsx'
import CurrencyItem from './CurrencyItem.jsx'
import SelectAcModal from './SelectAcModal.jsx'
import { fromJS, toJS }	from 'immutable'
import { treeCurrencySelect ,judgePermission} from 'app/utils'
import './style/index.less'

import * as currencyActions from 'app/redux/Config/Currency/currency.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
class Currency extends React.Component {

	componentDidMount() {
		this.props.dispatch(currencyActions.getFCListFetch())
		this.props.dispatch(currencyActions.getFCRelateAcListFetch())
		// this.props.dispatch(currencyActions.getModelFCListFetch())
		// this.props.dispatch(allActions.getAcListFetch())
		// this.props.dispatch(allActions.getAssListFetch())
	}

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.currencyState != nextprops.currencyState || this.props.homeState != nextprops.homeState
	}

	render() {

		const { dispatch, currencyState, allState, homeState } = this.props

		const detailList = homeState.getIn(['data', 'userInfo', 'pageController', 'MANAGER', 'preDetailList', 'FOREIGN_CURRENCY_SETTING', 'detailList'])
		// const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const acListTree = allState.get('cascadeAclist')
		const titleList = ['操作', '编码', '名称', '汇率', '是否本位币']
		const currencyModel = currencyState.get('currencyModel')
		const acListModalDisplay = currencyState.get('acListModalDisplay')
		const relatedAclist = currencyState.get('relatedAclist')
		const currencyList = currencyState.get('currencyList')
		const currencyModelList = allState.get('currencyModelList')
		const insertCurrencyList = currencyState.get('insertCurrencyList')
		const acRelateFCList = currencyState.get('acRelateFCList')
		const showCurrencyModal = currencyState.get('showCurrencyModal')
		const showCurrencyInfo = currencyState.get('showCurrencyInfo')

		const aclist = allState.get('aclist')
		const categoryAclist = {
			'资产': [],
			'负债': [],
			'权益': [],
			'成本': [],
			'损益': []
		}
		aclist.toJS().forEach(v => {
			const key = {
				'流动资产': '资产',
				'非流动资产': '资产',
				'流动负债': '负债',
				'非流动负债': '负债',
				'所有者权益': '权益',
				'成本': '成本'
			}[v.category] || '损益'
			categoryAclist[key].push(v)
		})
		const categoryAc = {
			'资产': [],
			'负债': [],
			'权益': [],
			'成本': [],
			'损益': []
		}
		const cate = fromJS(categoryAclist)
		cate.map((v, i) => {
			const everaclist = v.toJS()
			const ac = treeCurrencySelect(everaclist)
			categoryAc[i]=ac
		})

		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])

		return (
			<ContainerWrap type="config-one" className="currency">
				<Title
					detailList={detailList}
					isSpread={isSpread}
					pageList={pageList}
					// configPermissionInfo={configPermissionInfo}
					dispatch={dispatch}
				/>
				<TableWrap notPosition={true}>
					<TableAll type="currency-config">
						<TableTitle
							className="currency-tabel-width"
							hasCheckbox={false}
							titleList={titleList}
							onClick={() => true}
						/>
						<TableBody>
							{currencyList.map((u, i) =>
								<CurrencyItem
									detailList={detailList}
									dispatch={dispatch}
									item={u}
									line={i}
									// configPermissionInfo={configPermissionInfo}
								/>
							)}

						</TableBody>
					</TableAll>
					<TableTree className="currency-left">
						<Tooltip placement="bottom" title={!judgePermission(detailList.get('RELATE_AC')).disabled ? '' : '当前角色无该权限'}>
							<div className="currency-left-title"
								onClick={() => {
									if (!judgePermission(detailList.get('RELATE_AC')).disabled ) {
										// if (!judgePermission(detailList.get('RELATE_AC')).disabled) {
										dispatch(currencyActions.changeSelectAcListModalDisplay())
									}
								}}
								>
								<span>关联科目</span>
								<Icon type="edit" />
							</div>
						</Tooltip>
						<div className="relatedaclist">
							{
								(acRelateFCList || []).map((u,i) => (
									<span className="relatedaclist-item" key={u.get('acid')}>
										<span>{u.get('acid')}</span>
										<span>{u.get('acfullname')}</span>
									</span>
								))

							}
						</div>
					</TableTree>
				</TableWrap>
				{/* 新增/修改币别弹窗 */}
				<CurrencyModel
					dispatch={dispatch}
					currencyModelList={currencyModelList}
					currencyModel={currencyModel}
					insertCurrencyList={insertCurrencyList}
					onChange={(value) => {
						const fcNumber = value.split(Limit.FC_NUMBER_AND_NAME_CONNECT)[0]
						const name = value.split(Limit.FC_NUMBER_AND_NAME_CONNECT)[1]
						const item = currencyModelList.find(v => v.get('fcNumber') == fcNumber)
						dispatch(currencyActions.changeCurrency(item))

					}}
				/>
				{/* 关联科目 */}
				<SelectAcModal
					dispatch={dispatch}
					relatedAclist={relatedAclist}
					acListTree={categoryAc}
					acRelateFCList={acRelateFCList}
					acListModalDisplay={acListModalDisplay}
				/>
				{/* 提示信息 */}
				<AlertModal
					visible={showCurrencyModal}
					message={showCurrencyInfo}
					onOk={() => dispatch(currencyActions.showCurrencyInfo())}
				/>

			</ContainerWrap>
		)
	}
}
