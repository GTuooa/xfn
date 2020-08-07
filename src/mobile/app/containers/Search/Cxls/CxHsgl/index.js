import React from 'react'
import { Tabs } from 'app/components'
import { cxAccountActions } from 'app/redux/Search/Cxls'
import { toJS } from 'immutable'

import Sfgl from './Sfgl'
import Kjfp from './Kjfp'
import Fprz from './Fprz'
import Jzcb from './Jzcb'

export default
class CxHsgl extends React.Component {

	renderContent = tab => {
		const history = this.props.history
		let component = null
		switch (tab.title) {
			case '收付管理' : {
				component = <Sfgl history={history}/>
				break
			}
			case '成本结转' : {
				component = <Jzcb history={history}/>
				break
			}
			case '发票认证' : {
				component = <Fprz history={history}/>
				break
			}
			case '开具发票' : {
				component = <Kjfp history={history}/>
				break
			}
		}

		return component
	}

	render() {
		const { categoryList, activeTab, dispatch, history } = this.props

		let tabs = []
		categoryList.forEach(v => tabs.push({title: v.get('key')}))

		return (
			<Tabs tabs={tabs}
				prefixCls={'my-tab'}
				prerenderingSiblingsNumber={0}
				animated={false}
				useOnPan={false}
				page={activeTab}
				destroyInactiveTab={true}
				renderTabBar={props => <Tabs.DefaultTabBar {...props}
					page={4}
					animated={false}
					goToTab={(index) => {
						dispatch(cxAccountActions.changeCxlsData(['hsgl', 'activeTab'], index))
					}}
				/>}
			>
				{this.renderContent}
			</Tabs>

		)
	}
}
