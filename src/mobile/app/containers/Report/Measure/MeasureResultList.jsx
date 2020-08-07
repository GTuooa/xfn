import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import * as lrbActions from 'app/redux/Report/Lrb/lrb.action.js'
import { Icon,TextListInput,Checkbox,Amount,Switch ,Form,Container,ButtonGroup,Button,ScrollView }	from 'app/components'
import MeasureResultItem from './MeasureResultItem'
@immutableRenderDecorator
export default
class MeasureResultList extends React.Component {
    render(){
        let {resultList,ProfitAndLossResult,profitResult,incomeTotal,profit={},dispatch,resultListShowChildList,testProfit} =this.props
        let incomeTotalResult ={
            linename:'营业收入',
            monthaccumulation:ProfitAndLossResult,
            shareOfMonth:1,
            childProfit:[],
        }
        //incomeTotalResult.childProfit=[]

        //incomeTotalResult.monthaccumulation=ProfitAndLossResult
        //incomeTotalResult.shareOfMonth=1

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
            if(testProfit){
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
        let outList=[incomeTotalResult].concat(operating).concat([operatingExpenses]).concat([profitObj])
        return(
            <div className='measure-result-list'>
                {outList.length>0&&outList.map((item,index)=>{
                    return(
                        <MeasureResultItem
                            className={'measure-result-list'}
                            data={item}
                            key={index}
                            dispatch={dispatch}
                            index={index}
                            resultListShowChildList={resultListShowChildList}
                        />
                    )

                })}
            </div>
        )
    }
}
