export default function StackableLayout(props) { 

    
    const parentDivClass = props.stack ? "" : "flex";
    const childDivClass = props.stack ? "absolute w-full top-0" : "";
    
    const showBottomLayer0 = props.showBottom ? "0%" : "-100%";
    const showBottomLayer1 = props.showBottom ? "100%" : "0%";
    
    const customLayer0Class = props.stack ? "" : props.layer0Class;
    const customLayer1Class = props.stack ? "" : props.layer1Class;

    return (<div className={"ease-in-out duration-200 w-full h-full overflow-hidden relative " + parentDivClass}>
        
        <div className={"ease-in-out duration-200 h-full z-0 " + childDivClass + " " + customLayer0Class} style={{left: showBottomLayer0}}>
            { props.layer0}
        </div>

        <div className={"ease-in-out duration-200 h-full z-1 " + childDivClass + " " + customLayer1Class} style={{left: showBottomLayer1}}>
            { props.layer1}
        </div>
        

    </div>)


}