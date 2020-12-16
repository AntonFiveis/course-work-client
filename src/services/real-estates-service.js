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
