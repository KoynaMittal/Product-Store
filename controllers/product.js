const Product = require('../models/product')
const getAllProductsStatic = async(req,res) =>{
    const products = await Product.find({});
    res.status(200).json({products});
}

const getAllProducts = async(req,res) =>{
    const {featured, company, name, sort, fields, numericFilters} = req.query
    const queryObject = {}

    //finding
    if(featured){
        queryObject.featured = featured === 'true' ? true:false 
    }

    if(company){
        queryObject.company = company
    }

    if(name){
        queryObject.name = {$regex: name, $options:'i'}
    }
    
    //filters
    if(numericFilters){
        const operatorMap = {
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        const regex = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(regex, (match)=>`-${operatorMap[match]}-`);
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if(options.includes(field)){
                queryObject[field] = {[operator]: Number(value)}
            }
        });
    }
    console.log(queryObject);
    let result = Product.find(queryObject)

    //sorting and selecting 
    if(sort){
        let sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    }
    else{
        result = result.sort('createdAt');
    }

    if(fields){
        let fieldList = fields.split(',').join(' ');
        result = result.select(fieldList);
    }

    
    //pagination 
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1)*limit
    result = result.skip(skip).limit(limit)

    //final result 
    const products = await result
    res.status(200).json({products});
}

module.exports = {getAllProducts,getAllProductsStatic}