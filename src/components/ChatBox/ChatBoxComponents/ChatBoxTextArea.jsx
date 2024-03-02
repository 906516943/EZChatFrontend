import { useEffect, useState } from "react"



export default function (props) { 

    const [text, setText] = useState("");

    const keyDown = (e) => { 

        //if enter pressed without shift, trigger send event
        if ((!e.shiftKey) && (e.key == 'Enter')) { 
            
            if (text)
            { 
                props.enterPressed(text);
                setText("");

                document.getElementById("send-box").innerText = "";
            }
            
            e.preventDefault();
        }
    }


    return (<div
        id="send-box"
        onKeyDown={(e) => keyDown(e)}
        rows="1"
        contentEditable="true"
        suppressContentEditableWarning={true}
        style={{ resize: "none" }}
        className="w-full text-base font-medium rounded-xl p-2 pl-4 overflow-auto shadow-inner bg-white/85 focus:outline-none focus:bg-white/100 transition duration-100 ease-in"
        onInput={(e) => setText(e.target.innerText)}></div>)
}