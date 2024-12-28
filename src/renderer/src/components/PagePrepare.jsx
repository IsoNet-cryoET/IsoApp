import React, { useState, useEffect } from 'react'
import { renderContent } from './log_handler'
import { Box, TextField, Button } from '@mui/material'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import DataTable from './DataTable'

const PagePrepare = (props) => {
    const [JsonData, setJsonData] = useState('')

    useEffect(() => {
        const handleJsonUpdate = (data) => {
            console.log('PageA', 'api.onjson', data)
            setJsonData(data.output) // Update the table data
        }
        window.api.onJson(handleJsonUpdate)
        // return () => {
        //     window.api.offJson(handleJsonUpdate)
        // }
    }, [])

    const handleFileSelect = async (property) => {
        try {
            const filePath = await api.selectFile(property)
            props.set_star_name(filePath) // Update the state

            props.setPrepareMessages(() => [])
            await api.run({
                command: 'star2json',
                json_file: '.to_node.json',
                star_file: filePath
            })
        } catch (error) {
            console.error('Error selecting file:', error)
        }
    }

    return (
        <div>
            <Box display="flex" alignItems="center" gap={2} marginY={2}>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<FolderOpenIcon />}
                    onClick={() => handleFileSelect('openFile')}
                    sx={{ height: '56px' }} // Ensure the button has a height
                >
                    Load from star
                </Button>
                <TextField
                    label="current star file"
                    value={props.star_name}
                    fullWidth
                    disabled
                    sx={{ height: '56px' }} // Set the TextField's height to match the button
                />
            </Box>
            <DataTable jsonData={JsonData} star_name={props.star_name} />
            {renderContent(props.prepareMessages, 'prepare_star', props.star_name)}
        </div>
    )
}

export default PagePrepare
