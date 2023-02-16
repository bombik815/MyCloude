import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import FormContainer from '../../components/FormContainer';
import { listUsers, deleteUser } from '../../actions/userActions';
import { VscFiles } from "react-icons/vsc"
import Modal from '../../components/modal/Modal';
import PersonalFiles from '../../components/table/PersonalFiles';
import { variables } from '../../utils/variables';
import axios from '../../utils/axios';
import './usersList.css'

function UserListScreen() {

    // Modal windows
    const [openModal, setOpenModal] = useState(false)
    const [data, setData] = useState([]);

    const dispatch = useDispatch()
    let history = useNavigate();

    const userList = useSelector(state => state.userList)
    const { loading, error, users } = userList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete } = userDelete

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers())
        } else {
            history('/login')
        }
    }, [dispatch, history, successDelete, userInfo])


    const deleteHandler = (id) => {
        if (window.confirm('Are you sure to want to delete this user?')) {
            dispatch(deleteUser(id))
        }
    }

    async function getFilesUser(idUser) {
        try {
            await axios.get(
                `${variables.API_URL}files/user/${idUser}`,
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${userInfo.token}`
                    }
                }
            ).then((responseData) => {
                setData(responseData.data)
            })
        } catch (err) { console.error(err.toJSON()) }


    }

    const currentUserId = (id) => {
        try {
            getFilesUser(id)
            setOpenModal(true)
        } catch (err) { console.error(err.toJSON()) }

    }

    return (
        <FormContainer>
            <h1 className='text-center'>Users</h1>
            {loading
                ? (<Loader />)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <table>
                            <thead >
                                <tr >
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>ADMIN</th>
                                    <th>EDIT / DELETE / FILES</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.isAdmin ? (
                                            <i className='fas fa-check' style={{ color: 'green' }}></i>
                                        ) : (
                                            <i className='fas fa-check' style={{ color: 'red' }}></i>
                                        )}</td>

                                        <td >
                                            <LinkContainer to={`/admin/user/${user._id}/edit`} >
                                                <Button variant='light' className='btn-sm' style={{ backgroundColor: 'transparent' }}>
                                                    <i className='fas fa-edit'></i>
                                                </Button>
                                            </LinkContainer>

                                            <Button variant='primary' className='btn-sm' style={{ backgroundColor: 'transparent' }}
                                                onClick={() => deleteHandler(user._id)}>
                                                <i className='fas fa-trash' style={{ color: 'red' }}></i>
                                            </Button>

                                            <Button className='btn-sm ' style={{ backgroundColor: 'transparent' }}
                                                onClick={() => currentUserId(user._id)}>
                                                <VscFiles style={{ color: 'green', }} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    )}
            <div>
                <Modal open={openModal} onClose={() => setOpenModal(false)}>
                    <PersonalFiles files={data} />
                </Modal>
            </div>
        </FormContainer>
    )
}

export default UserListScreen
