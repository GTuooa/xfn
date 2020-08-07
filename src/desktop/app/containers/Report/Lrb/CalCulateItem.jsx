import React, { PropTypes } from 'react'
import { Map, List ,toJS} from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { Amount, TableItem,ItemTriangle ,TableOver} from 'app/components'
import * as lrbActions from 'app/redux/Report/Lrb/lrb.action.js'
import { Checkbox, Switch, message } from 'antd'
import { Icon } from 'app/components'
import { debounce, formatMoney } from 'app/utils'
import Input from 'app/components/Input'

@immutableRenderDecorator
export default
class CalCulateItem extends React.Component {
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
            return <span style={{color:`#ff8348`}}>{proportionDifference==='amountDifference'?`+${formatMoney(difference)}`:`+${difference}%`}<Icon type="arrow-up" style={{display:proportionDifference==='amountDifference'?'none':''}} /></span>
        }else if( difference === 0){
            return <span>{proportionDifference==='amountDifference'?`${difference}`:`${difference}%`}<span style={{color:`rgb(255,131,72)`}}>-</span></span>
        }else if(difference < 0){
            return <span style={{color:`#5e81d1`}}>{proportionDifference==='amountDifference'?`${formatMoney(difference)}`:`${difference}%`}<Icon type="arrow-down" style={{display:proportionDifference==='amountDifference'?'none':''}} /></span>
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
            haveSwitchList,
            cannotTestList,
            cannotChecked
        } = this.props
        const amountTextAlign = this.amountTextAlign(0)
        const loop = (data,level,index) => {
            const linename = data.get('linename')
            const checked = data.get('checked')
            const showChild = data.get('showChild')
            let uniqueId =data.get('lineindex') ?data.get('lineindex') :data.get('acId')
            if (data.get('childProfit') && data.get('childProfit').size) {
                return(
                <div key={idx}>
                <TableItem  className={className} line={idx}>
                    <li>
                        {
                            !cannotChecked.includes(linename)?
                            <Checkbox
                                checked={checked}
                                onClick={() => {
                                    dispatch(lrbActions.handleItemChecked(uniqueId,checked))
                                }}
                            />:''
                        }
                    </li>
                    <ItemTriangle
                        textAlign="left"
                        isLink={false}
                        showTriangle={true}
                        showchilditem={showChild}
                        onClick={(e)=>{
                            e.stopPropagation()
                            if(!showChild){
                                dispatch(lrbActions.handleItemChecked(uniqueId,false))
                            }else{
                                dispatch(lrbActions.changeThisItemChecked(uniqueId,false))
                            }
                            dispatch(lrbActions.handleItemShow(uniqueId,`${linename}`,!showChild))
                            // dispatch(lrbActions.upDateChlidProfitList(uniqueId))
                        }}
                    >
                        <span
                            style={{paddingLeft: level===0? '0px':`${(level)*24}px`}}
                        >
                            {linename}
                        </span>
                    </ItemTriangle>
                    <li>
                        <div className='lrb-item'>
                            <Amount className={`align-${amountTextAlign}`}>{data.get('monthaccumulation')}</Amount>
                            <span className={`align-${amountTextAlign}`}>{`${formatMoney(data.get('shareOfMonth')*100)}%`}</span>
                        </div>
                    </li>
                    <li>
                        {
                            !cannotChecked.includes(linename)?
                            <Switch
                                //disabled={showChild}
                                checked={data.get('testAmount')}
                                checkedChildren='占比'
                                unCheckedChildren='金额'
                                onClick={()=>{
                                    dispatch(lrbActions.changeSwitchType(linename))
                                }}
                            />:''
                        }

                    </li>
                    <li>
                        {
                            showChild?
                            <span>{data.get('testAmount')?`${formatMoney(data.get('testShareOfMonth'))}%`:data.get('testMonthaccumulation')}</span>
                            :
                            <div style={{display:cannotChecked.includes(linename)?'none':''}}>
                                {
                                    data.get('testAmount')?
                                    <div >
                                        <Input
                                            className='lrb-percent'
                                            disabled={!checked}
                                            value={data.get('testShareOfMonth')}
                                            onChange={ e => {
                                                const value = e.target.value
                                                if(/^\d*\.?\d{0,2}$/g.test(value)){
                                                    if(Number(value)<=100){
                                                        dispatch(lrbActions.changeTestShareOfMonth(value,uniqueId))
                                                    }
                                                    else {
                                                        message.info('小于100的数字')
                                                    }
                                                }
                                            }}
                                        />
                                        <span>%</span>
                                    </div>
                                    :
                                    <Input
                                        value={data.get('testMonthaccumulation')}
                                        disabled={!checked}
                                        onChange={ e => {
                                            const value = e.target.value
                                            if(/^\d*\.?\d{0,2}$/g.test(value)){
                                                if(Number(value)<10000000){
                                                    dispatch(lrbActions.changeTestMonthaccumulation(value,uniqueId))
                                                }
                                            }
                                        }}
                                    />
                                }
                            </div>

                        }
                    </li>
                </TableItem>
                    {
                        showChild && data.get('childProfit').map(w => loop(w,level+1,index))
                    }
                </div>)
            } else {
                return(
                    <div key={idx}>
                    <TableItem  className={className} line={idx}>
                        <li>
                            {
                                !cannotChecked.includes(linename)?
                                <Checkbox
                                    checked={checked}
                                    onClick={() => {
                                        dispatch(lrbActions.handleItemChecked(uniqueId,checked))
                                    }}
                                />:''
                            }
                        </li>
                        <TableOver
                           textAlign="left"
                           isLink={false}
                        >
                            <span
                                style={{paddingLeft: level===0? '0px':`${(level)*24}px`}}
                            >
                                {linename}
                            </span>
                        </TableOver>
                        <li>
                            <div className='lrb-item'>
                                <Amount className={`align-${amountTextAlign}`}>{data.get('monthaccumulation')}</Amount>
                                <span className={`align-${amountTextAlign}`}>{`${formatMoney(data.get('shareOfMonth')*100)}%`}</span>
                            </div>
                        </li>
                        <li>
                            {
                                !cannotChecked.includes(linename) && level === 0?
                                <Switch
                                    //disabled={showChild}
                                    checked={data.get('testAmount')}
                                    checkedChildren='占比'
                                    unCheckedChildren='金额'
                                    onClick={()=>{
                                        dispatch(lrbActions.changeSwitchType(linename))
                                    }}
                                />:''
                            }
                        </li>
                        <li>
                            <div style={{display:cannotChecked.includes(linename)?'none':''}}>
                                {
                                    data.get('testAmount')?
                                    <div >
                                        <Input
                                            className='lrb-percent'
                                            disabled={!checked}
                                            value={data.get('testShareOfMonth')}
                                            onChange={ e => {
                                                const value = e.target.value
                                                if(/^\d*\.?\d{0,2}$/g.test(value)){
                                                    if(Number(value)<=100){
                                                        dispatch(lrbActions.changeTestShareOfMonth(value,uniqueId))
                                                    }
                                                    else {
                                                        message.info('小于100的数字')
                                                    }
                                                }
                                            }}
                                        />
                                        <span>%</span>
                                    </div>
                                    :
                                    <Input
                                        value={data.get('testMonthaccumulation')}
                                        disabled={!checked}
                                        onChange={ e => {
                                            const value = e.target.value
                                            if(/^\d*\.?\d{0,2}$/g.test(value)){
                                                if(Number(value)<10000000){
                                                    dispatch(lrbActions.changeTestMonthaccumulation(value,uniqueId))
                                                }
                                            }
                                        }}
                                    />
                                }
                            </div>
                        </li>
                    </TableItem>
                    </div>
                )
            }
        }
        return loop(lrItem,0,idx)
    }
}
