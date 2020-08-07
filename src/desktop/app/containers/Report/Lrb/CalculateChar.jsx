import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import ReactEcharts from 'echarts-for-react'
import { debounce, formatMoney } from 'app/utils'

@immutableRenderDecorator
export default
class CalculateChar extends React.Component {
    getColor(linename,value,state){
        const name = linename.substr(-4,4)
        switch(name) {
            case '营业收入':
                if (state !== 0) {
                    return '#ff8348'
                }
            return 'rgb(255,131,72)'
            case '营业成本':
                return '#5ca7f2'
            case '营业税金':
                return 'rgb(2,129,255)'
            case '营业费用':
                return 'rgb(2,93,255)'
            case '营业利润':
                if (value>0) {
                    return '#ffb549'
                } else if (value===0) {
                    return '#FFF'
                } else if (value<0) {
                    return '#11c3e0'
                }
        }
    }
    render(){
        const {resultList,ProfitAndLossResult,profitResult,incomeTotal,profit} =this.props
        //let resultList =detailList.filter(v=>v.checked===true)
        //console.log(resultList);
        //if(testProfit){
        incomeTotal.monthaccumulation=ProfitAndLossResult
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
        let outList=[incomeTotal].concat(operating).concat([operatingExpenses])
        let outDataList = []
        let namelist = []
        outList.map((item)=>{
            let obj={
                value: item.testMonthaccumulation==='0'?0:item.testMonthaccumulation?Number(item.testMonthaccumulation).toFixed():item.monthaccumulation,
                name: `${item.linename.substr(-4,4)}    ${item.linename.substr(-4,4)==='营业收入'?'100.00%':item.testShareOfMonth===0?'0.00%':Number(item.testShareOfMonth)===Infinity||Number(item.testShareOfMonth)===-Infinity||isNaN(Number(item.testShareOfMonth))?'无效值':item.testShareOfMonth?formatMoney(item.testShareOfMonth)+'%':formatMoney(item.shareOfMonth*100)+'%'}`,
                itemStyle:{
                    normal: {
                        color: this.getColor(item.linename,Number(item.testShareOfMonth),profitResult)
                    }
                }
            }
            outDataList.push(obj)
            namelist.push(`${item.linename.substr(-4,4)}    ${item.linename.substr(-4,4)==='营业收入'?'100.00%':item.testShareOfMonth===0?'0.00%':Number(item.testShareOfMonth)===Infinity||Number(item.testShareOfMonth)===-Infinity||isNaN(Number(item.testShareOfMonth))?'无效值':item.testShareOfMonth?formatMoney(item.testShareOfMonth)+'%':formatMoney(item.shareOfMonth*100)+'%'}`)
        })

        namelist.push(`${profitObj.linename}    ${profitObj.testShareOfMonth===0?'0':Number(profitObj.testShareOfMonth)===Infinity||Number(profitObj.testShareOfMonth)===-Infinity||isNaN(Number(profitObj.testShareOfMonth))?'无效值':formatMoney(profitObj.testShareOfMonth)+'%'}`)
        let profitAmount = ProfitAndLossResult

        resultList.map((e)=>{
            profitAmount = profitAmount+Number(e.testMonthaccumulation)
        })
        const data = {
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
					minAngle: 1,
                    center:['25%','50%'],
					radius: ['0%', '55%'],
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
                        name:`${profitObj.linename}    ${profitObj.testShareOfMonth===0?'0':Number(profitObj.testShareOfMonth)===Infinity||Number(profitObj.testShareOfMonth)===-Infinity||isNaN(Number(profitObj.testShareOfMonth))?'无效值':formatMoney(profitObj.testShareOfMonth)+'%'}`,
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
				},
                {
					minAngle: 1,
					label: {
						normal: {
							show: false
						}
					},
					name:'比例',
					type:'pie',
                    center:['25%','50%'],
					radius: ['55%', '74%'],
					data: outDataList.reverse()
				}
			]
		}
        return(
            <ReactEcharts
                className='measure-pie-char'
                option={data}
                height='auto'
            />
        )
    }
}
