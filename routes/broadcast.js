const
    express = require('express'),
    router = express.Router();



router.get('/result', (req, res)=>{
    console.log('asdasdasdasd');
    res.json({result: 'Hello World'});
});
module.exports = router;