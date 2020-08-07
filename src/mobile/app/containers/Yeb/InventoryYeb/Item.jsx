import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import * as inventoryMxbActions from 'app/redux/Mxb/InventoryMxb/inventoryMxb.action.js'
import * as inventoryYebActions from 'app/redux/Yeb/InventoryYeb/inventoryYeb.action.js'
@immutableRenderDecorator
export default
class Item extends React.Component {
    render(){
        const {data,unitDecimalCount,history,dispatch,issuedate,endissuedate,stockCategoryValue,topCategoryUuid,subCategoryUuid,stockCategorylabel,
            stockCategoryList,stockQuantity,stockStoreList,stockStoreValue,stockStoreLabel,showChildList,chooseValue,inventoryType,typeListValue,typeListLabel,priceScale,quantityScale} = this.props
            let categoryValueAdd = stockCategoryValue
        const loop=(data,level)=>{
            const articlePaddingLeft = (level) / 100 * 10 + 'rem'

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

            if(data.childList&&data.childList.length>0){
                let showChild = showChildList.includes(data.uuid)
                categoryValueAdd = `${categoryValueAdd}${Limit.TREE_JOIN_STR}${data.uuid}`
                data.newCategoryValue = categoryValueAdd
                return(
                    <div>
                        <div className={level===0? 'ba ba-level' :'ba-ass ba'}>
                            <div>
                                <span className='name'>
                                {level == 0 ? '' : <span className="ba-flag" style={flagstyle}></span>}
                                <span
                                    className={`name-name name-click`}
                                    onClick={(e) => {
                                        sessionStorage.setItem('previousPage', 'inventoryYeb')
                                        dispatch(inventoryMxbActions.getInventoryMxbDataFromYeb(issuedate, endissuedate, null,'全部',data.newCategoryValue,'',
                                            data.uuid,data.name,stockCategoryList,stockQuantity,stockStoreList,stockStoreValue,stockStoreLabel,chooseValue,inventoryType,typeListValue,typeListLabel))
                                        history.push('/inventoryMxb')
                                    }}
                                >{data.name}</span>

                                </span>
                                <span className='btn'>
                                    <Icon
                                        type={showChild?'arrow-up':'arrow-down'}
                                        onClick={()=>{
                                            dispatch(inventoryYebActions.handleInventoryYebShowChildList(data.uuid))
                                        }}
                                    />
                                </span>
                            </div>
                            <div className='ba-info'>
                                <div >
                                    <div className='ba-begin'>
                                        <span className='amount-color'>数量</span>
                                        <Amount showZero={true} decimalPlaces={quantityScale} className='amount-color'>{data.beginQuantity}</Amount>
                                    </div>
                                    <div className='ba-begin'>
                                        <span className='amount-color'>单价</span>
                                        <Amount showZero={true} decimalPlaces={priceScale} className='amount-color'>{data.beginPrice}</Amount>
                                    </div>
                                    <div className='ba-amount'>
                                        <Amount decimalPlaces={unitDecimalCount}>{data.beginAmount}</Amount>
                                    </div>
                                </div>
                                <div>
                                    <div className='ba-amount'>
                                        <Amount showZero={true} decimalPlaces={quantityScale} className='amount-color'>{data.monthInQuantity}</Amount>
                                    </div>
                                    <div className='ba-amount'>
                                        <span></span>
                                    </div>
                                    <div className='ba-amount'>
                                        <Amount decimalPlaces={unitDecimalCount}>{data.monthInAmount}</Amount>
                                    </div>
                                </div>
                                <div>
                                    <div className='ba-amount'>
                                        <Amount showZero={true} decimalPlaces={quantityScale} className='amount-color'>{data.monthOutQuantity}</Amount>
                                    </div>
                                    <div className='ba-amount'>
                                        <span></span>
                                    </div>
                                    <div className='ba-amount'>
                                        <Amount decimalPlaces={unitDecimalCount}>{data.monthOutAmount}</Amount>
                                    </div>
                                </div>
                                <div>
                                    <div className='ba-amount'>
                                        <Amount showZero={true} decimalPlaces={quantityScale} className='amount-color'>{data.endQuantity}</Amount>
                                    </div>
                                    <div className='ba-amount'>
                                        <Amount showZero={true} decimalPlaces={priceScale} className='amount-color'>{data.endPrice}</Amount>
                                    </div>
                                    <div className='ba-amount'>
                                        <Amount decimalPlaces={unitDecimalCount}>{data.endAmount}</Amount>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {showChild && data.childList.map((v, i) => loop(v, level+1) )}
                    </div>
                )

            }else{
                return(
                    <div className={level===0? 'ba ba-level' :' ba-ass ba'}>
                        <div>
                            <span className='name'
                            onClick={(e) => {
                                // 不要阻止冒泡，会导致记住滚动有问题
                                // e.stopPropagation()

                                sessionStorage.setItem('previousPage', 'inventoryYeb')
                                dispatch(inventoryMxbActions.getInventoryMxbDataFromYeb(issuedate, endissuedate, data.uuid,data.name,stockCategoryValue,topCategoryUuid,
                                    subCategoryUuid,stockCategorylabel,stockCategoryList,stockQuantity,stockStoreList,stockStoreValue,stockStoreLabel,chooseValue,inventoryType,typeListValue,typeListLabel))
                                history.push('/inventoryMxb')
                            }}
                            >
                            {level == 0 ? '' : <span className="ba-flag" style={flagstyle}></span>}
                                {data.name}
                            </span>
                        </div>
                        <div className='ba-info'>
                            <div >
                                <div className='ba-begin'>
                                    <span className='amount-color'>数量</span>
                                    <Amount showZero={true} decimalPlaces={quantityScale} className='amount-color'>{data.beginQuantity}</Amount>
                                </div>
                                <div className='ba-begin'>
                                    <span  className='amount-color'>单价</span>
                                    <Amount showZero={true} decimalPlaces={priceScale} className='amount-color'>{data.beginPrice}</Amount>
                                </div>
                                <div className='ba-amount'>
                                    <Amount decimalPlaces={unitDecimalCount}>{data.beginAmount}</Amount>
                                </div>
                            </div>
                            <div>
                                <div className='ba-amount'>
                                    <Amount showZero={true} decimalPlaces={quantityScale} className='amount-color'>{data.monthInQuantity}</Amount>
                                </div>
                                <div className='ba-amount'>
                                    <span></span>
                                </div>
                                <div className='ba-amount'>
                                    <Amount showZero={true} decimalPlaces={unitDecimalCount}>{data.monthInAmount}</Amount>
                                </div>
                            </div>
                            <div>
                                <div className='ba-amount' >
                                    <Amount showZero={true} decimalPlaces={quantityScale} className='amount-color'>{data.monthOutQuantity}</Amount>
                                </div>
                                <div className='ba-amount'>
                                    <span></span>
                                </div>
                                <div className='ba-amount'>
                                    <Amount decimalPlaces={unitDecimalCount}>{data.monthOutAmount}</Amount>
                                </div>
                            </div>
                            <div>
                                <div className='ba-amount' >
                                    <Amount showZero={true} decimalPlaces={quantityScale} className='amount-color'>{data.endQuantity}</Amount>
                                </div>
                                <div className='ba-amount' >
                                    <Amount showZero={true} decimalPlaces={priceScale} className='amount-color'>{data.endPrice}</Amount>
                                </div>
                                <div className='ba-amount'>
                                    <Amount decimalPlaces={unitDecimalCount}>{data.endAmount}</Amount>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        return loop(data,0)
    }
}
