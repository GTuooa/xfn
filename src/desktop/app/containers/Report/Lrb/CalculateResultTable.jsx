import React from 'react'
import { fromJS, toJS } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import * as lrbActions from 'app/redux/Report/Lrb/lrb.action.js'
import { TableBody }	from 'app/components'
import CalCulateResultItem from './CalCulateResultItem'
import XfnIcon from 'app/components/Icon'

@immutableRenderDecorator
export default
class CalculateResultTable extends React.Component {
    state = {
        showAll:false
    }
    render(){
        let {resultList,ProfitAndLossResult,profitResult,incomeTotal,profit,dispatch,resultListShowChildList,calculType} =this.props
        const { showAll } = this.state
        incomeTotal.childProfit=[]
        incomeTotal.monthaccumulation=ProfitAndLossResult
        incomeTotal.shareOfMonth=1
        profit.childProfit=[]
        let profitObj={
            linename:'营业利润',
            testShareOfMonth: profitResult===0?0:profitResult/ProfitAndLossResult*100,
            testMonthaccumulation:`${profitResult}`,
            childProfit:[],
        }
        let operatingExpenses={
            linename:'减：营业费用',
            testShareOfMonth:0,
            testMonthaccumulation:'0',
            childProfit:[]
        }
        resultList.map((item)=>{
            if(calculType === '利润'){
                if(item.testAmount===true){
                    item.testMonthaccumulation=`${ProfitAndLossResult*Number(item.testShareOfMonth)/100}`
                }else{
                    item.testShareOfMonth = `${Number(item.testMonthaccumulation)/ProfitAndLossResult*100}`
                }
                if(item.childProfit.length>0){
                    item.childProfit.map((e)=>{
                        if(e.testAmount===true){
                            e.testMonthaccumulation=`${ProfitAndLossResult*Number(e.testShareOfMonth)/100}`
                        }else{
                            e.testShareOfMonth = `${Number(e.testMonthaccumulation)/ProfitAndLossResult*100}`
                        }
                    })
                }
            }else{
                if(item.testAmount===true){
                    item.testMonthaccumulation=`${ProfitAndLossResult*Number(item.testShareOfMonth)/100}`
                }else{
                    item.testShareOfMonth = `${Number(item.testMonthaccumulation)/ProfitAndLossResult*100}`
                }
                if(item.childProfit.length>0){
                    item.childProfit.map((e)=>{
                        if(e.testAmount===true){
                            e.testMonthaccumulation=`${ProfitAndLossResult*Number(e.testShareOfMonth)/100}`
                        }else{
                            e.testShareOfMonth = `${Number(e.testMonthaccumulation)/ProfitAndLossResult*100}`
                        }
                    })
                }
            }
        })
        let operating=[]
        resultList.map((item,index)=>{
            if(['管理费用',"销售费用","财务费用"].includes(item.linename)){
                operatingExpenses.childProfit.push(item)
                let testShareOfMonth = Number(operatingExpenses.testShareOfMonth) + Number(item.testShareOfMonth)
                operatingExpenses.testShareOfMonth =Number(testShareOfMonth)
                operatingExpenses.testMonthaccumulation=Number(item.testMonthaccumulation)+Number(operatingExpenses.testMonthaccumulation)
            }else{
                operating.push(item)
            }
        })
        let outList=[incomeTotal].concat(operating).concat([operatingExpenses]).concat([profitObj])
        return(
            <div className="table-title-wrap">
                <ul className='table-title calculate-result-table calculate-result-width'>
                    <li>
                        项目
                        <XfnIcon
                            size="14"
                            type={showAll?"tableGather":"tableExpand"}
                            style={{margin:"auto 5px",color:"#B9B9B9"}}
                            onClick={()=>{
                                this.setState({showAll:!showAll,a:1},()=>{
                                    dispatch(lrbActions.handleMeasureResultListShowChildAll(outList,this.state.showAll))
                                })
                            }}
                        />
                    </li>
                    <li>
                        <div><span>测算数据</span></div>
                        <div>
                            <span>测算金额</span>
                            <span>测算占比</span>
                        </div>
                    </li>
                </ul>
                <TableBody>
                    {outList.length>0 && outList.map((item,index)=>{
                        return(
                            <CalCulateResultItem
                                className={'calculate-result-width'}
                                data={item}
                                key={index}
                                dispatch={dispatch}
                                index={index}
                                resultListShowChildList={resultListShowChildList}
                            />
                        )

                    })}
                </TableBody>
            </div>
        )
    }
}
