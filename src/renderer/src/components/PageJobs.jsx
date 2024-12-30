import React, { useState, useEffect } from 'react'

const PageJobs = () => {
    const [jobList, setJobList] = useState({ inQueueList: [], notInQueueList: [] })

    const fetchJobLists = async () => {
        let data = await api.onFetchJobs()
        console.log('jobs', data)
        setJobList(data)
    }

    useEffect(() => {
        fetchJobLists()
    }, [])

    // useEffect(() => {
    //     console.log('jobList state updated:', jobList)
    // }, [jobList])

    return (
        <div>
            <div>
                <h4>jobs in queue</h4>
                <ul>
                    {(jobList.inQueueList || []).length > 0 ? (
                        jobList.inQueueList.map((item, index) => (
                            <li key={index}>
                                {item.status}: {item.result}
                            </li>
                        ))
                    ) : (
                        <li>No jobs</li>
                    )}
                </ul>
            </div>

            <div>
                <h4>Jobs running but not in queue</h4>
                <ul>
                    {(jobList.notInQueueList || []).length > 0 ? (
                        jobList.notInQueueList.map((item, index) => (
                            <li key={index}>
                                {item.cmd}: {item.result}
                            </li>
                        ))
                    ) : (
                        <li>No jobs</li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default PageJobs
