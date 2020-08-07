import React, { Fragment } from 'react'
import { fromJS } from 'immutable'
import { connect }	from 'react-redux'
export default
class Tabs extends React.Component {
    render() {
        const {
            tabs=[],
            value,
            onChange
        } = this.props
        return(
            <div
                className='xfn-tabs'

                >
                {tabs.map((v,index) =>
                    <span
                        key={index}
                        className={value === v.title?'active':''}
                        onClick={() => {
                            onChange(v,index)
                        }}

                        >
                        {v.title}
                    </span>
                )}
            </div>
        )
    }
}
