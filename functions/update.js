require('dotenv').config()
var axios = require("axios").default;
let auth = process.env.BASIC_AUTH;
let hostname = process.env.HOST;

var options = {
    method: 'GET',
    url: `https://${hostname}/wp-json/wc/v3/products`,
    params: { per_page: '100', page: '1', stock_status: 'instock' },
    headers: {
        authorization: `Basic ${auth}`
    }
};
let totalPages = 1;
let totalRequests = 0;
let allWrongProducts = [];

let start = async () => {
    //collect all products with wrong stock status

    let firstPageRes = await axios.request(options);
    totalPages = Number(firstPageRes.headers['x-wp-totalpages']);
    let wrongProducts = firstPageRes.data.filter(x => x.stock_quantity === 0);
    allWrongProducts = [...allWrongProducts, ...wrongProducts];


    for (let i = 2; i <= totalPages; i++) {
        await axios.request({...options, params: {...options.params, page: i } }).then(function(response) {
            let wrong = response.data.filter(x => x.stock_quantity === 0)
            allWrongProducts = [...allWrongProducts, ...wrong];
            allWrongProducts = allWrongProducts.concat(wrong)
        });
    }

    return finalize();

}



let finalize = async () => {
    let text = "Updated : "
    allWrongProducts.forEach(x => {
        text += `Navn: ${x.name} Id:  ${x.id}`;
    })
    let allUpdates = [];
    return {statusCode:200, body: text}
    allWrongProducts.forEach(x => {
        allUpdates.push(setToNoStock(x.id))
    })
    return await Promise.all(allUpdates).then(x => {
        return {
            statusCode: 200,
            body: text
        }
    })
}



function setToNoStock(id) {
    var options = {
        method: 'PUT',
        url: `https://${hostname}/wp-json/wc/v3/products/${id}`,
        headers: {
            'content-type': 'application/json',
            authorization: `Basic ${auth}`
        },
        data: { stock_status: 'outofstock' }
    };

    return axios.request(options).then(function(response) {
        console.log(response.status);
        return true;
    }).catch(function(error) {
        console.error(error);
        return false;
    });
}



exports.handler = async (event, context) => {
    return start();
    
}
