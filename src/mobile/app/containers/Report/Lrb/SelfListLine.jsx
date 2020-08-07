import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import * as lrbActions from 'app/redux/Report/Lrb/lrb.action.js'
import { Amount }	from 'app/components'
import { Icon } from 'antd'
@immutableRenderDecorator
export default
class SelfListLine extends React.Component {
    renderDifference(difference,proportionDifference){
        if(Number(difference) > 0){
            return <span style={{color:`rgb(255,131,72)`,fontSize:`${proportionDifference==='amountDifference' && Math.abs(difference)>1000? ".1rem":".11rem"}`}}>
                        {proportionDifference==='amountDifference'?`+${difference}`:`+${difference}%`}
                        <Icon type="arrow-up" style={{display:proportionDifference==='amountDifference'?'none':''}} />
                   </span>
        }else if(Number(difference) === 0){
            return <span style={{fontSize:`${proportionDifference==='amountDifference' && Math.abs(difference)>1000? ".1rem":".11rem"}`}}>
                        {proportionDifference==='amountDifference'?`${difference}`:`${difference}%`}
                        <span style={{color:`rgb(255,131,72)`}}>-</span>
                   </span>
        }else if(Number(difference) < 0){
            return <span style={{color:`rgb(94,129,209)`,fontSize:`${proportionDifference==='amountDifference' &&Math.abs(difference) >1000? ".1rem":".11rem"}`}}>
                        {proportionDifference==='amountDifference'?`${difference}`:`${difference}%`}
                        <Icon type="arrow-down" style={{display:proportionDifference==='amountDifference'?'none':''}} />
                   </span>
        }
    }
    render(){
        const {data,key,dispatch,showChildProfitList,index,proportionDifference} = this.props
        const titleIndex = [0,4,8]
        const loop=(item,level,key)=>{
            let difference =0
            switch (proportionDifference) {
                case 'shareDifference':
                    difference = (item.get('shareDifference')*100).toFixed(2)
                    break;
                case 'amountDifference':
                    difference = Math.round(item.get('amountDifference'))
                    break;
                case 'increaseDecreasePercent':
                    difference = (item.get('increaseDecreasePercent')*100).toFixed(2)
                    break;
                default:
                    difference = (item.get('shareDifference')*100).toFixed(2)
            }
            const articlePaddingLeft = (level ) / 10+ 'rem'
            const flagColor = {
                0: '#fff',
                1: '#D1C0A5',
                2: '#7E6B5A',
                3: '#59493f'
            }[level]

            const flagstyle = {
                background: flagColor,
                width: articlePaddingLeft
            }

            if(item.get("childProfit")&&item.get("childProfit").size){
                const showChild = showChildProfitList.indexOf(item.get("lineindex"))> -1 ||showChildProfitList.indexOf(item.get("acId"))>-1
                return(
                    <div key={`${key}_${item.get('linename')}`}>
                        <div
                            className={'xf-list-item'}
                            style={{background:titleIndex.includes(key)&&level==0?"#fff4e3":""}}
                            onClick={()=>{
                                let uniqueId =item.get("lineindex") ? item.get("lineindex") :item.get("acId")
                                dispatch(lrbActions.changeShowChildProfitList(uniqueId))
                            }}
                        >
                            <div className="linename">
                                <span
                                    className="linenametext"
                                    style={{fontWeight:level==0?"bold":"normal",color: '#222'}}
                                >
                                    {level == 0 ? '' : <span className="ba-flag" style={flagstyle}></span>}
                                    {item.get('linename').replace(/\、/g, '.').replace(/：/g, ':')}
                                </span>
                            </div>
                            <div>
                                <Icon type={showChild?"up":"down"} style={{marginTop:"0.07rem",color:'rgb(180,180,180)'}}/>
                            </div>
                        </div>
                        <div className='xf-list-amount' style={{fontWeight:level==0?"bold":"normal",background:titleIndex.includes(key)&&level==0?"#fff4e3":""}}>
                            <Amount showZero decimalPlaces={'0'} className="yearaccumulation">{item.get('yearaccumulation')}</Amount>
                            <span className="shareOfYear">{`${(item.get('shareOfYear')*100).toFixed(2)}%`}</span>
                            <Amount showZero decimalPlaces={'0'} className="monthaccumulation">{item.get('monthaccumulation')}</Amount>
                            <span className="shareOfMonth">{`${(item.get('shareOfMonth')*100).toFixed(2)}%`}</span>
                            <span className="typeChange">
                                {this.renderDifference(difference,proportionDifference)}
                            </span>
                        </div>
                       {showChild && item.get("childProfit").map((v,i)=>loop(v,level+1,index+1))}
                    </div>
                )
            }else{
                return(
                    <div key={`${key}_${item.get('linename')}`}>
                        <div
                            className={'xf-list-item'}
                            style={{fontWeight:level==0?"bold":"normal",background:titleIndex.includes(key)&&level==0?"#fff4e3":""}}
                            onClick={()=>{
                                let uniqueId =item.get("lineindex") ? item.get("lineindex") :item.get("acId")
                                dispatch(lrbActions.changeShowChildProfitList(uniqueId))
                            }
                        }
                        >
                            <div className="linename">
                                <span
                                    className="linenametext"
                                    //style={{paddingLeft:`${level*16}px`}}
                                >
                                    {level == 0 ? '' : <span className="ba-flag" style={flagstyle}></span>}
                                    {item.get('linename').replace(/\、/g, '.').replace(/：/g, ':')}
                                </span>
                            </div>
                        </div>
                        <div className='xf-list-amount' style={{fontWeight:level==0?"bold":"normal",background:titleIndex.includes(key)&&level==0?"#fff4e3":""}}>
                            <Amount showZero decimalPlaces={'0'} className="yearaccumulation">{item.get('yearaccumulation')}</Amount>
                            <span className="shareOfYear">{`${(item.get('shareOfYear')*100).toFixed(2)}%`}</span>
                            <Amount showZero decimalPlaces={'0'} className="monthaccumulation">{item.get('monthaccumulation')}</Amount>
                            <span className="shareOfMonth">{`${(item.get('shareOfMonth')*100).toFixed(2)}%`}</span>
                            <span className="typeChange">
                                {this.renderDifference(difference,proportionDifference)}
                            </span>
                        </div>
                    </div>
                )
            }
        }
        return loop(data,0,index)
    }
}
