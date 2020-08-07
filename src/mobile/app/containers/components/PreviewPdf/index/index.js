import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=PreviewPdf!./lazy'

const PreviewPdf = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default PreviewPdf
