function  errorHandler (err, req, res, next) {
    console.log(err);
    res.status(400).send({error: JSON.stringify(err)});
}

module.exports ={
    errorHandler,
}