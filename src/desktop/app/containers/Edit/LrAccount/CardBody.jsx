import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { connect }	from 'react-redux'

import * as Limit from 'app/constants/Limit.js'
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, JxcTableAll, Amount } from 'app/components'
import { DatePicker, Input, Select, Checkbox, Button, message, Radio, Switch, Divider } from 'antd'
import { Icon } from 'app/components'
import XfIcon from 'app/components/Icon'
const RadioGroup = Radio.Group
const Option = Select.Option
import SelectRadio from './SelectRadio'
import PayOrPreAmount from './PayOrPreAmount'
import LongTermAsset from './LongTermAsset'
import GoodsCost from './GoodsCost'
import { formatNum, DateLib, formatMoney } from 'app/utils'
import  Properties  from './Properties'
import  QcModal  from './QcModal'
import  Invoice  from './Invoice'
import TransferProfitorCost from './TransferProfitorCost'
import EditCardModal from './EditCardModal'
import AddCardModal from './AddCardModal'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as accountConfActions from 'app/redux/Config/Account/account.action'
@connect(state => {
	const {
		homeState,
		accountConfState,
		lrAccountState,
		allState } = state
	return{
		homeState,
		accountConfState,
		lrAccountState,
		allState }
})
@immutableRenderDecorator
export default
class CardBody extends React.Component {
	state = {
			show:false,
			showModal:false,
			showModalStock:false,
			index:0,
			accountInput:'',
			stockInput:'',
			contactsInput:'',

	}
	componentDidMount(){
		// var p1 = new Promise((resolve, reject) => {
		//     this.props.dispatch(allActions.getAcListFetch(resolve))
		// })
		// Promise.all([p1]).then((res) => {
        // console.log(this.props.lrAccountState)
    // })
		// new Promise(this.props.dispatch(allActions.getAcListFetch()),)
		// this.props.dispatch(allActions.getAcListFetch()).then(() => {
		// 	console.log('')
		// })
		this.props.dispatch(allActions.getAcListFetch())
	}
	render() {
		const {
            cardTemp,
            dispatch,
            accountList,
            taxRateTemp,
            payOrReceive,
            insertOrModify,
            runningCategory,
            disabledBeginDate,
			homeState,
			accountConfState,
			flags,
			lrAccountState,
			allState,
			configPermissionInfo,
			simplifyStatus

		} = this.props
		const categoryType = cardTemp.get('categoryType')
		const lrAclist = allState.get('lrAclist')
		let showManagemented, propertyShow, categoryTypeObj
		let direction = 'debit'
		let showInvoice = false
		let isShowAbout = false
		let specialState = false
		;({
			'LB_YYSR': () => {
				showManagemented = true
				propertyShow = '营业收入'
				categoryTypeObj = 'acBusinessIncome'
			},
			'LB_YYZC': () => {
				showManagemented = true
				propertyShow = '营业支出'
				categoryTypeObj = 'acBusinessExpense'
				direction = 'credit'
			},
			'LB_YYWSR': () => {
				showManagemented = true
				propertyShow = '营业外收入'
				categoryTypeObj = 'acBusinessOutIncome'
				isShowAbout = true
				direction = 'debit'
			},
			'LB_YYWZC': () => {
				showManagemented = true
				propertyShow = '营业外支出'
				categoryTypeObj = 'acBusinessOutExpense'
				direction = 'credit'
				isShowAbout = true
				direction = 'credit'
			},
			'LB_JK': () => {
				showManagemented = true
				propertyShow = '借款'
				categoryTypeObj = 'acLoan'
				specialState = true
			},
			'LB_TZ': () => {
				showManagemented = true
				propertyShow = '投资'
				categoryTypeObj = 'acInvest'
				specialState = true
			},
			'LB_ZB': () => {
				showManagemented = true
				propertyShow = '资本'
				categoryTypeObj = 'acCapital'
				specialState = true
			},
			'LB_CQZC': () => {
				showManagemented = true
				propertyShow = '长期资产'
				categoryTypeObj = 'acAssets',
				direction = 'debit'
			},
			'LB_FYZC': () => {
				showManagemented = true
				propertyShow = '费用支出'
				categoryTypeObj = 'acCost',
				direction = 'credit'
			},
			'LB_ZSKX': () => {
				showManagemented = false
				propertyShow = '暂收款项'
				categoryTypeObj = 'acTemporaryReceipt'
				isShowAbout = true
			},
			'LB_ZFKX': () => {
				showManagemented = false
				propertyShow = '暂付款项'
				categoryTypeObj = 'acTemporaryPay'
				isShowAbout = true
			},
			'LB_XCZC': () => {
				showManagemented = false
				propertyShow = '薪酬支出'
				categoryTypeObj = 'acPayment',
				direction = 'credit'
				specialState = true
			},
			'LB_SFZC': () => {
				showManagemented = false
				propertyShow = '税费支出'
				categoryTypeObj = 'acTax',
				direction = 'credit'
				specialState = true
			}
		}[categoryType] || (() => ''))()
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

		const useAssList = allState.get('allasscategorylist')
		const scale = cardTemp.get('scale')
		const payableAcFullName = taxRateTemp.get('payableAcFullName')
		const payableAcId = taxRateTemp.get('payableAcId')
		const payableAssCategory = taxRateTemp.get('payableAssCategory')
		const notBillingAssCategory = taxRateTemp.get('notBillingAssCategory')
		const notBillingAcId = taxRateTemp.get('notBillingAcId')
		const outputAcId = taxRateTemp.get('outputAcId')
		const payableRate = cardTemp.get('payableRate')
		const outputAssCategory = taxRateTemp.get('outputAssCategory')
		const waitOutputAcId = taxRateTemp.get('waitOutputAcId')
		const waitOutputAssCategory = taxRateTemp.get('waitOutputAssCategory')
		const inputAcId = taxRateTemp.get('inputAcId')
		const inputAssCategory = taxRateTemp.get('inputAssCategory')
		const certifiedAcId = taxRateTemp.get('certifiedAcId')
		const certifiedAssCategory = taxRateTemp.get('certifiedAssCategory')
		const propertyPay = cardTemp.get('propertyPay')
		const name = cardTemp.get('name')
		const categoryName = cardTemp.get('categoryName')
		const property = cardTemp.get('property')
		const beSpecial = cardTemp.get('beSpecial')
		const beDeposited = cardTemp.getIn([categoryTypeObj,'beDeposited'])
		const beCarryover = cardTemp.getIn([categoryTypeObj,'beCarryover'])
		const beCarryoverOut =cardTemp.get('beCarryover')
		const propertyCarryover = cardTemp.get('propertyCarryover')
		const assList = cardTemp.get('assList')
		const acId = cardTemp.get('acId')
		const acFullName = cardTemp.get('acFullName')
		const mediumAcId = cardTemp.get('mediumAcId')
		const mediumAcFullName = cardTemp.get('mediumAcFullName')
		const depositAcId = cardTemp.get('depositAcId')
		const depositAcFullName = cardTemp.get('depositAcFullName')
		const carryoverAcId = cardTemp.get('carryoverAcId')
		const carryoverAcFullName = cardTemp.get('carryoverAcFullName')
		const stockAcId = cardTemp.get('stockAcId')
		const stockAcFullName = cardTemp.get('stockAcFullName')
		const stockAc = cardTemp.getIn([categoryTypeObj, 'stockAc'])
		const mediumAssList = cardTemp.get('mediumAssList')
		const runningState = cardTemp.get('runningState')
		const beManagemented = cardTemp.getIn([categoryTypeObj, 'beManagemented'])
		const runningAbstract = cardTemp.get('runningAbstract')
		const runningDate = cardTemp.get('runningDate')
		const amount = cardTemp.get('amount')
		const taxAmount = cardTemp.get('taxAmount')
		const accountName = cardTemp.get('accountName')
		const billType = cardTemp.get('billType')
		const beCertificate = cardTemp.get('beCertificate')
		const priceTaxTotal = cardTemp.get('priceTaxTotal')
		const taxRate = cardTemp.get('taxRate')
		const assetType = cardTemp.get('assetType')
		const tax = cardTemp.get('tax')
		const runningType = cardTemp.get('runningType')
		const isModify = insertOrModify == 'modify' ? true : false
		const propertyCostList = cardTemp.get('propertyCostList')
		const companyAccumulationAmount = cardTemp.getIn([categoryTypeObj,'companyAccumulationAmount'])
		const personAccumulationAmount = cardTemp.getIn([categoryTypeObj,'personAccumulationAmount'])
		const companySocialSecurityAmount = cardTemp.getIn([categoryTypeObj,'companySocialSecurityAmount'])
		const personSocialSecurityAmount = cardTemp.getIn([categoryTypeObj,'personSocialSecurityAmount'])
		const incomeTaxAmount = cardTemp.getIn([categoryTypeObj,'incomeTaxAmount'])
		const socialSecurityAc = cardTemp.getIn([categoryTypeObj,'socialSecurityAc'])
		const fundAc = cardTemp.getIn([categoryTypeObj,'fundAc'])
		const incomeTaxAc = cardTemp.getIn([categoryTypeObj,'incomeTaxAc'])
		const offsetAmount = cardTemp.get('offsetAmount')
		const handleAmount = cardTemp.get('handleAmount')
		const currentAmount = cardTemp.get('currentAmount')
		const propertyCost =cardTemp.get('propertyCost')
		const beCleaning = cardTemp.getIn([categoryTypeObj,'beCleaning'])
		const incomeAc = cardTemp.getIn([categoryTypeObj, 'incomeAc'])
		const lossAc = cardTemp.getIn([categoryTypeObj, 'lossAc'])
		const payAc = cardTemp.getIn([categoryTypeObj,'payAc'])
		const payList = cardTemp.getIn([categoryTypeObj,'payList'])
		const deliveryAc = cardTemp.getIn([categoryTypeObj,'deliveryAc'])
		const inAdvanceAc = cardTemp.getIn([categoryTypeObj,'inAdvanceAc'])
		const saleAc = cardTemp.getIn([categoryTypeObj,'saleAc'])
		const manageAc = cardTemp.getIn([categoryTypeObj,'manageAc'])
		const financeAc = cardTemp.getIn([categoryTypeObj,'financeAc'])
		const welfareAc = cardTemp.getIn([categoryTypeObj,'welfareAc'])
		const beWelfare = cardTemp.getIn([categoryTypeObj,'beWelfare'])
		const welfareList = cardTemp.getIn([categoryTypeObj,'welfareList'])
		const receivablesAc = cardTemp.getIn([categoryTypeObj,'receivablesAc'])
		const carryoverAc = cardTemp.getIn([categoryTypeObj,'carryoverAc'])
		const billStates =cardTemp.get('billStates')
		const netProfitAmount = cardTemp.getIn([categoryTypeObj, 'netProfitAmount'])
		const lossAmount = cardTemp.getIn([categoryTypeObj, 'lossAmount'])
		const receivablesList = cardTemp.getIn([categoryTypeObj, 'receivablesList'])
		const inAdvanceList = cardTemp.getIn([categoryTypeObj, 'inAdvanceList'])
		const categoryUuid = cardTemp.get('categoryUuid')
		const deliveryList = cardTemp.getIn([categoryTypeObj, 'deliveryList'])
		const payableList = cardTemp.getIn([categoryTypeObj, 'payableList'])
		const unpaidInterestList = cardTemp.getIn([categoryTypeObj, 'unpaidInterestList'])
		const uncollectedInterestList = cardTemp.getIn([categoryTypeObj, 'uncollectedInterestList'])
		const accruedList = cardTemp.getIn([categoryTypeObj, 'accruedList'])
		const accruedAc = cardTemp.getIn([categoryTypeObj, 'accruedAc'])
		const beAccrued = cardTemp.getIn([categoryTypeObj, 'beAccrued'])
		const beInAdvance = cardTemp.getIn([categoryTypeObj, 'beInAdvance'])
		const turnOutAc = cardTemp.getIn([categoryTypeObj, 'turnOutAc'])
		const relationAc = cardTemp.getIn([categoryTypeObj, 'relationAc'])
		const assetsAc = cardTemp.getIn([categoryTypeObj, 'assetsAc'])
		const payableAc = cardTemp.getIn([categoryTypeObj, 'payableAc'])
		const cleaningAc = cardTemp.getIn([categoryTypeObj, 'cleaningAc'])
		const upgradeAc = cardTemp.getIn([categoryTypeObj, 'upgradeAc'])
		const depreciationAc = cardTemp.getIn([categoryTypeObj, 'depreciationAc'])
		const loanAc = cardTemp.getIn([categoryTypeObj, 'loanAc'])
		const interestAc = cardTemp.getIn([categoryTypeObj, 'interestAc'])
		const unpaidInterestAc = cardTemp.getIn([categoryTypeObj, 'unpaidInterestAc'])
		const investAc = cardTemp.getIn([categoryTypeObj, 'investAc'])
		const profitAc = cardTemp.getIn([categoryTypeObj, 'profitAc'])
		const uncollectedProfitAc = cardTemp.getIn([categoryTypeObj, 'uncollectedProfitAc'])
		const uncollectedProfitList = cardTemp.getIn([categoryTypeObj, 'uncollectedProfitList'])
		const uncollectedInterestAc = cardTemp.getIn([categoryTypeObj, 'uncollectedInterestAc'])
		const capitalAc = cardTemp.getIn([categoryTypeObj, 'capitalAc'])
		const unassignedAc = cardTemp.getIn([categoryTypeObj, 'unassignedAc'])
		const assignedAc = cardTemp.getIn([categoryTypeObj, 'assignedAc'])
		const beTurnOut = cardTemp.getIn([categoryTypeObj, 'beTurnOut'])
		const turnOutList = cardTemp.getIn([categoryTypeObj, 'turnOutList'])
		const propertyTax = cardTemp.get('propertyTax')
		const preAmount = cardTemp.get('preAmount')
		const payableAmount = cardTemp.get('payableAmount')
		const propertyInvest = cardTemp.get('propertyInvest')
		const fundList =cardTemp.getIn([categoryTypeObj, 'fundList'])
		const socialSecurityList =cardTemp.getIn([categoryTypeObj, 'socialSecurityList'])
		const propertyAssets =cardTemp.get('propertyAssets')
		const accumulationAmount =cardTemp.get('accumulationAmount')
		const socialSecurityAmount =cardTemp.get('socialSecurityAmount')
		const sfAmount =cardTemp.get('sfAmount')
		const isQueryByBusiness = flags.get('isQueryByBusiness')
		const selectedKeys = flags.get('selectedKeys')
		const runningInsertOrModify = flags.get('runningInsertOrModify')
		const businessList = cardTemp.get('businessList') ? cardTemp.get('businessList') : fromJS([])
		const billList = cardTemp.get('billList')
		const paymentList = cardTemp.get('paymentList')
		const notHandleAmount = cardTemp.get('notHandleAmount')
		const outputRate = cardTemp.get('outputRate')
		const manageCategory = manageAc && manageAc.size && manageAc.getIn([0, 'assCategoryList']) ? manageAc.getIn([0, 'assCategoryList']) : fromJS([])
		const saleCategory = saleAc && saleAc.size && saleAc.getIn([0, 'assCategoryList']) ? saleAc.getIn([0, 'assCategoryList']) : fromJS([])
		const financeCategory = financeAc && financeAc.size && financeAc.getIn([0, 'assCategoryList']) ? financeAc.getIn([0, 'assCategoryList']) : fromJS([])
		const specialStateforAccrued = flags.get('specialStateforAccrued')
		const specialStateforAssets = flags.get('specialStateforAssets')
		const showStockModal = flags.get('showStockModal')
		const allGetFlow = flags.get('allGetFlow')
		const showContactsModal = flags.get('showContactsModal')
		const MemberList = flags.get('MemberList')
		const thingsList = flags.get('thingsList')
		const stockThingsList = flags.get('stockThingsList')
		const contactsThingsList = flags.get('contactsThingsList')
		const selectThingsList = flags.get('selectThingsList')
		const currentCardType = flags.get('currentCardType')
		const projectList = flags.get('projectList')?flags.get('projectList'):fromJS([])
		const stockRange = cardTemp.getIn([categoryTypeObj,'stockRange'])
		const projectCard = cardTemp.get('projectCard')
		const beProject = cardTemp.get('beProject')
		const projectRange = cardTemp.get('projectRange')
		const usedProject = cardTemp.get('usedProject')
		const stockCardList = cardTemp.getIn([categoryTypeObj,'stockCardList'])
		const carryoverCardList = cardTemp.getIn([categoryTypeObj,'carryoverCardList'])

		const contactsCardRange = cardTemp.getIn([categoryTypeObj,'contactsCardRange'])
		const contactsRange = cardTemp.getIn([categoryTypeObj,'contactsRange'])
		const beReduce = cardTemp.getIn([categoryTypeObj,'beReduce'])
		const actualAmount = cardTemp.getIn([categoryTypeObj,'actualAmount'])
		const beReduceOut = cardTemp.get('beReduce')
		const reduceAmount = cardTemp.get('reduceAmount')
		const beWithholding = cardTemp.getIn(['acPayment', 'beWithholding'])
		const beWithholdSocial = cardTemp.getIn(['acPayment', 'beWithholdSocial'])
		const beWithholdTax = cardTemp.getIn(['acPayment', 'beWithholdTax'])
		let modalAssList = []
		const accountTest = (categoryType, beManagemented, isQueryByBusiness, runningState, payableAmount, handleAmount,propertyPay) => {
			if (categoryType === 'LB_YYSR' && !beManagemented //营业收入无收付管理显示在上方账户
			|| categoryType === 'LB_YYZC' && !beManagemented
			|| runningState === 'STATE_YYSR_DJ'
			|| runningState === 'STATE_YYZC_DJ'
			|| categoryType !== 'LB_ZZ'
			&& runningState !== 'STATE_FY_WF'
			&& runningState !== 'STATE_CQZC_WS'
			&& runningState !== 'STATE_XC_JT'
			&& (runningState === 'STATE_XC_FF' && beAccrued && (actualAmount>0 || propertyPay === 'SX_QTXC') || !beAccrued || runningState !== 'STATE_XC_FF' )
			&& runningState !== 'STATE_YYWSR_WS'
			&& runningState !== 'STATE_YYWZC_WF'
			&& runningState !== 'STATE_CQZC_WF'
			&& runningState !== 'STATE_ZB_LRFP'
			&& categoryType !== 'LB_YYSR'
			&& categoryType !== 'LB_YYZC'
			&& runningState !== 'STATE_SF_JT'
			&& runningState !== 'STATE_SF_ZCWJSF'
			&& runningState !== 'STATE_JK_JTLX'
			&& runningState !== 'STATE_TZ_JTGL'
			&& runningState !== 'STATE_TZ_JTLX'
			&& runningState !== 'STATE_TZ_WS'
			&& runningType !== 'LX_JZSY_SY'
			&& runningType !== 'LX_JZSY_SS'
			&& assetType !== 'XZ_ZJTX'
			&& !specialStateforAssets) {  //|| !payableAmount
				return true
			} else {
				return false
			}
		}
		// 可选日期范围
		const disabledDate = function (current) {
			return current && (moment(disabledBeginDate) > current)
		}

		let hasChecked  = false
        let totalNotHandleAmount = 0
		paymentList ? paymentList.map((item,index) => {
			if(item.get('beSelect')){
				totalNotHandleAmount += item.get('notHandleAmount')
				hasChecked = true
			}
		}):''


		const reg = /^\d*\.?\d{0,2}$/
		const regNegative = /^-{0,1}\d*\.?\d{0,2}$/
		const amountStr = ({
			'': () => '金额：',
			'STATE_SF_JN': () => {return propertyTax === 'SX_ZZS' ? '支付金额：' : '金额：'},
			'STATE_XC_JT': () => {return propertyPay === 'SX_GZXJ' || propertyPay === 'SX_SHBX' || propertyPay === 'SX_ZFGJJ'?'金额：':'金额：'},
		}[runningState] || (() => {return categoryType === 'LB_YYSR' || categoryType === 'LB_YYZC' ? '总金额：' : '金额：'}))()
		//数字校验
		const numberTest = (e, dispatchFunc) => {
			if (e.target.value === undefined)
				return

			let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
			if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
				value = value.substr(1)
			}
			if (reg.test(value) || (value === '')) {
				dispatchFunc(value)
			} else {
				message.info('金额只能输入带两位小数的数字')
			}
		}
		// 获取辅助核算列表
		const getAccountListByAccount = (Account , place) => {
			let asscategory
			return	Account?Account.map(v => {
					return v.get('assCategoryList') ? v.get('assCategoryList').map(w => {
						let index
						const findtypeList = useAssList ? useAssList.toJS().find((x,i) => {
							if(x.asscategory === w){
								index = i
								asscategory=w
								return true
							}
						}):[]
						const chooseList = findtypeList ? findtypeList.asslist : []
						const chosenAssList = cardTemp.getIn(place).find(v =>  v.get('assCategory') === w)
						return (
							<div className='accountConf-modal-list-item' name='asslist'>
								<label>{w}：</label>
								<div>
									{
										specialStateforAccrued?
										<div>
											{chosenAssList && `${chosenAssList.get('assId')} ${chosenAssList.get('assName')}`}
										</div>
										:
										<Select
											// placeholder='必填，请选择辅助核算'
											disabled={isQueryByBusiness && categoryType === 'LB_XCZC' && place.length && place[1] === 'accruedList' && handleAmount > 0} //查询状态下薪酬支出有核销流水后计提科目的辅助核算不能修改
											value={chosenAssList && `${chosenAssList.get('assId')} ${chosenAssList.get('assName')}`}
											onChange={value => {
													dispatch(lrAccountActions.updateAssList(place, value))

											}}
											>
												{
													chooseList.map((z, zi) =>{
														const value = `${z.assname}${Limit.TREE_JOIN_STR}${z.assid}${Limit.TREE_JOIN_STR}${asscategory}`
														modalAssList.push(place)
														return(
															<Option key={zi} value={value}>
																{`${z.assid} ${z.assname}`}
															</Option>
														)
													})
												}

										</Select>
									}
								</div>
							</div>
						)

					})
					:
					null

				})
				:
				null
		}
		const projectTest = () => {
			if(beProject
			 && ((runningState !== 'STATE_YYSR_DJ'
			 && runningState !== 'STATE_YYZC_DJ'
			 && (categoryType === 'LB_XCZC' && (beAccrued && runningState === 'STATE_XC_JT' ||  !beAccrued && (runningState === 'STATE_XC_FF' || runningState === 'STATE_XC_JN') || runningState === 'STATE_XC_YF') || categoryType !== 'LB_XCZC')
			 && (categoryType === 'LB_SFZC' && (beAccrued && runningState === 'STATE_SF_JT' ||  !beAccrued && runningState === 'STATE_SF_JN' && (propertyTax === 'SX_QYSDS' || propertyTax === 'SX_QTSF')) || categoryType !== 'LB_SFZC')
			 && (categoryType === 'LB_JK' && propertyCost === 'XZ_CHLX' && (beAccrued && runningState === 'STATE_JK_JTLX' || !beAccrued) || categoryType !== 'LB_JK')
			 && (categoryType === 'LB_TZ' && propertyCost === 'XZ_QDSY' && (beAccrued && (runningState === 'STATE_TZ_JTGL' || runningState === 'STATE_TZ_JTLX') || !beAccrued) || categoryType !== 'LB_TZ')
			 && (categoryType === 'LB_CQZC' && (runningState === 'STATE_CQZC_JZSY' || assetType === 'XZ_ZJTX') || categoryType !== 'LB_CQZC')
			 && categoryType !== 'LB_ZB'
		 	 && runningState !== 'STATE_ZS_TH'
			 && runningState !== 'STATE_ZF_SH'
		 	 && runningState !== 'STATE_FY_DJ')
			 || isQueryByBusiness && usedProject)){
				 return true
			 }
			 return false
		 }
	return (
      <div className="accountConf-modal-list lrAccount-CardBody">
				{
					cardTemp.get('flowNumber') &&  runningInsertOrModify === 'modify'?
					<div className="accountConf-modal-list-item">
						<label>流水号：</label>
						<div>
								{cardTemp.get('flowNumber')}
						</div>
					</div>
					:
					null
				}
				<div className="accountConf-modal-list-item">
					<label>日期：</label>
					{
						specialStateforAccrued?
							<div>
								{runningDate}
							</div>
							:
							<div>
								<DatePicker
									allowClear={false}
									disabledDate={disabledDate}
									value={moment(runningDate)}
									disabled={assetType === 'XZ_CZZC' && isQueryByBusiness && beCleaning && businessList &&  businessList.size}
									onChange={value => {
										const date = value.format('YYYY-MM-DD')
										dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningDate', date))
										// if(paymentType === 'LB_SFGL' && (isQueryByBusiness || runningInsertOrModify === 'modify')){
										// 	return
										// }else{
											if(preAmount<=0) {
												dispatch(lrAccountActions.changeLrAccountCommonString('card', 'offsetAmount', 0))
											}
										// }

									}}
								/>
							</div>
					}

				</div>
				<div className="accountConf-modal-list-item">
					<label>流水类别：</label>
					{
						specialStateforAccrued?
							<div>
								{name}
							</div>
							:
							<div className="lrls-account-box">
								<RunCategorySelect
									disabled={runningInsertOrModify === 'modify' || specialStateforAssets}  //查询状态下 不能修改流水类别
									treeData={runningCategory}
									value={name}
									placeholder=""
									parentDisabled={true}
									onChange={(value,label,extra) => {
										const valueList = value.split(Limit.TREE_JOIN_STR)
										const categoryIndexList = valueList[2].split('_')
										let category = runningCategory

										categoryIndexList.forEach((v, i) => {
											if (i < categoryIndexList.length-1) {
												category = category.getIn([Number(v), 'childList'])
											} else {
												category = category.getIn([Number(v)])
											}
										})
										dispatch(lrAccountActions.selectAccountRunningCategory(valueList[0], valueList[1], category, scale, payableRate, outputRate))
									}}
								/>
								{
									projectTest()?
									<Switch
										className="use-unuse-style"
										style={{marginLeft:'.2rem'}}
										checked={usedProject}
										checkedChildren={'项目'}
										onChange={() => {
											if (!usedProject && !projectCard.size) {
												dispatch(lrAccountActions.changeLrAccountCommonString('card','projectCard',fromJS([{uuid:'',amount:''}])))
											}
											dispatch(lrAccountActions.changeLrAccountCommonString('card','usedProject',!usedProject))
										}}
									/>:null
								}
							</div>
					}
				</div>


				<Properties
					dispatch={dispatch}
					cardTemp={cardTemp}
					flags={flags}
					hasChecked={hasChecked}
				/>
				<SelectRadio
					disabled={isQueryByBusiness}
					isModify={isModify}
					cardTemp={cardTemp}
					dispatch={dispatch}
					beSpecial={beSpecial}
					beDeposited={beDeposited}
					runningState={runningState}
					payOrReceive={payOrReceive}
					beManagemented={beManagemented}
					flags={flags}
					specialStateforAccrued={specialStateforAccrued}
				/>

				<div className="accountConf-separator"></div>
				<div className="accountConf-modal-list-item">
					<label>摘要：</label>
					{
						specialStateforAccrued?
							<div>
								{runningAbstract}
							</div>
							:
							<div>
								<Input className="focus-input"
                                    onFocus={(e) => {
										document.getElementsByClassName('focus-input')[0].select();
									}}
									value={runningAbstract}
									onChange={(e) => {
										dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningAbstract', e.target.value))
									}}
								/>
							</div>
					}
				</div>
				{
					runningState!='' && beManagemented && runningState !== 'STATE_CQZC_JZSY' && assetType !== 'XZ_ZJTX'?
						<div className="accountConf-modal-list-item">
							<label>往来单位：</label>
							<div className='chosen-right' >
								{
									specialStateforAccrued?
										<div>
											{`${contactsCardRange?contactsCardRange.get('code'):''} ${contactsCardRange?contactsCardRange.get('name'):''}`}
										</div>
										:
										<Select
											combobox
											showSearch
											value={`${contactsCardRange && contactsCardRange.get('code')?contactsCardRange.get('code'):''} ${contactsCardRange && contactsCardRange.get('name')?contactsCardRange.get('name'):''}`}
											dropdownRender={menu => (
										      <div>
										        {menu}
										        <Divider style={{ margin: '4px 0' }} />
										        <div  style={{ padding: '8px', cursor: 'pointer' }} onMouseDown={() => {
													const showModal = () =>{
														this.setState({showModal:true})
													}
													dispatch(lrAccountActions.initRelaCard(direction,showModal))
												}} >
										          <Icon type="plus" /> 新增往来单位
										        </div>
										      </div>
										    )}
											onChange={value => {
												const valueList = value.split(Limit.TREE_JOIN_STR)
												const uuid = valueList[0]
												const code = valueList[1]
												const name = valueList[2]
												dispatch(lrAccountActions.changeLrAccountCommonString('card', [categoryTypeObj, 'contactsCardRange'], fromJS({uuid,name,code})))
											}}
											>
											{
												contactsThingsList.map((v, i) => <Option   key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{`${v.get('code')} ${v.get('name')}`}</Option>)
											}
										</Select>

								}
								<div className='chosen-word'
									onClick={() => {
										dispatch(lrAccountActions.getCardList('contacts', runningState, contactsRange,'showContactsModal'))
										dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'currentCardType'], 'contacts'))

								}}>选择</div>
							</div>
							{/* <Button
								className="add-btn"
								disabled={!editPermission}
								style={{marginLeft:'.2rem'}}
								onClick={() => {
									const showModal = () =>{
										this.setState({showModal:true})
									}
									dispatch(lrAccountActions.initRelaCard(direction,showModal))
								}}>
								新增
							</Button> */}
							<EditCardModal
								showModal = {this.state.showModal}
								closeModal = {() => this.setState({showModal:false})}
								lrAclist = {lrAclist}
								dispatch={dispatch}
								lrAccountState={lrAccountState}
								simplifyStatus={simplifyStatus}
								contactsRange={contactsRange}
							/>
						</div>
						:null
				}
				{
					   projectTest() && usedProject?
						projectCard.map((v,i) =>
						<div key={i} className='project-content-area' style={projectCard.size>1?{}:{border:'none',marginBottom:'0'}}>
						<div className="accountConf-modal-list-item" >
							<label>项目：</label>
							<div className='chosen-right'>
								{
									specialStateforAccrued?
										<div>
											{`${v.get('code')?v.get('code'):''} ${v.get('name')?v.get('name'):''}`}
										</div>
										:
										<Select
											combobox
											showSearch
											value={`${v.get('code') !== 'COMNCRD' && v.get('code')?v.get('code'):''} ${v.get('name')?v.get('name'):''}`}
											onChange={value => {
												const valueList = value.split(Limit.TREE_JOIN_STR)
												const uuid = valueList[0]
												const code = valueList[1]
												const name = valueList[2]
												const amount = v.get('amount')
												dispatch(lrAccountActions.changeLrAccountCommonString('card', ['projectCard',i], fromJS({uuid,name,code,amount})))
											}}
											>
											{projectList.filter(v => {
												if (categoryType === 'LB_FYZC'
											    || runningState === 'STATE_XC_JT'
											    || !beAccrued && runningState === 'STATE_XC_JN'
												|| runningState === 'STATE_XC_YF'
											    || propertyCost === 'XZ_CHLX' && (runningState === 'STATE_JK_JTLX' || !beAccrued && runningState === 'STATE_JK_ZFLX' )
												|| assetType === 'XZ_ZJTX') {
													return true
											    } else if (v.get('code') === 'COMNCRD') {
													return false
												}
												return true
												}).map((v, i) =>
												<Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>
													{`${v.get('code') !== 'COMNCRD'?v.get('code'):''} ${v.get('name')}`}
												</Option>
											)}
										</Select>

								}
								<div className='chosen-word'
									onClick={() => {
										dispatch(lrAccountActions.getProjectAllCardList(projectRange,'showContactsModal'))
										dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'currentCardType'], 'project'))
										this.setState({
											index:i,
											curAmount:v.get('amount')
										})

								}}>选择</div>
							</div>
							{
								propertyCarryover !== 'SX_HW'
							 && categoryType !== 'LB_CQZC'?
									<span className='icon-content'>
										<span>
											<XfIcon
												type="simple-plus"
												theme="outlined"
												onClick={() => {
													dispatch(lrAccountActions.addProject(projectCard,i))
													if (beProject && usedProject && projectCard.size === 1) {
														dispatch(lrAccountActions.changeLrAccountCommonString('card',['projectCard',0,'amount'],amount))
													}
												}}
											/>
										</span>
										{
											projectCard.size >1 ?
												<span>
													<XfIcon
														type="sob-delete"
														theme="outlined"
														onClick={() => {
															dispatch(lrAccountActions.deleteProject(projectCard,i,taxRate))
														}}
													/>
												</span> : ''
										}

									</span>:''
							}

						</div>
						{
							projectCard.size >1 ?
							<div className="accountConf-modal-list-item" >
								<label>金额：</label>
								<Input
									value={v.get('amount')}
									onChange={(e) => {
										if (e.target.value === undefined)
											return

										let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
										if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
												value = value.substr(1)
											}
											if (categoryType === 'LB_FYZC') {
												if (regNegative.test(value) || (value === '')) {
													dispatch(lrAccountActions.changeLrAccountCommonString('card', ['projectCard',i,'amount'], value))
													dispatch(lrAccountActions.autoCalculateProjectAmount())
													taxRate && dispatch(lrAccountActions.changeAccountTaxRate())
												} else {
													message.info('金额只能输入带两位小数的数字')
												}
											} else {
												if (reg.test(value) || (value === '')) {
													dispatch(lrAccountActions.changeLrAccountCommonString('card', ['projectCard',i,'amount'], value))
													dispatch(lrAccountActions.autoCalculateProjectAmount())
													taxRate && dispatch(lrAccountActions.changeAccountTaxRate())
												} else {
													message.info('金额只能输入带两位小数的数字')
												}
											}
									}}
								/>
							</div>:''
						}

						</div>
					):null

				}

				{
					(runningState === 'STATE_YYSR_XS' || runningState === 'STATE_YYSR_TS' || runningState === 'STATE_YYZC_TG' || runningState === 'STATE_YYZC_GJ') && propertyCarryover ==='SX_HW' ?
					stockCardList && stockCardList.map((v,i) =>
					<div>
					<div className="accountConf-modal-list-item">
						<label>存货：</label>
						<div className='chosen-right'>
							{
								specialStateforAccrued?
									<div>
										{`${v.get('code')?v.get('code'):''} ${v.get('name')?v.get('name'):''}`}
									</div>
									:
									<Select
										showSearch
										combobox
										value={`${v.get('code')?v.get('code'):''} ${v.get('name')?v.get('name'):''}`}
										dropdownRender={menu => (
										  <div>
											{menu}
											<Divider style={{ margin: '4px 0' }} />
											<div  style={{ padding: '8px', cursor: 'pointer' }} onMouseDown={() => {
												const showModal= () =>{
													this.setState({showModalStock:true})
												}
												dispatch(lrAccountActions.initStockCard(direction,showModal))
											}} >
											  <Icon type="plus" /> 新增存货
											</div>
										  </div>
										)}
										onChange={value => {
											const valueList = value.split(Limit.TREE_JOIN_STR)
											const uuid = valueList[0]
											const code = valueList[1]
											const name = valueList[2]
											const amount = v.get('amount')
											dispatch(lrAccountActions.changeLrAccountCommonString('card', [categoryTypeObj, 'stockCardList', i] , fromJS({uuid,name,code,amount})))
											beCarryover && dispatch(lrAccountActions.changeLrAccountCommonString('card', [categoryTypeObj, 'carryoverCardList', i] , fromJS({uuid,name,code})))
										}}
										>
										{stockThingsList.map((v, i) => <Option  key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{`${v.get('code')} ${v.get('name')}`}</Option>)}
									</Select>
							}
							<div className='chosen-word'
								onClick={() => {
									dispatch(lrAccountActions.getCardList('stock', runningState, stockRange,'showContactsModal'))
									dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'currentCardType'], 'stock'))
									this.setState({
										index:i,
										curAmount:v.get('amount')
									})
							}}>选择</div>

						</div>
						{/* <Button
							className="add-btn"
							disabled={!editPermission}
							style={{marginLeft:'.2rem'}}
							onClick={() => {
								const showModal= () =>{
									this.setState({showModalStock:true})
								}
								dispatch(lrAccountActions.initStockCard(direction,showModal))
							}}>
							新增
						</Button> */}

						<span className='icon-content'>
							<span className="icon-plus-margin">
								<XfIcon
									type="simple-plus"
									theme="outlined"
									onClick={() => {
										dispatch(lrAccountActions.addStock(stockCardList,i,categoryTypeObj))
										if (propertyCarryover === 'SX_HW' && stockCardList.size === 1 ) {
											dispatch(lrAccountActions.changeLrAccountCommonString('card',[categoryTypeObj,'stockCardList',0,'amount'],amount))
										}
										beCarryover && dispatch(lrAccountActions.addCarryStock(carryoverCardList,i,categoryTypeObj))
									}}
								/>
							</span>
							{
								stockCardList.size >1 ?
									<span className="icon-plus-margin" style={{fontSize:'14px'}}>
										<XfIcon
											type="sob-delete"
											theme="outlined"
											onClick={() => {
												dispatch(lrAccountActions.deleteStock(stockCardList,i,taxRate,categoryTypeObj))
												beCarryover && dispatch(lrAccountActions.deleteCarryStock(carryoverCardList,i,categoryTypeObj))
											}}
										/>
									</span> : ''
							}

						</span>

					</div>
					{
						stockCardList.size >1 ?
						<div className="accountConf-modal-list-item" >
							<label>金额：</label>
							<Input
								value={v.get('amount')}
								onChange={(e) => {
									numberTest(e, (value) => {
										dispatch(lrAccountActions.changeLrAccountCommonString('card', [categoryTypeObj,'stockCardList',i,'amount'], value))
										dispatch(lrAccountActions.autoCalculateStockAmount(categoryTypeObj))
										taxRate && dispatch(lrAccountActions.changeAccountTaxRate())
									})

								}}
							/>
						</div>:''
					}

					</div>
					)
					:
					null
				}

				<div style={{display:runningState === 'STATE_SF_JN' && propertyTax === 'SX_ZZS' ?'':'none'}}>
					<div className="accountConf-separator"></div>
					<div className="accountConf-modal-list-item">
						<div className='input-right-amount'>
							<span style={{margin:0}}>处理税费：<Amount>{(Number(offsetAmount) + Number(handleAmount) + (beReduceOut && reduceAmount ? Number(reduceAmount):0)).toFixed(2)}</Amount></span>
						</div>
					</div>
					{
						categoryType === 'LB_SFZC' && propertyTax === 'SX_ZZS' && runningState === 'STATE_SF_JN' ?
							<PayOrPreAmount
								preAmount={cardTemp.get('preAmount')}
								payableAmount={cardTemp.get('payableAmount')}
								direction={direction}
								dispatch={dispatch}
								accountNameList={payList}
								accountNameAc={payAc}
								cardTemp={cardTemp}
								runningDate={runningDate}
								categoryUuid={categoryUuid}
								categoryType={categoryType}
								acId={payAc.getIn([0,'acId'])}
								runningState={runningState}
								propertyTax={propertyTax}
								isYfsf={true}
								taxAmount={taxAmount}
								flags={flags}

							/>
							:
							null
					}
					{/* 税费支出 金额 预交*/}


					<div className="accountConf-modal-list-item" style={{display:(categoryType ==='LB_SFZC' && runningState === 'STATE_SF_JN') && (beInAdvance || cardTemp.get('preAmount')>0 || offsetAmount>0)?'':'none'}}>
						<label>预交抵扣金额：</label>
						<div style={{display:'flex'}}>
							{
								specialStateforAccrued?
									<div>
										{offsetAmount?offsetAmount.toFixed(2):'0.00'}
									</div>
									:
									<Input
										style={{flex:1}}
										value={offsetAmount}
										onChange={(e) => {
											//e.targt.value小于计提
											numberTest(e, (value) => dispatch(lrAccountActions.changeLrAccountCommonString('card', 'offsetAmount', value)))

										}}
									/>
							}
							{
								categoryType === 'LB_SFZC' && propertyTax === 'SX_ZZS' && runningState === 'STATE_SF_JN'?
									<PayOrPreAmount
										preAmount={cardTemp.get('preAmount')}
										payableAmount={cardTemp.get('payableAmount')}
										direction={direction}
										dispatch={dispatch}
										accountNameList={inAdvanceList}
										accountNameAc={inAdvanceAc}
										cardTemp={cardTemp}
										runningDate={runningDate}
										categoryUuid={categoryUuid}
										categoryType={categoryType}
										acId={inAdvanceAc.getIn([0,'acId'])}
										runningState={runningState}
										propertyTax={propertyTax}
										flags={flags}
									/>
									:
									null
							}
						</div>
					</div>
				</div>
				{
					runningState !== 'STATE_YYSR_DJ'
					&& runningState !== 'STATE_YYZC_DJ'
					&& runningState !== 'STATE_FY_DJ'
					&& runningState !== 'STATE_SF_SFJM'
					&& (runningState !== 'STATE_XC_FF' || runningState == 'STATE_XC_FF' && !beWithholding && !beWithholdSocial && !beWithholdTax)
					&& (runningState !== 'STATE_XC_JN' || runningState === 'STATE_XC_JN' && !beWithholding && !beWithholdSocial && !beWithholdTax)
					&& runningType !== 'LX_JZSY_SY'
					&& runningType !== 'LX_JZSY_SS'
					&& !specialStateforAssets ?
					<div className="accountConf-modal-list-item">
						<label>{amountStr}</label>
						<div>
							{
								specialStateforAccrued || beProject && usedProject && projectCard.size>1 || propertyCarryover === 'SX_HW' && stockCardList.size>1?
									<div>
										{propertyTax === 'SX_ZZS' && runningState === 'STATE_SF_JN' ? Number(handleAmount).toFixed(2) : Number(amount).toFixed(2)}
									</div>
									:
									<Input
										placeholder=""
										value={propertyTax === 'SX_ZZS' && runningState === 'STATE_SF_JN' ? handleAmount : !hasChecked && runningState === 'STATE_ZF_SH' ? 0 : amount}
										disabled={assetType === 'XZ_CZZC' && isQueryByBusiness && beCleaning && businessList &&  businessList.size }
										onChange={(e) => {
											if(!hasChecked && runningState === 'STATE_ZF_SH'){
												message.info('请先勾选待处理流水')
											}else{
												if (e.target.value === undefined)
													return

												let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
												if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
														value = value.substr(1)
													}
													if (categoryType === 'LB_FYZC') {
														if (regNegative.test(value) || (value === '')) {
															dispatch(lrAccountActions.changeLrAccountCommonString('card', `${propertyTax === 'SX_ZZS' && runningState === 'STATE_SF_JN' ? 'handleAmount' : 'amount'}`, value))
														} else {
															message.info('金额只能输入带两位小数的数字')
														}
													} else {
														if (reg.test(value) || (value === '')) {
															dispatch(lrAccountActions.changeLrAccountCommonString('card', `${propertyTax === 'SX_ZZS' && runningState === 'STATE_SF_JN' ? 'handleAmount' : 'amount'}`, value))
														} else {
															message.info('金额只能输入带两位小数的数字')
														}
													}
													assetType === 'XZ_CZZC' && businessList ? !businessList.size : false && dispatch(lrAccountActions.calculateGain())
													taxRate && dispatch(lrAccountActions.changeAccountTaxRate())
													categoryType === 'LB_CQZC' && beCarryoverOut && dispatch(lrAccountActions.calculateGain())


											}

										}}
									/>
								}
							{/* 薪酬支出 未处理金额 */}
							{
								categoryType === 'LB_XCZC' && (propertyPay ==='SX_GZXJ' || propertyPay ==='SX_SHBX' || propertyPay ==='SX_ZFGJJ') && (runningState === 'STATE_XC_JN' || runningState === 'STATE_XC_FF')&& !beWithholding && beAccrued ?
									<PayOrPreAmount
										preAmount={cardTemp.get('preAmount')}
										payableAmount={cardTemp.get('payableAmount')}
										direction={direction}
										dispatch={dispatch}
										accountNameList={accruedList}
										accountNameAc={accruedAc}
										cardTemp={cardTemp}
										runningDate={runningDate}
										categoryUuid={categoryUuid}
										categoryType={categoryType}
										acId={accruedAc.getIn([0,'acId'])}
										runningState={runningState}
										accruedState='XCZC'
										flags={flags}
									/>
									:
									null
							}
							{/* 税费支出  未处理金额 */}
							{
								categoryType === 'LB_SFZC' && (propertyTax === 'SX_QTSF' ||propertyTax === 'SX_QYSDS') && runningState === 'STATE_SF_JN' && beAccrued?
									<PayOrPreAmount
										preAmount={cardTemp.get('preAmount')}
										payableAmount={cardTemp.get('payableAmount')}
										direction={direction}
										dispatch={dispatch}
										accountNameList={accruedList}
										accountNameAc={accruedAc}
										cardTemp={cardTemp}
										runningDate={runningDate}
										categoryUuid={categoryUuid}
										categoryType={categoryType}
										acId={accruedAc.getIn([0,'acId'])}
										runningState={runningState}
										propertyTax={propertyTax}
										sfAmount={sfAmount}
										flags={flags}
										accruedState='QTSF'
									/>
									:
									null
							}
							{
								categoryType === 'LB_SFZC' && propertyTax === 'SX_GRSF' && runningState === 'STATE_SF_JN'?
									<PayOrPreAmount
										preAmount={cardTemp.get('preAmount')}
										payableAmount={cardTemp.get('payableAmount')}
										direction={direction}
										dispatch={dispatch}
										accountNameList={payList}
										accountNameAc={payAc}
										cardTemp={cardTemp}
										runningDate={runningDate}
										categoryUuid={categoryUuid}
										categoryType={categoryType}
										acId={payAc.getIn([0,'acId'])}
										runningState={runningState}
										propertyTax={propertyTax}
										sfAmount={sfAmount}
										flags={flags}
									/>
									:
									null
							}
							{
								categoryType === 'LB_SFZC'&& runningState === 'STATE_SF_ZCWJSF' && beTurnOut?
									<PayOrPreAmount
										preAmount={cardTemp.get('preAmount')}
										payableAmount={cardTemp.get('payableAmount')}
										direction={direction}
										dispatch={dispatch}
										accountNameList={turnOutList}
										accountNameAc={turnOutAc}
										cardTemp={cardTemp}
										runningDate={runningDate}
										categoryUuid={categoryUuid}
										categoryType={categoryType}
										acId={turnOutAc.getIn([0,'acId'])}
										runningState={runningState}
										flags={flags}
									/>
									:
									null
							}
							{/* 暂收暂付 */}
							{
								runningState === 'STATE_ZS_TH' || runningState ==='STATE_ZF_SH'?
									<PayOrPreAmount
										preAmount={cardTemp.get('preAmount')}
										payableAmount={''}
										direction={direction}
										dispatch={dispatch}
										accountNameList={[]}
										accountNameAc={[]}
										cardTemp={cardTemp}
										runningDate={runningDate}
										categoryUuid={categoryUuid}
										categoryType={categoryType}
										acId={''}
										runningState={runningState}
										propertyPay={propertyPay}
										accumulationAmount={accumulationAmount}
										fundOrSocialSecurity='fund'
										flags={flags}
									/>
									:
									null
							}
							{/* 资本  未处理金额 */}
							{
								categoryType === 'LB_ZB'&& runningState === 'STATE_ZB_ZFLR' && beAccrued?
									<PayOrPreAmount
										preAmount={cardTemp.get('preAmount')}
										payableAmount={cardTemp.get('payableAmount')}
										direction={direction}
										dispatch={dispatch}
										accountNameList={payableList}
										accountNameAc={payableAc}
										cardTemp={cardTemp}
										runningDate={runningDate}
										categoryUuid={categoryUuid}
										categoryType={categoryType}
										acId={payableAc.getIn([0,'acId'])}
										runningState={runningState}
										flags={flags}
									/>
									:
									null
							}
							{/* 借款 未处理金额 */}
							{
								categoryType === 'LB_JK'&& runningState === 'STATE_JK_ZFLX' && beAccrued?
									<PayOrPreAmount
										preAmount={cardTemp.get('preAmount')}
										payableAmount={cardTemp.get('payableAmount')}
										direction={direction}
										dispatch={dispatch}
										accountNameList={unpaidInterestList}
										accountNameAc={unpaidInterestAc}
										cardTemp={cardTemp}
										runningDate={runningDate}
										categoryUuid={categoryUuid}
										categoryType={categoryType}
										acId={unpaidInterestAc.getIn([0,'acId'])}
										runningState={runningState}
										flags={flags}
									/>
									:
									null
							}
							{/* 投资 未处理金额 */}
							{
								categoryType === 'LB_TZ'&&  runningState === 'STATE_TZ_SRLX' && beAccrued?
									<PayOrPreAmount
										preAmount={cardTemp.get('preAmount')}
										payableAmount={cardTemp.get('payableAmount')}
										direction={direction}
										dispatch={dispatch}
										accountNameList={uncollectedInterestList}
										accountNameAc={uncollectedInterestAc}
										cardTemp={cardTemp}
										runningDate={runningDate}
										categoryUuid={categoryUuid}
										categoryType={categoryType}
										acId={uncollectedInterestAc.getIn([0,'acId'])}
										runningState={runningState}
										flags={flags}
									/>
									:
									null
							}
							{
								categoryType === 'LB_TZ'&& runningState === 'STATE_TZ_SRGL'  && beAccrued?
									<PayOrPreAmount
										preAmount={cardTemp.get('preAmount')}
										payableAmount={cardTemp.get('payableAmount')}
										direction={direction}
										dispatch={dispatch}
										accountNameList={uncollectedProfitList}
										accountNameAc={uncollectedProfitAc}
										cardTemp={cardTemp}
										runningDate={runningDate}
										categoryUuid={categoryUuid}
										categoryType={categoryType}
										acId={uncollectedProfitAc.getIn([0,'acId'])}
										runningState={runningState}
										flags={flags}
									/>
									:
									null
							}
						</div>

					</div>
					:
					null
				}
				{/* 营业收入／支出 收订金 */}
				{
					beDeposited && (runningState === 'STATE_YYSR_DJ' || runningState === 'STATE_YYZC_DJ' || runningState === 'STATE_FY_DJ') ?
					<div>
						<div className="accountConf-modal-list-item">
							<label>{`预${direction ==='debit'?'收':'付'}金额：`}</label>
							<div>
								<Input

									value={amount}
									onChange={(e) => {
										numberTest(e,(value) => dispatch(lrAccountActions.changeLrAccountCommonString('card', 'amount', value)))
									}}
								/>
							</div>
						</div>
					</div>
					:
					null
				}




				{
					!isQueryByBusiness?
					<div>
							<div
								style={{
									display:
									runningState
								&& runningState !== 'STATE_YYSR_DJ'
								&& runningState !== 'STATE_YYZC_DJ'
								&& beManagemented
								&& (categoryType==='LB_YYZC'||categoryType==='LB_YYSR')?'':'none'
								}}
								>
								<div className="accountConf-separator"></div>
								{
									(categoryType === 'LB_YYSR'||categoryType === 'LB_YYZC')&& runningState !== 'STATE_YYSR_DJ' && runningState !== 'STATE_YYZC_DJ' && beManagemented ?
										<PayOrPreAmount
										preAmount={cardTemp.get('preAmount')}
										payableAmount={cardTemp.get('payableAmount')}
										direction={direction}
										dispatch={dispatch}
										accountNameList={direction === 'debit'?receivablesList:deliveryList}
										accountNameAc={direction === 'debit'?receivablesAc:deliveryAc}
										cardTemp={cardTemp}
										runningDate={runningDate}
										categoryUuid={categoryUuid}
										categoryType={categoryType}
										acId={contactsCardRange?contactsCardRange.get('uuid'):''}
										runningState={runningState}
										flags={flags}
										categoryTypeObj={categoryTypeObj}
									/>
									:
									null
								}
								{
								(runningState ==='STATE_YYSR_XS' || runningState ==='STATE_YYZC_GJ') && preAmount?
									<div className="accountConf-modal-list-item">
										<label>{`预${direction ==='debit'?'收':'付'}抵扣：`}</label>
										<div>
											<Input
												value={offsetAmount}
												onChange={(e) => {
													numberTest(e,(value) => dispatch(lrAccountActions.changeLrAccountCommonString('card', 'offsetAmount', value)))

												}}
											/>
										</div>
									</div>
									:
									null
								}
								{
									(runningState ==='STATE_YYSR_TS' || runningState ==='STATE_YYZC_TG') && payableAmount>0 ?
										<div className="accountConf-modal-list-item">
											<label>{`应${direction ==='debit'?'收':'付'}款抵扣：`}</label>
											<div>
												<Input
													value={offsetAmount}
													onChange={(e) => {
														numberTest(e,(value) => dispatch(lrAccountActions.changeLrAccountCommonString('card', 'offsetAmount',value)))

													}}
												/>
											</div>
										</div>
										:
										null
								}
								<div className="accountConf-modal-list-item">
									<label>{`本次${runningState ==='STATE_YYSR_TS' || runningState ==='STATE_YYZC_GJ'?'付':'收'}款：`}</label>
									<div>
										<Input className='yysr-focus-input'
											onFocus={() => {
												let temporaryAmount = runningState === 'STATE_YYSR_XS' || runningState === 'STATE_YYSR_TS' ||runningState === 'STATE_YYZC_GJ' ||runningState === 'STATE_YYZC_TG' ? amount-offsetAmount : amount
												dispatch(lrAccountActions.changeLrAccountCommonString('card', 'currentAmount', temporaryAmount))
												setTimeout(() => {
													document.getElementsByClassName('yysr-focus-input')[0].select()
												},1)
											}}
											value={currentAmount}
											onChange={(e) => {
												numberTest(e,(value) => dispatch(lrAccountActions.changeLrAccountCommonString('card', 'currentAmount', value)))

											}}
										/>
									</div>
								</div>
								{
									(categoryType === 'LB_YYSR' || categoryType === 'LB_YYZC' ) && (runningState !== 'STATE_YYSR_DJ' && runningState !== 'STATE_YYZC_DJ') && currentAmount > 0 ?
									<div className="accountConf-modal-list-item">
										<label>账户：</label>
										<div className="lrls-account-box">
											<Select
												combobox
												showSearch
												value={cardTemp.get('accountName')?cardTemp.get('accountName'):''}
												dropdownRender={menu => (
												  <div>
													{menu}
													<Divider style={{ margin: '4px 0' }} />
													<div  style={{ padding: '8px', cursor: 'pointer' }} onMouseDown={() => {
														dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'showAccountModal'], true))
														dispatch(accountConfActions.beforeInsertAccountConf('account','','fromLrAccount'))
													}} >
													  <Icon type="plus" /> 新增账户
													</div>
												  </div>
												)}
												onSelect={value => {
													dispatch(lrAccountActions.changeLrAccountAccountName('card', 'accountUuid', 'accountName', value))
												}}
												>
												{accountList.getIn([0, 'childList']).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
											</Select>
											{/* <Button
												disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
												className="title-right "
												type="ghost"
												onClick={()=>{
													dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'showAccountModal'], true))
													dispatch(accountConfActions.beforeInsertAccountConf('account','','fromLrAccount'))
												}}
												>
													新增
											</Button> */}
										</div>
									</div>
									:
									null
								}

							</div>


						</div>
						:
						null
				}
				{
					(categoryType === 'LB_YYSR' || categoryType === 'LB_YYZC' ) && (runningState !== 'STATE_YYSR_DJ' && runningState !== 'STATE_YYZC_DJ') && isQueryByBusiness && allGetFlow?
						<div className="accountConf-modal-list-item">
							<label>账户：</label>
							<div className="lrls-account-box">
								<Select
									combobox
									showSearch
									value={cardTemp.get('accountName')?cardTemp.get('accountName'):''}
									dropdownRender={menu => (
									  <div>
										{menu}
										<Divider style={{ margin: '4px 0' }} />
										<div  style={{ padding: '8px', cursor: 'pointer' }} onMouseDown={() => {
											dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'showAccountModal'], true))
											dispatch(accountConfActions.beforeInsertAccountConf('account','','fromLrAccount'))
										}} >
										  <Icon type="plus" /> 新增账户
										</div>
									  </div>
									)}
									onSelect={value => {
										dispatch(lrAccountActions.changeLrAccountAccountName('card', 'accountUuid', 'accountName', value))
									}}
									>
									{accountList.getIn([0, 'childList']).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
								</Select>
								{/* <Button
									disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
									className="title-right "
									type="ghost"
									onClick={()=>{
										dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'showAccountModal'], true))
										dispatch(accountConfActions.beforeInsertAccountConf('account','','fromLrAccount'))
									}}
									>
										新增
								</Button> */}
							</div>
						</div>:null
				}
				{/* 薪酬支出 */}
				<div style={{display:categoryType === 'LB_XCZC' && (runningState === 'STATE_XC_FF' || runningState === 'STATE_XC_JN' ) && (beWithholding || beWithholdTax || beWithholdSocial) && beAccrued ?'':'none'}}>
					<div className="accountConf-separator"></div>

					<div className="accountConf-modal-list-item" style={{display: propertyPay === 'SX_GZXJ' && (beWithholding || beWithholdTax || beWithholdSocial)  ?'':'none'}}>
						<label>工资薪金：</label>
						<div>
							{
								specialStateforAccrued ||  usedProject && projectCard.size>1?
									<div>
										{amount}
									</div>
									:
									<Input
										value={amount}
										onChange={(e) => {
											numberTest(e,(value) => {
												dispatch(lrAccountActions.changeLrAccountCommonString('card', 'amount', value))
												dispatch(lrAccountActions.autoCalculateAmount())
										})

										}}
									/>
							}

							{
								categoryType === 'LB_XCZC' && propertyPay !=='SX_FLF' && beAccrued && (runningState === 'STATE_XC_FF' || runningState === 'STATE_XC_JN')?
									<PayOrPreAmount
										preAmount={cardTemp.get('preAmount')}
										payableAmount={cardTemp.get('payableAmount')}
										direction={direction}
										dispatch={dispatch}
										accountNameList={accruedList}
										accountNameAc={accruedAc}
										cardTemp={cardTemp}
										runningDate={runningDate}
										categoryUuid={categoryUuid}
										categoryType={categoryType}
										acId={accruedAc.getIn([0,'acId'])}
										runningState={runningState}
										accruedState='XCZC'
										flags={flags}
									/>
									:
									null
							}
						</div>
					</div>
					<div className="accountConf-modal-list-item" style={{display:propertyPay==='SX_SHBX' && beWithholdSocial?'':'none'}}>
						<label className='large-width-label' style={!specialStateforAccrued?{width: '167px'}:{}}>社会保险(公司部分)：</label>
						<div>
							{
								specialStateforAccrued ?
									<div>
										{companySocialSecurityAmount}
									</div>
									:
								<Input
									value={companySocialSecurityAmount}
									onChange={(e) => {
										numberTest(e,(value) => {
											dispatch(lrAccountActions.changeAccountSalary('companySocialSecurityAmount',value))
											dispatch(lrAccountActions.autoCalculateAmount())
										})
									}}
								/>
							}
						</div>
					</div>
					<div className="accountConf-modal-list-item" style={{display:(propertyPay==='SX_SHBX'||propertyPay==='SX_GZXJ') && runningState !== 'STATE_XC_JT' && beWithholdSocial?'':'none'}}>
						<span style={{display:specialStateforAccrued? 'none' : '', marginRight:'10px'}}>
							<Checkbox
								checked={flags.get('personSocialSecurityAmountchecked')}
								onChange={(e) => {
									dispatch(lrAccountActions.changeAccountSalaryCheckbox('personSocialSecurityAmount','personSocialSecurityAmountchecked', e.target.checked))
									dispatch(lrAccountActions.autoCalculateAmount())
								}}
							/>
						</span>
						<label className='large-width-label'>{`${propertyPay==='SX_SHBX'?'代缴':'代扣'}社会保险(个人部分)：`}</label>
						<div>
							{
								specialStateforAccrued ?
									<div>
										{personSocialSecurityAmount}
									</div>
									:
									<Input
										disabled={!flags.get('personSocialSecurityAmountchecked')}
										value={personSocialSecurityAmount}
										onChange={(e) => {
											numberTest(e,(value) => {
												dispatch(lrAccountActions.changeAccountSalary('personSocialSecurityAmount',value))
												dispatch(lrAccountActions.autoCalculateAmount())
											})
										}}
									/>
							}
							{
								categoryType === 'LB_XCZC' && propertyPay ==='SX_GZXJ'  && beWithholdSocial && (runningState === 'STATE_XC_FF' || runningState === 'STATE_XC_JN')?
									<PayOrPreAmount
										preAmount={cardTemp.get('preAmount')}
										payableAmount={cardTemp.get('payableAmount')}
										direction={direction}
										dispatch={dispatch}
										accountNameList={socialSecurityList}
										accountNameAc={socialSecurityAc}
										cardTemp={cardTemp}
										runningDate={runningDate}
										categoryUuid={categoryUuid}
										categoryType={categoryType}
										acId={socialSecurityAc.getIn([0,'acId'])}
										runningState={runningState}
										propertyPay={propertyPay}
										fundOrSocialSecurity='socialSecurity'
										socialSecurityAmount={socialSecurityAmount}
										flags={flags}
									/>
									:
									null
							}
						</div>
					</div>

					<div className="accountConf-modal-list-item" style={{display:propertyPay==='SX_ZFGJJ' && beWithholding?'':'none'}}>
						<label className='large-width-label' style={!specialStateforAccrued?{width: '167px'}:{}}>公积金(公司部分)：</label>
						<div>
							{
								specialStateforAccrued?
								<div>
									{companyAccumulationAmount}
								</div>
								:
								<Input
									value={companyAccumulationAmount}
									onChange={(e) => {
										numberTest(e,(value) => {
											dispatch(lrAccountActions.changeAccountSalary('companyAccumulationAmount',value))
											dispatch(lrAccountActions.autoCalculateAmount())
										})
									}}
								/>
							}
						</div>
					</div>
					{
						(propertyPay==='SX_ZFGJJ'||propertyPay==='SX_GZXJ') && beWithholding?
						<div className="accountConf-modal-list-item" >
							<span style={{display:specialStateforAccrued? 'none' : '', marginRight:'10px'}}>
								<Checkbox
									checked={flags.get('personAccumulationAmountchecked')}
									onChange={(e) => {
										dispatch(lrAccountActions.changeAccountSalaryCheckbox('personAccumulationAmount','personAccumulationAmountchecked', e.target.checked))
										dispatch(lrAccountActions.autoCalculateAmount())
									}}
								/>
							</span>
								<label className='large-width-label'>{`${propertyPay==='SX_ZFGJJ'?'代缴':'代扣'}公积金(个人部分)：`}</label>
							<div>
								{
									specialStateforAccrued ?
										<div>
											{personAccumulationAmount}
										</div>
										:
										<Input
											disabled={!flags.get('personAccumulationAmountchecked')}
											value={personAccumulationAmount}
											onChange={(e) => {
												numberTest(e,(value) => {
													dispatch(lrAccountActions.changeAccountSalary('personAccumulationAmount',value))
													dispatch(lrAccountActions.autoCalculateAmount())
												})
											}}
										/>
									}
								{
									categoryType === 'LB_XCZC' && propertyPay ==='SX_GZXJ' && beWithholding && (runningState === 'STATE_XC_FF' || runningState === 'STATE_XC_JN')?
										<PayOrPreAmount
											preAmount={cardTemp.get('preAmount')}
											payableAmount={cardTemp.get('payableAmount')}
											direction={direction}
											dispatch={dispatch}
											accountNameList={fundList}
											accountNameAc={fundAc}
											cardTemp={cardTemp}
											runningDate={runningDate}
											categoryUuid={categoryUuid}
											categoryType={categoryType}
											acId={fundAc.getIn([0,'acId'])}
											runningState={runningState}
											propertyPay={propertyPay}
											accumulationAmount={accumulationAmount}
											fundOrSocialSecurity='fund'
											flags={flags}
										/>
										:
										null
								}
							</div>
						</div>
						:
						null
					}
					<div className="accountConf-modal-list-item" style={{display:(propertyPay==='SX_SHBX'||propertyPay==='SX_GZXJ') && runningState !== 'STATE_XC_JT' && beWithholdTax?'':'none'}}>
						<span style={{display:specialStateforAccrued? 'none' : '', marginRight:'10px'}}>
							<Checkbox
								checked={flags.get('incomeTaxAmountchecked')}
								onChange={(e) => {
									dispatch(lrAccountActions.changeAccountSalaryCheckbox('incomeTaxAmount','incomeTaxAmountchecked', e.target.checked))
									dispatch(lrAccountActions.autoCalculateAmount())
								}}
							/>
						</span>
						<label className='large-width-label'> {`${propertyPay === 'SX_GZXJ'?'代扣':'代缴'}个人所得税：`}</label>
						<div>
							{
								specialStateforAccrued ?
									<div>
										{incomeTaxAmount}
									</div>
									:
									<Input
										disabled={!flags.get('incomeTaxAmountchecked')}
										value={incomeTaxAmount}
										onChange={(e) => {
											numberTest(e,(value) => {
												dispatch(lrAccountActions.changeAccountSalary('incomeTaxAmount',value))
												dispatch(lrAccountActions.autoCalculateAmount())
											})
										}}
									/>
							}
						</div>

					</div>

					{
						propertyPay !== 'SX_QTXC' && propertyPay !== 'SX_FLF'?
						<div className="accountConf-modal-list-item">
							<label>实际支付金额：</label>
							<div>
								{formatMoney(actualAmount,2,'')}
							</div>
						</div>
						:
						null
					}
				</div>
				{
					accountTest(categoryType, beManagemented, isQueryByBusiness, runningState, payableAmount, handleAmount,propertyPay) ?
					<div className="accountConf-modal-list-item"	>
						<label>账户：</label>
						<div>
							{
								specialStateforAccrued?
									<div>
										{accountName?accountName:'无'}
									</div>
									:
									<div className="lrls-account-box">
										<Select
											combobox
											showSearch
											value={cardTemp.get('accountName')?cardTemp.get('accountName'):''}
											dropdownRender={menu => (
											  <div>
												{menu}
												<Divider style={{ margin: '4px 0' }} />
												<div  style={{ padding: '8px', cursor: 'pointer' }} onMouseDown={() => {
													dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'showAccountModal'], true))
													dispatch(accountConfActions.beforeInsertAccountConf('account','','fromLrAccount'))
												}} >
												  <Icon type="plus" /> 新增账户
												</div>
											  </div>
											)}
											onSelect={value => {
												const uuid = value.split(Limit.TREE_JOIN_STR)[0]
												if (uuid.indexOf('addCard') > -1) {
													dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'showAccountModal'], true))
													dispatch(accountConfActions.beforeInsertAccountConf('account','','fromLrAccount'))
												} else if (uuid.indexOf('test') > -1) {
													return
												} else {
													dispatch(lrAccountActions.changeLrAccountAccountName('card', 'accountUuid', 'accountName', value))
												}
											}}
											>
											{accountList.getIn([0, 'childList']).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
										</Select>
										{/* <Button
											disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
											className="title-right chosen-word add-btn"
											type="ghost"
											onClick={()=>{
												dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'showAccountModal'], true))
												dispatch(accountConfActions.beforeInsertAccountConf('account','','fromLrAccount'))
											}}
											>
												新增
										</Button> */}
									</div>
							}
						</div>
					</div>
					:
					null
				}
				{
					beReduce?
					<div className="accountConf-modal-list-item" style={{display:runningState === 'STATE_SF_JN' && !specialStateforAccrued?'':'none'}}>
						<span style={{marginRight:'10px'}}>
							<Checkbox
								checked={beReduceOut}
								onChange={(e) => {
									dispatch(lrAccountActions.changeLrAccountCommonString('card', 'beReduce', !beReduceOut))
								}}
							/>
						</span>
						<label className='large-width-label'>税费减免</label>


					</div>:''
				}
				{
					beReduce && beReduceOut && runningState === 'STATE_SF_JN'?
					<div className="accountConf-modal-list-item">
						<label>减免金额：</label>
						{
							specialStateforAccrued ?
								<div>
									{reduceAmount?reduceAmount.toFixed(2):'0.00'}
								</div>
								:
								<Input
									// disabled={!flags.get('incomeTaxAmountchecked')}
									value={reduceAmount}
									onChange={(e) => {
										numberTest(e,(value) => {
											dispatch(lrAccountActions.changeLrAccountCommonString('card','reduceAmount',value))
										})
									}}
								/>
						}
					</div>:''
				}
				{/*  发票 */}
				<Invoice
					dispatch={dispatch}
					flags={flags}
					cardTemp={cardTemp}
					taxRateTemp={taxRateTemp}
					allState={allState}
				/>
				{/* 处置损益/成本 */}
				<TransferProfitorCost
					dispatch={dispatch}
					flags={flags}
					cardTemp={cardTemp}
					taxRateTemp={taxRateTemp}
					allState={allState}
					callback={() => {
						this.setState({index:0})
					}}
				/>
				<QcModal
					showContactsModal={showContactsModal}
					MemberList={MemberList}
					thingsList={thingsList}
					selectThingsList={selectThingsList}
					dispatch={dispatch}
					currentCardType={currentCardType}
					modalName={'showContactsModal'}
					palceTemp={'card'}
					runningState={runningState}
					categoryTypeObj={categoryTypeObj}
					contactsRange={contactsRange}
					stockRange={stockRange}
					selectedKeys={selectedKeys}
					projectRange={projectRange}
					index={this.state.index}
					curAmount={this.state.curAmount}
				/>
				{
					(runningState === 'STATE_YYSR_XS' || runningState === 'STATE_YYSR_TS' || runningState === 'STATE_YYZC_TG' || runningState === 'STATE_YYZC_GJ') && propertyCarryover ==='SX_HW'?
					<AddCardModal
						showModal = {this.state.showModalStock}
						closeModal = {() => this.setState({showModalStock:false})}
						lrAclist = {lrAclist}
						dispatch={dispatch}
						lrAccountState={lrAccountState}
						simplifyStatus={simplifyStatus}
						stockRange={stockRange}
					/>:''
				}



			</div>

		)
	}
}
