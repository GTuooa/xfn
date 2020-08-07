import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import * as measureActions from 'app/redux/Report/Measure/measure.action.js'
import { Icon } from 'app/components'
import { decimal } from 'app/utils'

@immutableRenderDecorator
export default
class MeasureResultItem extends React.Component {
    render(){
        const {data,index,resultListShowChildList,dispatch} = this.props
        const loop=(item,level,index)=>{
            let showChild = resultListShowChildList.includes(`${item.linename}`)
            if(item.childProfit&&item.childProfit.length>0){
                return(
                    <div>
                        <div className='measure-result-list-item' style={{fontWeight:level==0?"bold":''}}>
                            <div className='linename' >
                                <span style={{paddingLeft:`${level*14}px`}}>{item.linename}</span>
                            </div>
                            <div
                                className='icon'
                                onClick={()=>{
                                    dispatch(measureActions.handleMeasureResultListShowChild(`${item.linename}`))
                                }}
                            >
                                <Icon type={showChild?'arrow-up':"arrow-down"} />
                            </div>
                            <div className='amount'>
                                {`${item.linename.substr(-4,4)==='营业收入'?
                                    item.monthaccumulation===0 ? '0.00' : item.monthaccumulation.toFixed(2):
                                    Number(item.testMonthaccumulation)===0?'0.00':Number(item.testMonthaccumulation).toFixed(2)}`
                                }
                            </div>
                            <div className='precent'>
                                {`${item.linename.substr(-4,4)==='营业收入'?
                                    item.shareOfMonth=== 0 ? '0.00%' :decimal(item.shareOfMonth*100, 2, true)+'%':
                                    Number(item.testShareOfMonth)===Infinity||Number(item.testShareOfMonth)===-Infinity||isNaN(item.testShareOfMonth)?'无效值':Number(item.testShareOfMonth).toFixed(2)+'%'}
                                `}

                            </div>
                        </div>
                        {showChild&&item.childProfit.map((v,i)=>loop(v,level+1,index+1))}
                    </div>
                )
            }else{
                return(
                    <div className='measure-result-list-item' style={{fontWeight:level==0?"bold":''}}>
                        <div className='linename'>
                            <span style={{paddingLeft:`${level*14}px`}}>{item.linename}</span>
                        </div>
                        <div className='icon'></div>
                        <div className='amount'>
                            {`${item.linename.substr(-4,4)==='营业收入'?
                                item.monthaccumulation===0 ? '0.00' : item.monthaccumulation.toFixed(2):
                                Number(item.testMonthaccumulation)===0?'0.00':Number(item.testMonthaccumulation).toFixed(2)}`
                            }
                        </div>
                        <div className='precent'>
                            {`${item.linename.substr(-4,4)==='营业收入'?
                                item.shareOfMonth=== 0 ? '0.00%' :decimal(item.shareOfMonth*100, 2, true)+'%':
                                Number(item.testShareOfMonth)===Infinity||Number(item.testShareOfMonth)===-Infinity||isNaN(item.testShareOfMonth)?'无效值':Number(item.testShareOfMonth).toFixed(2)+'%'}
                            `}
                        </div>
                    </div>
                )
            }
        }
        return loop(data,0,index)
    }
}
