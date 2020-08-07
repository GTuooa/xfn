import React, { PropTypes } from 'react'
import { Map, List ,toJS} from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { Amount, TableItem,ItemTriangle ,TableOver} from 'app/components'
import * as lrbActions from 'app/redux/Report/Lrb/lrb.action.js'
import { Icon, Checkbox, Switch, Input, message } from 'antd'
import { debounce, formatMoney } from 'app/utils'

@immutableRenderDecorator
export default
class CalCulateResultItem extends React.Component {
    render(){
        const {
            data,
            index,
            resultListShowChildList,
            dispatch,
            className
        } = this.props
        const loop = (item,level,index) => {
            const linename = item.linename
            let showChild = resultListShowChildList.includes(`${linename}`)
            // const amount = `${linename.substr(-4,4)==='营业收入'?formatMoney(item.monthaccumulation):formatMoney(item.testMonthaccumulation)}`
            const amount =`${item.linename.substr(-4,4)==='营业收入'?
                item.monthaccumulation===0 ? '0' : item.monthaccumulation:
                Number(item.testMonthaccumulation)===0?'0':Number(item.testMonthaccumulation)}`
            const percent = `${item.linename.substr(-4,4)==='营业收入'?
                item.shareOfMonth=== 0 ? '0.00%' :formatMoney(item.shareOfMonth*100)+'%':
                Number(item.testShareOfMonth)===Infinity||Number(item.testShareOfMonth)===-Infinity||isNaN(item.testShareOfMonth)?'无效值':formatMoney(item.testShareOfMonth)+'%'}
            `
            if (item.childProfit&&item.childProfit.length>0) {
                return(
                <div>
                    <TableItem className={className} line={index+1}>
                            <ItemTriangle
                            textAlign="left"
                            isLink={false}
                            showTriangle={true}
                            showchilditem={showChild}
                            onClick={(e)=>{
                                e.stopPropagation()
                                dispatch(lrbActions.handleMeasureResultListShowChild(`${linename}`,!showChild))
                            }}
                        >
                            <span
                                style={{paddingLeft: level===0? '0px':`${(level)*24}px`}}
                            >
                                {linename.replace(/\./g, '、').replace(/:/g, '：')}
                            </span>
                        </ItemTriangle>
                        <li>
                            <div className='lrb-item'>
                                <span >{formatMoney(amount)}</span>
                                <span >{percent}</span>
                            </div>
                        </li>
                    </TableItem>
                    {showChild&&item.childProfit.map((v,i)=>loop(v,level+1,index))}
                </div>
                )} else {
                return(
                <TableItem className={className} line={index+1}>
                    <TableOver
                       textAlign="left"
                       isLink={false}
                    >
                        <span
                            style={{paddingLeft: level===0? '0px':`${(level)*24}px`}}
                        >
                            {linename.replace(/\./g, '、').replace(/:/g, '：')}
                        </span>
                    </TableOver>
                    <li>
                        <div>
                            <span >{formatMoney(amount)}</span>
                            <span >{percent}</span>
                        </div>
                    </li>
                </TableItem>
            )}
        }
        return loop(data,0,index)
    }
}
