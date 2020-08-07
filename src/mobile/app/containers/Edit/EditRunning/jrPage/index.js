import React, { Component } from 'react'

import ZskxLs from 'app/containers/Edit/EditRunning/jrPage/zskx.jsx'
import ZfkxLs from 'app/containers/Edit/EditRunning/jrPage/zfkx.jsx'
import JkLs from 'app/containers/Edit/EditRunning/jrPage/jk.jsx'
import TzLs from 'app/containers/Edit/EditRunning/jrPage/tz.jsx'
import ZbLs from 'app/containers/Edit/EditRunning/jrPage/zb.jsx'
import SfzcLs from 'app/containers/Edit/EditRunning/jrPage/sfzc.jsx'
import XczcLs from 'app/containers/Edit/EditRunning/jrPage/xczc.jsx'
import KjfpLs from 'app/containers/Edit/EditRunning/jrPage/kjfp.jsx'
import FprzLs from 'app/containers/Edit/EditRunning/jrPage/fprz.jsx'
import JzsyLs from 'app/containers/Edit/EditRunning/jrPage/jzsy.jsx'
import ZcwjzzsLs from 'app/containers/Edit/EditRunning/jrPage/zcwjzzs.jsx'
import SfglLs from 'app/containers/Edit/EditRunning/jrPage/sfgl.jsx'
import JzcbLs from 'app/containers/Edit/EditRunning/jrPage/jzcb.jsx'
import GgfyftLs from 'app/containers/Edit/EditRunning/jrPage/ggfyft.jsx'
import XmjzLs from 'app/containers/Edit/EditRunning/jrPage/xmjz.jsx'


export default class JrPage extends Component  {
    render () {
        const { categoryType, isModify } = this.props
        let component = null

		;({

			'LB_XCZC': () => {//薪酬支出-选择流水页面
                component = <XczcLs/>
            },
			'LB_SFZC': () => {//税费支出-选择流水页面
                component = <SfzcLs/>
            },
			'LB_ZSKX': () => {//暂收款项-选择流水页面
                component = <ZskxLs/>
            },
			'LB_ZFKX': () => {//暂付款项-选择流水页面
                component = <ZfkxLs/>
            },
			'LB_JK': () => {//借款支付利息-选择流水页面
                component = <JkLs/>
            },
			'LB_TZ': () => {//投资收入股利-选择流水页面
                component = <TzLs/>
            },
			'LB_ZB': () => {//支付利润-选择流水页面
                component = <ZbLs/>
            },
			'LB_SFGL': () => {//收付管理-选择流水页面
                component = <SfglLs/>
            },
			'LB_JZCB': () => {//结转成本-选择流水页面
                component = <JzcbLs/>
            },
			'LB_KJFP': () => {//开具发票-选择流水页面
                component = <KjfpLs/>
            },
			'LB_FPRZ': () => {//发票认证-选择流水页面
                component = <FprzLs/>
            },
			'LB_ZCWJZZS': () => {//未交增值税-选择流水页面
                component = <ZcwjzzsLs/>
            },
			'LB_GGFYFT': () => {//项目公共费用分摊-选择流水页面
                component = <GgfyftLs/>
            },
			'LB_JZSY': () => {//结转损益-选择流水页面
                component = <JzsyLs/>
            },
            'LB_XMJZ': () => {//项目结转-选择流水页面
                component = <XmjzLs/>
            },

        }[categoryType] || (()=> null))()

        return (
            <div className='xfn-tree xfn-tree-animate'>
                <div className='xfn-tree-popup'>
                    <div className='jr-title' style={{display: !isModify && ['LB_SFGL', 'LB_ZSKX', 'LB_ZFKX', 'LB_JZCB'].includes(categoryType) ? 'none' : ''}}>
                        <span>{categoryType=='LB_XMJZ' ? '查看详情' : '选择核销流水'}</span>
                        {/* <span className='jr-cancel'>取消</span> */}
                    </div>
                    {component}
                </div>
            </div>
        )
    }
}
