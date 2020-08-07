import React, { PropTypes } from 'react'
import { fromJS, toJS } from 'immutable'
import { connect }	from 'react-redux'
import { SegmentedControl, WingBlank } from 'antd-mobile'
import { cxAccountActions } from 'app/redux/Search/Cxls'
import * as thirdParty from 'app/thirdParty'

export default
class ScrollLoad extends React.Component {
    state = {
        isLoading: false
    }
    componentDidMount() {
        const scroller = document.getElementsByClassName('scroll-item')[0]
        scroller.addEventListener('touchmove',this.touchstart, false)
        scroller.addEventListener('scroll',this.touchstart, false)


    }
    touchstart = (e) => {
        const { isLoading } = this.state
        const { diff, callback, isGetAll } = this.props
        const scroller = document.getElementsByClassName('scroll-item')[0]
        const content = document.getElementsByClassName('flow-content')[0]
        const scrollerHeight = Number(window.getComputedStyle(scroller).height.replace('px',''))
        const contentHeight = Number(window.getComputedStyle(content).height.replace('px',''))
        const bottomDistance = contentHeight - scrollerHeight
        const scrollY = scroller.scrollTop

        if ((scrollY > bottomDistance - 25 - diff) && !isLoading &&  contentHeight > scrollerHeight && !isGetAll) {
            callback(this)
            this.setState({
                isLoading: true
            })
        }
    }
    render() {
        let title = ''
        const { isGetAll, itemSize } = this.props
        if (!isGetAll) {
            title = '加载中...'
        } else {
            title = '已加载全部'
        }
        return (
            <div className='loading'>{itemSize?title:''}</div>
        )
    }
}
