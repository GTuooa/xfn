import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as tcgmActions from 'app/redux/Fee/Tcgm/tcgm.action.js'
import * as thirdParty from 'app/thirdParty'

import { Checkbox, Icon } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class Buy extends React.Component {

	render() {
        const {
            buyList,
            buyStatu,
            dispatch,
			corpName,
			orderWindowShow,
			orderNumber,
			history,
			corpId,
			ddUserId,
			agreeGm,
			onAgree,
			showContract,
			expirationInfo
		} = this.props

        let buyArr = Array.from(buyList.keys(v => v)).map(v => v)

        const equityName = buyStatu.get('equityName')
        const index = buyStatu.get('index')

		return (
			<div>
				<div className="tcgm-upgrade-buy-wrap">
					<div className="tcgm-upgrade-buy-tip">
						增值模块
					</div>
					<ul className="tcgm-upgrade-buy-list">
						{
							buyArr.map((v, i) => {

								const key = v
								const buy = buyList.get(key)
								const index = buyStatu.get('index')
								const currentItem = buyStatu.get('equityName') === key ? (typeof index === 'number' ? buy.get(index) : buy.get(0)) : buy.get(0)

								let menu = []
								buy.forEach((w, j) => menu.push(w.get('relateNumber')))

								return (
									<li className="tcgm-upgrade-buy-item" key={i}>
										<div
											className="tcgm-upgrade-buy-item-checkbox"
											onClick={() => dispatch(tcgmActions.tcgmSelectBuyItem(key))}
										>
											<Checkbox
												checked={buyStatu.get('equityName') === key}
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
															dispatch(tcgmActions.tcgmSelectBuyItemIndex(v, result.buttonIndex))
														}
													}
												})
											}}
										>
											<span className="tcgm-upgrade-buy-equityname">
												{currentItem.get('equityName')}
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
							<span>{equityName ? `已选：${equityName}${buyList.find((v, key) => key === equityName).getIn([index, 'relateNumber'])}，到期时间${expirationInfo}` : ''}</span>
						</div>
					</ul>
				</div>
				<div className="tcgm-upgrade-buy-money-show">
					<div className="tcgm-upgrade-buy-money">
						<span className="main-font-variable">需付金额：</span>
						<span className="tcgm-upgrade-buy-money-font">
							{equityName ? (typeof index === 'number' ? '¥ ' + Math.floor(buyList.getIn([equityName, index, 'payFee'])) : '¥ 0') : '¥  0'}
						</span>
						<span className="tcgm-upgrade-buy-money-rule" onClick={() => {
							thirdParty.Alert('增值模块的到期时间将与会计版/智能版对齐，支付金额按剩余天数折算。如1月1日购买小番财务，套餐到期时间为12月31日。当7月1日购买阿米巴时，仅需支付1/2阿米巴价款。', '确定', '套餐购买价格计算规则')
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
						<span className='tcgm-upgrade-buy-before-checkbox' onClick={() => {
							dispatch(tcgmActions.agreeReadContractTcgm(!agreeGm))
						}}><Checkbox checked={agreeGm}/></span>
						<span className="main-font-variable" onClick={() => {
							dispatch(tcgmActions.agreeReadContractTcgm(!agreeGm))
						}}> 我已阅读并同意</span>
						<span className="tcgm-upgrade-buy-before-link" onClick={() => {
							sessionStorage.setItem('enterContract', 'tcgm')
							history.push('/feecontract')
						}}>《用户服务协议》</span>
					</div>
				</div>
			</div>
        )
	}
}
