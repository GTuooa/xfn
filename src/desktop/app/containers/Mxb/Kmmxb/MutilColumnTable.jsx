import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import JvItem from './JvItem.jsx'
import MutilColumnTitle from './MutilColumnTitle.jsx'
import MutilColumnItem from './MutilColumnItem.jsx'
import { TableBody, TableItem, TableTitle, TableAll, Amount, TablePagination ,TableScrollWrap ,TableScroll} from 'app/components'

@immutableRenderDecorator
export default
class MutilColumnTable extends React.Component {

    constructor() {
		super()
		this.state = {
			showMoreColumn: false,
		}
	}

    render(){
        const { dispatch, acinfo, mutilColumnData, paginationCallBack } = this.props
        const { showMoreColumn } = this.state

        const maxColumnCount = 10

        const mutilColumnAcList = mutilColumnData.get('acList')
        const allAmountList = mutilColumnData.get('allAmountList')
        const detailList = mutilColumnData.get('detailList')
        const currentPage = mutilColumnData.get('pageNum')
        const pageCount = mutilColumnData.get('pageCount')

        let title = []
        mutilColumnAcList.map(v => {
            title.push(v.get('acname'))
        })

        const obj ={'_': true}
		const mutilColumnIndexList = detailList.size ? (detailList.map(v => [v.get('vcDate'), v.get('vcindex')].join('_')).filter(w => obj[w] ? false : obj[w] = true)) : fromJS([])

        const acDirection = mutilColumnData.get('direction') === 'debit' ? '借' : '贷'

        let initIndex = 0

        return(
            <TableScrollWrap>
            <div className='mutil-column-table-scroll-contaner-wrap'>
            <div className='mutil-column-table-scroll-contaner'>
                <TableAll type={showMoreColumn ? 'mutil-column-table-spread' : "mutil-column-table"}  newTable='true'>
                    <div className="mxb-table-title">科目: {acinfo}</div>
                    <MutilColumnTitle
                        className="mxb-mutil-table-width"
                        dispatch={dispatch}
                        showMoreColumn={showMoreColumn}
                        title={title}
                        maxColumnCount={maxColumnCount}
                        changeShowMoreColumn={value => this.setState({showMoreColumn: value})}
        			/>
                    <TableBody>
                    {currentPage == 1 && detailList && detailList.size ?
                        showMoreColumn ?
                        <TableItem className="mxb-table-justify">
                            <li style={{minWidth: '76px',maxWidth: '76px',flex: '76'}}></li>
                            <li style={{minWidth: '80px',maxWidth: '80px',flex: '80'}}></li>
                            <li style={{minWidth: `${782-70*title.length}px`,maxWidth:`${1422-110*title.length}px`,flex:`${1422-110*title.length}`}}>期初余额</li>
                            {
                                detailList.getIn([0, 'amountList']).map((v, i) => {
                                    return (
                                        <li key={i+1} style={{minWidth: '70px',maxWidth: '110px',flex: '110'}}>
                                            <Amount className='mutil-column-amount'>{v}</Amount>
                                        </li>
                                    )
                                })
                            }
                            <li style={{minWidth: '32px',maxWidth: '32px',flex: '32'}}>{acDirection}</li>
                            <li style={{minWidth: '110px',maxWidth: '110px',flex: '110'}}><Amount className='mutil-column-amount'>{detailList.getIn([0, 'balanceAmount'])}</Amount></li>
                        </TableItem>
                        :
                        title.length > maxColumnCount ?
                            <TableItem className="mxb-table-justify">
                                <li style={{minWidth: '76px',maxWidth: '76px',flex: '76'}}></li>
                                <li style={{minWidth: '80px',maxWidth: '80px',flex: '80'}}></li>
                                <li style={{minWidth: `${782-70*maxColumnCount}px`,maxWidth:`${1422-110*maxColumnCount}px`,flex:`${1422-110*maxColumnCount}`}}>期初余额</li>
                                {
                                    detailList.getIn([0, 'amountList']).slice(0, maxColumnCount-1).map((v, i) => {
                                        return (
                                            <li key={i+1} style={{minWidth: '70px',maxWidth: '110px',flex: '110'}}>
                                                <Amount className='mutil-column-amount'>{v}</Amount>
                                            </li>
                                        )
                                    })
                                }
                                <li style={{minWidth: '70px',maxWidth: '110px',flex: '110'}}><Amount className='mutil-column-amount'>{detailList.getIn([0, 'otherAmount'])}</Amount></li>
                                <li style={{minWidth: '32px',maxWidth: '32px',flex: '32'}}>{acDirection}</li>
                                <li style={{minWidth: '110px',maxWidth: '110px',flex: '110'}}><Amount className='mutil-column-amount'>{detailList.getIn([0, 'balanceAmount'])}</Amount></li>
                            </TableItem>:
                            <TableItem className="mxb-table-justify">
                                <li style={{minWidth: '76px',maxWidth: '76px',flex: '76'}}></li>
                                <li style={{minWidth: '80px',maxWidth: '80px',flex: '80'}}></li>
                                <li style={{minWidth: `${782-70*title.length}px`,maxWidth:`${1422-110*title.length}px`,flex:`${1422-110*title.length}`}}>期初余额</li>
                                {
                                    detailList.getIn([0, 'amountList']).map((v, i) => {
                                        return (
                                            <li key={i+1} style={{minWidth: '70px',maxWidth: '110px',flex: '110'}}>
                                                <Amount className='mutil-column-amount'>{v}</Amount>
                                            </li>
                                        )
                                    })
                                }
                                <li style={{minWidth: '32px',maxWidth: '32px',flex: '32'}}>{acDirection}</li>
                                <li style={{minWidth: '110px',maxWidth: '110px',flex: '110'}}><Amount className='mutil-column-amount'>{detailList.getIn([0, 'balanceAmount'])}</Amount></li>
                        </TableItem>
                    : null}
                    {detailList && detailList.map((data,index) => {
                        if (index === 0 && data.get('jvAbstract') === '期初余额') {
                            initIndex = - 1
                            return null
                        } else {
                            return (
                                <MutilColumnItem
                                    data={data}
                                    item={data}
                                    dispatch={dispatch}
                                    acDirection={acDirection}
                                    showMoreColumn={showMoreColumn}
                                    maxColumnCount={maxColumnCount}
                                    mutilColumnIndexList={mutilColumnIndexList}
                                    className="mxb-table-justify"
                                    title={title}
                                    index={index+1+initIndex}
									totalSize={detailList ? detailList.size + initIndex : 0}
                                />
                            )
                        }
                    })}
                    {showMoreColumn ?
                        <TableItem className="mxb-table-justify">
                            <li style={{minWidth: '76px',maxWidth: '76px',flex: '76'}}></li>
                            <li style={{minWidth: '80px',maxWidth: '80px',flex: '80'}}></li>
                            <li style={{minWidth: `${782-70*title.length}px`,maxWidth:`${1422-110*title.length}px`,flex:`${1422-110*title.length}`}}>合计</li>
                            {allAmountList && allAmountList.map((v, i) => {
                                return(
                                    <li key={i+1} style={{minWidth: '70px',maxWidth: '110px',flex: '110'}}><Amount className='mutil-column-amount'>{v}</Amount></li>
                                )
                            })}
                            <li style={{minWidth: '32px',maxWidth: '32px',flex: '32'}}>{acDirection}</li>
                            <li style={{minWidth: '110px',maxWidth: '110px',flex: '110'}}><Amount className='mutil-column-amount'>{mutilColumnData.get('allBalanceAmount')}</Amount></li>
                        </TableItem>
                        :
                        title.length > maxColumnCount ?
                        <TableItem className="mxb-table-justify">
                            <li style={{minWidth: '76px',maxWidth: '76px',flex: '76'}}></li>
                            <li style={{minWidth: '80px',maxWidth: '80px',flex: '80'}}></li>
                            <li style={{minWidth: `${782-70*maxColumnCount}px`,maxWidth:`${1422-110*maxColumnCount}px`,flex:`${1422-110*maxColumnCount}`}}>合计</li>
                            {allAmountList && allAmountList.slice(0,maxColumnCount-1).map((v, i) =>{

                                return(
                                    <li key={i+1} style={{minWidth: '70px',maxWidth: '110px',flex: '110'}}>
                                        <Amount className='mutil-column-amount'>{v}</Amount>
                                    </li>
                                )
                            })}
                            <li style={{minWidth: '70px',maxWidth: '110px',flex: '110'}}><Amount  className='mutil-column-amount'>{mutilColumnData.get('allOtherAmount')}</Amount></li>
                            <li style={{minWidth: '32px',maxWidth: '32px',flex: '32'}}>{acDirection}</li>
                            <li style={{minWidth: '110px',maxWidth: '110px',flex: '110'}}><Amount className='mutil-column-amount'>{mutilColumnData.get('allBalanceAmount')}</Amount></li>
                        </TableItem>:
                        <TableItem className="mxb-table-justify">
                            <li style={{minWidth: '76px',maxWidth: '76px',flex: '76'}}></li>
                            <li style={{minWidth: '80px',maxWidth: '80px',flex: '80'}}></li>
                            <li style={{minWidth: `${782-70*title.length}px`,maxWidth:`${1422-110*title.length}px`,flex:`${1422-110*title.length}`}}>合计</li>
                            {allAmountList && allAmountList.map((v, i) => {
                                return(
                                    <li key={i+1} style={{minWidth: '70px',maxWidth: '110px',flex: '110'}}>
                                        <Amount className='mutil-column-amount'>{v}</Amount>
                                    </li>
                                )
                            })}
                            <li style={{minWidth: '32px',maxWidth: '32px',flex: '32'}}>{acDirection}</li>
                            <li style={{minWidth: '110px',maxWidth: '110px',flex: '110'}}><Amount className='mutil-column-amount'>{mutilColumnData.get('allBalanceAmount')}</Amount></li>
                        </TableItem>
                    }
                    </TableBody>
                    <TablePagination
                        currentPage={currentPage}
                        pageCount={pageCount}
                        paginationCallBack={(value) => paginationCallBack(value)}
                    />
                </TableAll>
                </div>
                </div>
            </TableScrollWrap>
        )
    }
}
