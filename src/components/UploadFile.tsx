import React, { useEffect, useRef, useState } from 'react';
import './App.css';


type props = {
    onChange: (file: File) => void,
    onFailed: (file: File, message: any) => void,
    fileName?: string,
    allowedFileTypes?: string[],
    fileSize?: Number,
    uploadContainerClassName?: string,
    uploadBtnClassName?: string,
    uploadFileNameClassName?: string
}

const defaultProps = {
    fileName: '',
    allowedFileTypes: [],
    fileSize: undefined,
    uploadContainerClassName: '',
    uploadBtnClassName: '',
    uploadFileNameClassName: ''
}

const UploadFile = (props: props) => {

    const newProps = { ...defaultProps, ...props }
    const { onChange, onFailed, fileName, fileSize, allowedFileTypes, uploadContainerClassName, uploadBtnClassName, uploadFileNameClassName } = newProps;

    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadFileName, setUploadFileName] = useState<string>("no file selected");

    const inputref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (fileName) {
            setUploadFileName(fileName)
        }
    }, [fileName])

    useEffect(() => {
        if (uploadFile) {
            setUploadFileName(uploadFile.name)
        }
    }, [uploadFile])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        if (event.target.files && event.target.files[0]) {

            if (allowedFileTypes && allowedFileTypes.length > 0) {

                const fileType = '.' + event.target.files[0].type.split('/')[1]
                const fileSizeInBytes = event.target.files[0].size

                if (!allowedFileTypes.includes(fileType)) {
                    onFailed(event.target.files[0], 'not valid file type');
                    return
                }
                if (fileSize && fileSize < fileSizeInBytes) {
                    onFailed(event.target.files[0], 'not valid size');
                    return;
                }

            }

            setUploadFile(event.target.files[0]);
            onChange(event.target.files[0]);

        }

    };


    return (
        <>
            <input accept={allowedFileTypes.join(',') || ''} style={{ display: 'none' }} type={'file'} ref={inputref} onChange={handleFileChange} />
            <span className={'upload-file-container ' + uploadContainerClassName} >
                <button className={'choose-btn ' + uploadBtnClassName} onClick={() => inputref.current?.click()}>Choose File</button>
                <span className={'upload-file-name-input ' + uploadFileNameClassName}>{uploadFileName}</span>
            </span>
        </>
    )
}

export default UploadFile
