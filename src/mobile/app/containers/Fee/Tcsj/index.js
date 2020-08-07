// import React from 'react'
// import { connect }	from 'react-redux'
//
// import Title from '../components/Title'
// import { Icon, Button, ButtonGroup, Container, Row, Form, ScrollView, TextInput, MonthPicker, SinglePicker } from 'app/components'
//
// import { feeActions } from 'app/redux/Fee'
// import * as tcgmActions from 'app/redux/Fee/Tcgm/tcgm.action.js'
// import * as thirdParty from 'app/thirdParty'
//
// import OrderUpgrade from '../components/OrderUpgrade/index.js'
// import Upgrade from './Upgrade'
// import UntreatedOrder from './UntreatedOrder'
//
// import '../style.less'
//
// @connect(state => state)
// export default
// class Tcgm extends React.Component {
//
//     componentDidMount() {
//         this.props.dispatch(tcgmActions.getPayProductFetch())
// 	}
//     constructor() {
// 		super()
// 		this.state = {
//             readContractStatus: false,
//             agree: false
//         }
// 	}
//
//     shouldComponentUpdate(nextprops, nextstate) {
// 		return this.props.tcgmState != nextprops.tcgmState || this.state != nextstate
// 	}
//
//     render() {
//
//         const { tcgmState, feeState, dispatch, homeState, history } = this.props
//         const { readContractStatus, agree } = this.state
//
//         const currentPage = feeState.getIn(['views', 'currentPage'])
//
//         const corpName = tcgmState.getIn(['data', 'payInfo', 'corpName'])
//         const corpId = tcgmState.getIn(['data', 'payInfo', 'corpId'])
//         const equityInfoList = tcgmState.getIn(['data', 'payInfo', 'equityInfoList'])
//         const expirationInfo = tcgmState.getIn(['data', 'payInfo', 'expirationInfo'])
//         const buyList = tcgmState.getIn(['data', 'payInfo', 'buyList'])
//         const upgradeList = tcgmState.getIn(['data', 'payInfo', 'upgradeList'])
//
//         const views = tcgmState.get('views')
//         const orderWindowShow = views.get('orderWindowShow')
//         const orderNumber = views.get('orderNumber')
//         const buyOrUpgrade = views.get('buyOrUpgrade')
//         const upgradeStatu = views.get('upgradeStatu')
//         const buyStatu = views.get('buyStatu')
//         const agreeSj = views.get('agreeSj')
//         const untreatedOrderVisible = views.get('untreatedOrderVisible')
//         const untreatedOrderMessage = views.get('untreatedOrderMessage')
//         const untreatedOrderList = views.get('untreatedOrderList')
//         const untreatedOrderNo = views.get('untreatedOrderNo')
//         const untreatedOrderSize = untreatedOrderList ? untreatedOrderList.length : ''
//
//         const ddUserId = homeState.getIn(['data', 'userInfo', 'dduserid'])
//
//         const equityName = buyStatu.get('equityName')
//         const index = buyStatu.get('index')
//
//         let subjectName = ''
//         let amount = 0
//         let goodsCode = []
//         upgradeStatu.forEach(v => {
//             const upgrade = upgradeList.getIn([v.get('equityName'), v.get('index')])
//             subjectName = subjectName ? subjectName + '+' + upgrade.get('equityName') : upgrade.get('equityName')
//             amount = amount + upgrade.get('payFee')
//             goodsCode.push(upgrade.get('equityCode'))
//         })
//
//         return (
//             <Container>
//                 <Title
//                     activeTab={currentPage}
//                     onClick={(value) => {
//                         dispatch(feeActions.switchFeeActivePage(value))
//                     }}
//                 />
//
//                 <OrderUpgrade
// 					upgradeOrBuyList={upgradeList}
// 					upgradeOrBuyStatu={upgradeStatu}
// 					corpName={corpName}
// 					dispatch={dispatch}
// 					orderWindowShow={orderWindowShow}
// 					orderNumber={orderNumber}
// 					history={history}
// 					corpId={corpId}
// 					ddUserId={ddUserId}
// 					amount={amount}
// 					subjectName={subjectName}
// 				/>
//
//                 <UntreatedOrder
//                     dispatch={dispatch}
//                     untreatedOrderMessage={untreatedOrderMessage}
//                     untreatedOrderVisible={untreatedOrderVisible}
//                     untreatedOrderList={untreatedOrderList}
//                     untreatedOrderSize={untreatedOrderSize}
//                     untreatedOrderNo={untreatedOrderNo}
//                 />
//
//                 <ScrollView flex='1'>
//                     <Upgrade
//                         upgradeList={upgradeList}
//                         upgradeStatu={upgradeStatu}
//                         dispatch={dispatch}
//                         corpName={corpName}
//                         orderWindowShow={orderWindowShow}
//                         orderNumber={orderNumber}
//                         history={history}
//                         corpId={corpId}
//                         ddUserId={ddUserId}
//                         agree={agree}
//                         onAgree={() => this.setState({agree: !agree})}
//                         showContract={() => this.setState({readContractStatus: true})}
//                         agreeSj={agreeSj}
//                     />
//
//                 </ScrollView>
//
//                 <ButtonGroup type='ghost' height={50}>
// 					<Button onClick={() => history.goBack()}><Icon type="cancel"/>取消</Button>
// 					<Button disabled={!(amount > 0 && agreeSj)} onClick={() => {
//                         if (amount > 0) {
//                             if (agreeSj) {
//                                 dispatch(tcgmActions.submitOrderTcsj(subjectName, amount, goodsCode))
//                             } else {
//                                 thirdParty.Alert('请阅读并同意《用户服务协议》')
//                             }
//                         } else {
//                             thirdParty.Alert('请选择要升级的套餐')
//                         }
// 					}}><Icon type="save"/>提交订单</Button>
// 				</ButtonGroup>
//             </Container>
//         )
//     }
// }
