import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {getAllRealEstates, patchRealEstates} from '../../services/real-estates-service'

export default function RealEstatesTable () {
    const [realEstates, setRealEstates] = useState([])
    const [selectedRow, setSelectedRow] = useState(null),
        [selectedKey, setSelectedKey] = useState(null),
        [changed, setChanged] = useState(null)

    useEffect(() => {
        let cleanupFunction = false

        const fetchData = async () => {
            try {
                const newRealEstates = await getAllRealEstates()
                if (!cleanupFunction) {
                    setRealEstates(newRealEstates)
                    setChanged(Array.from({length: newRealEstates.length}, () => false))
                    cleanupFunction = true
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
        return () => cleanupFunction = true
    }, [])

    if(!realEstates || realEstates.length === 0) return <div></div>

    const onDoubleClick = rowIndex => key => {
        setSelectedRow(rowIndex)
        setSelectedKey(key)
    }

    const setNewValue = value => {
        const newRealEstates = [...realEstates]
        newRealEstates[selectedRow][selectedKey] = value
        setRealEstates(newRealEstates)
        changed[selectedRow] = true
        setChanged(changed)
    }

    const saveChanges = async () => {
        const updatedRows = realEstates.filter((_, index) => changed[index])
        if(updatedRows.length === 0) return;
        const ok = await patchRealEstates(updatedRows)
        if(ok)
            alert ('Saved succesfully')
        else alert ('Invalid changes!!!')
    }

    const rows = realEstates.sort((a, b) => a.realEstateID - b.realEstateID).map((item, index) => 
        <TableRow 
            key={`row${index}`}
            setNewValue={setNewValue} 
            onDoubleClick={onDoubleClick(index)} 
            index={index} 
            realEstate={item}/>)

    const tableHeaderObj = {} 
    Object.keys(realEstates[0]).forEach(key => tableHeaderObj[key] = key)

    return (
        <>
        <RealEstatesTableView>
            <tbody>
                <TableRow index={-1} realEstate={tableHeaderObj}/>
                {rows}
            </tbody>
        </RealEstatesTableView>
        <ButtonGroup onClick={saveChanges}>
            <StyledButton>Save changes</StyledButton>
        </ButtonGroup>
        </>
    )
}

const RealEstatesTableView = styled.table`
    width: 100%;
    border-collapse: collapse;
`

const TableRow = ({realEstate, index, onDoubleClick, setNewValue}) => {
    const [selected, setSelected] = useState('')
    const [value, setValue] = useState ('')

    const changableValues = ['title', 'priceInDollars', 'district', 'address', 'floorsCount', 'roomsCount', 'house', 'isCurrentlyAvailable' ]

    if(index === -1) return (
        <TableRowView className="header"> 
            {Object.keys(realEstate).map((key, index1) => <TableItem key={`${key}-${index}`}  style={{gridArea: `propName${index1}`}}><Span>{realEstate[key]}<Span/></Span></TableItem>)}
        </TableRowView>
    )
    
    const rowItems = Object.keys(realEstate).map((key) => 
        <TableItem 
            key={`${key}-${index}`}
            onDoubleClick={({target}) => {
                if(!changableValues.includes(key)) return;

                if(!selected) {
                    setValue(realEstate[key])
                    setSelected(key)
                    onDoubleClick(key)
                }
            }}
            >
            {!selected || selected !== key 
                ? <Span className='span'>{realEstate[key].toString()}</Span>
                : (
                <Form onSubmit={(ev) => {
                    ev.preventDefault()
                    setNewValue(value)
                    setSelected(null)
                    setValue(null)
                }}>
                    <Input type="text" value={value} onChange={({target}) => setValue(target.value)}/>
                </Form>
            )}
        </TableItem>
    )

    return (
        <TableRowView>
            {rowItems}
        </TableRowView>
    )
}

const TableItem = styled.th`
    padding: .7rem;
    text-align: center;
    font-weight: 400;

`

const TableRowView = styled.tr`
    background-color: #fff;
    transition: all 150ms ease;
    &:hover {
        background-color: #f08d54;
        color: #fff;
    }

    &.header {
        background-color: #c75d00;
        color: #fff;
        font-weight: 600;
        
    }
`

const Form = styled.form`
    margin: auto;
`

const Span = styled.span`
    margin: auto;
`

const Input = styled.input`

`

const ButtonGroup = styled.div`
    margin: 1rem auto;
    display: flex;
`

const StyledButton = styled.button`
    padding: 1rem;
    font-size: 1rem;
    color: #fff;
    background: #1420ba;
`