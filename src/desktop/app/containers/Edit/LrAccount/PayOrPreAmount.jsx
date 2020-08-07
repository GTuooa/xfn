import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is } from 'immutable'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import { Amount } from 'app/components'

export default
class PayOrPreAmount extends React.Component {
  shouldComponentUpdate = (nextProps) => {
    const { preAmount,
            payableAmount,
            accountNameList,
            dispatch,
            cardTemp,
            categoryUuid,
            runningDate,
            direction,
            categoryType,
            acId,
            runningState,
            propertyPay,
            fundOrSocialSecurity,
            accumulationAmount,
            socialSecurityAmount,
            propertyTax,
            accruedState,
            sfAmount,
            isYfsf,
            taxAmount,
            accountNameAc,
            flags,
            categoryTypeObj
       } = this.props
    const specialStateforAccrued = flags.get('specialStateforAccrued')
    const isQueryByBusiness = flags.get('isQueryByBusiness')
    const contactsCardRange = cardTemp.getIn([categoryTypeObj,'contactsCardRange'])
    const contactsCardRange2 = nextProps.cardTemp.getIn([categoryTypeObj,'contactsCardRange'])
    const propertyCost = cardTemp.get('propertyCost')
    const name = cardTemp.get('name')
    const flowNumber = cardTemp.get('flowNumber')
    const flowNumber2 = nextProps.cardTemp.get('flowNumber')
    const accountNameList2 = nextProps.accountNameList
    const runningDate2 = nextProps.runningDate
    const preAmount2 = nextProps.preAmount
    const payableAmount2 = nextProps.payableAmount
    const socialSecurityAmount2 = nextProps.socialSecurityAmount
    const accumulationAmount2 = nextProps.accumulationAmount
    const sfAmount2 = nextProps.sfAmount
    const taxAmount2 = nextProps.taxAmount
    const runningState2 = nextProps.runningState
    const propertyCost2 = nextProps.cardTemp.get('propertyCost')
    const name2 = nextProps.cardTemp.get('name')
    const specialStateforAccrued2 = nextProps.flags.get('specialStateforAccrued')
    const runningInsertOrModify2 = nextProps.flags.get('runningInsertOrModify')
    const propertyTax2 = nextProps.cardTemp.get('propertyTax')
    const uuid2 = nextProps.cardTemp.get('uuid')
    if( isQueryByBusiness && flowNumber2 !==flowNumber
     || runningDate2 && runningState2
     && (runningDate !== runningDate2 && runningState2 !== 'STATE_JK_ZFLX' && runningState2 !== 'STATE_TZ_SRGL' && runningState2 !== 'STATE_TZ_SRLX' && runningState2 !== 'STATE_ZB_ZFLR' && accruedState !== 'XCZC'  && runningState2 !== 'STATE_SF_JN' && runningState2 !== 'STATE_ZS_TH' && runningState2 !== 'STATE_ZF_SH' && runningInsertOrModify2 === 'modify'
     || runningDate !== runningDate2 && runningInsertOrModify2 === 'insert'
     || runningState2 !== runningState && runningState2
     || propertyCost2 !== propertyCost && propertyCost2
     || name2 !== name && name2
     || specialStateforAccrued2 !== specialStateforAccrued && runningState2 !== 'STATE_JK_ZFLX' && runningState2 !== 'STATE_TZ_SRGL' && runningState2 !== 'STATE_TZ_SRLX' && runningState2 !== 'STATE_ZB_ZFLR' && runningState2 !== 'STATE_SF_JN' && accruedState !== 'XCZC' && runningState2 !== 'STATE_SF_JN' && runningState2 !== 'STATE_ZS_TH' && runningState2 !== 'STATE_ZF_SH'
     || contactsCardRange !== contactsCardRange2)) {
         if (!specialStateforAccrued2) {
             if(isYfsf) {  //应付税费
                 dispatch(lrAccountActions.getRunningAccountInfo(categoryUuid, runningDate2 , accountNameList2, acId, 'VAT', runningInsertOrModify2, uuid2))
             } else if(runningState2 === 'STATE_SF_ZCWJSF') {
                 dispatch(lrAccountActions.getRunningAccountInfo(categoryUuid, runningDate2, accountNameList2, acId, 'taxFetch'))
             } else if(propertyPay === 'SX_GZXJ' && fundOrSocialSecurity === 'fund') {
                 dispatch(lrAccountActions.getRunningAccountInfo(categoryUuid, runningDate2, accountNameList2, acId, 'fund'))
             } else if(propertyPay === 'SX_GZXJ' && fundOrSocialSecurity === 'socialSecurity') {
                 dispatch(lrAccountActions.getRunningAccountInfo(categoryUuid, runningDate2, accountNameList2, acId, 'socialSecurity'))
             } else if(categoryType === 'LB_SFZC' && runningState === 'STATE_SF_JN' && propertyTax === 'SX_GRSF') {
                 dispatch(lrAccountActions.getRunningAccountInfo(categoryUuid, runningDate2, accountNameList2, acId, 'sfAmount'))
             } else if (accruedState === 'XCZC' || accruedState === 'QTSF' || runningState2 === 'STATE_ZS_TH' || runningState2 ==='STATE_ZF_SH' || runningState2 === 'STATE_ZB_ZFLR' || runningState2 === 'STATE_JK_ZFLX' || runningState2 === 'STATE_TZ_SRGL' || runningState2 === 'STATE_TZ_SRLX') {
                dispatch(lrAccountActions.getRunningAccountInfo(categoryUuid, runningDate2 , accountNameList2, acId, 'accruedXCZC'))
             } else {
                dispatch(lrAccountActions.getRunningAccountInfo(categoryUuid, runningDate2, accountNameList2, nextProps.acId, 'dikou' ,runningInsertOrModify2 ,uuid2))
             }
         }

    }
      return  runningState2 !== runningState
              || propertyCost2 !== propertyCost
              || runningDate !== runningDate2
              || preAmount !== preAmount2
              || payableAmount !== payableAmount2
              || accumulationAmount !== accumulationAmount2
              || socialSecurityAmount !== socialSecurityAmount2
              || sfAmount !== sfAmount2
              || taxAmount !== taxAmount2?
              true:false
  }
  componentDidMount() {
    const {
         dispatch,
         categoryUuid,
         runningDate,
         direction,
         categoryType,
         acId,
         runningState,
         propertyPay,
         fundOrSocialSecurity,
         propertyTax,
         accruedState,
         accountNameList,
         isYfsf,
         accountNameAc,
         flags
          } = this.props
          const specialStateforAccrued = flags.get('specialStateforAccrued')
          const isQueryByBusiness = flags.get('isQueryByBusiness')
    if (runningDate && !specialStateforAccrued && runningState) {
        if(isYfsf) {  //应付税费
          dispatch(lrAccountActions.getRunningAccountInfo(categoryUuid, runningDate , accountNameList, acId, 'VAT'))
        } else if(runningState === 'STATE_SF_ZCWJSF') {
          dispatch(lrAccountActions.getRunningAccountInfo(categoryUuid, runningDate, accountNameList, acId, 'taxFetch'))
        } else if(propertyPay === 'SX_GZXJ' && fundOrSocialSecurity === 'fund') {
          dispatch(lrAccountActions.getRunningAccountInfo(categoryUuid, runningDate, accountNameList, acId, 'fund'))
        } else if(propertyPay === 'SX_GZXJ' && fundOrSocialSecurity === 'socialSecurity') {
          dispatch(lrAccountActions.getRunningAccountInfo(categoryUuid, runningDate, accountNameList, acId, 'socialSecurity'))
        } else if(categoryType === 'LB_SFZC' && runningState === 'STATE_SF_JN' && propertyTax === 'SX_GRSF') {
          dispatch(lrAccountActions.getRunningAccountInfo(categoryUuid, runningDate, accountNameList, acId, 'sfAmount'))
      } else if (runningState === 'STATE_SF_JN' && propertyTax === 'SX_ZZS') {
          dispatch(lrAccountActions.getRunningAccountInfo(categoryUuid, runningDate , accountNameList, acId, 'accruedZZS'))
       } else if ((accruedState === 'XCZC' || accruedState === 'QTSF' || runningState === 'STATE_ZS_TH' || runningState ==='STATE_ZF_SH' || runningState === 'STATE_ZB_ZFLR' || runningState === 'STATE_JK_ZFLX' || runningState === 'STATE_TZ_SRGL' || runningState === 'STATE_TZ_SRLX')&&!isQueryByBusiness) {
           dispatch(lrAccountActions.getRunningAccountInfo(categoryUuid, runningDate , accountNameList, acId, 'accruedXCZC'))
        }  else {
          dispatch(lrAccountActions.getRunningAccountInfo(categoryUuid, runningDate, accountNameList, acId, 'dikou' ))
        }
  }
}
  render() {
    const {
        preAmount,
        payableAmount,
        accountNameList,
        dispatch,
        cardTemp,
        categoryUuid,
        runningDate,
        direction,
        categoryType,
        acId,
        runningState,
        propertyPay,
        fundOrSocialSecurity,
        accumulationAmount,
        socialSecurityAmount,
        propertyTax,
        state,
        sfAmount,
        isYfsf,
        taxAmount,
        flags,
        accruedState
    } = this.props
    const amount = cardTemp.getIn(['queryObj', 'amount'])
    const handleAmount = cardTemp.getIn(['queryObj', 'handleAmount'])
    const offsetAmount = cardTemp.getIn(['queryObj', 'offsetAmount'])
    const personAccumulationAmount = cardTemp.getIn(['queryObj', 'personAccumulationAmount'])
    const personSocialSecurityAmount = cardTemp.getIn(['queryObj', 'personSocialSecurityAmount'])
    const companySocialSecurityAmount = cardTemp.getIn(['queryObj', 'companySocialSecurityAmount'])
    const companyAccumulationAmount = cardTemp.getIn(['queryObj', 'companyAccumulationAmount'])
    const incomeTaxAmount = cardTemp.getIn(['queryObj', 'incomeTaxAmount'])
    const isQueryByBusiness = flags.get('isQueryByBusiness')
    const specialStateforAccrued = flags.get('specialStateforAccrued')
    let element
    if(preAmount || payableAmount || socialSecurityAmount>0 || accumulationAmount>0 || sfAmount || taxAmount) {
      if(((runningState === 'STATE_YYSR_XS'||runningState === 'STATE_YYZC_GJ')&& preAmount )|| ((runningState === 'STATE_YYSR_TS'||runningState === 'STATE_YYZC_TG')&&payableAmount > 0)) {
        element = (
          <div className="accountConf-modal-list-item accountConf-premount">
            <label></label>
            <label>{`预${direction ==='debit'?'收':'付'}款：`}</label>
            <div>
             {cardTemp.get('preAmount') }
            </div>
            <label>{`应${direction ==='debit'?'收':'付'}款：`}</label>
            <div>
            {cardTemp.get('payableAmount')}
            </div>
          </div>
        )
        } else if(categoryType === 'LB_XCZC' && fundOrSocialSecurity === 'socialSecurity' && isQueryByBusiness ? (Number(socialSecurityAmount) + Number(personSocialSecurityAmount)).toFixed(2) > 0 : socialSecurityAmount>0 ) {
            element = (
              <div className='input-right-amount'>
                <span>未处理金额：<Amount>{isQueryByBusiness ? (Number(socialSecurityAmount) + Number(personSocialSecurityAmount)).toFixed(2) : socialSecurityAmount}</Amount></span>
              </div>
            )
        } else if(categoryType === 'LB_XCZC' && fundOrSocialSecurity === 'fund' && isQueryByBusiness ? (Number(accumulationAmount) + Number(personAccumulationAmount)).toFixed(2) > 0 : accumulationAmount>0 ) {
            element = (
              <div className='input-right-amount'>
                <span>未处理金额：<Amount>{isQueryByBusiness ? (Number(accumulationAmount) + Number(personAccumulationAmount)).toFixed(2) : accumulationAmount}</Amount></span>
              </div>
            )
        } else if(categoryType === 'LB_XCZC' && payableAmount && state === 'accrued') {
            element = (
              <div className='input-right-amount'>
                <span>未处理金额：<Amount>{isQueryByBusiness ? (Number(amount) + Number(payableAmount)).toFixed(2) : payableAmount}</Amount></span>
              </div>
            )
        } else if(categoryType === 'LB_XCZC' && payableAmount && propertyPay === 'SX_SHBX') {
            element = (
              <div className='input-right-amount'>
                <span>未处理金额：<Amount>{isQueryByBusiness ? (Number(companySocialSecurityAmount) + Number(payableAmount)).toFixed(2) : payableAmount}</Amount></span>
              </div>
            )
        } else if(categoryType === 'LB_XCZC' && payableAmount && propertyPay === 'SX_ZFGJJ') {
            element = (
              <div className='input-right-amount'>
                <span>未处理金额：<Amount>{isQueryByBusiness ? (Number(companyAccumulationAmount) + Number(payableAmount)).toFixed(2) : payableAmount}</Amount></span>
              </div>
            )
        } else if(categoryType === 'LB_JK' && payableAmount && runningState === 'STATE_JK_ZFLX') {
            element = (
              <div className='input-right-amount'>
                <span>未处理金额：<Amount>{isQueryByBusiness ? (Number(amount) + Number(payableAmount)).toFixed(2) : payableAmount}</Amount></span>
              </div>
            )
        } else if(categoryType === 'LB_SFZC' && (isQueryByBusiness ? (Number(preAmount) + Number(offsetAmount)).toFixed(2) > 0 : preAmount > 0 )&& runningState === 'STATE_SF_JN' && propertyTax ==='SX_ZZS' && accruedState !== 'QTSF' && !isYfsf) {
            element = (
            <div className='input-right-amount'>
             <span> 待抵扣：<Amount>{isQueryByBusiness ? (Number(preAmount) + Number(offsetAmount)).toFixed(2) : preAmount}</Amount></span>
              </div>
            )
        } else if(categoryType === 'LB_SFZC' && sfAmount >0 && runningState === 'STATE_SF_JN' && propertyTax === 'SX_GRSF') {
            element = (
            <div className='input-right-amount'>
            <span>未处理金额：<Amount>{sfAmount}</Amount></span>
              </div>
            )
        } else if(categoryType === 'LB_SFZC' && payableAmount && runningState === 'STATE_SF_JN' && propertyTax === 'SX_QTSF') {
            element = (
            <div className='input-right-amount'>
            <span>未处理金额：<Amount>{isQueryByBusiness ? (Number(amount) + Number(payableAmount)).toFixed(2) : payableAmount}</Amount></span>
              </div>
            )
        } else if(categoryType === 'LB_ZB' && payableAmount && runningState === 'STATE_ZB_ZFLR') {
            element = (
            <div className='input-right-amount'>
            <span>未处理金额：<Amount>{isQueryByBusiness ? (Number(amount) + Number(payableAmount)).toFixed(2) : payableAmount}</Amount></span>
              </div>
            )
        }  else if(categoryType === 'LB_JK' && payableAmount && runningState === 'STATE_JK_ZFLX') {
            element = (
            <div className='input-right-amount'>
            <span>未处理金额：<Amount>{isQueryByBusiness ? (Number(amount) + Number(payableAmount)).toFixed(2) : payableAmount}</Amount></span>
              </div>
            )
        }  else if(categoryType === 'LB_TZ' && payableAmount && (runningState === 'STATE_TZ_SRLX' || runningState === 'STATE_TZ_SRGL' )) {
            element = (
            <div className='input-right-amount'>
            <span>未处理金额：<Amount>{isQueryByBusiness ? (Number(amount) + Number(payableAmount)).toFixed(2) : payableAmount}</Amount></span>
              </div>
            )
        } else if(categoryType === 'LB_SFZC'&& payableAmount && runningState === 'STATE_SF_ZCWJSF') {
            element = (
            <div className="accountConf-modal-list-item">
              <label></label>
              <label>待转出未交税费：</label>
              <div>
               <Amount>{payableAmount}</Amount>
              </div>
            </div>
            )
        } else {
        element = null
        }
  } else{
    element = null
  }
    return(
      <div>
        {element}
      </div>
    )
  }



}
