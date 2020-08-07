import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { TableWrap } from 'app/components'

import FirstSection from './FirstSection'
import SecondSection from './SecondSection'
import ThirdSection from './ThirdSection'
import FourthSection from './FourthSection'

@immutableRenderDecorator
export default
class AmbBody extends React.Component {

	constructor() {
		super()
		this.state = { searchValue: '', scrollTop: '', allAssOrAc: 'ac'}
	}

	componentDidMount() {
		// 表格头部距离了顶端 877
		const tableSroll = this.refs['tableSroll']
		tableSroll.addEventListener('scroll', this.orderScroll.bind(this));
	}
	orderScroll() {

		const tableSroll = this.refs['tableSroll']

		this.setState({
			scrollTop: tableSroll.scrollTop
		})
	}

	render() {

		const {
			assId,
			gainAndLoss,
			income,
			pay,
			incomeBigger,
			detailDrawing,
			trendMap,
			issuedate,
			endissuedate,
			ambDetailTable,
			dispatch,
			didMount,
			currentAc,
			assName,
			tableShowChild,
			assCategory,
			isSpread
		} = this.props
		const { searchValue, scrollTop, allAssOrAc } = this.state

		// 表格头离顶端的距离，调整高度时要注意
		const offsetTop = 668

		return (
			<TableWrap notPosition={true}>
				<div className="ambsyb-main" ref="tableSroll">
					<div className="ambsyb-piechar-wrap">
						{/* 收支损益关系图 */}
						<FirstSection
							gainAndLoss={gainAndLoss}
							income={income}
							pay={pay}
							didMount={didMount}
						/>
						{/* 收支走势图等 */}
						<SecondSection
							incomeBigger={incomeBigger}
							detailDrawing={detailDrawing}
							trendMap={trendMap}
							issuedate={issuedate}
							endissuedate={endissuedate}
							didMount={didMount}
						/>
					</div>
					{/* 阿米巴对象余额表，全部时有 */}
					{
						assId === '' ?
						(
							allAssOrAc === 'ac' ?
								<FourthSection
									showAssTable={true}
									offsetTop={offsetTop}
									scrollTop={scrollTop}
									assName={assName}
									dispatch={dispatch}
									tableShowChild={tableShowChild}
									ambDetailTable={ambDetailTable}
									onSeclect={() => this.setState({allAssOrAc: 'ass'})}
									isSpread={isSpread}
								/> :
								<ThirdSection
									offsetTop={offsetTop}
									scrollTop={scrollTop}
									dispatch={dispatch}
									currentAc={currentAc}
									issuedate={issuedate}
									endissuedate={endissuedate}
									assId={assId}
									assCategory={assCategory}
									ambDetailTable={ambDetailTable}
									onSeclect={() => this.setState({allAssOrAc: 'ac'})}
									isSpread={isSpread}
								/>
						) :
						<FourthSection
							showAssTable={false}
							offsetTop={offsetTop}
							scrollTop={scrollTop}
							assName={assName}
							dispatch={dispatch}
							tableShowChild={tableShowChild}
							ambDetailTable={ambDetailTable}
							isSpread={isSpread}
						/>
					}
					{/* 明细，辅助项目有 */}
	            </div>
			</TableWrap>
		)
	}
}
