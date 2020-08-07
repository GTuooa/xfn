import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import * as yjsfbActions from 'app/redux/Report/Yjsfb/yjsfb.action.js'
import { Icon, Amount }	from 'app/components'

// const levels = {//用于说明
// 	firstlrb: [3],//一级且有子分类的(有图标)
// 	firstlrblast: [1, 2, 24],//一级无子分类的(无图标)
// 	second: [4, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 ],//二级
// 	thirdlrb: [5, 6, 7, 8, 9, 10]//三级
// }

@immutableRenderDecorator
export default
class ProfitLine extends React.Component {
	marginLeft(level){
		switch(level){
			case 1:
			case 2:
			case 3:
				return 0;
			case 4:
				return 24;
			default:
				return (level-3)*18
		}
	}
	render() {
		const { lr, key,dispatch,showChildList, showedProfitLineBlockIdxList, ...other } = this.props

		// let level//调整样式使用
		// const lineIndex = lr.get('lineIndex')
		// if (lineIndex == 3) {
		// 	level = 'firstlrb'
		// } else if (lineIndex == 1 || lineIndex == 2 || lineIndex == 26) {
		// 	level = 'firstlrblast'
		// } else {
		// 	level = 'second'
		// }
		// else if (lineIndex == 5 || lineIndex == 6 || lineIndex == 7 || lineIndex == 8 || lineIndex == 9  || lineIndex == 10 || lineIndex == 11) {
		// 	level = 'thirdlrb'
		// }
		// else {
		// 	level = 'second'
		// }

		//const show = showedProfitLineBlockIdxList.find(v => v == lr.get('lineIndex'))//icon的显示与否
		const loop=(item,level,key)=>{
			if(item.get("payTaxList")&&item.get("payTaxList").size){
				const showChild = showChildList.indexOf(item.get("lineIndex"))> -1
				const marginLeft = this.marginLeft(item.get('level'))
				return(
					<div key={key}>
						<dd
							{...other}
							className={['sjb-line', ].join(' ')}
							style={{fontWeight: item.get("level")===1 || item.get("level")===2?`bold`:'',background:item.get("level")===1?'#FEF4E3':''}}
							onClick={() => { dispatch(yjsfbActions.handleShowChildList(item.get('lineIndex')))}}
							>
							<span className="linename">
								<span className="linenametext" style={{marginLeft:`${marginLeft}px`}}>{item.get('lineName').replace(/、/g, '.').replace(/：/g, ':').replace(/（/g, '(').replace(/）/g, ')')}</span>
								<Icon className="sjb-item-icon"  type={showChild?"arrow-up":"arrow-down"}/>
							</span>
							<Amount className="sumAmount" showZero="true">{item.get('yearAmount')}</Amount>
							<Amount className="amount" showZero="true">{item.get('currentAmount')}</Amount>
						</dd>
						{showChild && item.get("payTaxList").map((v,i)=>loop(v,level+1,key+1))}
					</div>
				)
			}else{
				const marginLeft = this.marginLeft(item.get('level'))
				return(
					<dd
						{...other}
						key={key}
						className={['sjb-line', ].join(' ')}
						style={{fontWeight: item.get("level")===1 || item.get("level")===2?`bold`:'',background:item.get("level")===1?'#FEF4E3':''}}
						>
						<span className="linename">
							<span className="linenametext" style={{marginLeft:`${marginLeft}px`}}>{item.get('lineName').replace(/、/g, '.').replace(/：/g, ':').replace(/（/g, '(').replace(/）/g, ')')}</span>
						</span>
						<Amount className="sumAmount" showZero="true">{item.get('yearAmount')}</Amount>
						<Amount className="amount" showZero="true">{item.get('currentAmount')}</Amount>
					</dd>
				)
			}
		}
		return loop(lr,0,1)
	}
}
