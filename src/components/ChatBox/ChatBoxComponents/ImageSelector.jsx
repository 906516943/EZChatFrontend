import $ from 'jquery'
import { IconButton, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';

const fileFormats = ['.jpg', '.jpeg', '.bmp', '.png', '.gif']
const fileFormatsStr = fileFormats.reduce((x, y) => x + ', ' + y)

export default function ImageSelector(props) { 

    const onNewImageClick = () => { 
        
        const id = Date.now();
        $('#image-selector').append('<input hidden type="file" id="' + id + '" multiple="multiple" accept="' + fileFormatsStr + '"></input>');


        const element = $('#' + id)

        element.trigger('click');
        element.on('cancel', () => element.remove());
        element.on('change', async () => {
            const files = Array.from(element.get()[0].files);
            element.remove();


            // cannot upload more than 10 files
            if ((props.imgs.length + files.length) > 10) {
                alert("Cannot upload more than 10 files");
                return;
            }


            //make sure no file is larger than 5MB and wrong file format
            const exceed5MB = files
                .map(x => x.size)
                .some(x => x > 5242880);
            
            if (exceed5MB) {
                alert("File(s) cannot exceed 5MB");
                return;
            }

            const wrongFormat = files
                .map(x => x.name)
                .some(x => {
                    const format = x.split('.').pop();
                    if (format == null) return true;
                    
                    return !fileFormats.includes('.' + format);
                });
            
            if (wrongFormat) {
                alert("Wrong file format");
                return;
            }


            //read files
            const data = (await Promise.all(files.map(x => x.arrayBuffer())))
                .map(x => new Blob([x]))
                .map(x => {
                    return { url: URL.createObjectURL(x), blob: x }
                });
            
            props.setImgs(props.imgs.concat(data));
        });
    }


    const onRemoveImageClick = (item) => { 
        URL.revokeObjectURL(item.url);
        props.setImgs(props.imgs.filter(x => x != item));
    }

    return (
        <div id="image-selector" className='h-28 p-4 flex gap-4 w-full'>
            {
                props.imgs.map(x => (
                    <div key={x.url} className='h-20 w-20 rounded-lg shrink-0 shadow-xl bg-cover border-2 overflow-hidden' style={{ backgroundImage: 'url("' + x.url + '")' }}>
                        <div className='h-full w-full border-white bg-black/30 hover:bg-black/50 transition: duration-100 flex justify-center items-center'>
                            <div>
                                <IconButton aria-label="Image" onClick={() => onRemoveImageClick(x)}>
                                    <CancelIcon fontSize="large" sx={{ color: "white" }}></CancelIcon>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                ))
            }
            
            <div className='h-20 w-20 rounded-lg shrink-0 shadow-inner bg-black/15 bg-cover overflow-hidden flex justify-center items-center'>
                <IconButton aria-label="Image" onClick={onNewImageClick}>
                    <AddIcon fontSize="large" sx={{ color: "rgba(64, 64, 64)" }}></AddIcon>
                </IconButton>   
            </div>

        </div>)



}