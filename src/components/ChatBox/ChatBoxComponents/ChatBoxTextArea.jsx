import { useEffect, useState } from "react"



export default function (props) { 

    const [text, setText] = useState("");

    const keyDown = (e) => { 

        //if enter pressed without shift, trigger send event
        if ((!e.shiftKey) && (e.key == 'Enter')) { 
            
            props.enterPressed(text);
            setText("");

            document.getElementById("send-box").innerText = "";
            e.preventDefault();
        }
    }


    return (<div
        id="send-box"
        onKeyDown={(e) => keyDown(e)}
        rows="1"
        contentEditable="plaintext-only"
        suppressContentEditableWarning={true}
        style={{ resize: "none" }}
        className="w-full max-h-32 text-base font-medium rounded-xl p-2 pl-4 overflow-auto shadow-inner bg-white/50 focus:outline-none focus:bg-white/75 transition duration-100 ease-in"
        onInput={(e) => setText(e.target.innerText)}></div>)
}