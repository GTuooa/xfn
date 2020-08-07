import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import ReactEcharts from 'echarts-for-react'
import { decimal } from 'app/utils'

@immutableRenderDecorator
export default
class MeasurePieChar extends React.Component {
    getColor(linename,value){
        if(linename.substr(-4,4)==='营业收入'){
            return 'rgb(255,131,72)'
        }else if(linename.substr(-4,4)==='营业成本'){
            return 'rgb(92,167,242)'
        }else if(linename.substr(-4,4)==='营业税金'){
            return 'rgb(2,129,255)'
        }else if(linename==='营业费用'){
            return 'rgb(2,93,255)'
        }else if(linename==='营业利润'){
            if(value>0){
                return 'rgb(255,181,73)'
            }else if(value===0){
                return '#FFF'
            }else if(value<0){
                return 'rgb(17,195,224)'
            }
        }
    }
    render(){
        const {resultList,ProfitAndLossResult,profitResult,incomeTotal,profit} =this.props
        //let resultList =detailList.filter(v=>v.checked===true)
        //console.log(resultList);
        //if(testProfit){
        let incomeTotalResult = {
            linename:'营业收入',
            monthaccumulation:ProfitAndLossResult
        }
        //incomeTotalResult.monthaccumulation=ProfitAndLossResult
        resultList.forEach((item)=>{
            if(item.childProfit&&item.childProfit.length>0){
                item.childProfit=item.childProfit.filter(v=>v.checked===true)
            }
        })
        let profitObj={
            linename:'营业利润',
            testShareOfMonth: profitResult===0?0:profitResult/ProfitAndLossResult*100,
            testMonthaccumulation:profitResult
        }

        const transparentItemStyle = {
            normal: {
                color: 'transparent'
            }
        }
        let operatingExpenses={
            linename:'营业费用',
            testShareOfMonth:'0',
            testMonthaccumulation:0,
        }
        resultList.map((item)=>{
            if(item.testAmount===true){
                item.testMonthaccumulation=`${ProfitAndLossResult*Number(item.testShareOfMonth)/100}`
            }else{
                item.testShareOfMonth = `${Number(item.testMonthaccumulation)/ProfitAndLossResult*100}`
            }
        })
        let operating=[]
        let cost =[]
        resultList.map((item,index)=>{
            if(['管理费用',"销售费用","财务费用"].includes(item.linename)){
                cost.push(item)
            }else{
                operating.push(item)
            }
        })

        cost.map((item)=>{
            let testMonthaccumulation = Number(operatingExpenses.testMonthaccumulation) + Number(item.testMonthaccumulation)
            operatingExpenses.testMonthaccumulation =Number(testMonthaccumulation)
            let testShareOfMonth = Number(operatingExpenses.testShareOfMonth) + Number(item.testShareOfMonth)
            operatingExpenses.testShareOfMonth =Number(testShareOfMonth)

        })
        //let outList=[incomeTotal].concat(operating.concat([operatingExpenses]).reverse())//.concat([profitObj])
        let outList=[incomeTotalResult].concat(operating).concat([operatingExpenses])
        let outDataList = []
        let namelist = []
        outList.map((item)=>{
            let obj={
                value: item.testMonthaccumulation==='0'?0:item.testMonthaccumulation?Number(item.testMonthaccumulation).toFixed():item.monthaccumulation,
                name: `${item.linename.substr(-4,4)}    ${item.linename.substr(-4,4)==='营业收入'?'100.00%':item.testShareOfMonth===0?0:Number(item.testShareOfMonth)===Infinity||Number(item.testShareOfMonth)===-Infinity||isNaN(Number(item.testShareOfMonth))?'无效值':item.testShareOfMonth?Number(item.testShareOfMonth).toFixed(2)+'%':decimal(item.shareOfMonth*100, 2, true)+'%'}`,
                itemStyle:{
                    normal: {
                        color: this.getColor(item.linename,Number(item.testShareOfMonth))
                    }
                }
            }
            outDataList.push(obj)
            namelist.push(`${item.linename.substr(-4,4)}    ${item.linename.substr(-4,4)==='营业收入'?'100.00%':item.testShareOfMonth===0?'0':Number(item.testShareOfMonth)===Infinity||Number(item.testShareOfMonth)===-Infinity||isNaN(Number(item.testShareOfMonth))?'无效值':item.testShareOfMonth?Number(item.testShareOfMonth).toFixed(2)+'%':decimal(item.shareOfMonth*100, 2, true)+'%'}`)
        })

        namelist.push(`${profitObj.linename}    ${profitObj.testShareOfMonth===0?'0':Number(profitObj.testShareOfMonth)===Infinity||Number(profitObj.testShareOfMonth)===-Infinity||isNaN(Number(profitObj.testShareOfMonth))?'无效值':profitObj.testShareOfMonth.toFixed(2)+'%'}`)
        let profitAmount = ProfitAndLossResult

        resultList.map((e)=>{
            profitAmount = profitAmount+Number(e.testMonthaccumulation)
        })

        const data = {
            title:{
                text: '测算损益图',
                textStyle:{
                    color:'rgb(34,34,34)',
                    fontSize:'14px'
                },
                left: '55%',
                top:'10px',
            },
            legend: {
               orient: 'vertical',
               left: '55%',
               data:namelist,
               icon:'circle',
               top:'middle',
               selectedMode:false,
           },
			series: [
				{
					name:'利润',
					type:'pie',
					silent: true,
					minAngle: 1,
                    center:['25%','50%'],
					radius: ['0%', '45%'],
                    label: {
						normal: {
							show: false
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data:[{
                        value: (Math.abs(profitAmount)-Math.abs(profitResult))/2,
                        name: ' ',
                        itemStyle: transparentItemStyle
                    },{
                        value: Math.abs(profitResult),
                        name:`${profitObj.linename}    ${profitObj.testShareOfMonth===0?'0':Number(profitObj.testShareOfMonth)===Infinity||Number(profitObj.testShareOfMonth)===-Infinity||isNaN(Number(profitObj.testShareOfMonth))?'无效值':profitObj.testShareOfMonth.toFixed()+'%'}`,
                        itemStyle: {
                            normal: {
                                color: profitResult===0?"#FFF":profitResult>0?'rgb(255,181,73)':'rgb(17,195,224)'
                            }
                        }
                    },{
                        value:  (Math.abs(profitAmount)-Math.abs(profitResult))/2,
                        name: ' ',
                        itemStyle: transparentItemStyle
                    }]
				}
                , {
					minAngle: 1,
					label: {
						normal: {
							show: false
						}
					},
					silent: true,
					name:'比例',
					type:'pie',
                    center:['25%','50%'],
					radius: ['45%', '75%'],
					data: outDataList.reverse()
				}
			]
		}
        return(
            <ReactEcharts
                className='measure-pie-char'
                option={data}
            />
        )
    }
}
