import React, { useRef, useState, useEffect } from 'react';

const ImagePosterApp = () => {
    const canvasRef = useRef(null);
    const [posterImage, setPosterImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    // Load the poster when component mounts
    useEffect(() => {
        const poster = new Image();
        poster.src = `${process.env.PUBLIC_URL}/assets/Poster.png`; // Your poster image URL
        poster.onload = () => {
            setPosterImage(poster);
        };
    }, []);

    useEffect(() => {
        if (posterImage && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(posterImage, 0, 0, canvas.width, canvas.height);
        }
    }, [posterImage]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                setUploadedImage(img);
                drawUploadedImage(img);
            };
        };
        reader.readAsDataURL(file);
    };

    const drawUploadedImage = (img) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Define the area where the uploaded image will be placed
        const x = 150;
        const y = 400;
        const width = 200;
        const height = 200;

        ctx.drawImage(img, x, y, width, height);
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = 'poster-with-image.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div>
            <h1>Upload and Add Image to Poster</h1>
            <input type="file" onChange={handleImageUpload} />
            <button onClick={handleDownload}>Download Poster</button>
            <div style={{ position: 'relative', width: '500px', height: '700px', border: '1px solid #ccc', marginBottom: '10px' }}>
                <canvas ref={canvasRef} width={1080} height={1920} />
            </div>


        </div>
    );
};

export default ImagePosterApp;
