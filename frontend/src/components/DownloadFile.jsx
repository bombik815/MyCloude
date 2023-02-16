import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { variables } from './../utils/variables';
import axios from 'axios';

const dict_type = {
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.dot': 'application/msword',
    '.dotx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    '.docm': 'application/vnd.ms-word.document.macroEnabled.12',
    '.dotm': 'application/vnd.ms-word.template.macroEnabled.12',
    '.xls': 'application/vnd.ms-excel', '.xla': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xltx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    '.xlsm': 'application/vnd.ms-excel.sheet.macroEnabled.12',
    '.xltm': 'application/vnd.ms-excel.template.macroEnabled.12',
    '.xlam': 'application/vnd.ms-excel.addin.macroEnabled.12',
    '.xlsb': 'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pot': 'application/vnd.ms-powerpoint', '.pps': 'application/vnd.ms-powerpoint',
    '.ppa': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.potx': 'application/vnd.openxmlformats-officedocument.presentationml.template',
    '.ppsx': 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
    '.ppam': 'application/vnd.ms-powerpoint.addin.macroEnabled.12',
    '.pptm': 'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
    '.potm': 'application/vnd.ms-powerpoint.template.macroEnabled.12',
    '.ppsm': 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
    '.mdb': 'application/vnd.ms-access', '.pdf': 'application/pdf',
    '.jpeg ': 'mage/jpeg', '.jpg ': 'mage/jpg', '.png': 'mage/png', '.json': 'application/json',
    '.csv': 'text/csv', '.css': 'text/css', '.txt': 'text/plain', '.svg': 'mage/svg+xml',
    '.tiff': 'text/csv', '.tif': 'text/csv',
}

function DownloadFile() {
    const [download, setDownlod] = useState(false);
    const params = useParams();
    const id = params.id
    let file_type = ""

    // usin type BLOB generate link for download 
    const forceDownload = (response, file_id) => {

        // search item (content-type) in dictionary 
        const fileType = response.data.type
        Object.entries(dict_type).forEach((key) => {
            if (fileType === key[1]) {
                file_type = key[0]
            }
        })
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${file_id}${file_type}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
        setDownlod(true);

    }
    // function download file to disk
    async function downloadFileAtURL(file_id) {
        await axios.get(
            `${variables.API_URL}files/download/${file_id}`,
            {
                responseType: 'blob',
                headers: {
                    'Content-type': 'application/json',
                }
            },
        ).then((data) => {
            forceDownload(data, file_id)
        }).catch((err) => console.log(err))
    }

    if (download) {
        console.log(" File has been downloaded successfully")
    } else {
        downloadFileAtURL(id)
    }

    return (
        <>
            {download ? (
                <div className='flex justify-center text-center'><h2> File has been downloaded successfully</h2></div>
            ) : ('...')

            }
        </>
    )
}

export default DownloadFile
