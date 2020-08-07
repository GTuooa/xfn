import React from 'react'
import { toJS, fromJS } from 'immutable'
import { Popover } from 'antd-mobile'
import { Icon } from 'app/components'

export default
class SwapPosition extends React.Component {
    constructor(props) {
		super(props)
		this.state = {
            visible: false,
        }
    }

    render() {

        const {
			dispatch,
            overlay,
            item,
            data,
            swapPosition,
            i,
            sortClick,
            iconClick//点击排序按钮
		} = this.props

        const { visible } = this.state
        return(
            <div onClick={() => { iconClick(true) }}>
                <Popover
                    visible={visible}
                    overlay={overlay}
                    align={{
                      overflow: { adjustY: 0, adjustX: 0 },
                      offset: [10, 0],
                    }}
                    placement={'bottomLeft'}
                    onSelect={(e) => {
                        switch (e.props.value) {
                            case 'up':
                                sortClick(item.get('uuid'), data.getIn([i - 1, 'uuid']))
                                break
                            case 'down':
                                sortClick(item.get('uuid'), data.getIn([i + 1, 'uuid']))
                                break
                            default:
                                console.log(e.props.value)
                        }
                        this.setState({ visible: false})
                        iconClick(false)
                    }}
                  >
                    <Icon
                        type="swap-position"
                        style={{display:swapPosition ? 'block' : 'none'}}
                        className='swap-position-icon'
                    />
                 </Popover>
            </div>
        )
    }
}
