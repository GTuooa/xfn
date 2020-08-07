// import React from 'react'
// import { Modal, message } from 'antd'
// import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
// import * as tcgmActions from 'app/redux/Fee/Tcgm/tcgm.action.js'
// import * as thirdParty from 'app/thirdParty'

// import OrderBuy from './OrderBuy'

// import { Checkbox, Button, Menu, Dropdown, Icon } from 'antd'
// import XfnIcon from 'app/components/Icon'

// @immutableRenderDecorator
// export default
// class Buy extends React.Component {

// 	constructor() {
// 		super()
// 		this.state = { helpValue: false }
// 	}

// 	render() {
//         const {
//             buyList,
//             buyStatu,
//             dispatch,
// 			corpName,
// 			orderWindowShow,
// 			orderNumber,
// 			history,
// 			corpId,
// 			ddUserId,
// 			orderNo,
// 			agree,
// 			onAgree,
// 			showContract
// 		} = this.props
// 		const { helpValue } = this.state

//         let buyArr = Array.from(buyList.keys(v => v)).map(v => v)

//         const equityName = buyStatu.get('equityName')
//         const index = buyStatu.get('index')

// 		return (
//             <div>
//                 <div className="tcgm-upgrade-buy-wrap">
//                     <span className="tcgm-label">增值模块：</span>
//                     <ul className="tcgm-upgrade-buy-list">
//                         {
//                             buyArr.map((v, i) => {

//                                 const key = v
//                                 const buy = buyList.get(key)
//                                 const index = buyStatu.get('index')
//                                 const currentItem = buyStatu.get('equityName') === key ? (typeof index === 'number' ? buy.get(index) : buy.get(0)) : buy.get(0)

//                                 const menu = <Menu>
//                                     {buy.map((w, j) => {
//                                         return (
//                                             <Menu.Item key={key+j}>
//                                                 <span
//                                                     className="tcgm-upgrade-item-menu-item setting-common-ant-dropdown-menu-item"
//                                                     onClick={() => {
//                                                         if (index === j) {
//                                                             return
//                                                         } else {
//                                                             dispatch(tcgmActions.tcgmSelectBuyItemIndex(key, j))
//                                                         }
//                                                     }}
//                                                 >
//                                                     {w.get('relateNumber')}
//                                                 </span>
//                                             </Menu.Item>
//                                         )
//                                     })}
//                                 </Menu>

//                                 return (
// 									<Dropdown overlay={menu} placement="bottomCenter">
// 										<li className={`tcgm-upgrade-buy-item${buyStatu.get('equityName') === key ? ' tcgm-upgrade-buy-item-current' : ''}`} key={i} onClick={() => {
// 											dispatch(tcgmActions.tcgmSelectBuyItem(key))
// 										}}>

// 											<div className="tcgm-upgrade-buy-info">
// 												<span>{currentItem.get('equityName')}</span>
// 												<span>{currentItem.get('relateNumber')}</span>
// 											</div>
// 											<span className="tcgm-upgrade-buy-dropdown" onClick={e => e.stopPropagation()}>
// 												<a className="ant-dropdown-link" href="#">
// 													<Icon type="down" />
// 												</a>
// 											</span>
// 											{buyStatu.get('equityName') === key ? <Icon className="tcgm-upgrade-buy-info-icon" type="check" /> : ''}
// 										</li>
// 									</Dropdown>
//                                 )
//                             })
//                         }
//                     </ul>
//                 </div>
//                 <div className="tcgm-upgrade-buy-money">
//                     <span className="tcgm-label">需付金额：</span>
//                     <span className="tcgm-upgrade-buy-money-font">
//                         {equityName ? (typeof index === 'number' ? '¥ ' + Math.floor(buyList.getIn([equityName, index, 'payFee'])) : '¥ 0') : '¥  0'}
//                     </span>
// 					<span className="tcgm-upgrade-buy-money-rule" onClick={() => this.setState({helpValue: true})}>价格计算规则</span>
//                 </div>

// 				<div className="tcgm-upgrade-buy-methord">
//                     <span className="tcgm-label">支付方式：</span>
//                     <span>
//                         <XfnIcon type="boss" size='20' style={{color: '#00AAEF'}}/>支付宝
//                     </span>
//                 </div>

// 				<div className="tcgm-upgrade-buy-before">
// 					<span onClick={onAgree}><Checkbox checked={agree}/></span>
// 					<span> 我已阅读并同意</span>
// 					<span className="tcgm-upgrade-buy-before-link" onClick={showContract}>《用户服务协议》</span>
// 				</div>

//                 <div className={equityName && typeof index === 'number' && agree ? "tcgm-upgrade-buy-button-wrap" : "tcgm-upgrade-buy-button-wrap-disabled"}>
//                     <Button
//                         type="primary"
//                         onClick={() => {

//                             if (equityName && typeof index === 'number') {

// 								if (agree) {
//                                     if (buyList.getIn([equityName, index])) {
//                                         dispatch(tcgmActions.submitOrderTcgm(buyList.getIn([equityName, index])))
//                                     } else {
//                                         message.info('未选中套餐')
//                                     }
// 								} else {
// 									thirdParty.Alert('请阅读并同意《用户服务协议》')
// 								}

//                             } else {
//                                 thirdParty.Alert('请选择要购买的套餐')
//                             }
//                         }}
//                     >
//                         提交订单
//                     </Button>
//                 </div>

// 				<OrderBuy
// 					upgradeOrBuyList={buyList}
// 					upgradeOrBuyStatu={buyStatu}
// 					corpName={corpName}
// 					dispatch={dispatch}
// 					orderWindowShow={orderWindowShow}
// 					orderNumber={orderNumber}
// 					history={history}
// 					corpId={corpId}
// 					ddUserId={ddUserId}
// 					orderNo={orderNo}
// 				/>

// 				<Modal
// 					title={'套餐购买价格计算规则：'}
// 					visible={helpValue}
// 					footer=""
// 					onOk={() => this.setState({helpValue: false})}
// 					onCancel={() => this.setState({helpValue: false})}
// 				>
// 					<div className="money-help">增值模块的到期时间将与会计版/智能版对齐，支付金额按剩余天数折算。</div>
// 					<div className="money-help">如1月1日购买小番财务，套餐到期时间为12月31日。当7月1日购买阿米巴时，仅需支付1/2阿米巴价款。</div>
// 				</Modal>
//             </div>
//         )
// 	}
// }
