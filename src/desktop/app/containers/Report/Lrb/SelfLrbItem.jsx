import React, { PropTypes } from 'react'
import { Map, List ,toJS} from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { Amount, TableItem,ItemTriangle ,TableOver} from 'app/components'
import * as lrbActions from 'app/redux/Report/Lrb/lrb.action.js'
import { Icon } from 'app/components'
import { debounce, formatMoney } from 'app/utils'

@immutableRenderDecorator
export default
class LrItem extends React.Component {
    amountTextAlign(level){
        switch(level){
            case 0 :
            case 1 :
                return "right";
            case 2 :
                return 'center';
            default :
                return 'left'
        }
    }
    renderDifference(difference,proportionDifference){
        if(difference>0){
            return <span style={{color:`#ff8348`}}>{proportionDifference==='amountDifference'?`+${formatMoney(difference)}`:`+${formatMoney(difference)}%`}<Icon type="arrow-up" style={{display:proportionDifference==='amountDifference'?'none':''}} /></span>
        }else if( difference === 0){
            return <span>{proportionDifference==='amountDifference'?`${difference}`:`${difference}%`}<span style={{color:`rgb(255,131,72)`}}>-</span></span>
        }else if(difference < 0){
            return <span style={{color:`#5e81d1`}}>{proportionDifference==='amountDifference'?`${formatMoney(difference)}`:`${formatMoney(difference)}%`}<Icon type="arrow-down" style={{display:proportionDifference==='amountDifference'?'none':''}} /></span>
        }
    }
    render(){
        const {
            lrItem,
            className,
            idx,
            showChildProfitList,
            dispatch,
            proportionDifference,
            selfListData,
        } = this.props
        const loop = (lrItem, level ,key)=>{
            let difference =0
            switch (proportionDifference) {
                case 'shareDifference':
                    difference = lrItem.get('shareDifference')*100
                    break;
                case 'amountDifference':
                    difference= lrItem.get('amountDifference')
                    break;
                case 'increaseDecreasePercent':
                    difference= lrItem.get('increaseDecreasePercent')*100
                    break;
                default:
                    difference = lrItem.get('shareDifference')*100
            }
            if(lrItem.get('childProfit')&&lrItem.get('childProfit').size){
                const showChild = showChildProfitList.indexOf(lrItem.get("lineindex"))> -1 ||showChildProfitList.indexOf(lrItem.get("acId"))>-1
                const amountTextAlign = this.amountTextAlign(level)
                return(
                    <div key={key}>
                        <TableItem  className={className} line={idx+1}>
                            <ItemTriangle
                                textAlign="left"
                                isLink={false}
                                showTriangle={true}
                                showchilditem={showChild}
                                onClick={(e)=>{
                                    e.stopPropagation()
                                    let uniqueId =lrItem.get("lineindex") ? lrItem.get("lineindex") :lrItem.get("acId")
                                    dispatch(lrbActions.upDateChlidProfitList(uniqueId))
                                }}
                            >
                                <span
                                    style={{paddingLeft: level===0? '0px':`${(level)*24}px`}}
                                >
                                    {lrItem.get('linename')}
                                </span>
                            </ItemTriangle>
                            <li>
                                <div className='lrb-item'>
                                    <Amount className={`align-${amountTextAlign}`}>{lrItem.get('yearaccumulation')}</Amount>
                                    <span className={`align-${amountTextAlign}`}>{`${formatMoney(lrItem.get('shareOfYear')*100)}%`}</span>
                                </div>
                            </li>
                            <li>
                                <div className='lrb-item'>
                                    <Amount className={`align-${amountTextAlign}`}>{lrItem.get('monthaccumulation')}</Amount>
                                    <span>{`${formatMoney(lrItem.get('shareOfMonth')*100)}%`}</span>
                                </div>
                            </li>

                            <li className='last-item'>
                                {this.renderDifference(difference,proportionDifference)}
                            </li>
                        </TableItem>
                        {
                            showChild && lrItem.get('childProfit').map((v, i) => loop(v, level+1, `${key}_${i}`))
                        }
                    </div>
                )
            }else{
                const amountTextAlign = this.amountTextAlign(level)
                return(
                    <TableItem className={className} line={idx+1} key={key}>
                        <TableOver
                           textAlign="left"
                           isLink={false}
                        >
                            <span
                                style={{paddingLeft: level===0? '0px':`${(level)*24}px`}}
                            >
                                {lrItem.get('linename')}
                            </span>
                        </TableOver>
                        <li>
                            <div className='lrb-item'>
                                <Amount className={`align-${amountTextAlign}`}>{lrItem.get('yearaccumulation')}</Amount>
                                <span>{`${formatMoney(lrItem.get('shareOfYear')*100)}%`}</span>
                            </div>
                        </li>
                        <li>
                            <div className='lrb-item'>
                                <Amount className={`align-${amountTextAlign}`}>{lrItem.get('monthaccumulation')}</Amount>
                                <span>{`${formatMoney(lrItem.get('shareOfMonth')*100)}%`}</span>
                            </div>
                        </li>
                        <li className='last-item'>
                            {this.renderDifference(difference,proportionDifference)}
                        </li>
                    </TableItem>
                )
            }
        }
        return loop(lrItem,0,idx)
    }
}
