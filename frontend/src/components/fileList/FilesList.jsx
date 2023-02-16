import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getListFiles } from '../../actions/filesActions';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Card from '../Card';
import Loader from '../Loader'
import Message from '../Message'
import styled from "styled-components";
import add_plus from '../../assets/add_file.png';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Modal from '../modal/Modal';
import AddFile from '../AddFile';
import './fileList.css'


const FilesList = () => {

    // Modal windows
    const [openModal, setOpenModal] = useState(false)
    //Pagination 
    const [paginate, setPaginate] = useState(6);
    const [search, setSearch] = useState('');

    const history = useNavigate();

    // GET data files from store
    const dispatch = useDispatch()

    const fileList = useSelector(state => state.fileLists)
    const { files, loading, error } = fileList

    const userLogin = useSelector(state => state.userLogin)
    const { loading: userLoading, userInfo } = userLogin

    // on page load
    useEffect(() => {
        if (userInfo) {
            dispatch(getListFiles());
        } else {
            history('/login')
        }
    }, [dispatch, history, userInfo])

    // funtion filter data
    function searchDef(files) {
        return files.filter(
            (file) =>
                search.toLowerCase() === ''
                    ? file
                    : file.file_name.toLowerCase().includes(search) ||
                    file.file_type.toLowerCase().includes(search)
        );
    }
    // button load more data on page
    const load_more = (event) => {
        setPaginate((prevValue) => prevValue + 6)
    }


    return (
        <>
            <Container className='container xs={12} md={6} lg={4} xl={3} mt-4'>
                <h2 className='my-6 text-center'>List of files</h2>
                <div className='main-box'>
                    <div className='main-box-info'>
                        <div className='p-2   font-medium text-base shadow-md'>Toatal size:&nbsp;
                            {files.reduce((totalSize, file) =>
                                totalSize + Math.round(Number(file.size_file, 10) / 1024), 0)
                            } Kb
                        </div>
                        <div className='p-2 text-center font-medium text-base shadow-md'>Quantity files:&nbsp;
                            {files.length}
                        </div>
                    </div>

                    <Form className='form-box' >
                        <Form.Control
                            type='search'
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Search files...'
                            className='h-17 bg-slate-200 rounded-sm ' />
                    </Form>
                    <Tippy content={<span>Add new file</span>}>
                        <button className="mx-2 text-white rounded-sm"
                            onClick={() => setOpenModal(true)}>
                            <img className='h-10 w-10 rounded-xl' src={add_plus} alt='add' />
                        </button>
                    </Tippy>

                </div>

                {userLoading && loading
                    ? (<Loader />)
                    : error
                        ? (<Message variant='danger'>{error}</Message>)
                        : files?.length ? (
                            <div className=" container xs={12} md={6} lg={4} xl={3} mt-3">
                                <div className="CardGrid gap-4" >
                                    {
                                        searchDef(files)
                                            .slice(0, paginate)
                                            .map((file) => (
                                                <div key={file.id}>
                                                    <Card props={file} />
                                                </div>
                                            ))
                                    }
                                </div>
                                {files?.length > 6 &&
                                    <div className='box-btn'>
                                        <Button type='submit'
                                            variant='primary'
                                            className='bg-zinc-500 rounded-sm transform transition-all 
                                            hover:-translate-y-1 duration-300 shadow-lg
                                            hover:shadow-2xl'
                                            onClick={load_more}>Load More</Button>
                                    </div>
                                }
                            </div>
                        ) : (
                            <div className='textNotification'>
                                <h3 className='my-3  text-center'>No files uploaded yet.</h3>
                            </div>
                        )
                }
            </Container>
            <div>
                <Modal open={openModal} onClose={() => setOpenModal(false)}>
                    <AddFile />
                </Modal>
            </div>
        </>
    )
}
export default FilesList
