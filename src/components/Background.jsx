export default function Background(props) { 


    return (<div className="relative w-screen h-screen">
        { /*background*/}
        <div className="absolute w-full h-full z-0" style={{background: 'url("m42.jpg")'}}>

        </div>

        { /*foreground*/}
        <div className="absolute w-full h-full z-1">
            { props.children }
        </div>
    </div>)
}