import React from 'react'
import ScreenFile from '../assets/file-blank-solid-240.png';
import edit_file from '../assets/edit.png';
import detail_file from '../assets/Documents.png';
import download_file from '../assets/download.png';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { variables } from '../utils/variables';
import { useClipboard } from 'use-clipboard-copy';



function Card({ props }) {

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const clipboard = useClipboard({
        copiedTimeout: 3200, // tipe duration in milsec
    });

    // Split the string name of file
    let newNameFile = props.file_name.slice(0, 10)
    if (newNameFile.length < props.file_name.length) {
        newNameFile += '...';
    }
    // usin type BLOB generate link for download 
    const forceDownload = (response, fileName) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
    }
    // function download file to disk
    async function downloadFileAtURL(file_id, fileName) {
        await axios.get(
            `${variables.API_URL}files/download/${file_id}`,
            {
                responseType: 'blob',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                }
            },
        ).then((data) => {
            forceDownload(data, fileName)
        }).catch((err) => console.log(err))
    }


    return (
        <div>
            {/* <!--Card --> */}
            <div className='w-40 p-2 bg-white rounded-xl transform transition-all 
            hover:-translate-y-1 duration-300 shadow-lg
            hover:shadow-2xl'>
                <div className='static flex justify-start items-center'>
                    {
                        variables.format_files.includes(props.file_type) ?
                            (
                                // eslint-disable-next-line jsx-a11y/alt-text
                                <img className="h-20 w-20 object-cover object-center rounded-xl"
                                    src={`${variables.STATIC_URL}${props.file_file}`} />
                            ) : (
                                // eslint-disable-next-line jsx-a11y/alt-text
                                <img className="h-20 w-20 object-cover object-center rounded-xl"
                                    src={`${ScreenFile}`} />
                            )}
                    <div className="p-2 absolute top-0 right-0 
                        font-medium rounded-tr-xl bg-[#686868] text-white text-center">
                        {props.file_type}
                    </div>
                </div>
                <div className='p-2'>
                    <h2 className='text-xs text-left font-normal'>{newNameFile}</h2>
                </div>
                {/* <!--Button edit of file --> */}
                <div className='flex justify-center items-center gap-2'>
                    <Tippy content={<span>Edit file</span>}>
                        <Link to={'/update/' + props.id}>
                            <img className='h-10 w-10 rounded-xl' src={edit_file} alt='delet file' />
                        </Link>
                    </Tippy>
                    {/* <!--Button detail of file --> */}
                    <Tippy content={<span>Detail file</span>}>
                        <Link to={'/detail/' + props.id}>
                            <img className='h-10 w-10 rounded-xl' src={detail_file} alt='delet file' />
                        </Link>
                    </Tippy>
                    {/* <!--Button download file --> */}
                    <Tippy content={<span>Download file</span>}>
                        <button onClick={() => {
                            downloadFileAtURL(
                                `${props.id}`,
                                `${props.file_name}.${props.file_type}`)
                        }}>
                            <img className='h-10 w-10 rounded-xl'
                                src={download_file}
                                alt='download file' />
                        </button>
                    </Tippy>
                </div>
                {/* <!--Button copy link for share --> */}
                <div className='text-center text-base mt-2 '>
                    <input ref={clipboard.target}
                        value={`${variables.API_URL_FRONT}files/download/${props.id_uuid}`}
                        type="hidden" readOnly />
                    <button className=" pl-3 pr-3 bg-[#686868] text-white rounded-sm"
                        onClick={clipboard.copy}>
                        {clipboard.copied ? 'Link Copied' : 'Copy Link'}
                    </button>
                </div>
            </div>
        </div >
    )
}

export default Card
