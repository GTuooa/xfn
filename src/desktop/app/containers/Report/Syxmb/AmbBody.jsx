import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { TableWrap } from 'app/components'

import FirstSection from './FirstSection'
import SecondSection from './SecondSection'
import ThirdSection from './ThirdSection'
import FourthSection from './FourthSection'

import * as syxmbActions from 'app/redux/Report/Syxmb/syxmb.actions.js'
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
			cardUuid,
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
			cardName,
			tableShowChild,
			//assCategory,
			isSpread,
			beCategory,
			allAssOrAc,
			unit
		} = this.props
		const { searchValue, scrollTop,  } = this.state

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
							unit={unit}
						/>
						{/* 收支走势图等 */}
						<SecondSection
							incomeBigger={incomeBigger}
							detailDrawing={detailDrawing}
							trendMap={trendMap}
							issuedate={issuedate}
							endissuedate={endissuedate}
							didMount={didMount}
							unit={unit}
						/>
					</div>
					{/* 阿米巴对象余额表，全部时有 */}
					{
						beCategory === true ?
						(
							allAssOrAc === 'ac' ?
								<FourthSection
									showAssTable={true}
									offsetTop={offsetTop}
									scrollTop={scrollTop}
									cardName={cardName}
									dispatch={dispatch}
									tableShowChild={tableShowChild}
									ambDetailTable={ambDetailTable}
									onSeclect={() => dispatch(syxmbActions.changeAssOrAc('ass'))}
									isSpread={isSpread}
									unit={unit}
								/> :
								<ThirdSection
									offsetTop={offsetTop}
									scrollTop={scrollTop}
									dispatch={dispatch}
									currentAc={currentAc}
									issuedate={issuedate}
									endissuedate={endissuedate}
									cardUuid={cardUuid}
								//	assCategory={assCategory}
									ambDetailTable={ambDetailTable}
									onSeclect={() => dispatch(syxmbActions.changeAssOrAc('ac'))}
									isSpread={isSpread}
									unit={unit}
								/>
						) :
						<FourthSection
							showAssTable={false}
							offsetTop={offsetTop}
							scrollTop={scrollTop}
							cardName={cardName}
							dispatch={dispatch}
							tableShowChild={tableShowChild}
							ambDetailTable={ambDetailTable}
							isSpread={isSpread}
							unit={unit}
						/>
					}
					{/* 明细，辅助项目有 */}
	            </div>
			</TableWrap>
		)
	}
}
