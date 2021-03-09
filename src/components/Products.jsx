import React from 'react';
import {CircularProgress, Grid} from '@material-ui/core';   
import Product from './Product/Product';
import useStyles from './stylesproducts';
/***const products=[
    {id:1, name:'Shoes', description:'Running Shoes', price:'$5', image:'https://cdn.shopify.com/s/files/1/0316/8249/4604/products/30800175_02_01_360x.jpg?v=1601121761'},
    {id:2, name:'MacBook', description:'Apple Macbook', price:'$200', image:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp-spacegray-select-202011?wid=452&hei=420&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1603406905000'}
]
*/
const Products = ({products, onAddToCart}) => {
    const classes=useStyles();
    
    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid container justify="center" spacing={4}>
                {products.map((product)=>(
                   <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                       <Product product={product} onAddToCart={onAddToCart}/>
                 </Grid>
                ))}
            </Grid>    
        </main>
    )
}
export default Products;