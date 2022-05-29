const express = require('express');


// Init Express router
const router = express.Router();

const { check, validationResult } = require('express-validator');
const Plane = require('../models/Plane');

 // @route GET api/planes
 // @desc Get All planes
router.get('/', async (req,res) => {

	try {

	let filter = {};

	if (req.query.airline) {
		filter = {airline : req.query.airline}
	}


	if (req.query.model) {
		filter = {model : req.query.model}
	}


	const currentPage = req.query.page || 1;
	
	const limit = req.query.per_page || 5;
	let next,previous = 0;
	
	const startIndex = (currentPage - 1) * limit
	const endIndex = currentPage * limit

	
		 await Plane.where(filter).countDocuments()
			.then(count => {
				totalItems = count;
				if (endIndex < totalItems) next = currentPage + 1
				if (startIndex > 0)  previous = currentPage - 1
	
				return Plane.find()
					.where(filter)
					.skip(startIndex)
					.select('name airline model')
					.sort({updated : -1})
					.limit(limit)
			})
			.then(planes => {
				res.responseApiReturn(200,{planes,next,previous})
			})
			.catch(err => {
				console.log(err)
				res.responseApiReturn(500,{},'Database Error');
			});

		} catch (err) {
        console.error(err.message);
		res.responseApiReturn(500,{},'Server Error');
    }
});


// @route    GET api/planes/:id
// @desc     Get a plane
router.get('/:id',  async (req, res) => {
	try {
		const plane = await Plane.findById(req.params.id);

		if (!plane) return res.responseApiReturn(404,null,'Plane not found');

        res.responseApiReturn(200,plane);
	} catch (err) {
		console.error(err.message);
		res.responseApiReturn(500,null,'Server Error');
	}
});

 // @route POST api/planes
 // @desc Add New Plane
 router.post('/',[
        check('name').not().isEmpty().withMessage('Name Is Required'),
        check('capacity').not().isEmpty().withMessage('Capacity Is Required').isInt({min:0}).withMessage('capacity is not int or amount is less than zero'),
        check('model').not().isEmpty().withMessage('Model Is Required'),
		check('code').not().isEmpty().withMessage('Code Is Required').custom(
			(value) => {
				return Plane.findOne({code: value})
				.then((plane) => {
					if(plane) {
						return Promise.reject('Code plane is already exist')
					}
				})
         }),
    ],async (req,res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
			return res.responseApiReturn(422,null,'',errors.array());
        } 

        const {name, code, capacity, model, airline} = req.body;

        try {
          const  newplane = new Plane({
               name,
			   code,
			   capacity,
			   model,
			   airline
            });

            await newplane.save();
            
            res.responseApiReturn(200,newplane);

          } catch (err) {
			res.responseApiReturn(500,null,'Server Error');
		}

});


// @route    PUT api/planes/:id
// @desc     Update a plane
router.put('/:id',  async (req, res) => {

    const {name, code, capacity, model, airline} = req.body;

	try {
		let plane = await Plane.findById(req.params.id);

		if (!plane) return res.responseApiReturn(404,null,'Plane not found');

		if (code) {
			let p = await Plane.findOne({code});
			if (p && p.id == plane.id) {
				return res.responseApiReturn(422,null,'',[
					{
						"msg": "Code plane is already exist",
						"param": "code",
						"location": "body"
					}
				]);

			}

		}
		plane = await Plane.findByIdAndUpdate(
			req.params.id,
			{ $set: {name,code,model,capacity,airline}},
			{ new: true }
		);

		res.responseApiReturn(200,plane);
	} catch (err) {
		console.error(err.message);
		res.responseApiReturn(500,null,'Server Error');
	}
});

// @route    DELETE api/planes/:id
// @desc     Delete a plane
router.delete('/:id',  async (req, res) => {
	try {
		const plane = await Plane.findById(req.params.id);

		if (!plane) return res.responseApiReturn(404,null,'Plane not found');

		await Plane.findByIdAndRemove(req.params.id);

		res.responseApiReturn(200,null,'Plane removed');
	} catch (err) {
		console.error(err.message);
		res.responseApiReturn(500,null,'Server Error');
	}
});

// @route    GET api/planes/capacity/:id
// @desc     Get plane capacity
router.get('/capacity/:id',  async (req, res) => {
	try {
		const plane = await Plane.findById(req.params.id);

		if (!plane) return res.responseApiReturn(404,null,'Plane not found');

		res.responseApiReturn(200,{ capacity : plane.capacity });
	} catch (err) {
		console.error(err.message);
		res.responseApiReturn(500,null,'Server Error');
	}
});


module.exports = router;
