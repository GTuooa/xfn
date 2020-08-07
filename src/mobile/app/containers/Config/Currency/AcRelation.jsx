import React, { PropTypes } from 'react'
import { Map, toJS } from 'immutable'
import { connect }	from 'react-redux'
import { ButtonGroup, Button, Container, Row, ScrollView, Icon } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import * as currencyActions from 'app/redux/Config/Currency/currency.action'
import * as allActions from 'app/redux/Home/All/aclist.actions'
import Title from './Title.jsx'
import Ac from './Ac.jsx'
import './currency.less'
import 'app/containers/Config/AcConfig/ac-config.less'

@connect(state => state)
export default
class AcRelation extends React.Component {

	componentDidMount() {
		thirdParty.setTitle({title: '关联科目设置'})
		thirdParty.setRight({show: false})
		const { dispatch, allState, currencyState } = this.props
		const list = currencyState.get('acRelateFCList').map(w => w.get('acid'))
		dispatch(allActions.selectAcAllByCurrency(list))
	}
	render() {
		const {
			allState,
			history,
			dispatch,
			acconfigState,
			currencyState
		} = this.props

		const showedLowerAcIdList = acconfigState.get('showedLowerAcIdList')
		const aclistSeq = allState.get('aclist').toSeq()
		const acTags = allState.get('acTags')
		const assTags = allState.get('assTags')

		const fcTabSelectedIndex = currencyState.get('fcTabSelectedIndex')
		//通过当前选择的tab栏索引获取到相应类别
		const tabSelectedSubTags = acTags.getIn([fcTabSelectedIndex, 'sub'])

		//获取acass中的aclist和asslist(插入类别)
		//当前tab页的科目列表
		let currTabAcList = aclistSeq
			//设置每个科目相对于数组的编号，便于分页之后相关操作定位
			.map((v, i) => v.set('idx', i))
			//只显示符合当前选中的页面的科目
			.filter(v => tabSelectedSubTags.indexOf(v.get('category')) > -1)
			.map(v => {
				const currAcid = v.get('acid')
				const nextAcupperid = aclistSeq.getIn([v.get('idx') + 1, 'upperid'])
				return v.set('hasSub', !!nextAcupperid && nextAcupperid === currAcid)
			})

		return (
			<Container className="ac-relation">
				<Title
					tabSelectedIndex={fcTabSelectedIndex}
					dispatch={dispatch}
					acTags={acTags}
					callback={(value) => dispatch(currencyActions.changeTabIndexCurrency(value))}
				/>
				<ScrollView flex="1">
					{currTabAcList.map((u, j) => {
						const upperid = u.get('upperid')
						const backgroundColor = upperid ? '#FEF3E3' : '#fff'
						const display = ''

						return (
							<Ac
								hasSub={u.get('hasSub')}
								style={{backgroundColor, display}}
								key={u.get('acid')}
								idx={u.get('idx')}
								ac={u}
								selectable={!u.get('hasSub')}
								currTabAcList={currTabAcList}
								dispatch={dispatch}
							/>
						)
					})}
				</ScrollView>
				<ButtonGroup type='ghost' height={50}>
					<Button onClick={() => dispatch(allActions.unselectAcAll()) & history.goBack()}><Icon type="cancel"/><span>取消</span></Button>
					<Button onClick={() => dispatch(currencyActions.changeRelatedAcListFetch(history))}><Icon type="confirm"/><span>确认</span></Button>
				</ButtonGroup>
			</Container>
		)
	}
}
