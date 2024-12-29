import React from 'react'
import { renderContent } from './log_handler'

const PageMask = (props) => {
    return <div>{renderContent(props.maskMessages)}</div>
}

export default PageMask
