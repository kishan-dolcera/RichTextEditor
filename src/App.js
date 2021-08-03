import Editor from 'ckeditor5-custom-build/build/ckeditor';
import CKEditor from "@ckeditor/ckeditor5-react"
//import parse from "html-react-parser"
import React, { useState,useEffect } from "react"
import "./App.css"
function App() {

  const [text, setText] = useState("")
  const [allMemes, setMemes] = useState({allMemes:[]})
  const [memeSearchText,setMemeSearchText] = useState("");
  const [parseText,setParseText] = useState("");
  const editorConfiguration = {
    toolbar: [ 'bold', 'italic', 'underline', 'link', 'insertImage' ]
  };
  
//if there are any memeSearchText in the editor make an api call to the memes api
//and filter out the meme for given  memeSearchText.
  useEffect(()=>{
    if(memeSearchText.length){
      fetch("https://api.imgflip.com/get_memes")
      .then(response => response.json())
      .then(data => {
        setMemes({
          allMemes: data.data.memes.filter(meme => meme.name.toLowerCase().includes(memeSearchText))
        })

        let replacedText;
        //replace the memeSearchPattern with the meme.
        if(allMemes.allMemes.length)
        replacedText = parseText.replace(`{{${memeSearchText}_meme}}`,`<img  alt="meme" width="30" height="30" src=${allMemes.allMemes[0].url}></img>`)
        
        setMemeSearchText("");
        if(replacedText){
          //setParseText(replacedText);
          setText(replacedText);
        }
    })
    }
  })

  const editorChanged=(event, editor) => {
    const data = editor.getData()
    setParseText(data)
    //setText(data)
  }

//Function to find the search pattern for text and extract the text for filtering memes
  const generateMemes =()=>{
    let memeSearchPattern = parseText.match(/\{\{\w+_meme\}\}/gmi)
    //console.log(memeSearchPattern);
    if(memeSearchPattern){
      memeSearchPattern.forEach(ele =>{
      ele = ele.replace(/\{\{|_meme|\}\}/gmi,"");
      //console.log(ele);
      setMemeSearchText(ele);
      })
    }
  }

  return (
    <div className="App">
      <div className="editor">
        <CKEditor
          editor={Editor}
          config={ editorConfiguration }
          data={text}
          onChange={(e,editor)=>editorChanged(e,editor)}
        />
      </div>
      <br></br>
      <div className="meme">
        <button onClick={generateMemes}>GET Memes</button>
      </div>
    </div>
  )
}
export default App