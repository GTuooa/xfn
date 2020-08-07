import React from 'react'
import { connect }	from 'react-redux'
import * as thirdParty from 'app/thirdParty'
import { cxAccountActions } from 'app/redux/Search/Cxls'

import Cxls from './Cxls'
import Sfgl from './Hsgl/Sfgl'
import Kjfp from './Hsgl/Kjfp'
import Fprz from './Hsgl/Fprz'
import Jzcb from './Hsgl/Jzcb'
import Jzsy from './Hsgl/Jzsy'
import CxHsgl from './CxHsgl/index.js'
import './CxHsgl/index.less'

@connect(state => state)
export default
class CxlsRouter extends React.Component {
	componentDidMount() {
		thirdParty.setTitle({ title: '查询流水' })
		thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })

		if (sessionStorage.getItem('ylPage') === 'cxls') {
			sessionStorage.removeItem('ylPage')
			return
		}
		if (sessionStorage.getItem('from-cxls')) {//从预览凭证进入
			sessionStorage.removeItem('from-cxls')
			return
		}

		this.props.dispatch(cxAccountActions.getPeriodAndBusinessList())
		this.props.dispatch(cxAccountActions.getRunningAccount())

	}

	render() {
		const { cxAccountState, history, dispatch } = this.props
		const currentRouter = cxAccountState.getIn(['views', 'currentRouter'])

		let component = null
		;({
			'CXLS': () => {//查询流水
                component = <Cxls history={history}/>
            },
			'SFGL': () => {//收付管理
                component = <Sfgl/>
            },
			'JZCB': () => {//结转成本
                component = <Jzcb/>
            },
			'KJFP': () => {//开具发票
                component = <Kjfp/>
            },
			'FPRZ': () => {//发票认证
                component = <Fprz/>
            },
			'JZSY': () => {//结转损益
                component = <Jzsy/>
            },
			'CX_HSGL': () => {//查询核算管理
				const categoryList = cxAccountState.getIn(['hsgl', 'categoryList'])
				const activeTab = cxAccountState.getIn(['hsgl', 'activeTab'])
                component = <CxHsgl
					categoryList={categoryList}
					activeTab={activeTab}
					dispatch={dispatch}
					history={history}
				/>
            },
        }[currentRouter] || (()=> null))()

		return (component)
	}
}
