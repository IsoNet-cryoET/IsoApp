import React from 'react'
import { renderContent } from './log_handler'

const PagePredict = (props) => {
    return <div>{renderContent(props.predictMessages)}</div>
}

export default PagePredict
