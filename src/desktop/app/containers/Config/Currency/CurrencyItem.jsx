import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Checkbox, Button, Tooltip }	from 'antd'
import { Icon } from 'app/components'
import { TableItem, TableOver, TableAll, TableTree, Price } from 'app/components'
import { judgePermission} from 'app/utils'

import * as currencyActions from 'app/redux/Config/Currency/currency.action.js'

@immutableRenderDecorator
export default
class CurrencyItem extends React.Component {

	render() {
		const {
            dispatch,
            line,
			item,
			// configPermissionInfo,
			detailList
		} = this.props

		const standard = item.get('standard') == '0' ? true : false;

		return (
			<TableItem line={line+1} className="currency-tabel-width currency-table-content">
				<li>
				{/**judgePermission(detailList.get('CUD_FOREIGN_CURRENCY')).disabled */}
					<Tooltip placement="bottom" title={standard ?  (!judgePermission(detailList.get('CUD_FOREIGN_CURRENCY')).disabled ? '' : '仅管理可删除') : '本位币不可删除'}>
						<span>
							<Icon
		                        type="close"
		                        className="currency-edit"
								style={{color: standard ? '' : '#cccccc'}}
								onClick={() => {
									if (standard && !judgePermission(detailList.get('CUD_FOREIGN_CURRENCY')).disabled) {
										dispatch(currencyActions.deleteCurrencyFetch(item.get('fcNumber')))
									}

								}}
		                    />
						</span>
					</Tooltip>
                </li>
                <li>{item.get('fcNumber')}</li>
				<TableOver
					textAlign="left"
					isLink={standard ? true : false}
					onClick={() => {
						if (standard && !judgePermission(detailList.get('CUD_FOREIGN_CURRENCY')).disabled) {
							sessionStorage.setItem('handleCurrency', 'modify')
							dispatch(currencyActions.changeCurrencyModalDisplay(item.get('fcNumber'), item.get('exchange')))
						}
					}}>
					{item.get('name')}
				</TableOver>
                <li><Price>{item.get('exchange')}</Price></li>
                <li>{item.get('standard') == '0' ? '否' : '是'}</li>
            </TableItem>
		)
	}
}
