var express = require('express');
const router = express.Router();
const isBase64 = require('is-base64');
const base64Img = require('base64-img');
const { Media } = require('../models');
const fs = require('fs');

/* GET media listing. */

router.get('/', async function(req,res) {
  const media = await Media.findAll({
      attributes: ['id','image']
  });

  const mappedMedia = media.map((m) => {
      m.image = `${req.get('host')}/${m.image}`;
      return m;
  })

  return res.json({
    status : 'succes',
    data : mappedMedia
  })

});

router.post('/', function(req, res, next) {
    const image = req.body.image;
    
    if(!isBase64(image,{mimeRequired:true})){
      return res.status(400).json({
        status: 'error',
        message: 'invalid base64'
      })
    }

    // simpan ke storage local
   
    base64Img.img(image, './public/images', Date.now(), async function (err, filepath) {
        if (err) {
          res.status(400).json({ status: 'error', message: err.message });
        }
        const filename = filepath.split('/').pop();
       
        try {
           const media = await Media.create({ image : `images/${filename}` });
          
            return res.json({
              status : 'success',
              data : {
                id : media.id,
                image : `${req.get('host')}/images/${filename}`
              }
            });
        }
        catch(err){
           res.status(400).json({ status: 'error', message: err.message });
        }

        
     });
});
router.delete('/:id',async function(req,res) {
        const id = req.params.id;
       
        const media = await Media.findByPk(id);

        if(!media){
            return res.status(404).json({status: 'error',message: 'media not found'})
        }
        fs.unlink(`./public/${media.image}`, async (err) => {
           if(err){
             return res.status(400).json({
               status : 'error',
               message: err.message
             })
           }

           await media.destroy();

           return res.json({
             status : 'success',
             message: 'image deleted'
        })
    });
});

module.exports = router;
