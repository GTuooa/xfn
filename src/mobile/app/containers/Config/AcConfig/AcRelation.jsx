import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect }	from 'react-redux'
import * as assconfigActions from 'app/redux/Config/Ass/assconfig.action'
import * as allActions from 'app/redux/Home/All/aclist.actions'
import * as assAllActions from 'app/redux/Home/All/asslist.actions'
import { ButtonGroup, Button, Container, Row, ScrollView, Icon } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import Title from './Title'
import Ac from './Ac'
import './ac-config.less'


@connect(state => state)
export default
class AcRelation extends React.Component {

	componentDidMount() {
		thirdParty.setTitle({title: '关联科目设置'})
		thirdParty.setRight({show: false})
		const { dispatch, allState, assconfigState } = this.props
		//通过当前选择的tab栏索引获取到相应类别
		const assTags = allState.get('assTags')
		const asstabSelectedIndex = assconfigState.get('tabSelectedIndex')
		const tabSelectedAssCategory = assTags.get(asstabSelectedIndex)
		dispatch(allActions.selectAcAllByAssCategory(tabSelectedAssCategory))
	}
	render() {
		const {
			assconfigState,
			acconfigState,
			allState,
			history,
			dispatch
		} = this.props

		const showedLowerAcIdList = acconfigState.get('showedLowerAcIdList')
		const aclistSeq = allState.get('aclist').toSeq()
		const acTags = allState.get('acTags')
		const assTags = allState.get('assTags')
		// 获得辅助页所指类别位置
		const tabSelectedIndex = assconfigState.get('tabSelectedIndex')
		// 辅助核算页所指的辅助类别
		const currentAssCategory = assTags.get(tabSelectedIndex)

		// 辅助核算页所指的ac类别位置
		const assTabSelectedIndex = assconfigState.get('assTabSelectedIndex')
		// const currAcIdFirstChar = assTabSelectedIndex + 1

		//通过当前选择的tab栏索引获取到相应类别
		const tabSelectedAssCategory = assTags.get(assTabSelectedIndex)
		const tabSelectedSubTags = acTags.getIn([assTabSelectedIndex, 'sub'])
		//通过类别获取当前acasslist中相应的索引和具体对象
		const acAssSelectedIndex = allState.get('acasslist').findKey(v => v.get('asscategory') === tabSelectedAssCategory)
		const acass = allState.getIn(['acasslist', acAssSelectedIndex])
		//获取acass中的aclist和asslist(插入类别)
		//当前tab页的科目列表
		let currTabAcList = aclistSeq
			//设置每个科目相对于数组的编号，便于分页之后相关操作定位
			.map((v, i) => v.set('idx', i))
			//只显示符合当前选中的页面的科目
			// .filter(v => v.get('acid') && v.get('acid').charAt(0) == currAcIdFirstChar)
			.filter(v => tabSelectedSubTags.indexOf(v.get('category')) > -1)
			//判断不显示已关联其它辅助核算且没有2个的ac
			.filter(v => v.get('asscategorylist').some(v => v === currentAssCategory) || v.get('asscategorylist').size < 2)
			.map(v => {
				const currAcid = v.get('acid')
				const nextAcupperid = aclistSeq.getIn([v.get('idx') + 1, 'upperid'])
				return v.set('hasSub', !!nextAcupperid && nextAcupperid === currAcid)
			})

		return (
			<Container className="ac-relation">
				<Row className="header">
					<span>辅助核算类型：{currentAssCategory}</span>
				</Row>
				<Title
					tabSelectedIndex={assTabSelectedIndex}
					dispatch={dispatch}
					acTags={acTags}
					callback={(value) => dispatch(assconfigActions.changeTabIndexAcAssconfig(value))}
				/>
				<ScrollView flex="1">
					{currTabAcList.map((u, j) => {
						const upperid = u.get('upperid')
						const backgroundColor = upperid ? '#FEF3E3' : '#fff'
						const display = ''
						// const display = !upperid || showedLowerAcIdList.indexOf(upperid) > -1 ? '' : 'none'
						// const isExpanded = showedLowerAcIdList.indexOf(u.get('acid')) > -1
						const isExpanded = 'displaynone'

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
				<ButtonGroup type='ghost' height={50}>
					<Button onClick={() => dispatch(allActions.unselectAcAll()) & history.goBack()}><Icon type="cancel"/><span>取消</span></Button>
					<Button onClick={() => dispatch(assAllActions.modifyRelatedAclistFetch(history))}><Icon type="confirm"/><span>确认</span></Button>
				</ButtonGroup>
			</Container>
		)
	}
}
