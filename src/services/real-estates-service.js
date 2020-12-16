const urlBase = 'http://localhost:3001'
export const getAllRealEstates = async () => fetch(`${urlBase}/real-estates`).then(res => res.json()).catch(err => console.log(err))
