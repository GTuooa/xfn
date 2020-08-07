import React from 'react'
import { Icon }  from 'app/components'
import { InputItem } from 'antd-mobile'

export default
class SearchApproval extends React.Component {
    state={
        filterContent:''
    }
    componentDidMount() {
        const input = document.getElementsByClassName('search-input-dom')[0]
        input.addEventListener('keypress',e => {
            if (e.key === 'Enter') {
                e.target.blur()
                const filterContent  = this.props.value ? this.props.value : this.state.filterContent
                this.props.onSubmit(filterContent)
            }
        })
    }
    render() {
        const {
            value,
            onSubmit,
            placeholder,
            needCancel,
            onFocus,
            onBlur,
            onChange,
            history
        } = this.props
        const filterContent  = value ? this.props.value : this.state.filterContent
        return(
            <div className='approval-search'>
                <form action="javascript:;" >
                    <InputItem
                        type='search'
                        className='search-input-dom'
                        value={filterContent}
                        onChange={value => {
                            onChange && onChange(value)
                            this.setState({filterContent:value})
                        }}
                        placeholder={placeholder}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        ref='input'

                    />
                </form>
            <Icon type='search' className='search-icon'/>
            {
                filterContent?
                <Icon
                    type='preview'
                    className='close-icon'
                    style={needCancel?{right:'0.6rem'}:{}}
                    onClick={() => {
                        this.setState({filterContent:''})
                        onSubmit('')
                        onChange && onChange('')
                        this.refs.input.focus()
                    }}
                />:''
            }
            {
                needCancel?
                <span className='close-span' onClick={() => {
                    history.goBack()
                    this.setState({filterContent:''})
                    // onSubmit('')
                    onChange && onChange('')
                }}>取消</span>
                :''
            }
            </div>
        )
    }
}
