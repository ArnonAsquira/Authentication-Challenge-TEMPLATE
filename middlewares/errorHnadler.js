function  errorHandler (err, req, res, next) {
    console.log(err, req.body);
    res.end({error: err});
}

module.exports ={
    errorHandler,
}