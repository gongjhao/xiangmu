const {Router} = require('express')
const router = Router()
const categoryModel = require('../model/category')
const articleModel = require('../model/article')

router.post('/article',async (req,res,next)=>{
    try{
        if(req.session.user){
        const{content,contentText,title,category}= req.body

        const data = await articleModel
           .create({
               content,
               contentText,
               title,
               category,
               author:req.session.user._id
               })
               res.json({
                   code:200,
                   msg:'发布成功',
                   data
               })
            }else{
                res.json({
                    code:403,
                    msg:'未登录状态不能发表笔记'
                })
            }
            }catch(err){
                next(err)
            }
    
})

router.get('/article',(req,res)=>{
    let {pn=1,size=10} =req.query
    pn = parseInt(pn)
    size = parseInt(size)

    articleModel.find()
    .skip((pn-1)*size)
    .limit(size)
    .populate({
        path:'author',
        select:'-password -email'
    })
    .populate({
         path:'category'
    })
    .then(data => {
        res.json({
            code:200,
            data
        })
    })
})

module.exports = router