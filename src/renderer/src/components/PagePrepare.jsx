import React, { useState, useEffect } from 'react'
import { renderContent } from './log_handler'
import { Box, TextField, Button } from '@mui/material'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import DataTable from './DataTable'

const PagePrepare = (props) => {
    const [JsonData, setJsonData] = useState('')

    // useEffect(() => {
    const handleJsonUpdate = (data) => {
        setJsonData(data.output) // Update the table data
    }
    window.api.onJson(handleJsonUpdate)
    // return () => {
    //     window.api.offJson(handleJsonUpdate)
    // }
    // }, [])

    useEffect(() => {
        api.run({
            command: 'star2json',
            json_file: '.to_node.json',
            star_file: props.starName
        })
    }, [])

    const handleFileSelect = async (property) => {
        try {
            const filePath = await api.selectFile(property)
            props.setStarName(filePath) // Update the state

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
                    value={props.starName}
                    fullWidth
                    disabled
                    sx={{ height: '56px' }} // Set the TextField's height to match the button
                />
            </Box>
            <DataTable jsonData={JsonData} star_name={props.starName} />
            {renderContent(props.prepareMessages)}
        </div>
    )
}

export default PagePrepare
