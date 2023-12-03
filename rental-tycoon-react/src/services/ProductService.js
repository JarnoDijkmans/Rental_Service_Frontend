import axios from "axios";

const hostname = 'http://localhost:8080'

const instanceOf = 'Product'

function createMachineFormData(newMachineData) {
    const formData = new FormData();
  
    newMachineData.files.forEach((file) => {
      formData.append('files', file);
    });

    formData.append('name', newMachineData.name);
  
    formData.append('description', newMachineData.description);
  
    formData.append('price', newMachineData.price);

    formData.append('machineSpecificField', newMachineData.machineSpecificField)
  
    return formData;
  }

function CreateMachine(newMachineData) {
    const formData = createMachineFormData(newMachineData);
    return axios.post(`${hostname}/${instanceOf}/machine`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => response.data)
        .catch(error => {
          console.error('Error creating post:', error);
          throw error; 
        });
    }
    const fetchAndUpdateFiles = async (productId, files) => {
      const updatedFiles = [];
      for (let file of files) {
        try {
          const fileResponse = await axios.get(`${hostname}/api/files/${productId}/${file.fileUrl}`, { responseType: 'blob' });
          const blob = new Blob([fileResponse.data], { type: file.type });
          const objectURL = URL.createObjectURL(blob);
    
          const updatedContentItem = {
            url: objectURL,
            type: file.type,
          };
    
          updatedFiles.push(updatedContentItem);
        } catch (error) {
          console.error(`Failed to retrieve file: ${file.fileUrl}`);
        }
      }
      return updatedFiles;
    };
    
    const getMachinesByCategory = async (id) => {
      const response = await axios.get(`${hostname}/${instanceOf}/filter/${id}`);
      const products = response.data.products;
    
      for (let product of products) {
        if (product.files && product.files.length > 0) {
          product.files = await fetchAndUpdateFiles(product.id, product.files);
        }
      }
    
      return products;
    };
    
    const getProductsByName = async (name) => {
      const response = await axios.get(`${hostname}/${instanceOf}/mapping/${name}`);
      const products = response.data.products;
    
      for (let product of products) {
        if (product.files && product.files.length > 0) {
          product.files = await fetchAndUpdateFiles(product.id, product.files);
        }
      }
    
      return products;
    };

    async function getAllProducts() {
      try {
        const response = await axios.get(`${hostname}/Product`);
        const products = response.data.products;
    
        for (let product of products) {
          if (product.files && product.files.length > 0) {
            product.files = await fetchAndUpdateFiles(product.id, product.files);
          }
        }
    
        return products;
      } catch (error) {
        console.error('Error Retrieving products', error);
        throw error;
      }
    }

    const getProductById = async (id) => {
      try {
        const response = await axios.get(`${hostname}/${instanceOf}/${id}`);
        const product = response.data; 
        console.log("Product by ID:", product);
    
        if (product.files && product.files.length > 0) {
          const updatedFiles = [];
          for (let file of product.files) {
            try {
              const fileResponse = await axios.get(`${hostname}/api/files/${product.id}/${file.fileUrl}`, { responseType: 'blob' });
    
              const blob = new Blob([fileResponse.data], { type: file.type });
              const objectURL = URL.createObjectURL(blob);
    
              const updatedContentItem = {
                url: objectURL,
                type: file.type,
              };
    
              updatedFiles.push(updatedContentItem);
            } catch (error) {
              console.error(`Failed to retrieve file: ${file.fileUrl}`);
            }
          }
          product.files = updatedFiles;
        }
    
        return product;
      } catch (error) {
        console.error(`Error getting product by ID (${id}):`, error);
        throw error;
      }
    };
export default {
    CreateMachine,
    getMachinesByCategory,
    getProductsByName,
    getProductById,
    getAllProducts
}