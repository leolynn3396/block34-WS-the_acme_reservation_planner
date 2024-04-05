const { client, 
    createTables,    
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    fetchReservations,
    createReservation,
    destroyReservation } = require('./db');

const express = require('express');
const app = express();

//GET
api.get('/api/customers', async(req, res, next)=> {
    try{
        res.send(await fetchCustomers());
    }catch(ex){
        next(ex);
    }
});
api.get('/api/restaurants', async(req, res, next)=> {
    try{
        res.send(await fetchRestaurants());
    }catch(ex){
        next(ex);
    }
});
api.get('/api/reservations', async(req, res, next)=> {
    try{
        res.send(await fetchReservations)
    }catch(ex){
        next(ex);
    }
});

//POST

app.post('/api/customers/:id/reservations', async(req, res, next) => {
    try{
        res.status(201).send(await createReservation(req.body));
        } catch(ex){
            next(ex);
        }
});


//DELETE
app.delete('/api/customers/:customer_id/reservations/:id', async(req, res, next) => {
    try{
        await destroyReservation(req.params.id);
        res.sendStatus(204);
    }catch(ex){
        next(ex);
    }  
});  


const init = async()=> {
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const [ling, amy, josh, HDL, DolarShop, ChengduMemory] = 
    await Promise.all([
        createCustomer('ling'),
        createCustomer('amy'),
        createCustomer('josh'),
        createRestaurant('HDL'),
        createRestaurant('DolarShop'),
        createRestaurant('ChengduMemory'),
    ]);
    console.log(`ling has an id of ${ling.id}`);
    console.log(`HDL has an id of ${HDL.id}`);
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());
    await Promise.all([
        createReservation([customer_id: ling.id, restaurant_id: HDL.id, date: '04/01/2024', party_count: '6']),
        createReservation([customer_id: ling.id, restaurant_id: DolarShop.id, date: '04/15/2024', party_count: '7']),
        createReservation([customer_id: amy.id, restaurant_id: ChengduMemory.id, date: '07/04/2024', party_count: '8'])
    ]);
    const reservations = await fetchReservations();
    console.log(reservations);
    await destroyReservation(reservations[0].id);
    console.log(await fetchReservations());

    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));

};
  
  init();