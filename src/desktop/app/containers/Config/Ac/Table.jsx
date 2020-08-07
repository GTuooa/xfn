import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import AcItem from './AcItem.jsx'
import { TableWrap, TableBody, TableAll } from 'app/components'
import TableTitle from './TableTitle'

import * as configActions from 'app/redux/Config/Ac/acConfig.action.js'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const { dispatch, selectAcAll, aclist, acStatus, acChildShow, acConfigRowClick, upperidList, unitDecimalCount, configPermissionInfo, detailList } = this.props

		let lineNum = 0
		const titleList = ['操作', '编码', '名称', '类别', '余额方向', '辅助核算', '外币', '计算单位']

		return (
			<TableWrap notPosition={true}>
				<TableAll>
					{/* <TableTitle
						className="accongig-tabel-width"
						hasCheckbox={true}
						titleList={titleList}
						onClick={() => dispatch(configActions.selectAcAll())}
						selectAcAll={selectAcAll}
					/> */}
					<TableTitle
						unitDecimalCount={unitDecimalCount}
						dispatch={dispatch}
						selectAcAll={selectAcAll}
						onClick={() => dispatch(configActions.selectAcAll())}
						// configPermissionInfo={configPermissionInfo}
						detailList={detailList}
					/>
					<TableBody>
						{aclist.map((u, j) => {
							const isShow = u.get('acid').length === 4 || acChildShow.indexOf(u.get('acid').substr(0, 4)) > -1
							let line = isShow ? ++lineNum : 'hide'
							return (<AcItem key={u.get('acid')}
								isShow={isShow}
								line={line}
								upperidList={upperidList}
								checked={acStatus.get(j)}
								aclist={aclist}
								acitem={u}
								idx={j}
								className="accongig-tabel-width accongig-tabel-justify"
								dispatch={dispatch}
								acChildShow={acChildShow}
								acConfigRowClick={acConfigRowClick}
							/>)
						})}
					</TableBody>
				</TableAll>
			</TableWrap>
		)
	}
}
