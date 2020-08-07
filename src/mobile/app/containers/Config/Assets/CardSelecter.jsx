import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Map, toJS } from 'immutable'
import { Row, Icon } from 'app/components'
import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'
import './Assets.less'


@immutableRenderDecorator
export default
class CardSelecter extends React.Component {

    render() {
        const { dispatch, cardDetailList, cardNumber, serialNumber, style, history } = this.props

        const idx = serialNumber ? serialNumber.substr(0,1) : '1'
        const indexlist = cardDetailList.get(idx)


        const fullCardNumber = `${serialNumber}${cardNumber}`
        const curIndex = indexlist.findIndex(v => v === fullCardNumber)
        const preIndex = indexlist.get(curIndex - 1)
        const nextIndex = indexlist.get(curIndex + 1)

        return (
            <Row className="card-selecter" style={style}>
                <Icon
                    className="selecter-left"
                    type="arrow-right"
                    style={{visibility: curIndex === 0 ? 'hidden' : 'visible',color: '#777'}}
                    onClick={() => dispatch(assetsActions.getAssetsCardFetch(preIndex.substr(3,4), preIndex.substr(0, 3), history))}
                ></Icon>
                <div className="card-selecter-body">
                    <span className="">{`卡片编码_${cardNumber}`}</span>
                </div>
                <Icon
                    className="selecter-right"
                    type="arrow-right"
                    style={{visibility: nextIndex ? 'visible' : 'hidden',color: '#777'}}
                    onClick={() => dispatch(assetsActions.getAssetsCardFetch(nextIndex.substr(3,4), nextIndex.substr(0, 3), history))}
                ></Icon>
            </Row>
        )
    }
}
