
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {getAllRealEstates} from '../../services/real-estates-service'
import RealEstatesTable from '../real-estates-table/real-estates-table'
import './app.css'
const App = () => {

    const [realEstates, setRealEstates] = useState([])
    

    return (
        <AppView>
            <Title>Real Estates Company</Title>
            <RealEstatesTable realEstates={realEstates}></RealEstatesTable>
        </AppView>
    )
}

export default App

const AppView = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 5rem;
    /* border: 1px solid #ffffff; */
    min-height: 75vh;
`

const Title = styled.h1`
    text-align: center;
    color: #ffffff;
    font-size: 3rem;
    margin-top: 4rem;
`