import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { TextListInput,Checkbox,Amount,SwitchText ,Form,Icon} from 'app/components'
import { decimal } from 'app/utils'

import * as measureActions from 'app/redux/Report/Measure/measure.action.js'

@immutableRenderDecorator
export default
class MeasureItem extends React.Component {
    render(){
        const {item,index,className,checkedList,dispatch,showChildList,cannotChecked,haveSwitchList,cannotTestList} =this.props
        const loop=(item,level,key,testAmount)=>{
            const articlePaddingLeft = (level) / 10+ 'rem'
            const flagColor = {
                0: '#fff',
                1: '#D1C0A5',
                2: '#7E6B5A',
                3: '#59493f'
            }[level]
            const flagstyle = {
                background: flagColor,
                width: articlePaddingLeft,
                marginLeft:'.05rem'
            }
            let uniqueId =item.lineindex ?item.lineindex :item.acId
            //let checked =checkedList.includes(uniqueId)
            let showChild = item.showChild
            if(item.childProfit&&item.childProfit.length>0){
                return(
                    <div>
                        <div className="measure-item-title" style={{fontWeight:level===0? 'bold':''}}>
                            <div
                                className='measure-item-title-checkbox'
                                onClick={()=>{
                                    if(!cannotChecked.includes(item.linename)){
                                        dispatch(measureActions.handleItemChecked(uniqueId,item.checked))
                                    }
                                }}>
                                    {!cannotChecked.includes(item.linename)&&
                                        <Checkbox
                                            checked={item.checked}
                                        />
                                    }
                            </div>
                            <div
                                className='measure-item-title-title'
                                onClick={()=>{
                                    if(!cannotChecked.includes(item.linename)){
                                        dispatch(measureActions.handleItemChecked(uniqueId,item.checked))
                                    }
                                }}>
                                {level == 0 ? '' : <span className="ba-flag" style={flagstyle}></span>}
                                <span style={{paddingLeft:'.05rem'}}>{item.linename}</span>
                            </div>
                            <div
                                className='measure-item-title-arror'
                                onClick={()=>{
                                    if(!showChild){
                                        dispatch(measureActions.handleItemChecked(uniqueId,false))
                                    }else{
                                        dispatch(measureActions.changeThisItemChecked(uniqueId,false))
                                    }
                                    dispatch(measureActions.handleItemShow(uniqueId,`${item.linename}`))
                                }}
                            >
                                <Icon type={showChild?'arrow-up':"arrow-down"} style={{marginTop:"0.07rem",marginRight:'.1rem'}}/>
                            </div>
                        </div>
                        <div className='measure-item-contant' style={{fontWeight:level===0? 'bold':''}}>
                            <div className='measure-item-contant-amount' onClick={()=>{
                                if(!cannotChecked.includes(item.linename)){
                                    dispatch(measureActions.handleItemChecked(uniqueId,item.checked))
                                }
                            }}>
                                <Amount showZero>{item.monthaccumulation}</Amount>
                            </div>
                            <div className='measure-item-contant-precent' onClick={()=>{
                                if(!cannotChecked.includes(item.linename)){
                                    dispatch(measureActions.handleItemChecked(uniqueId,item.checked))
                                }
                            }}>
                                {/* {`${Math.round(item.shareOfMonth*100)}%`} */}
                                {`${decimal(item.shareOfMonth*100, 2, true)}%`}
                            </div>
                            <div className='measure-item-contant-switch'>
                                {haveSwitchList.includes(item.linename)&&
                                    <SwitchText
                                        //disabled={showChild}
                                        className='noTextSwitchShort'
                                        checkedChildren="占比"
                                        unCheckedChildren="金额"
                                        checked={item.testAmount}
                                        onChange={()=>{
                                            dispatch(measureActions.changeSwitchType(item.linename))
                                        }}
                                    />
                                }
                            </div>
                            {!cannotTestList.includes(item.linename)?
                                <div className='measure-item-contant-input'>
                                    <div className='input-border' style={{display:item.testAmount?"":'none'}}>
                                        <TextListInput
                                            value={item.testShareOfMonth}
                                            disabled={showChild || !item.checked}
                                            onChange={value=>{
                                                if(/^\d*\.?\d{0,2}$/g.test(value)){
                                                    if(Number(value)<100){
                                                        dispatch(measureActions.changeTestShareOfMonth(value,uniqueId))
                                                    }
                                                }
                                            }}
                                        />
                                        <span>%</span>
                                    </div>
                                    <div className='input-border' style={{display:item.testAmount?"none":''}}>
                                        <TextListInput
                                            value={item.testMonthaccumulation}
                                            disabled={showChild || !item.checked}
                                            onChange={value=>{
                                                if(/^\d*\.?\d{0,2}$/g.test(value)){
                                                    if(Number(value)<10000000){
                                                        dispatch(measureActions.changeTestMonthaccumulation(value,uniqueId))
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            :<div className='measure-item-contant-input'></div>}
                        </div>
                        {showChild&& item.childProfit.map((v,i)=>loop(v,level+1,index+1,item.testAmount))}
                    </div>
                )
            }else{
                return(
                    <div>
                        <div className="measure-item-title" style={{fontWeight:level===0? 'bold':''}}>
                            <div className='measure-item-title-checkbox' onClick={()=>{
                                if(!cannotChecked.includes(item.linename)){
                                    dispatch(measureActions.handleItemChecked(uniqueId,item.checked))
                                }
                            }}>
                                {!cannotChecked.includes(item.linename)&&
                                    <Checkbox
                                        checked={item.checked}
                                    />
                                }
                            </div>
                            <div className='measure-item-title-title' onClick={()=>{
                                if(!cannotChecked.includes(item.linename)){
                                    dispatch(measureActions.handleItemChecked(uniqueId,item.checked))
                                }
                            }}>
                                {level == 0 ? '' : <span className="ba-flag" style={flagstyle}></span>}
                                <span style={{paddingLeft:'.05rem'}}>{item.linename}</span>
                            </div>
                            <div className='measure-item-title-arror'>
                            </div>
                        </div>
                        <div className='measure-item-contant' style={{fontWeight:level===0? 'bold':''}}>
                            <div className='measure-item-contant-amount' onClick={()=>{
                                if(!cannotChecked.includes(item.linename)){
                                    dispatch(measureActions.handleItemChecked(uniqueId,item.checked))
                                }
                            }}>
                                <Amount showZero>{item.monthaccumulation}</Amount>
                            </div>
                            <div className='measure-item-contant-precent' onClick={()=>{
                                if(!cannotChecked.includes(item.linename)){
                                    dispatch(measureActions.handleItemChecked(uniqueId,item.checked))
                                }
                            }}>
                                {/* {`${Math.round(item.shareOfMonth*100)}%`} */}
                                {`${decimal(item.shareOfMonth*100, 2, true)}%`}
                            </div>
                            <div className='measure-item-contant-switch'>
                                {haveSwitchList.includes(item.linename)&&
                                    <SwitchText
                                        //disabled={showChild}
                                        className='noTextSwitchShort'
                                        checkedChildren="占比"
                                        unCheckedChildren="金额"
                                        checked={item.testAmount}
                                        onChange={()=>{
                                            dispatch(measureActions.changeSwitchType(item.linename))
                                        }}
                                    />
                                }
                            </div>
                            {!cannotTestList.includes(item.linename)?
                                <div className='measure-item-contant-input'>
                                    <div className='input-border' style={{display:item.testAmount?"":'none'}}>
                                        <TextListInput
                                            value={item.testShareOfMonth}
                                            disabled={!item.checked}
                                            onChange={value=>{
                                                if(/^\d*\.?\d{0,2}$/g.test(value)){
                                                    if(Number(value)<100){
                                                        dispatch(measureActions.changeTestShareOfMonth(value,uniqueId))
                                                    }
                                                }
                                            }}
                                        /><span>%</span>
                                    </div>
                                    <div className='input-border' style={{display:item.testAmount?"none":''}}>
                                        <TextListInput
                                            value={item.testMonthaccumulation}
                                            disabled={!item.checked}
                                            onChange={value=>{
                                                if(/^\d*\.?\d{0,2}$/g.test(value)){
                                                    if(Number(value)<10000000){
                                                        dispatch(measureActions.changeTestMonthaccumulation(value,uniqueId))
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            :<div className='measure-item-contant-input'></div>}
                        </div>
                    </div>
                )
            }

        }
        return loop(item,0,index,item.testAmount)
    }
}
