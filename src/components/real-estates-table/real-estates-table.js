import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {deleteRealEstate, getAllRealEstates, patchRealEstates, postNewRealEstate} from '../../services/real-estates-service'

export default function RealEstatesTable () {
    const [realEstates, setRealEstates] = useState([])
    const [selectedRow, setSelectedRow] = useState(null),
        [selectedKey, setSelectedKey] = useState(null),
        [changed, setChanged] = useState([]),
        [page,setPage] = useState(0),
        reOnPage =4

    const [showModal, setShowModal] = useState(false)


    const [newTitle, setNewTitle] = useState(''),
    [newPrice, setNewPrice] = useState(''),
    [newSquare, setNewSquare] = useState(''),
    [newDistrict, setNewDiscirict] = useState(''),
    [newAddress, setNewAddress] = useState(''),
    [newFloorsCount, setNewFloorsCount] = useState(''),
    [newRoomsCount, setNewRoomsCount] = useState(''),
    [newHouse, setNewHouse] = useState(false)


    const reload = async (cleanupFunction) => {
        try {
            const newRealEstates = await getAllRealEstates()
            if (!cleanupFunction) {
                setRealEstates(newRealEstates)
                setChanged(Array.from({length: newRealEstates.length}, () => []))
                // cleanupFunction = true
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        let cleanupFunction = false
        reload(cleanupFunction)
        return () => cleanupFunction = true
    }, [])


    const addNewRealEstate = async () => {
        const ownerID = JSON.parse(localStorage.getItem('user')).userID
        const newRealEstate = {
            title: newTitle,
            ownerID,
            priceInDollars: newPrice,
            squareInM2: newSquare,
            district: newDistrict,
            address: newAddress,
            floorsCount: newFloorsCount,
            roomsCount: newRoomsCount,
            house: newHouse
        }

        const ok = await postNewRealEstate(newRealEstate)
        if(ok) {
            setShowModal(false)
            reload(false)
        }
    }

    const saveChanges = async () => {
        const updatedRows = realEstates.map((item, index) => {
            if (changed[index].length === 0) return undefined;

            const result = {realEstateID: item.realEstateID}
            changed[index].forEach(key => {
                result[key] = item[key]
            })
            return result
        }).filter(item => item !== undefined)
        if (updatedRows.length === 0) return;

        console.log(updatedRows)
        const ok = await patchRealEstates(updatedRows)
        if(ok) {
            alert ('Saved succesfully')
            setChanged(Array.from({length: realEstates.length}, () => []))
        }
        else alert ('Invalid changes!!!')
    }

    const modal = (
            <DarkBg id='dark' onClick={({target}) => target.id.includes('dark') ? setShowModal(false) : null}>
                <Modal>
                    <ModalTitle>Input data about real estate</ModalTitle>
                    <StyledInput value={newTitle} onChange={({target}) => setNewTitle(target.value)} placeholder="Title"/>
                    <StyledInput value={newPrice} onChange={({target}) => setNewPrice(target.value)} placeholder="Price in dollars"/>
                    <StyledInput value={newSquare} onChange={({target}) => setNewSquare(target.value)}placeholder="Square in m2"/>
                    <StyledInput value={newDistrict} onChange={({target}) => setNewDiscirict(target.value)} placeholder="District"/>
                    <StyledInput value={newAddress} onChange={({target}) => setNewAddress(target.value)} placeholder="Address"/>
                    <StyledInput value={newFloorsCount} onChange={({target}) => setNewFloorsCount(target.value)} placeholder="Floors count"/>
                    <StyledInput value={newRoomsCount} onChange={({target}) => setNewRoomsCount(target.value)} placeholder="Rooms count"/>
                    <div style={{margin: '0 auto'}}>
                        <Span className="big">Is a house</Span>
                        <StyledInput value={newHouse} onChange={({target}) => setNewHouse(target.checked)} type="checkbox" placeholder="Is a house"/>
                    </div>
                    <ButtonGroup onClick={saveChanges}>
                        <StyledButton className="success" onClick={addNewRealEstate}>Add real estate</StyledButton>
                    </ButtonGroup>
                </Modal>
            </DarkBg>)


    if(!realEstates || realEstates.length === 0 || changed.length === 0) return <div> {showModal ? modal : null }
        <StyledButton className="success" onClick={() => setShowModal(true)}>Add real estates</StyledButton></div>

    const onDoubleClick = rowIndex => key => {
        if(selectedKey || selectedRow) throw new Error()
        setSelectedRow(rowIndex)
        setSelectedKey(key)
    }

    const setNewValue = value => {
        const newRealEstates = [...realEstates]
        newRealEstates[selectedRow][selectedKey] = value
        setRealEstates(newRealEstates)
        changed[selectedRow].push(selectedKey)
        setChanged(changed)
        setSelectedKey(null)
        setSelectedRow(null)
    }

    const removeRealEstate = async (realEstateID) => {
        console.log(realEstateID)
        const ok = await deleteRealEstate(realEstateID)

        if(ok) reload(false)
        else alert ("Something went wrong...")
    }

    const rows = realEstates.sort((a, b) => a.realEstateID - b.realEstateID).map((item, index) =>
        <TableRow
            key={`row${index}`}
            setNewValue={setNewValue}
            remove={() => removeRealEstate(item.realEstateID)}
            onDoubleClick = {onDoubleClick(index)}
            index={index}
            realEstate={item}
            changed={changed[index]}
            />)
    const pageRows = rows.slice(page*reOnPage,(page+1)*reOnPage>rows.length? rows.length: (page+1)*reOnPage)

    const tableHeaderObj = {}
    Object.keys(realEstates[0]).forEach(key => tableHeaderObj[key] = key)
    const nextPage = ()=>{
        const newPage = page+1>=rows.length/reOnPage? 0:page+1
        setPage(newPage)
    }
    const prevPage = ()=>{
        const prevPage = page-1<0? Math.floor(rows.length/reOnPage):page-1
        setPage(prevPage)
    }




    return (
        <>
        <RealEstatesTableView>
            <tbody>
                <TableRow index={-1} realEstate={tableHeaderObj}/>
                {pageRows}
            </tbody>
        </RealEstatesTableView>
        {showModal ? modal : null }
        <ButtonGroup onClick={saveChanges}>
            <StyledButton className="success" onClick={() => setShowModal(true)}>Add real estates</StyledButton>
            <StyledButton>Save changes</StyledButton>
        </ButtonGroup>
        <ButtonGroup>
            <StyledButton className="success" onClick={prevPage}>Prev</StyledButton>
            <StyledButton className="success" onClick={nextPage}>Next</StyledButton>
        </ButtonGroup>
        </>
    )
}

const RealEstatesTableView = styled.table`
    width: 100%;
    border-collapse: collapse;
`

const TableRow = ({realEstate, index, onDoubleClick, setNewValue, changed, remove}) => {
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
            className={changed && changed.includes(key) ? 'changed' : ''}
            onDoubleClick={({target}) => {
                if(!changableValues.includes(key)) return;

                if(!selected) {
                    try {
                        onDoubleClick(key)
                        setValue(realEstate[key])
                        setSelected(key)
                    } catch (error) {}

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
        <>
        <TableRowView>
            {rowItems}
            <th style={{background: '#d9a043'}}>
                <StyledButton onClick={() => remove()} style={{display: 'block', margin: 'auto 1rem'}} className="danger">Remove</StyledButton>
            </th>
        </TableRowView>

        </>
    )
}

const TableItem = styled.th`
    padding: .7rem;
    text-align: center;
    font-weight: 400;

    &.changed {
        background-color: #22d472;
        color: #fff;
    }

`

const TableRowView = styled.tr`
    position: relative;
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

    &.big {
        font-size: 1.5rem;
    }
`

const Input = styled.input`

`

const ButtonGroup = styled.div`
    margin: 1rem auto;
    display: flex;
`

const StyledButton = styled.button`
    margin: 0 .25rem;
    padding: 1rem;
    font-size: 1rem;
    color: #fff;
    background: #1420ba;
    border: none;

    &.success {
        background-color: #08bf5a;
    }

    &.danger {
        background-color: #e33d3d;
    }
`

const Modal = styled.div`
    margin: auto;
    z-index: 7;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    background-color: #d9a043;
`

const ModalTitle = styled.h3`
    color: #fff;
    font-size: 2.5rem;
    margin: 1rem 2rem;

`

const StyledInput = styled.input`
    padding: .25rem;
    border: 1px solid #000;
    font-size: 2rem;
    border-radius: .5rem;
    margin: .25rem 1rem;
`

const DarkBg = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    z-index: 4;
    background: rgba(0,0,0,0.5);
`
