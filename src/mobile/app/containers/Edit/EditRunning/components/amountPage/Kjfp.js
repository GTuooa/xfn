import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import { Row, Amount, XfInput, SwitchText, } from 'app/components'

import { decimal } from 'app/utils'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'


export default class Kjfp extends Component {
    
    render () {
        const { dispatch, jrTaxAmount, jrAmount, amount, pendingStrongList, isModify, inputTax, taxTotal } = this.props
        // jrTaxAmount //源流水收入(价税合计)
        // jrAmount //税额
        // taxTotal: '',//手动输入的计税合计金额
        let beSelectList = [], showJrTaxTotal = true
        pendingStrongList.map(v => {
            if (v.get('beSelect')) {
                beSelectList.push('1')
                if (v.get('beOpened')) {
                    showJrTaxTotal = false
                }
            }
        })
        const amountDisabled = beSelectList.length > 1  ? true : false
        const showSwitch = beSelectList.length == 1
        let jrTaxTotal = jrTaxAmount
        if (!amountDisabled) {
            jrTaxTotal = jrTaxAmount * amount / jrAmount
        }

        return (
            <div className='lrls-card'>
                <Row className='lrls-more-card'>
                    <label>{inputTax ? '开票税额' : '价税合计'}:</label>
                    <XfInput.BorderInputItem
                        mode='amount'
                        disabled={amountDisabled}
                        placeholder='填写金额'
                        value={inputTax ? amount : taxTotal}
                        onChange={(value) => {
                            if (!inputTax) {//价税合计金额
                                let amount = decimal(value*jrAmount/jrTaxAmount)
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], amount))
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'taxTotal'], value))
                            } else {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                            }
                        }}
                    />
                    <span className='noTextSwitch' style={{marginLeft: '6px', display: !isModify && showSwitch ? '' : 'none'}}>
                        <SwitchText
                            checked={inputTax}
                            checkedChildren=''
                            unCheckedChildren=''
                            onChange={() => {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'inputTax'], !inputTax))
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], jrAmount))
                                if (inputTax) {//价税合计模式
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'taxTotal'], jrTaxAmount))
                                }
                            }}
                        />
                    </span>
                </Row>
                <div className='lrls-placeholder lrls-margin-top'
                    style={{paddingLeft: '.6rem', display: showJrTaxTotal ? '' : 'none'}}
                >
                    <span>
                        { !inputTax ? 
                           <span>开票税额: <Amount showZero>{amount}</Amount></span>
                           : <span>价税合计: <Amount showZero>{jrTaxTotal}</Amount></span> 
                        }
                    </span>
                    <div>
                       待处理价税合计: <Amount showZero>{jrTaxAmount}</Amount>
                    </div>
                </div>
            </div>
        )
    }
}
