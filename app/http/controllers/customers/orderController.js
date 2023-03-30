const Order = require('../../../models/order')
const moment = require('moment')
function orderController(){
    return {
        async store(req, res){
            //validate request
            const{  address, phone} = req.body
            if( !phone || !address){
                req.flash('error', 'All field are required!!')
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })

            
            
             await order.save().then( result =>{
                req.flash('success', 'Order placed sucessfully ')
                delete req.session.cart
                return res.redirect('/customers/orders')

            }).catch( err =>{
                req.flash('error', 'Something went wrong !!')
                return res.redirect('/cart')
                
            })   
        }, 
         async index(req, res){
            const orders = await Order.find({ customerId: req.user._id }, 
                null, 
                {sort:{ 'createdAt':-1}})

                res.header('Cache-Control', 'no-store' )
            res.render('customers/orders', { orders: orders, moment: moment})
            //console.log(orders)
          
        }
    }
}


module.exports = orderController