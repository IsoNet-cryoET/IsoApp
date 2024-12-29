import React from 'react'
import { renderContent } from './log_handler'
import { IconButton, Box, Button } from '@mui/material'
import StopIcon from '@mui/icons-material/Stop'
import CancelIcon from '@mui/icons-material/Cancel'

const PageRefine = (props) => {
    const handleKillPython = () => {
        console.log('kill here')
        window.api.killPython()
    }
    return (
        <div>
            <Box display="flex" alignItems="center" gap={2} marginY={2}>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<CancelIcon />}
                    onClick={() => handleKillPython()}
                    sx={{ height: '56px' }} // Ensure the button has a height
                >
                    Kill this process
                </Button>
            </Box>
            {renderContent(props.refineMessages)}
        </div>
    )
}
export default PageRefine
