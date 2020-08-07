import React from 'react'
import { fromJS, toJS } from 'immutable'

export default
class ScrollLoad extends React.Component {
    state = {
        isLoading: false//是否是正在加载中
    }
    componentDidMount() {
        const scroller = document.getElementsByClassName('scroll-view')[0]
        scroller.addEventListener('touchmove',this.touchstart, false)
        scroller.addEventListener('scroll',this.touchstart, false)
    }
    touchstart = (e) => {
        const { isLoading } = this.state
        const { callback, isGetAll, classContent } = this.props
        const diff = this.props.diff || 100
        const scroller = document.getElementsByClassName('scroll-view')[0]
        const content = document.getElementsByClassName(classContent)[0]
        if (scroller && window.getComputedStyle(scroller) && content && window.getComputedStyle(content)) {
            const scrollerHeight = Number(window.getComputedStyle(scroller).height.replace('px',''))
            const contentHeight = Number(window.getComputedStyle(content).height.replace('px',''))
            const bottomDistance = contentHeight - scrollerHeight
            const scrollY = scroller.scrollTop
            if ((scrollY > bottomDistance - 25 - diff) && !isLoading &&  contentHeight > scrollerHeight && !isGetAll) {//符合下拉加载的条件
                callback(this)
                this.setState({
                    isLoading: true
                })
            }
        }

    }

    render() {
        const { isGetAll, itemSize } = this.props

        let title = ''
        if (!isGetAll) {
            title = '加载中...'
        } else {
            title = '已加载全部'
        }
        return (
            <div style={{textAlign: 'center', color: '#ccc', fontSize: '.12rem'}}>{itemSize ? title : ''}</div>
        )
    }
}
