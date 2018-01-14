const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req,res)=>{
    res.render('index', {title: 'Home'});
}


exports.addStore = (req,res) => {
    res.render('editStore', {title: 'Add Store'});
}

exports.createStore = async (req,res) => {
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);

    res.redirect(`/store/${store.slug}`); 
}

exports.getStores = async (req,res) =>{
    const stores = await Store.find();
    res.render('stores', {title: 'Stores', stores});
}

exports.editStore = async (req, res) => {
    const store = await Store.findOne({_id: req.params.id});
    res.render('editStore', {title: `Edit ${store.name}`, store});
    
}

exports.updateStore = async (req,res) =>{
    //set the location data to be a point
    req.body.locaiton.type = 'Point';
    const store = await Store.findOneAndUpdate({_id:req.params.id}, req.body, {
        new: true, //return the new store instead of the old store
        runValidators: true, //force our model to run the validation
    }).exec();

    req.flash('success', `Successfully updated ${store.name}. <a href=/stores/${store.slug}>View Store -></a>`);
    res.redirect(`/stores/${store._id}/edit`);
}