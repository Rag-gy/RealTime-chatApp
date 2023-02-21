const notFound = (req, res, next)=>{
    let error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404)
    next(error);
}

const errorHandler = (err, req, res, next)=>{
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode    // here we set the StatusCode as per the current status where 200 denotes the request is succeeded and 500 mean Internal server error
    res.status(statusCode)
    res.json({
        message:err.message,
        stack:process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = {notFound, errorHandler}