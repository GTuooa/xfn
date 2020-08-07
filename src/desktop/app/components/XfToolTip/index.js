import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'
import './style.less'

@immutableRenderDecorator
export default
class XfTooltip extends React.Component {
    state={
        elementX:0,
        elementY:0,
    }
    getElementLeft = (element) => {
        var actualLeft = element.offsetLeft;
        var current = element.offsetParent;

        while (current !== null){
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actualLeft
    }
    getElementTop = (element) => {
        var actualTop = element.offsetTop - (element.scrollTop || 0);
        var current = element.offsetParent;

        while (current !== null){
            actualTop += current.offsetTop - (current.scrollTop || 0);
            current = current.offsetParent;
        }
        return actualTop
    }
    calculatePos = () => {
        const element = this.div
        const left = this.getElementLeft(element)
        const top = this.getElementTop(element)
        const width = element.clientWidth
        const height = element.clientHeight
        const elementX = left + width + 5
        const elementY = top
        element.className = 'xf-tooltip xf-tooltip-open'
        this.setState({
            elementX,
            elementY,
        })
    }
    elemetHidden = () => {
        const element = this.div
        element.className = 'xf-tooltip'
    }
    componentDidMount() {
        const element = this.div
        element.addEventListener('mouseover',this.calculatePos)
        element.addEventListener('mouseout',this.elemetHidden)

    }
    componentWillUnmount() {
        const element = this.div
        element.removeEventListener('mouseover',this.calculatePos)
        element.addEventListener('mouseout',this.elemetHidden)
    }
    render() {
        const { title } = this.props
        const {
            elementX,
            elementY,
        } = this.state
        return(
            <div ref={node => this.div = node} className='xf-tooltip'>
                {
                    title?
                    <div
                        ref={node => this.tip = node}
                        style={{
                            left:elementX+'px',
                            top:elementY+'px',
                        }}
                        className='xf-tooltip-title'
                        >
                            {title}

                    </div>:''
                }

                {
                    this.props.children
                }
            </div>
        )
    }
}
