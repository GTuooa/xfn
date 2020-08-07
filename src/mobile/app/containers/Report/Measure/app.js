import React, { PropTypes } from 'react'
import { Map, toJS } from 'immutable'
import { connect }	from 'react-redux'
import { Icon, Container, ScrollView, Row, SinglePicker,ButtonGroup,Button,TextListInput,Amount }	from 'app/components'
import thirdParty from 'app/thirdParty'
import * as allActions from 'app/redux/Home/All/other.action'
import * as measureActions from 'app/redux/Report/Measure/measure.action.js'
import MeasureCondition from './MeasureCondition'

import MeasureResult from './MeasureResult'
import './style.less'
import '../sheet.less'

@connect(state => state)
export default
class Measure extends React.Component {
    componentDidMount() {
        thirdParty.setTitle({title: '测算一下'})
		thirdParty.setIcon({
            showIcon: false
        })
        thirdParty.setRight({ show: false })
        sessionStorage.setItem("prevPage", 'measure')
        const issuedate = this.props.lrbState.get('issuedate')
        const endissuedate = this.props.lrbState.get('endissuedate')
        this.props.dispatch(measureActions.getMeasureInitData(issuedate,endissuedate))
    }
    render() {
        const {
            measureState,
            allState,
            dispatch,
			history
        } = this.props
        const showResult = measureState.get('showResult')
        const incomeTotal = measureState.get('incomeTotal')
        const profit = measureState.get('profit')
        const detailList = measureState.get('detailList').toJS()
        const amountInput = measureState.get('amountInput')
        const checkedList = measureState.get('checkedList')
        const showChildList = measureState.get('showChildList')
        const cannotChecked = measureState.get('cannotChecked')
        const haveSwitchList = measureState.get('haveSwitchList')
        const testProfit = measureState.get('testProfit')
        const cannotTestList = measureState.get('cannotTestList')
        const profitResult = measureState.get('profitResult')
        const ProfitAndLossResult = measureState.get('ProfitAndLossResult')
        const resultList = measureState.get('resultList')
        //console.log(resultList);
        // resultList.forEach((item)=>{
        //     if(item.childProfit&&item.childProfit.length>0){
        //         item.childProfit=item.childProfit.filter(v=>v.checked===true)
        //     }
        // })

        const resultListShowChildList = measureState.get('resultListShowChildList')
        return (
            <Container>
                {!showResult&&
                    <MeasureCondition
                        dispatch={dispatch}
                        incomeTotal={incomeTotal}
                        profit={profit}
                        detailList={detailList}
                        amountInput={amountInput}
                        checkedList={checkedList}
                        showChildList={showChildList}
                        cannotChecked={cannotChecked}
                        haveSwitchList={haveSwitchList}
                        cannotTestList={cannotTestList}
                        testProfit={testProfit}
                        history={history}
                    />
                }
                {showResult&&
                    <MeasureResult
                        dispatch={dispatch}
                        testProfit={testProfit}
                        profitResult={profitResult}
                        ProfitAndLossResult={ProfitAndLossResult}
                        resultList={resultList}
                        incomeTotal={incomeTotal}
                        profit={profit}
                        resultListShowChildList={resultListShowChildList}
                    />
                }
            </Container>
        )
    }
}
