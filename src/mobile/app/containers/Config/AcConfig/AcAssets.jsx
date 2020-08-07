import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect }	from 'react-redux'
import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'
import * as acconfigActions from 'app/redux/Config/Ac/acconfig.action'

import * as allActions from 'app/redux/Home/All/aclist.actions'
import { Cascade, ButtonGroup, Button, Container, Row, ScrollView, Icon } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import Title from './Title'
import Ac from './Ac'
import './ac-config.less'


@connect(state => state)
export default
class AcRelation extends React.Component {

	componentDidMount() {
		thirdParty.setTitle({title: '科目选择'})
		thirdParty.setRight({show: false})
		// this.props.dispatch(allActions.getAcListFetch())
	}
	render() {
		const {
			assetsState,
			acconfigState,
			allState,
			history,
			dispatch
		} = this.props

		const showedLowerAcIdList = acconfigState.get('showedLowerAcIdList')
		const aclistSeq = allState.get('aclist').toSeq()
		const acTags = allState.get('acTags')

		const tabSelectedIndex = assetsState.get('tabSelectedIndex')
		const currAcIdFirstChar = tabSelectedIndex + 1

		//通过当前选择的tab栏索引获取到相应类别
		const assTags = allState.get('assTags')
		const tabSelectedAssCategory = assTags.get(tabSelectedIndex)
		//通过类别获取当前acasslist中相应的索引和具体对象
		const acAssSelectedIndex = allState.get('acasslist').findKey(v => v.get('asscategory') == tabSelectedAssCategory)
		const acass = allState.getIn(['acasslist', acAssSelectedIndex])
		//获取acass中的aclist和asslist(插入类别)
		//当前tab页的科目列表
		let currTabAcList = aclistSeq
			//设置每个科目相对于数组的编号，便于分页之后相关操作定位
			.map((v, i) => v.set('idx', i))
			//只显示符合当前选中的页面的科目
			.filter(v => v.get('acid') && v.get('acid').charAt(0) == currAcIdFirstChar)
			//判断是否存在下一级，并设置标示位
			// .filter(v => v.get('asscategorylist').some(v => v == tabSelectedAssCategory) || v.get('asscategorylist').size == 0)
			.map(v => {
				const currAcid = v.get('acid')
				const nextAcupperid = aclistSeq.getIn([v.get('idx') + 1, 'upperid'])
				return v.set('hasSub', !!nextAcupperid && nextAcupperid === currAcid)
			})

		//console.log('assconfigState------------', assconfigState.toJS())
		return (
			<Container className="ac-relation">
				<Title
					tabSelectedIndex={tabSelectedIndex}
					dispatch={dispatch}
					acTags={acTags}
					callback={(value) => dispatch(assetsActions.changeTabIndexAssetsconfig(value))}
					/>
				<ScrollView flex="1">
					{currTabAcList.map((u, j) => {
						const upperid = u.get('upperid')
						const backgroundColor = upperid ? '#FEF3E3' : '#fff'
						const display = !upperid || showedLowerAcIdList.indexOf(upperid) > -1 ? '' : 'none'
						const isExpanded = showedLowerAcIdList.indexOf(u.get('acid')) > -1

						return (
							<Ac
								hasSub={u.get('hasSub')}
								isExpanded={isExpanded}
								style={{backgroundColor, display}}
								key={u.get('acid')}
								idx={u.get('idx')}
								ac={u}
								selectable={!u.get('hasSub')}
								allAcCheckBoxDisplay={true}
								allAcModifyButtonDisplay={false}
								currTabAcList={currTabAcList}
								dispatch={dispatch}
								history={history}
							/>
						)
					})}
				</ScrollView>
				<ButtonGroup height={50}>
					<Button onClick={() => dispatch(assetsActions.assetsSelectAc())}><Icon type="confirm"/><span>确认</span></Button>
					<Button onClick={() => history.goBack()}><Icon type="cancel"/><span>取消</span></Button>
				</ButtonGroup>
			</Container>
		)
	}
}
