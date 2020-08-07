import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as kmyebActions from 'app/redux/Yeb/Kmyeb/kmyeb.action.js'
import * as assKmyebActions from 'app/redux/Yeb/AssYeb/assYeb.action.js'
import { XfnIcon } from 'app/components'
import './table.less'
import { Tooltip } from 'antd'
@immutableRenderDecorator

class TitleKmye extends React.Component{
	constructor() {
		super()
		this.state = { isShowAll: false }
	}
	render() {
		const { title1, title2, dispatch, isAssYeb, assYebState, fromAss } = this.props
		const { isShowAll } = this.state
		let filterZero,kmyeAssCategory,condition,endissuedate,issuedate, acId,assYeb,assbalanceaclist
		if (fromAss) {
			filterZero = assYebState.get('filterZero')
			 assbalanceaclist = assYebState.get('assbalanceaclist')
			 kmyeAssCategory = assYebState.get('kmyeAssCategory')
			 condition = assYebState.get('condition')
			 endissuedate = assYebState.get('endissuedate')
			 issuedate = assYebState.get('issuedate')
			 acId = assYebState.get('acId')
			 assYeb = assbalanceaclist.every(v=> !v.has('showchilditem'))?false:assbalanceaclist.every(v=> v.has('showchilditem')?v.get('showchilditem'):true)
		}
		return (
			<div className="table-title-wrap">
				<ul className="table-title-kmyeb table-title-kmyeb-width">
					<li>
						<span onClick={()=>{
							if(isAssYeb){
								dispatch(assKmyebActions.assYebShowAll(!assYeb))
							}else{
								dispatch(kmyebActions.isShowAll(!isShowAll))
								this.setState({isShowAll: !isShowAll})
							}

						}}>
							{title1}
							{
								isAssYeb ?
								<XfnIcon type={assYeb ? 'kmyeUp' : 'kmyeDown'} className={assYeb ? 'kmyeDown kmyeUp' : 'kmyeDown'}/>
								:
								<XfnIcon type={isShowAll ? 'kmyeUp' : 'kmyeDown'} className={isShowAll ? 'kmyeDown kmyeUp' : 'kmyeDown'}/>
							}
						</span>
					</li>
					<li><span>{title2}</span></li>
					<li>
						<div>
							<span>期初余额</span>
							<span>本期发生额</span>
							<span>本年累计发生额</span>
							<span>期末余额
								{
									fromAss?
									<Tooltip title='筛选有余额的对象'>
										<span
											className='Ass-shalou'
											style={{color:filterZero?'red':'',paddingLeft:'2px'}}
											onClick={() => {
												dispatch(assKmyebActions.getAssEveryKmyebListFetch(issuedate, endissuedate, kmyeAssCategory,condition,!filterZero,acId,1,true))
											}}
											>
												<XfnIcon type='sandy-clock'/>
											</span>
									</Tooltip>:''
								}

							</span>
						</div>
						<div>
							<span>借方</span>
							<span>贷方</span>
							<span>借方</span>
							<span>贷方</span>
							<span>借方</span>
							<span>贷方</span>
							<span>借方</span>
							<span>贷方</span>
						</div>
					</li>
				</ul>
			</div>
		)
	}
}

export default TitleKmye;