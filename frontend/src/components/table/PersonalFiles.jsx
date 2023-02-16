import React, { useMemo, useState } from 'react';
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination
} from 'react-table'
import FormContainer from '../FormContainer';
import './table.css'
import { COLUMNS } from './columns'
import { GlobalFilter } from './GlobalFilter'

function PersonalFiles({ files }) {

  const columns = useMemo(() => COLUMNS, [])
  const data = files

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    pageCount,
    footerGroups,
    state,
    setGlobalFilter,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination)

  const { pageIndex, globalFilter } = state

  return (

    <div className='main-container'>
      <h1 className='text-center'>Files of user</h1>

      <div className='wrapper'>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

        <table {...getTableProps()}>
          <thead className=' bg-slate-100 px-10' >
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? column.isSortedDesc ? ' 🔽' : ' 🔼' : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>
          {/* <tfoot>
            {footerGroups.map(footerGroup => (
              <tr {...footerGroup.getFooterGroupProps()}>
                {footerGroup.headers.map(column => (
                  <td {...column.getFooterProps()}>{column.render('Footer')}</td>
                ))}
              </tr>
            ))}
          </tfoot> */}
        </table>
        <div className='text-center'>
          <button className='btn' onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button className='btn' onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </button>{' '}
          <button className='btn' onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </button>{' '}
          <button className='btn' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>{' '}
          <span>
            Page{' '}
            <strong className='btn'>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>

        </div>
      </div>
    </div>
  )
}

export default PersonalFiles
