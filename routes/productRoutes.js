import express from 'express';
const router = express.Router();
import fs from 'fs';

router.get('/',(req,res)=>{
    const data = fs.readFile('./product.json',"utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const response = JSON.parse(data);
        res.send(response)
    });

})

router.get('/:id',(req,res)=>{
    const id = req.params.id;

    const data = fs.readFile('./product.json',"utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const response = JSON.parse(data);
        const product = response.products.filter(item => item.id == id);
        res.send(product)
    });
  
})



// Update product by ID
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;

    // Read the file asynchronously
    fs.readFile('./product.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error reading file' });
        }

        const response = JSON.parse(data);
        
        // Update the product with the given id
        const updatedProducts = response.products.map(item => {
            if (item.id == id) {
                // Update the matching product with new data
                return { ...item, ...body };
            }
            return item; // Return the item as is if it's not the one to update
        });

        // Check if the product was found and updated
        const updatedProduct = updatedProducts.find(item => item.id == id);
        if (!updatedProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }

        // Write the updated products array back to the file
        fs.writeFile('./product.json', JSON.stringify({ products: updatedProducts }, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ message: 'Error writing file' });
            }
            // Return the updated product
            res.status(200).json(updatedProduct);
        });
    });
});



router.delete('/:id', (req, res) => {
    const id = req.params.id;

    // Read the file asynchronously 
    fs.readFile('./product.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error reading file' });
        }

        const response = JSON.parse(data);

        // Find the index of the product to be deleted
        const productIndex = response.products.findIndex(item => item.id == id);
        
        if (productIndex === -1) {
            return res.status(404).send({ message: 'Product not found' });
        }

        // Remove the product from the array
        const deletedProduct = response.products.splice(productIndex, 1)[0];

        // Write the updated products array back to the file
        fs.writeFile('./product.json', JSON.stringify({ products: response.products }, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ message: 'Error writing file' });
            }
            // Return a success message with the deleted product details
            res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
        });
    });
});



export default router;