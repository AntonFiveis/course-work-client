import React, { useState } from 'react'
import styled from 'styled-components'

export default function RealEstatesTable ({realEstates, setRealEstates}) {
    const [selectedRow, setSelectedRow] = useState(null),
        [selectedKey, setSelectedKey] = useState(null)
    if(!realEstates || realEstates.length === 0) return <div></div>

    const gridRowTemplate = realEstates.reduce((prev1, curr1, index1) => 
    `${prev1}${index1 === 0 ? '' : `
    `}${`"` + Object.keys(curr1).reduce((prev, _, index) => `${prev}${index === 0 ? '' : ' '}prop${index1}${index}`, '') + `"`}`, '') 
    
    const propNames = Object.keys(realEstates[0]).reduce((prev, _, index) => `${prev}${index === 0 ? '' : ' '}propName${index}`, '')
    const RealEstatesTableView = styled.div`
        display: grid;
        grid-template-areas: 
        "${propNames}"
        ${gridRowTemplate};
    `

    const onDoubleClick = rowIndex => key => {
        setSelectedRow(rowIndex)
        setSelectedKey(key)
    }

    const setNewValue = value => {
        const newRealEstates = [...realEstates]
        newRealEstates[selectedRow][selectedKey] = value
        setRealEstates(newRealEstates)
    }

    const rows = realEstates.map((item, index) => 
        <TableRow 
            key={`row${index}`}
            setNewValue={setNewValue} 
            onDoubleClick={onDoubleClick(index)} 
            index={index} 
            realEstate={item}/>)

    const tableHeaderObj = {} 
    Object.keys(realEstates[0]).forEach(key => tableHeaderObj[key] = key)

    return (
        <RealEstatesTableView>
            <TableRow index={-1} realEstate={tableHeaderObj}/>
            {rows}
        </RealEstatesTableView>
    )
}

const TableRow = ({realEstate, index, onDoubleClick, setNewValue}) => {
    const [hovered, setHovered] = useState(false)
    const [selected, setSelected] = useState('')
    const [value, setValue] = useState ('')
    if(index === -1) return (
        <> 
            {Object.keys(realEstate).map((key, index1) => <TableItem key={`${key}-${index}`} className="header" style={{gridArea: `propName${index1}`}}><Span>{realEstate[key]}<Span/></Span></TableItem>)}
        </>
    )

    
    const rowItems = Object.keys(realEstate).map((key, index1) => 
        <TableItem 
            key={`${key}-${index}`}
            onMouseEnter={() => setHovered(true)} 
            onMouseOut={({relatedTarget, target}) => {
                setHovered(false)
            } }
            onClick={({target}) => {
                if(!selected) {
                    console.log(key)
                    setValue(realEstate[key])
                    setSelected(key)
                    onDoubleClick(key)
                    // console.log(selected)
                }
            }}
            className={hovered ? 'hovered' : ''} 
            style={{gridArea: `prop${index}${index1}`}}>
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

    // console.log(realEstate)

    return (
        <>
            {rowItems}
        </>
    )
}

const TableItem = styled.div`
    background-color: #fff;
    padding: .7rem;
    text-align: center;
    display: flex;

    transition: all 150ms ease;

    &.header {
        background-color: #c75d00;
        color: #fff;
        font-weight: 600;
        
    }

    &.hovered {
        background-color: #f08d54;
        color: #fff;
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