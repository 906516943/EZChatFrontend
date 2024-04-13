export default function Avatar(props){ 

    const url = props.url ?? 'avatar.png';

    return (
        <div className={'h-full w-full overflow-hidden border-2 rounded-full border-white shadow-md'}>
            <div className="h-full w-full bg-cover bg-white" style={{ backgroundImage: 'url("' + url + '")' }}></div>
        </div>
    )

}