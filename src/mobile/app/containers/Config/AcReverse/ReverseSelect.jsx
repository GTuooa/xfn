import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect }	from 'react-redux'

import * as thirdParty from 'app/thirdParty'
import { Button, ButtonGroup, Container, Row, ScrollView } from 'app/components'
import ReverseSelectAc from './ReverseSelectAc.jsx'
import Title from '../AcConfig/Title.jsx'
import '../AcConfig/ac-config.less'

import * as acAllActions from 'app/redux/Home/All/aclist.actions'
import * as acconfigActions from 'app/redux/Config/Ac/acconfig.action'

@connect(state => state)
export default
class ReverseSelect extends React.Component {

	componentDidMount() {
		thirdParty.setTitle({title: '科目选择'})
		thirdParty.setIcon({
            showIcon: false
        })
		thirdParty.setRight({show: false})
		// this.props.dispatch(acAllActions.getAcListFetch())
	}

	render() {
		const {
			dispatch,
			acconfigState,
			history,
			allState
		} = this.props

		const selectAcId = acconfigState.get('selectAcId')    //被选中科目的acid
		const type = acconfigState.get('type')

		const aclistSeq = allState.get('aclist').toSeq()
		const tabSelectedIndex = acconfigState.get('tabSelectedIndex')
		const showedLowerAcIdList = acconfigState.get('showedLowerAcIdList')

		// 是否有非零个item被选中
		const acTags = allState.get('acTags')
		const tabSelectedSubTags = acTags.getIn([tabSelectedIndex, 'sub'])
		//当前tab页的科目列表
		const currTabAcList = aclistSeq
			//设置每个科目相对于数组的编号，便于分页之后相关操作定位
			.map((v, i) => v.set('idx', i))
			//只显示符合当前选中的页面的科目
			.filter(v => tabSelectedSubTags.indexOf(v.get('category')) > -1)
			//判断是否存在下一级，并设置标示位  －－－hasSub
			.map(v => {
				const currAcid = v.get('acid')
				const nextAcupperid = aclistSeq.getIn([v.get('idx') + 1, 'upperid'])
				return v.set('hasSub', !!nextAcupperid && nextAcupperid === currAcid)
			})



		return (
			<Container className="ac-config ac-reverse-config">
				<Title
					tabSelectedIndex={tabSelectedIndex}
					dispatch={dispatch}
					acTags={acTags}
					callback={(value) => dispatch(acconfigActions.changeTabIndexAcConfig(value))}
				/>
				<ScrollView flex="1" uniqueKey="ac-config-scroll" savePosition className="ac-list">
					{currTabAcList.map((u, j) => {
						const upperid = u.get('upperid')
						const backgroundColor = upperid ? '#FEF3E3' : '#fff'
						const display = !upperid || showedLowerAcIdList.indexOf(upperid) > -1 ? '' : 'none'
						const isExpanded = showedLowerAcIdList.indexOf(u.get('acid')) > -1

						return (
							<ReverseSelectAc
								hasSub={u.get('hasSub')}
								isExpanded={isExpanded}
								style={{backgroundColor, display}}
								key={u.get('acid')}
								idx={u.get('idx')}
								ac={u}
								dispatch={dispatch}
								selectAcId={selectAcId}
								type={type}
							/>
						)
					})}
				</ScrollView>
				<Row>
					<ButtonGroup height={50}>
						<Button onClick={() => history.goBack()}><span>取消</span></Button>
                        <Button disabled={selectAcId ? false : true} onClick={() => dispatch(acconfigActions.getReportAcReverseCheck(type, selectAcId, history))}><span>校验</span></Button>
					</ButtonGroup>
				</Row>
			</Container>
		)
	}
}
