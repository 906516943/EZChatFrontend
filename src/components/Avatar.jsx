export default function Avatar(props){ 

    const url = props.url ?? 'avatar.png';
    const square = props.square ? 'rounded-xl' : 'rounded-full';
    const shadow = props.shadow ? 'shadow-md' : '';
    const border = props.border ? 'border-2' : '';
    return (
        <div className={'h-full w-full overflow-hidden border-white ' + square + ' ' + shadow + ' ' + border}>
            <div className="h-full w-full bg-cover bg-white" style={{ backgroundImage: 'url("' + url + '")' }}></div>
        </div>
    )

}