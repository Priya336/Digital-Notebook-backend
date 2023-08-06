
//Get request are intenyed to retrive data fromt the server without modification
//POST request are used to send data to the server for processing and may modifies server state 
const express= require('express');
const fetchuser=require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const router=express.Router();
const Notes=require('../Modules/Notes')
//router 1:get all the notes
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try {
        const notes=await Notes.find({user:req.user.id});
    res.json(notes)
    } catch (error) {
        console.error(error.message);
      res.status(500).send("Internal error occur");
    }
   
})

//route 2:add notes
router.post('/addnotes',fetchuser,[
    body('Title', "valid title").isLength({ min: 5}),
    body('description', "descriptiom should be of 5 charcter").isLength({min:6}),
],async (req,res)=>{
 try{ const {Title,description,tag}=req.body;
    //if there exist a error ,return the bad request and the error
   const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()});
    }
const note=new Notes ({
    Title,description,tag,user:req.user.id
    
})
console.log(note)
const savenote=await note.save()
    res.json(savenote)
}
catch(error){
    console.error(error.message);
    res.status(500).send("Internal error occur");
}
}
)

//Routes 3:update notes
router.put('/updatenotes/:id',fetchuser, async (req,res)=>{
   try {
    const{Title,description,tag}=req.body
    //creat new node
    const newNote={};
    if(Title){newNote.Title=Title};
    if(description){newNote.description=description}
    if(tag){newNote.tag=tag}  
    //Find the note to be updated and update it
    console.log(req.params.id)
    let note= await Notes.findById(req.params.id);
    if(!note){res.status(404).send("Not found")}
    console.log(note)
    if(note.user.toString()!==req.user.id){
        return res.status(401).send("NOt allowed")
    }
   
        note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.json(note);
   } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occur");
   }
 
 }  )

 //route 4 deleting the notes
 router.put('/updatenotes/:id',fetchuser, async (req,res)=>{
    // const{Title,description,tag}=req.body
    // //creat new node
    // const newNote={};
    // if(Title){newNote.Title=Title};
    // if(description){newNote.description=description}
    // if(tag){newNote.tag=tag}  
    // //Find the note to be updated and update it
    // console.log(req.params.id)
    let note= await Notes.findById(req.params.id);
    if(!note){res.status(404).send("Not found")}
    console.log(note)
    if(note.user.toString()!==req.user.id){
        return res.status(401).send("NOt allowed")
    }
   
        note=await Notes.findByIdAndDelete(req.params.id,{$set:newNote},{new:true})
        res.json(note);
 }  )

 //route 4 deleting the notes
 router.delete('/deletenotes/:id',fetchuser, async (req,res)=>{
   
    //Find the note to be deleted 
    try {
        let note= await Notes.findById(req.params.id);
        if(!note){res.status(404).send("Not found")}
    
        //allow deletion only when user own this notes
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("NOt allowed")
        }
       
            note=await Notes.findByIdAndDelete(req.params.id)
            res.json({"Successfully deleted note":note});
    } catch (error) {
        console.error(error.message);
      res.status(500).send("Internal error occur");
    }
   
 }  )
module.exports=router