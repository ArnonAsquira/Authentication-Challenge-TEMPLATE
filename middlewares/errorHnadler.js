function  errorHandler (err, req, res, next) {
    console.log(err);
    res.status(400).send({error: err});
}

module.exports ={
    errorHandler,
}