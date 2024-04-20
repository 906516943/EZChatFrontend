import $ from 'jquery'
import { IconButton, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import { useContext } from 'react';
import { GlobalContext } from '../../../Global';
import { GenHash, GenId } from '../../../services/Utils';

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
                alert("Cannot upload more than 10 images");
                return;
            }


            //make sure no file is larger than 5MB and wrong file format
            const exceed5MB = files
                .map(x => x.size)
                .some(x => x > 5242880);
            
            if (exceed5MB) {
                alert("image size cannot exceed 5MB");
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
                alert("Unsupported image format found");
                return;
            }


            //read files
            const data = (await Promise.all(files.map(x => x.arrayBuffer())));
            const imgs = [];

            for (var d of data) { 
                const fileHash = GenHash(d);

                if (!GlobalContext.cache.imageMap.has(fileHash)) { 
                    GlobalContext.cache.imageMap.set(fileHash, { url: URL.createObjectURL(new Blob([d])), arrayBuffer: d });
                }

                imgs.push({ id: GenId(), hash: fileHash});
            }

            props.setImgs(props.imgs.concat(imgs));
        });
    }


    const onRemoveImageClick = (item) => { 

        var sameImgs = props.imgs.filter(x => x.hash == item.hash);

        if (sameImgs.length == 1)
        { 
            URL.revokeObjectURL(item.data.url);
            GlobalContext.cache.imageMap.delete(item.hash);
        }


        props.setImgs(props.imgs.filter(x => x.id != item.id));
    }

    return (
        <div id="image-selector" className='h-28 p-4 flex gap-4 w-full'>
            {
                props.imgs
                    .filter(x => GlobalContext.cache.imageMap.has(x.hash))
                    .map(x => { return { id: x.id, hash: x.hash, data: GlobalContext.cache.imageMap.get(x.hash) } })
                    .map(x => (
                    <div key={x.id} className='h-20 w-20 rounded-lg shrink-0 shadow-xl bg-cover border-2 overflow-hidden' style={{ backgroundImage: 'url("' + x.data.url + '")' }}>
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