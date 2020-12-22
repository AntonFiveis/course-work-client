const urlBase = 'http://localhost:3001/real-estates'
export const getAllRealEstates = async () => fetch(urlBase).then(res => res.json()).catch(err => console.log(err))


export const patchRealEstates = async (changedRealEstates) => fetch(urlBase, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(changedRealEstates)
    }).then(res => res.ok)

    
export const postNewRealEstate = async (realEstate) => fetch(urlBase, {
    method: 'POST',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(realEstate)
}).then(res => res.ok)

export const deleteRealEstate = async(realEstateID) => fetch(`${urlBase}/${realEstateID}`, {
    method: 'DELETE',
    mode: 'cors'
}).then(res => res.ok)


export const getRealEstatesByTitle = async (title) => fetch(`${urlBase}/title?search=${title}`).then(res => res.json())
export const getRealEstatesByDistrict = async (district) => fetch(`${urlBase}/district?search=${district}`).then(res => res.json())
export const getRealEstatesByPrice = async ({start, end}) => fetch(`${urlBase}/price?start=${start}&end=${end}`).then(res => res.json())