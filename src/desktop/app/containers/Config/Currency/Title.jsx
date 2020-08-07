import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Icon, Checkbox, Button, Tooltip }	from 'antd'
import PageSwitch from 'app/containers/components/PageSwitch'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import {judgePermission} from 'app/utils'

import * as currencyActions from 'app/redux/Config/Currency/currency.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

@immutableRenderDecorator
export default
class FzItem extends React.Component {
	render() {
		const {
			// configPermissionInfo,
			dispatch,
			isSpread,
			pageList,
			detailList
		} = this.props

		return (
			<FlexTitle>
				<div className="flex-title-left">
					{isSpread ? '' :
						<PageSwitch
							pageItem={pageList.get('Config')}
							onClick={(page, name, key) => {
								dispatch(homeActions.addPageTabPane('ConfigPanes', key, key, name))
								dispatch(homeActions.addHomeTabpane(page, key, name))
							}}
						/>
					}
				</div>
				<div className="flex-title-right">
					<Tooltip placement="top" title={!judgePermission(detailList.get('CUD_FOREIGN_CURRENCY')).disabled? '' : '当前角色无该权限'}>
						<Button
							className="title-right four-word-btn"
							type="ghost"
							//title={!judgePermission(detailList.get('CUD_FOREIGN_CURRENCY')).disabled ? '' : '仅管理员可新增币别'}>
							disabled={judgePermission(detailList.get('CUD_FOREIGN_CURRENCY')).disabled}
							//disabled={judgePermission(detailList.get('CUD_FOREIGN_CURRENCY')).disabled}
							onClick={() => {
								sessionStorage.setItem('handleCurrency', 'insert')
								dispatch(currencyActions.changeCurrencyModalDisplay())
							}}
						>
							添加币别
						</Button>
					</Tooltip>
					<Button
						className="title-right"
						type="ghost"
						onClick={() => {
							this.props.dispatch(currencyActions.getFCListFetch())
							this.props.dispatch(currencyActions.getFCRelateAcListFetch())
							dispatch(allActions.closeConfigPage('外币设置'))
						}}
						>
						刷新
					</Button>
				</div>
            </FlexTitle>
		)
	}
}
