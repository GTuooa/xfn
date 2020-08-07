import React from 'react'
import { connect }	from 'react-redux'
import * as thirdParty from 'app/thirdParty'
import { Row, Container, ScrollView } from 'app/components'
import Yysr from './Yysr'
import Yyzc from './Yyzc'
import Fyzc from './Fyzc'
import Xczc from './Xczc'
import Sfzc from './Sfzc'
import Nbzz from './Hsgl/Nbzz'
import Sfgl from './Hsgl/Sfgl'
import Fprz from './Hsgl/Fprz'
import Kjfp from './Hsgl/Kjfp'
import Jzcb from './Hsgl/Jzcb'
import Zcwjzzs from './Hsgl/Zcwjzzs'
import Ggfyft from './Hsgl/Ggfyft'
import Jzsy from './Hsgl/Jzsy'
import Zjtx from './Hsgl/Zjtx'
import Yywsr from './Qtls/Yywsr'
import Yywzc from './Qtls/Yywzc'
import Zskx from './Qtls/Zskx'
import Zfkx from './Qtls/Zfkx'
import Cqzc from './Cqzc'
import Jk from './Qtls/Jk'
import Tz from './Qtls/Tz'
import Zb from './Qtls/Zb'

import BottomButton from './BottomButton'
import YlTop from './YlTop'
import './ylls.less'

@connect(state => state)
export default
class Ylls extends React.Component {

	componentDidMount() {
		thirdParty.setTitle({title: '预览流水'})
		thirdParty.setIcon({ showIcon: false })
	}

	render() {
		const { dispatch, yllsState, history } = this.props
		const beBusiness = yllsState.getIn(['data', 'beBusiness'])//业务流水或收付管理
		const runningState = yllsState.getIn(['data', 'runningState'])//流水状态
		let categoryType = yllsState.getIn(['data', 'categoryType'])
		if (!beBusiness) {
			categoryType = 'LB_SFGL'
		}
		if (runningState === 'STATE_YYSR_JZCB') {
			categoryType = 'LB_JZCB'
		}

		let component = null
		;({
            'LB_YYSR': () => {//营业收入
                component = <Yysr history={history} />
            },
			'LB_YYZC': () => {//营业支出
                component = <Yyzc history={history} />
            },
			'LB_FYZC': () => {//费用支出
                component = <Fyzc history={history} />
            },
			'LB_XCZC': () => {//薪酬支出
                component = <Xczc history={history} />
            },
			'LB_SFZC': () => {//税费支出
                component = <Sfzc history={history} />
            },
			'LB_YYWSR': () => {//营业外收入
                component = <Yywsr history={history} />
            },
			'LB_YYWZC': () => {//营业外支出
                component = <Yywzc history={history} />
            },
			'LB_ZSKX': () => {//暂收款项
                component = <Zskx history={history} />
            },
			'LB_ZFKX': () => {//暂付款项
                component = <Zfkx history={history} />
            },
			'LB_CQZC': () => {//长期资产
                component = <Cqzc history={history} />
            },
			'LB_JK': () => {//借款
                component = <Jk history={history} />
            },
			'LB_TZ': () => {//投资
                component = <Tz history={history} />
            },
			'LB_ZB': () => {//资本
                component = <Zb history={history} />
            },
			'LB_ZZ': () => {//内部转账
                component = <Nbzz history={history} />
            },
			'LB_SFGL': () => {//收付管理
                component = <Sfgl history={history} />
            },
			'LB_JZCB': () => {//结转成本
                component = <Jzcb history={history} />
            },
			'LB_KJFP': () => {//开具发票
                component = <Kjfp history={history} />
            },
			'LB_FPRZ': () => {//发票认证
                component = <Fprz history={history} />
            },
			'LB_ZCWJZZS': () => {//转出未交增值税
                component = <Zcwjzzs history={history} />
            },
			'LB_GGFYFT': () => {//公共费用分摊
				component = <Ggfyft history={history} />
            },
			'LB_JZSY': () => {//长期资产结转损益
				component = <Jzsy history={history} />
            },
			'LB_ZJTX': () => {//长期资产折旧摊销
				component = <Zjtx history={history} />
            },
        }[categoryType] || (()=> null))()

		return (
			<Container className="ylls">
				<YlTop history={history}/>
				{ component }
				<BottomButton history={history}/>
			</Container>

		)
	}
}
