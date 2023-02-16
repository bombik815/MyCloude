import React, { useRef, useState } from 'react';
import { Form, Button, InputGroup, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addFileList } from '../actions/filesActions';
import { ImUpload } from 'react-icons/im';
import { getListFiles } from './../actions/filesActions';
import { toast } from 'react-toastify';

const AddFile = () => {

    //drag and drop
    const wrapperRef = useRef(null);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');
    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    //dispatch
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // hold state data given by user
    const [file_file, setFile] = useState(null)
    const [file_name, setFileName] = useState('')
    const [description, setDescription] = useState('')
    const [size_file, setSizeFile] = useState('')
    const [create_at, setCreate] = useState('')
    const [typeOfFile, settypeOfFile] = useState('')

    const nameRef = useRef('');

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    // to clear all data
    const clearData = () => {
        setFile(null);
        setDescription("");
        setSizeFile('');
        setCreate("");
        setFileName("");
        settypeOfFile("");
    }

    const fileSubmitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        let file_type = String(file_file.name.split('.')[1])
        let file_name = String(file_file.name.split('.')[0])
        formData.append('file_file', file_file, file_file.name)
        formData.append('file_name', file_name)
        formData.append('description', description)
        formData.append('size_file', size_file)
        formData.append('create_at', create_at)
        formData.append('user_id', userInfo.id)
        formData.append('file_type', file_type)

        dispatch(addFileList(formData))

        toast.success('The File was added successfully')
        clearData();
        navigate('/files');
        dispatch(getListFiles())

    }
    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        setSizeFile(nameRef.current.files[0].size)
        let nameOfFile = newFile.name
        let typeOfFile = String(newFile.name.split('.')[1])

        if (newFile) {
            setFile(newFile)
            setFileName(nameOfFile)
            settypeOfFile(typeOfFile)
            console.log(nameRef.current.files[0])
        }
        setCreate(new Date().toISOString())
    }

    return (
        <Container>
            <h2 className="my-6 text-center">Add File</h2>
            <div className='flex justify-center align-middle'>
                <Form className='p-3 bg-white rounded-xl transform transition-all duration-300 shadow-lg'
                    onSubmit={fileSubmitHandler}>
                    <div className='flex gap-4'>
                        <div ref={wrapperRef}
                            className="flex justify-center items-center drop-file-input"
                            onDragEnter={onDragEnter}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}>
                            <div className="grid grid-row-3 gap-4 justify-items-center  drop-file-input__label">
                                <ImUpload size='50px' />
                                <p>Drag & Drop your files here</p>
                            </div>
                            <input
                                ref={nameRef}
                                type="file"
                                defaultValue={file_file}
                                required
                                onChange={onFileDrop} />
                        </div>
                        <div className="grid justify-center items-center">
                            <Form.Control className='rounded-xl text-sm text-slate-900 font-bold text-center'
                                type="text"
                                placeholder="name of file"
                                defaultValue={file_name}
                                readOnly={true}
                            />

                            <InputGroup className="rounded-xl ">
                                <Form.Control className='rounded-xl  text-slate-900 font-bold text-center'
                                    placeholder="size"
                                    type="text"
                                    defaultValue={size_file}
                                    readOnly={true}
                                />
                                <InputGroup.Text className='rounded-xl'>byte</InputGroup.Text>
                            </InputGroup>
                            <InputGroup>
                                <Form.Control className='rounded-xl  text-slate-900 font-bold text-center'
                                    type="text"
                                    placeholder="create data"
                                    defaultValue={create_at}
                                    readOnly={true}
                                />
                            </InputGroup>
                        </div>
                    </div>
                    <Form.Group>
                        <Form.Control as='textarea' row={3}
                            className="my-3 rounded-xl"
                            type="text"
                            required
                            placeholder="Enter Description"
                            defaultValue={description}
                            onChange={(e) =>
                                setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <div className="my-3 flex justify-end items-center">
                        <Button className="text-white bg-gray-600 px-3 py-1 rounded-xl 
                        text-decoration-none hover:bg-gray-700 " size='xl' type='submit'>Submit</Button>
                    </div>
                </Form>
            </div>
        </Container>
    )
}

export default AddFile;
