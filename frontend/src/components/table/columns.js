
import { format } from 'date-fns'
export const COLUMNS = [
    {
        Header: 'Id',
        Footer: 'Id',
        accessor: 'id',
    },
    {
        Header: 'Name',
        Footer: 'Name',
        accessor: 'file_name',
    },
    {
        Header: 'Description',
        Footer: 'Description',
        accessor: 'description',
    },
    {
        Header: 'Date',
        Footer: 'Date',
        accessor: 'create_at',
        Cell: ({ value }) => { return format(new Date(value), 'dd-MM-yyyy') }
    },
    {
        Header: 'Size byte',
        Footer: 'Size byte',
        accessor: 'size_file',
    },
]