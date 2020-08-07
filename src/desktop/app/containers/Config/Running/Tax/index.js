import React from 'react'
import PropTypes from 'prop-types'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Tab } from 'app/components'
import { Button, Modal } from 'antd'
import * as thirdParty from 'app/thirdParty'
import PageSwitch from 'app/containers/components/PageSwitch'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'

import TaxRateConf from './TaxRateConf'

import * as taxConfActions from 'app/redux/Config/Running/tax/taxConf.action'
import { runningIndexActions } from 'app/redux/Config/Running/index'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as lsqcActions	from 'app/redux/Config/Lsqc/lsqc.action.js'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@immutableRenderDecorator
export default class Tax extends React.Component {

	static displayName = 'ConfigTax'

	componentDidMount() {

	}

	render() {

		const { dispatch,taxRateTemp, isTaxQuery, currentPage, editPermission, pageList, isSpread } = this.props

		const categoryName = taxRateTemp.get('categoryName')
		const categoryUuid = taxRateTemp.get('categoryUuid')
		const subordinateName = taxRateTemp.get('subordinateName')
		const isBalance = taxRateTemp.get('isBalance')
		const isBusiness = taxRateTemp.get('isBusiness')
		const showConfirmModal = taxRateTemp.get('showConfirmModal')
		const showModal = taxRateTemp.get('showModal')

		const titleList = [
			{
				value: '流水设置',
				key: 'running'
			},{
				value: '税费设置',
				key: 'taxRate'
			}
		]

		return (
			<ContainerWrap type="config-one" className="tax-config">
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread ? '' :
							<PageSwitch
								pageItem={pageList.get('Config')}
								onClick={(page, name, key) => {
									dispatch(homeActions.addPageTabPane('ConfigPanes', key, key, name))
									dispatch(homeActions.addHomeTabpane(page, key, name))
								}}
							/>
						}
						<Tab
							tabList={titleList}
							activeKey={currentPage}
							tabFunc={(v) => {
								if(currentPage === 'taxRate' && v.key !== currentPage && !isTaxQuery){
									thirdParty.Confirm({
										message: '税费设置未保存，是否保存',
										title: "提示",
										buttonLabels: ['放弃', '保存'],
										onSuccess : (result) => {
											if (result.buttonIndex === 1) {
												dispatch(allRunningActions.saveAccountConfTaxRate())
											}else{
												dispatch(allRunningActions.getRunningTaxRate())
												dispatch(taxConfActions.changeTaxConfQuery(true))
											}
										}
									})
								}
									dispatch(runningIndexActions.switchRunningIndexPage(v.key))
							}}


						/>
						{/* {titleList.map(v =>
							<span
								key={v.key}
								className={`title-conleft ${currentPage == v.key ? 'title-selectd' : ''}`}
								onClick={() => {
									if(currentPage === 'taxRate' && v.key !== currentPage && !isTaxQuery){
										thirdParty.Confirm({
											message: '税费设置未保存，是否保存',
											title: "提示",
											buttonLabels: ['放弃', '保存'],
											onSuccess : (result) => {
												if (result.buttonIndex === 1) {
													dispatch(allRunningActions.saveAccountConfTaxRate())
												}else{
													dispatch(allRunningActions.getRunningTaxRate())
													dispatch(taxConfActions.changeTaxConfQuery(true))
												}
											}
										})
									}
										dispatch(runningIndexActions.switchRunningIndexPage(v.key))

								}}
							>
								{v.value}
							</span>
						)} */}
						<Button
							className="title-btn"
							type="ghost"
							onClick={() => {
								dispatch(homeActions.addPageTabPane('ConfigPanes', 'Lsqc', 'Lsqc', '期初值'))
								dispatch(homeActions.addHomeTabpane('Config', 'Lsqc', '期初值'))
								dispatch(lsqcActions.getBeginningList(true))
							}}
						>
							期初值
						</Button>
					</div>
					<div className="flex-title-right">
						{
							!isTaxQuery?
								<Button
									disabled={!editPermission}
									className="title-right"
									type="ghost"
									onClick={() => {
										dispatch(allRunningActions.saveAccountConfTaxRate())
									}}
								>
									保存
								</Button>
								:
								null
						}
						{
							isTaxQuery && currentPage === 'taxRate' ?
								<Button
									disabled={!editPermission}
									className="title-right"
									type="ghost"
									onClick={() => {
										dispatch(taxConfActions.changeTaxConfQuery(false))
									}}
								>
									修改
								</Button>
								:
								<Button
									className="title-right"
									type="ghost"
									onClick={() => {
										dispatch(allRunningActions.getRunningTaxRate())
									}}
								>
									刷新
								</Button>
						}
					</div>
				</FlexTitle>
				<TaxRateConf
					dispatch={dispatch}
					taxRateTemp={taxRateTemp}
					isTaxQuery={isTaxQuery}
				/>
			</ContainerWrap>

		)
	}
}
