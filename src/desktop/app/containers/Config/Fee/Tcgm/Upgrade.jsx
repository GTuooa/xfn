import React from 'react'
import { Modal } from 'antd'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as tcgmActions from 'app/redux/Fee/Tcgm/tcgm.action.js'
import thirdParty from 'app/thirdParty'

import { Checkbox, Button, Menu, Dropdown } from 'antd'
import { Icon } from 'app/components'
import XfnIcon from 'app/components/Icon'
import OrderUpgrade from './OrderUpgrade'


@immutableRenderDecorator
export default
class Upgrade extends React.Component {

	constructor() {
		super()
		this.state = { helpValue: false }
	}

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
			agree,
			onAgree,
			showContract,
			expireDate
		} = this.props

		const { helpValue } = this.state

        let upgradeArr = Array.from(packageList.keys(v => v)).map(v => v)

		let subjectName = ''
		let amount = 0
		let goodsCode = []
		let goodsName = []
		upgradeStatu.forEach(v => {
			const upgrade = packageList.getIn([v.get('productName'), v.get('index')])
			subjectName = subjectName ? subjectName + '+' + upgrade.get('productName') : upgrade.get('productName')
			amount = amount + upgrade.get('payFee')
			goodsCode.push(upgrade.get('productCode'))
			goodsName.push(upgrade.get('productName')+upgrade.get('relateNumber'))
		})

		return (
            <div>
                <div className="tcgm-upgrade-buy-wrap">
                    <span className="tcgm-label">增值模块：</span>
                    <ul className="tcgm-upgrade-buy-list">
                        {
                            upgradeArr.map((v, i) => {

                                const key = v

								// 选中的升级套餐列表是否有当前的套餐
								const upgradeStatuItem = upgradeStatu.find(v => v.get('productName') === key)
                                const upgrade = packageList.get(key)
                                const index = upgradeStatuItem ? upgradeStatuItem.get('index') : 0
                                const currentItem = upgrade.get(index)

                                const menu = <Menu>
                                    {upgrade.map((w, j) => {
                                        return (
                                            <Menu.Item key={key+j}>
                                                <span
                                                    className="tcgm-upgrade-item-menu-item setting-common-ant-dropdown-menu-item"
                                                    onClick={() => {
                                                        if (index === j) {
                                                            return
                                                        } else {
                                                            dispatch(tcgmActions.tcgmSelectUpgradeItemIndex(key, j))
                                                        }
                                                    }}
                                                >
                                                    {w.get('relateNumber')}
                                                </span>
                                            </Menu.Item>
                                        )
                                    })}
                                </Menu>

                                return (
									<Dropdown overlay={menu} placement="bottomCenter">
										<li className={`tcgm-upgrade-buy-item${upgradeStatuItem ? ' tcgm-upgrade-buy-item-current' : ''}`} key={i} onClick={() => {
											dispatch(tcgmActions.tcgmSelectUpgradeItem(key))
										}}>
											<div  className="tcgm-upgrade-buy-info">
												<span>{currentItem.get('productName')}</span>
												<span>{currentItem.get('relateNumber')}</span>
											</div>
											<span onClick={e => e.stopPropagation()}>
												<a className="ant-dropdown-link" href="#">
													<Icon type="down" />
												</a>
											</span>
											{upgradeStatuItem ? <Icon className="tcgm-upgrade-buy-info-icon" type="check" /> : ''}
										</li>
									</Dropdown>
                                )
                            })
                        }
                    </ul>
				</div>
				<div className="tcgm-upgrade-buy-methord" style={{display: goodsName.length ? '' : 'none'}}>
					<span className="tcgm-label">已选模块：</span>
					<span>
						{goodsName.join('+')}
					</span>
				</div>
                <div className="tcgm-upgrade-buy-methord" style={{display: goodsName.length ? '' : 'none'}}>
                    <span className="tcgm-label">到期时间：</span>
                    <span>
                        {expireDate}
                    </span>
                </div>
                <div className="tcgm-upgrade-buy-money">
                    <span className="tcgm-label">需付金额：</span>
                    <span className="tcgm-upgrade-buy-money-font">
                         {'¥ ' + Math.floor(amount)}
                    </span>
					<span className="tcgm-upgrade-buy-money-rule" onClick={() => this.setState({helpValue: true})}>价格计算规则</span>
                </div>

				<div className="tcgm-upgrade-buy-methord">
                    <span className="tcgm-label">支付方式：</span>
                    <span>
                        <XfnIcon type="boss" size='20' style={{color: '#00AAEF'}}/>支付宝
                    </span>
                </div>

				<div className="tcgm-upgrade-buy-before">
					<span onClick={onAgree}><Checkbox checked={agree}/></span>
					<span> 我已阅读并同意</span>
					<span className="tcgm-upgrade-buy-before-link" onClick={showContract}>《用户服务协议》</span>
				</div>

                <div className={amount > 0 && agree ? "tcgm-upgrade-buy-button-wrap" : "tcgm-upgrade-buy-button-wrap-disabled"}>
                    <Button
                        type="primary"
                        // disabled={}
                        // className={}
                        onClick={() => {

                            if (amount > 0) {
								if (agree) {
									dispatch(tcgmActions.submitOrderTcsj(subjectName, amount, goodsCode))
								} else {
									thirdParty.Alert('请阅读并同意《用户服务协议》')
								}
                            } else {
                                thirdParty.Alert('请选择要升级的套餐')
                            }
                        }}
                    >
                        提交订单
                    </Button>
                </div>

				<OrderUpgrade
					upgradeOrBuyList={packageList}
					upgradeOrBuyStatu={upgradeStatu}
					corpName={corpName}
					dispatch={dispatch}
					orderWindowShow={orderWindowShow}
					orderNumber={orderNumber}
					corpId={corpId}
					ddUserId={ddUserId}
					amount={amount}
					subjectName={subjectName}
				/>

				<Modal
					title={'套餐升级价格计算规则：'}
					visible={helpValue}
					footer=""
					onOk={() => this.setState({helpValue: false})}
					onCancel={() => this.setState({helpValue: false})}
				>
					<div className="money-help">升级规格的到期时间将与会计版/智能版对齐，支付金额按升级规格与原规格的差价的剩余天数折算。</div>
					<div className="money-help">如1月1日购买3账套会计版（360元/年），套餐到期时间为12月31日。当7月1日升级为10账套（720元/年）时，需支付金额为180/360*（720元-360元）=180元。</div>
				</Modal>
            </div>
        )
	}
}
