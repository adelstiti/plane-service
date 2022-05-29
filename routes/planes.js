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
				res.status(200).json({planes,next,previous});
			})
			.catch(err => {
				console.log(err)
				res.status(500).send('Database Error');
			});

		} catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route    GET api/planes/:id
// @desc     Get a plane
router.get('/:id',  async (req, res) => {
	try {
		const plane = await Plane.findById(req.params.id);

		if (!plane) return res.status(404).json({ msg: 'Plane not found' });

        res.json(plane);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
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
            return res.status(422).json({errors : errors.array()});
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
            
            res.json(newplane);

          } catch (err) {
				res.status(500).send('Server Error');
          }

});


// @route    PUT api/planes/:id
// @desc     Update a plane
router.put('/:id',  async (req, res) => {

    const {name, code, capacity, model, airline} = req.body;

	try {
		let plane = await Plane.findById(req.params.id);

		if (!plane) return res.status(404).json({ msg: 'Plane not found' });

		if (code) {
			let p = await Plane.findOne({code});
			if (p && p.id == plane.id) {
				return res.status(422).json({msg : 'Code plane is already exist'});
			}

		}
		plane = await Plane.findByIdAndUpdate(
			req.params.id,
			{ $set: {name,code,model,capacity,airline}},
			{ new: true }
		);

		res.json(plane);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route    DELETE api/planes/:id
// @desc     Delete a plane
router.delete('/:id',  async (req, res) => {
	try {
		const plane = await Plane.findById(req.params.id);

		if (!plane) return res.status(404).json({ msg: 'Plane not found' });

		await Plane.findByIdAndRemove(req.params.id);

		res.json({ msg: 'Plane removed' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route    GET api/planes/capacity/:id
// @desc     Get plane capacity
router.get('/capacity/:id',  async (req, res) => {
	try {
		const plane = await Plane.findById(req.params.id);

		if (!plane) return res.status(404).json({ msg: 'Plane not found' });

		res.json({ capacity : plane.capacity });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});


module.exports = router;
