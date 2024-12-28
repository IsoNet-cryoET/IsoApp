import React, { useState, useEffect } from 'react'
import DrawerPrepare from './components/DrawerPrepare'
import { List, ListItem, ListItemText, IconButton, ListItemButton } from '@mui/material'
import DrawerRefine from './components/DrawerRefine'
import EditIcon from '@mui/icons-material/Edit'
import AppsIcon from '@mui/icons-material/Apps'
import CameraIcon from '@mui/icons-material/Camera'

import PageRefine from './components/PageRefine'
import PagePrepare from './components/PagePrepare'
import PagePredict from './components/PagePredict'
import { mergeMsg, processMessage } from './utils/utils'

const App = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [drawerOpen2, setDrawerOpen2] = useState(false)
    const [prepareMessages, setPrepareMessages] = useState([])
    const [refineMessages, setRefineMessages] = useState([])
    const [star_name, setStarName] = useState('')
    // const [JsonData, setJsonData] = useState('')

    const handleSubmitApp = (data) => {
        try {
            setStarName(data.star_name)
            setPrepareMessages(() => [])
            api.run(data)
        } catch (error) {
            console.error('Error submitting form:', error)
        }
        setDrawerOpen(false)
    }

    const handleSubmitApp2 = (data) => {
        try {
            setRefineMessages(() => [])
            api.run(data)
        } catch (error) {
            console.error('Error submitting form:', error)
        }
        setDrawerOpen2(false)
    }

    useEffect(() => {
        window.api.onPythonStderr((data) => {
            let newMsg = processMessage(data)

            if (data.command === 'prepare_star') {
                setPrepareMessages((prevMessages) => mergeMsg(prevMessages, newMsg))
            } else if (data.command === 'refine') {
                setRefineMessages((prevMessages) => mergeMsg(prevMessages, newMsg))
            }
        })
        window.api.onPythonStdout((data) => {
            let newMsg = processMessage(data)

            if (data.command === 'prepare_star') {
                setPrepareMessages((prevMessages) => mergeMsg(prevMessages, newMsg))
            } else if (data.command === 'refine') {
                setRefineMessages((prevMessages) => mergeMsg(prevMessages, newMsg))
            }
        })
        // window.api.onJson((data) => {
        //     setJsonData(() => data.output)
        // })
    }, [])

    // selected menu index
    const [selectedPrimaryMenu, setSelectedPrimaryMenu] = useState(0)
    const [selectedSecondaryMenu, setSelectedSecondaryMenu] = useState(0)

    const Contents = [
        [PagePrepare, PageRefine, PagePredict],
        [null, null]
    ]
    const CurrentComponent = Contents[selectedPrimaryMenu][selectedSecondaryMenu]

    const handlePrimaryMenuClick = (index) => {
        setSelectedPrimaryMenu(index)
        setSelectedSecondaryMenu(0) // Reset secondary menu selection
    }

    const handleSecondaryMenuClick = (event, index) => {
        setSelectedSecondaryMenu(index)
    }

    const selectedStyle = {
        '&.Mui-selected': {
            backgroundColor: '#D5E2F4',
            borderRadius: '24px'
        }
    }
    return (
        <div className="outer-container">
            <div className="top-bar">IsoNet 2</div>
            <div className="main-content">
                <div className="primary-menu">
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => handlePrimaryMenuClick(0)}
                                selected={selectedPrimaryMenu === 0}
                                sx={selectedStyle}
                            >
                                <CameraIcon sx={{ color: '#14446e' }} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => handlePrimaryMenuClick(1)}
                                selected={selectedPrimaryMenu === 1}
                                sx={selectedStyle}
                            >
                                <AppsIcon sx={{ color: '#14446e' }} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </div>

                <div className="secondary-menu">
                    {selectedPrimaryMenu === 0 && (
                        <List>
                            <ListItem
                                disablePadding
                                sx={{
                                    '&:hover': { backgroundColor: '#eaebef' }
                                }}
                            >
                                <ListItemButton
                                    selected={selectedSecondaryMenu === 0}
                                    sx={selectedStyle}
                                    onClick={(event) => handleSecondaryMenuClick(event, 0)}
                                >
                                    <ListItemText primary="Prepare" />
                                    <IconButton
                                        onClick={() => setDrawerOpen(true)}
                                        sx={{
                                            backgroundColor: '#eaf1fb', // Set the background color
                                            '&:hover': {
                                                backgroundColor: '#e0e0e0' // Optional: Hover effect
                                            },
                                            borderRadius: '50%', // Optional: Keeps the background circular
                                            width: '40px', // Increase clickable area width
                                            height: '40px', // Increase clickable area height
                                            display: 'flex', // Center the icon within the button
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <EditIcon sx={{ color: '#14446e', fontSize: '24px' }} />{' '}
                                        {/* Keep the icon size fixed */}
                                    </IconButton>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    selected={selectedSecondaryMenu === 1}
                                    sx={selectedStyle}
                                    onClick={(event) => handleSecondaryMenuClick(event, 1)}
                                >
                                    <ListItemText primary="Refine" />
                                    <IconButton
                                        onClick={() => setDrawerOpen2(true)}
                                        sx={{
                                            backgroundColor: '#eaf1fb', // Set the background color
                                            '&:hover': {
                                                backgroundColor: '#e0e0e0' // Optional: Hover effect
                                            },
                                            borderRadius: '50%', // Optional: Keeps the background circular
                                            width: '40px', // Increase clickable area width
                                            height: '40px', // Increase clickable area height
                                            display: 'flex', // Center the icon within the button
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <EditIcon sx={{ color: '#14446e', fontSize: '24px' }} />{' '}
                                        {/* Keep the icon size fixed */}
                                    </IconButton>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    selected={selectedSecondaryMenu === 2}
                                    sx={selectedStyle}
                                    onClick={(event) => handleSecondaryMenuClick(event, 2)}
                                >
                                    <ListItemText primary="Step 3" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    )}
                    {selectedPrimaryMenu === 1 && (
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton
                                    selected={selectedSecondaryMenu === 0}
                                    sx={selectedStyle}
                                    onClick={(event) => handleSecondaryMenuClick(event, 0)}
                                >
                                    <ListItemText primary="Page 1" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    selected={selectedSecondaryMenu === 1}
                                    sx={selectedStyle}
                                    onClick={(event) => handleSecondaryMenuClick(event, 1)}
                                >
                                    <ListItemText primary="Page 2" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    )}
                </div>
                <div className="content-area">
                    {CurrentComponent !== null ? (
                        <CurrentComponent
                            star_name={star_name}
                            set_star_name={setStarName}
                            {...(CurrentComponent === PagePrepare
                                ? { prepareMessages, setPrepareMessages }
                                : {})}
                            {...(CurrentComponent === PageRefine ? { refineMessages } : {})} // Pass
                        />
                    ) : (
                        <div>content is not ready</div>
                    )}
                </div>

                <DrawerPrepare
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    onSubmit={handleSubmitApp}
                />
                <DrawerRefine
                    open={drawerOpen2}
                    onClose={() => setDrawerOpen2(false)}
                    onSubmit={handleSubmitApp2}
                />
            </div>
        </div>
    )
}

export default App
