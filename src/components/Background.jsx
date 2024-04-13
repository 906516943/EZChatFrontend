export default function Background(props) { 


    return (<div className="relative w-screen h-screen">
        { /*background*/}
        <div className="absolute w-full h-full z-0 overflow-auto bg-contain bg-center" style={{background: 'url("m42.png")'}}>

        </div>

        { /*foreground*/}
        <div className="absolute w-full h-full z-1 overflow-auto">
            { props.children }
        </div>
    </div>)
}