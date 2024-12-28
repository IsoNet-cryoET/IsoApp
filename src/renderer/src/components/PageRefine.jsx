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
                {/* <TextField
                    label="current star file"
                    value={props.star_name}
                    fullWidth
                    disabled
                    sx={{ height: '56px' }} // Set the TextField's height to match the button
                /> */}
            </Box>
            {/* <IconButton onClick={handleKillPython} sx={{ color: '#14446e' }}>
                <StopIcon />
                Kill process
            </IconButton> */}
            {renderContent(props.messages, 'refine')}
        </div>
    )
}
export default PageRefine
