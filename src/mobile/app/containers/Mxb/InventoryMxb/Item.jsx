import React, { PropTypes } from 'react'
import { Map,fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import moment from 'moment'
import TableAmount from 'app/containers/components/Table/TableAmount'
import { runningPreviewActions } from 'app/redux/Edit/RunningPreview'

@immutableRenderDecorator
export default
class Item extends React.Component {
    render(){
        const {data,className,unitCardName,unitDecimalCount,baseData,dispatch,history,showReverseAmount,priceScale,quantityScale}=this.props
        let hash = {}
		const newUuidList = baseData.filter(v=>v.oriAbstract!=='期初余额').reduce((item, next) => {
			hash[next.oriUuid] ? '' : hash[next.oriUuid] = true && item.push(next);
			return item
		}, [])
        return(
            <div
                className={'ba' + ' ' + className}
                onClick={(e) => {
                    dispatch(runningPreviewActions.getRunningPreviewBusinessFetch(data.oriUuid, fromJS(data), fromJS(newUuidList), 'mxb', history))
                }}
            >
                <div>
                    <span className='name'>
                        <span className='name-name'>{`${data.oriDate}-${data.oriAbstract}`}</span>
                    </span>
                </div>
                <div className='ba-info'>
					<span className="ba-type-name">{ `${data.jrIndex}号`}</span>
					<TableAmount direction={'debit'}>{data.inQuantity>0 || data.inAmount ? data.inAmount : data.outAmount}</TableAmount>
					<TableAmount direction={'debit'}>{showReverseAmount?0-data.balanceAmount:data.balanceAmount}</TableAmount>
				</div>
                <div className='ba-info'>
					<span className="ba-type-name">{data.inQuantity>0|| data.inAmount?'入库':'出库'}</span>
                    {data.inQuantity>0 || data.inAmount>0 ?
                        <div className='ba-amount'>
                            <Amount showZero={true} decimalPlaces={quantityScale}>{data.inQuantity}</Amount>
                            <span>{unitCardName}*</span>
                            <TableAmount decimalPlaces={priceScale} direction={'debit' }>{data.inPrice}</TableAmount>
                        </div>:
                        <div className='ba-amount'>
                            <Amount showZero={true} decimalPlaces={quantityScale}>{data.outQuantity}</Amount>
                            <span>{unitCardName}*</span>
                            <TableAmount decimalPlaces={priceScale} direction={'debit' }>{data.outPrice}</TableAmount>
                        </div>
                    }
                    <div className='ba-amount'>
                        <Amount showZero={true} decimalPlaces={quantityScale}>{showReverseAmount?0-data.balanceQuantity:data.balanceQuantity}</Amount>
                        <span>{unitCardName}*</span>
                        <TableAmount direction={'debit' } decimalPlaces={priceScale}>{data.balancePrice}</TableAmount>
                    </div>
				</div>
            </div>
        )
    }
}
