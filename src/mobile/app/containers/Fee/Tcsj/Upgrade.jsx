import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as tcgmActions from 'app/redux/Fee/Tcgm/tcgm.action.js'
import * as thirdParty from 'app/thirdParty'

import { Checkbox, Icon } from 'app/components'

@immutableRenderDecorator
export default
class Upgrade extends React.Component {

	render() {
        const {
            packageList,
            upgradeStatu,
            dispatch,
			corpName,
			orderWindowShow,
			orderNumber,
			corpId,
			ddUserId,
			history,
			showContract,
			agreeSj,
			expireDate
		} = this.props

        let upgradeArr = Array.from(packageList.keys(v => v)).map(v => v)

		let subjectName = ''
		let amount = 0
		let goodsCode = []
		let readySelect = []
		upgradeStatu.forEach(v => {
			const upgrade = packageList.getIn([v.get('productName'), v.get('index')])
			subjectName = subjectName ? subjectName + '+' + upgrade.get('productName') : upgrade.get('productName')
			amount = amount + upgrade.get('payFee')
			goodsCode.push(upgrade.get('productCode'))
			readySelect.push(upgrade.get('productName')+upgrade.get('relateNumber'))
		})

		return (
			<div>
				<div className="tcgm-upgrade-buy-wrap">
					<div className="tcgm-upgrade-buy-tip">
						增值模块
					</div>

					<ul className="tcgm-upgrade-buy-list">
						{
							upgradeArr.map((v, i) => {

								const key = v

								// 选中的升级套餐列表是否有当前的套餐
								const upgradeStatuItem = upgradeStatu.find(v => v.get('productName') === key)
								const upgrade = packageList.get(key)
								const index = upgradeStatuItem ? upgradeStatuItem.get('index') : 0
								const currentItem = upgrade.get(index)

								let menu = []
								upgrade.forEach((w, j) => menu.push(w.get('relateNumber')))

								return (
									<li
										key={i}
										className="tcgm-upgrade-buy-item"
									>
										<div
											className="tcgm-upgrade-buy-item-checkbox"
											onClick={() => dispatch(tcgmActions.tcgmSelectUpgradeItem(key))}
										>
											<Checkbox
												checked={upgradeStatuItem}
											/>
										</div>
										<div
											className="tcgm-upgrade-buy-info"
											onClick={() => {
												thirdParty.actionSheet({
													title: "选择规格",
													cancelButton: "取消",
													otherButtons: menu,
													onSuccess: (result) => {
														if (result.buttonIndex == -1) {
															return
														} else {
															dispatch(tcgmActions.tcgmSelectUpgradeItemIndex(v, result.buttonIndex))
														}
													}
												})
											}}
											>
											<span className="tcgm-upgrade-buy-equityname">
												{currentItem.get('productName')}
											</span>
											<span className="tcgm-upgrade-buy-relateNumber">
												{currentItem.get('relateNumber')}
											</span>
											<span className="tcgm-upgrade-buy-dropdown">
												<Icon type="arrow-down" />
											</span>
										</div>
									</li>
								)
							})
						}
						<div className="tcgm-upgrade-buy-item-selected">
							<span>{readySelect.length ? `已选：${readySelect.join('，')}，到期时间${expireDate}` : ''}</span>
						</div>
					</ul>
				</div>
				<div className="tcgm-upgrade-buy-money-show">
					<div className="tcgm-upgrade-buy-money">
						<span className="main-font-variable">需付金额：</span>
						<span className="tcgm-upgrade-buy-money-font">
							{'¥ ' + Math.floor(amount)}
						</span>
						<span className="tcgm-upgrade-buy-money-rule" onClick={() => {
							thirdParty.Alert('升级规格的到期时间将与会计版/智能版对齐，支付金额按升级规格与原规格的差价的剩余天数折算。如1月1日购买3账套会计版（360元/年），套餐到期时间为12月31日。当7月1日升级为10账套（720元/年）时，需支付金额为180/360*（720元-360元）=180元。', '确定', '套餐升级价格计算规则')
						}}>价格计算规则</span>
					</div>

					<div className="tcgm-upgrade-buy-methord">
						<span className="main-font-variable">支付方式：</span>
						<span className="tcgm-upgrade-buy-methord-icon">
							<Icon type="zhifubao" style={{color: 'rgb(0, 170, 239)', fontSize: '.15rem'}} />
							支付宝
						</span>
					</div>

					<div className="sub-font-variable">
						{`温馨提示：该付费套餐仅可在当前${corpName}团队中使用`}
					</div>

					<div className="tcgm-upgrade-buy-before">
						<span className="tcgm-upgrade-buy-before-checkbox" onClick={() => {
							dispatch(tcgmActions.agreeReadContractTcsj(!agreeSj))
						}}><Checkbox checked={agreeSj}/></span>
						<span className="main-font-variable" onClick={() => {
							dispatch(tcgmActions.agreeReadContractTcsj(!agreeSj))
						}}> 我已阅读并同意</span>
						<span className="tcgm-upgrade-buy-before-link" onClick={() => {
						// showContract
						sessionStorage.setItem('enterContract', 'tcsj')
						history.push('/feecontract')
						}}>《用户服务协议》</span>
					</div>
				</div>
			</div>
        )
	}
}
